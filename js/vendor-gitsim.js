/* Git-Simulator: ein vereinfachtes, aber ehrliches Modell von Git.
   Zustand: Arbeitsordner (files), Staging (index), Commits, Branches,
   Remote (origin auf "GitHub") und die lokal bekannten origin/*-Stände (tracking). */
(function (global) {
  "use strict";

  function hex7() {
    var s = "";
    for (var i = 0; i < 7; i++) s += "0123456789abcdef"[Math.floor(Math.random() * 16)];
    return s;
  }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function isPrefix(a, b) { // ist Liste a Anfang von Liste b?
    if (a.length > b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  function tokenize(line) {
    var out = [], cur = "", q = null, has = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (q) { if (ch === q) q = null; else cur += ch; continue; }
      if (ch === '"' || ch === "'") { q = ch; has = true; continue; }
      if (ch === " " || ch === "\t") { if (cur || has) { out.push(cur); cur = ""; has = false; } continue; }
      if (ch === ">") {
        if (cur || has) { out.push(cur); cur = ""; has = false; }
        if (line[i + 1] === ">") { out.push(">>"); i++; } else out.push(">");
        continue;
      }
      cur += ch;
    }
    if (cur || has) out.push(cur);
    return out;
  }

  function Sim(saved) {
    this.s = saved ? saved : Sim.fresh();
  }

  Sim.fresh = function () {
    return {
      inited: false,
      files: { "notizen.txt": "Meine ersten Notizen" },
      index: {},
      commits: {},          // id -> {msg, tree, parents, branch, time, author}
      branches: {},         // name -> [ids], ältester zuerst
      head: "main",
      remote: null,         // URL von origin
      remoteBranches: {},   // Stand auf GitHub
      tracking: {},         // lokal bekannte origin/* Stände
      upstream: {},         // branch -> true
      user: "Du",
      stash: [],
      stats: { statusAfterInit: 0 },
      flags: {}
    };
  };

  var P = Sim.prototype;

  /* ---------- Hilfsfunktionen auf dem Zustand ---------- */
  P.tip = function (b) { var l = this.s.branches[b || this.s.head]; return l && l.length ? l[l.length - 1] : null; };
  P.treeOf = function (id) { return id ? this.s.commits[id].tree : {}; };
  P.headTree = function () { return this.treeOf(this.tip()); };
  P.ignorePatterns = function () {
    var g = this.s.files[".gitignore"];
    if (!g) return [];
    return g.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) { return l && l[0] !== "#"; });
  };
  P.isIgnored = function (name) {
    var pats = this.ignorePatterns();
    for (var i = 0; i < pats.length; i++) {
      var p = pats[i].replace(/\/$/, "");
      var re = new RegExp("^" + p.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "(/.*)?$");
      if (re.test(name)) return true;
    }
    return false;
  };
  P.changes = function () {
    var s = this.s, ht = this.headTree(), r = { staged: [], unstaged: [], untracked: [] }, k;
    var all = {};
    for (k in ht) all[k] = 1;
    for (k in s.index) all[k] = 1;
    for (k in s.files) all[k] = 1;
    Object.keys(all).sort().forEach(function (f) {
      var inH = f in ht, inI = f in s.index, inW = f in s.files;
      if (inI && !inH) r.staged.push(["new file", f]);
      else if (!inI && inH) r.staged.push(["deleted", f]);
      else if (inI && inH && s.index[f] !== ht[f]) r.staged.push(["modified", f]);
      if (inI && !inW) r.unstaged.push(["deleted", f]);
      else if (inI && inW && s.files[f] !== s.index[f]) r.unstaged.push(["modified", f]);
      if (!inI && inW && !this.isIgnored(f)) r.untracked.push(f);
    }, this);
    return r;
  };
  P.isDirty = function () { var c = this.changes(); return c.staged.length > 0 || c.unstaged.length > 0; };
  P.newCommit = function (msg, tree, parents, extra) {
    var id; do { id = hex7(); } while (this.s.commits[id]);
    this.s.commits[id] = Object.assign({ msg: msg, tree: copy(tree), parents: parents, branch: this.s.head, time: Date.now(), author: this.s.user }, extra || {});
    return id;
  };
  P.checkoutTree = function (tree) { // Arbeitsordner + Index auf einen Baum setzen, untracked bleibt
    var s = this.s, old = this.headTree(), f;
    for (f in old) delete s.files[f];
    for (f in s.index) if (!(f in tree)) delete s.files[f];
    for (f in tree) s.files[f] = tree[f];
    s.index = copy(tree);
  };
  /* Ist Commit a ein Vorfahre von (oder gleich) Commit b? Folgt den parents-Zeigern. */
  P.isAncestor = function (a, b) {
    if (!a) return true;
    var todo = b ? [b] : [], seen = {};
    while (todo.length) {
      var x = todo.pop();
      if (x === a) return true;
      if (seen[x]) continue;
      seen[x] = 1;
      todo = todo.concat(this.s.commits[x].parents);
    }
    return false;
  };
  /* Zwei Verläufe zusammenführen: gibt {list, tree, kind} zurück */
  P.combine = function (mine, theirs, label) {
    var tm = mine[mine.length - 1], tt = theirs[theirs.length - 1], self = this;
    if (this.isAncestor(tt, tm)) return { kind: "uptodate", list: mine };
    if (this.isAncestor(tm, tt)) return { kind: "ff", list: theirs.slice(), tree: this.treeOf(tt) };
    var baseId = null;
    for (var i = mine.length - 1; i >= 0; i--) if (this.isAncestor(mine[i], tt)) { baseId = mine[i]; break; }
    var baseTree = this.treeOf(baseId);
    var t1 = this.treeOf(tm), t2 = this.treeOf(tt);
    var tree = copy(t1), f;
    for (f in t2) if (t2[f] !== baseTree[f]) tree[f] = t2[f];
    for (f in baseTree) if (!(f in t2) && t1[f] === baseTree[f]) delete tree[f];
    var list = mine.concat(theirs.filter(function (id) { return mine.indexOf(id) < 0; }));
    var id = this.newCommit("Merge " + label, tree, [mine[mine.length - 1], theirs[theirs.length - 1]], { merge: true });
    list.push(id);
    return { kind: "merge", list: list, tree: tree, id: id };
  };

  /* ---------- Ausführung ---------- */
  P.run = function (line) {
    var parts = line.split("&&"), out = [];
    for (var i = 0; i < parts.length; i++) {
      var t = parts[i].trim();
      if (!t) continue;
      var r = this.exec(tokenize(t));
      out = out.concat(r.out);
      if (r.fail) break;
    }
    return out;
  };

  P.exec = function (a) {
    var o = [], self = this, s = this.s;
    function p(text, cls) { o.push([cls || "", text]); }
    function fail(text) { p(text, "err"); return { out: o, fail: true }; }
    function done() { return { out: o }; }
    var cmd = a[0];

    switch (cmd) {
      case "help":
        p("Shell (simuliert):", "warn");
        p("  ls, ls -a           Dateien anzeigen");
        p("  cat <datei>         Inhalt anzeigen");
        p("  touch <datei>       leere Datei anlegen");
        p("  echo \"text\" > d    Datei (über)schreiben    echo \"text\" >> d  anhängen");
        p("  rm <datei>          Datei löschen    clear   Fenster leeren");
        p("Git:", "warn");
        p("  init, status, add, commit [-m|--amend], log [--oneline], diff [--staged], show");
        p("  remote add|-v|set-url|remove, push [-u], pull, fetch, clone");
        p("  branch, switch [-c], checkout [-b], merge, restore [--staged], rm [--cached]");
        p("  revert, stash [pop|list], config user.name|--list");
        return done();
      case "clear": return { out: [["clear", ""]] };
      case "pwd": p("/home/du/projekt"); return done();
      case "cd": p("(In der Simulation bleibst du im Ordner ~/projekt.)", "dim"); return done();
      case "ls": {
        var showAll = a[1] === "-a" || a[1] === "-la";
        var names = Object.keys(s.files).sort().filter(function (n) { return showAll || n[0] !== "."; });
        if (showAll && s.inited) names.unshift(".git/");
        p(names.join("   ") || "(leer)");
        return done();
      }
      case "cat":
        if (!a[1]) return fail("cat: Dateiname fehlt");
        if (!(a[1] in s.files)) return fail("cat: " + a[1] + ": Datei nicht gefunden");
        p(s.files[a[1]] || "(leer)");
        return done();
      case "touch":
        if (!a[1]) return fail("touch: Dateiname fehlt");
        a.slice(1).forEach(function (f) { if (!(f in s.files)) s.files[f] = ""; });
        return done();
      case "rm":
        if (!a[1]) return fail("rm: Dateiname fehlt");
        if (!(a[1] in s.files)) return fail("rm: " + a[1] + ": Datei nicht gefunden");
        delete s.files[a[1]];
        return done();
      case "echo": {
        var gi = a.indexOf(">"), ai = a.indexOf(">>"), idx = gi >= 0 ? gi : ai;
        if (idx < 0) { p(a.slice(1).join(" ")); return done(); }
        var text = a.slice(1, idx).join(" "), file = a[idx + 1];
        if (!file) return fail("echo: Zieldatei fehlt");
        if (ai >= 0 && s.files[file]) s.files[file] = s.files[file] + "\n" + text;
        else s.files[file] = text;
        return done();
      }
      case "git": return this.git(a.slice(1), p, fail, done);
      case "": return done();
      default:
        return fail(cmd + ": Befehl nicht gefunden (help zeigt alle Befehle)");
    }
  };

  P.git = function (a, p, fail, done) {
    var s = this.s, self = this, sub = a[0];
    var needsRepo = ["status", "add", "commit", "log", "diff", "show", "remote", "push", "pull", "fetch", "branch", "switch", "checkout", "merge", "restore", "rm", "revert", "stash"];
    if (!sub) { p("usage: git <command> [<args>]   (z. B. git status, git help)"); return done(); }
    if (sub === "help" || sub === "--help") return this.exec(["help"]);
    if (needsRepo.indexOf(sub) >= 0 && !s.inited) return fail("fatal: not a git repository (or any of the parent directories): .git\n# Dieser Ordner ist noch kein Repo → zuerst git init");
    var has = function (flag) { return a.indexOf(flag) >= 0; };
    var arg = function (n) { var r = a.slice(1).filter(function (x) { return x[0] !== "-"; }); return r[n]; };

    switch (sub) {
      case "init":
        if (s.inited) { p("Reinitialized existing Git repository in /home/du/projekt/.git/"); return done(); }
        s.inited = true;
        var bi = a.indexOf("-b");
        if (bi >= 0 && a[bi + 1]) s.head = a[bi + 1];
        s.branches[s.head] = [];
        p("Initialized empty Git repository in /home/du/projekt/.git/", "ok");
        return done();

      case "status": {
        s.stats.statusAfterInit++;
        var c = this.changes(), b = s.head, mine = s.branches[b] || [];
        p("On branch " + b);
        if (s.upstream[b] && s.tracking[b]) {
          var tr = s.tracking[b], ahead = mine.filter(function (x) { return tr.indexOf(x) < 0; }).length,
              behind = tr.filter(function (x) { return mine.indexOf(x) < 0; }).length;
          if (!ahead && !behind) p("Your branch is up to date with 'origin/" + b + "'.");
          else if (ahead && !behind) p("Your branch is ahead of 'origin/" + b + "' by " + ahead + " commit" + (ahead > 1 ? "s" : "") + ".\n  (use \"git push\" to publish your local commits)");
          else if (!ahead && behind) p("Your branch is behind 'origin/" + b + "' by " + behind + " commit" + (behind > 1 ? "s" : "") + ".\n  (use \"git pull\" to update your local branch)");
          else p("Your branch and 'origin/" + b + "' have diverged.\n  (use \"git pull\" to merge the remote branch into yours)");
        }
        if (!mine.length) p("\nNo commits yet");
        if (c.staged.length) {
          p("\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)");
          c.staged.forEach(function (x) { p("\t" + (x[0] + ":").padEnd(12) + x[1], "green"); });
        }
        if (c.unstaged.length) {
          p("\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)");
          c.unstaged.forEach(function (x) { p("\t" + (x[0] + ":").padEnd(12) + x[1], "red"); });
        }
        if (c.untracked.length) {
          p("\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)");
          c.untracked.forEach(function (x) { p("\t" + x, "red"); });
        }
        if (!c.staged.length && !c.unstaged.length) {
          if (c.untracked.length) p("\nnothing added to commit but untracked files present (use \"git add\" to track)");
          else p("\nnothing to commit, working tree clean");
        }
        return done();
      }

      case "add": {
        var targets = a.slice(1).filter(function (x) { return x[0] !== "-" || x === "-A"; });
        if (!targets.length) return fail("Nothing specified, nothing added.\n# Tipp: git add . (alles) oder git add <datei>");
        var addAll = targets.indexOf(".") >= 0 || targets.indexOf("-A") >= 0 || has("--all");
        if (addAll) {
          Object.keys(s.files).forEach(function (f) { if (!self.isIgnored(f) || f in s.index) s.index[f] = s.files[f]; });
          Object.keys(s.index).forEach(function (f) { if (!(f in s.files)) delete s.index[f]; });
          return done();
        }
        for (var i = 0; i < targets.length; i++) {
          var f = targets[i];
          if (!(f in s.files) && !(f in s.index)) return fail("fatal: pathspec '" + f + "' did not match any files");
          if (self.isIgnored(f) && !(f in s.index)) { p("The following paths are ignored by one of your .gitignore files:\n" + f + "\nhint: Use -f if you really want to add them.", "warn"); continue; }
          if (f in s.files) s.index[f] = s.files[f]; else delete s.index[f];
        }
        return done();
      }

      case "commit": {
        var mi = a.indexOf("-m"), msg = mi >= 0 ? a[mi + 1] : null, amend = has("--amend");
        if (has("-am") || has("-a")) {
          Object.keys(s.index).forEach(function (f) { if (f in s.files) s.index[f] = s.files[f]; else delete s.index[f]; });
          var ami = a.indexOf("-am"); if (ami >= 0) msg = a[ami + 1];
        }
        var list = s.branches[s.head];
        if (amend) {
          if (!list.length) return fail("fatal: You have nothing to amend.");
          var old = s.commits[list[list.length - 1]];
          var nid = this.newCommit(msg || old.msg, s.index, old.parents);
          var wasPushed = (s.tracking[s.head] || []).indexOf(list[list.length - 1]) >= 0;
          list[list.length - 1] = nid;
          p("[" + s.head + " " + nid + "] " + (msg || old.msg), "ok");
          if (wasPushed) p("# Achtung: Der alte Commit war schon gepusht. Jetzt weichen lokal und GitHub voneinander ab.", "warn");
          return done();
        }
        if (msg === null || msg === undefined) return fail("error: Bitte eine Nachricht mit -m \"…\" angeben.\n# (Echtes Git würde hier einen Editor öffnen.)");
        if (!msg.trim()) return fail("Aborting commit due to empty commit message.");
        if (same(s.index, this.headTree())) {
          var cc = this.changes();
          if (cc.unstaged.length || cc.untracked.length) return fail("no changes added to commit (use \"git add\" and/or \"git commit -a\")\n# Erst mit git add stagen, dann committen.");
          return fail("nothing to commit, working tree clean");
        }
        var stagedN = this.changes().staged.length;
        var id = this.newCommit(msg, s.index, list.length ? [list[list.length - 1]] : []);
        var first = !list.length;
        list.push(id);
        p("[" + s.head + (first ? " (root-commit) " : " ") + id + "] " + msg, "ok");
        p(" " + stagedN + " file" + (stagedN > 1 ? "s" : "") + " changed");
        return done();
      }

      case "log": {
        var l = (s.branches[s.head] || []).slice().reverse();
        if (!l.length) return fail("fatal: your current branch '" + s.head + "' does not have any commits yet");
        var oneline = has("--oneline");
        l.forEach(function (id, n) {
          var c = s.commits[id], deco = [];
          if (n === 0) deco.push("HEAD -> " + s.head);
          Object.keys(s.branches).forEach(function (b) { if (b !== s.head && self.tip(b) === id) deco.push(b); });
          Object.keys(s.tracking).forEach(function (b) { var t = s.tracking[b]; if (t.length && t[t.length - 1] === id) deco.push("origin/" + b); });
          var d = deco.length ? " (" + deco.join(", ") + ")" : "";
          if (oneline) { p(id + d + " " + c.msg, n === 0 ? "warn" : ""); }
          else {
            p("commit " + id + "a8c1e0f9b2d4c6e8a0b1c3d5e7f9a1b3c5" + d, "warn");
            p("Author: " + c.author + "\nDate:   " + new Date(c.time).toLocaleString("de-DE") + "\n\n    " + c.msg + "\n");
          }
        });
        return done();
      }

      case "diff": {
        var staged = has("--staged") || has("--cached");
        var from = staged ? this.headTree() : s.index, to = staged ? s.index : s.files, any = false;
        var keys = {}; for (var k1 in from) keys[k1] = 1; if (staged) for (var k2 in to) keys[k2] = 1; else for (var k3 in s.index) keys[k3] = 1;
        Object.keys(keys).sort().forEach(function (f) {
          var A = from[f], B = to[f];
          if (A === B) return;
          any = true;
          p("diff --git a/" + f + " b/" + f, "warn");
          var al = A === undefined ? [] : A.split("\n"), bl = B === undefined ? [] : B.split("\n");
          al.forEach(function (x) { if (bl.indexOf(x) < 0) p("-" + x, "red"); });
          bl.forEach(function (x) { if (al.indexOf(x) < 0) p("+" + x, "green"); });
        });
        if (!any) p(staged ? "(keine gestagten Änderungen)" : "(keine ungestagten Änderungen; neue, unbekannte Dateien zeigt diff nicht)", "dim");
        return done();
      }

      case "show": {
        var sid = arg(0) || this.tip();
        if (!sid || !s.commits[sid]) return fail("fatal: bad revision '" + (sid || "HEAD") + "'");
        var c = s.commits[sid], prev = c.parents.length ? this.treeOf(c.parents[0]) : {};
        p("commit " + sid, "warn"); p("Author: " + c.author + "\n\n    " + c.msg + "\n");
        var ks = {}; for (var x in prev) ks[x] = 1; for (var y in c.tree) ks[y] = 1;
        Object.keys(ks).forEach(function (f) {
          if (prev[f] === c.tree[f]) return;
          p((prev[f] === undefined ? "neu:      " : c.tree[f] === undefined ? "gelöscht: " : "geändert: ") + f, prev[f] === undefined ? "green" : c.tree[f] === undefined ? "red" : "warn");
        });
        return done();
      }

      case "remote": {
        var rs = a[1];
        if (!rs) { if (s.remote) p("origin"); return done(); }
        if (rs === "-v") { if (s.remote) { p("origin\t" + s.remote + " (fetch)"); p("origin\t" + s.remote + " (push)"); } else p("(kein Remote eingetragen)", "dim"); return done(); }
        if (rs === "add") {
          if (!a[2] || !a[3]) return fail("usage: git remote add <name> <url>");
          if (a[2] !== "origin") p("# Hinweis: In der Simulation wird nur 'origin' unterstützt; ich verwende origin.", "dim");
          if (s.remote) return fail("error: remote origin already exists.");
          s.remote = a[3];
          if (!/^https:\/\/github\.com\/.+\/.+/.test(a[3])) p("# Hinweis: Eine GitHub-URL sieht so aus: https://github.com/<konto>/<repo>.git", "dim");
          return done();
        }
        if (rs === "set-url") { if (!s.remote) return fail("error: No such remote 'origin'"); s.remote = a[3] || a[2]; return done(); }
        if (rs === "remove" || rs === "rm") { if (!s.remote) return fail("error: No such remote: 'origin'"); s.remote = null; s.tracking = {}; s.upstream = {}; return done(); }
        return fail("error: Unknown subcommand: " + rs);
      }

      case "push": {
        var u = has("-u") || has("--set-upstream"), pos = a.slice(1).filter(function (x) { return x[0] !== "-"; });
        var remoteName = pos[0], br = pos[1] || s.head;
        if (!s.remote) return fail("fatal: No configured push destination.\n# Erst ein Remote eintragen: git remote add origin <url>");
        if (remoteName && remoteName !== "origin") return fail("fatal: '" + remoteName + "' does not appear to be a git repository");
        if (!remoteName && !s.upstream[s.head]) return fail("fatal: The current branch " + s.head + " has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin " + s.head + "\n\n# Kurzform: git push -u origin " + s.head);
        var local = s.branches[br];
        if (!local || !local.length) return fail("error: src refspec " + br + " does not match any\n# Es gibt noch keinen Commit auf '" + br + "' → erst committen.");
        var rem = s.remoteBranches[br] || [];
        if (same(rem, local)) { p("Everything up-to-date"); if (u) { s.upstream[br] = true; s.tracking[br] = local.slice(); } return done(); }
        if (!this.isAncestor(rem[rem.length - 1], local[local.length - 1])) return fail(" ! [rejected]        " + br + " -> " + br + " (fetch first)\nerror: failed to push some refs to '" + s.remote + "'\nhint: Updates were rejected because the remote contains work that you do not have locally.\n# Auf GitHub gibt es Commits, die du nicht hast → erst git pull, dann git push.");
        var newN = local.filter(function (x) { return rem.indexOf(x) < 0; }).length;
        p("Enumerating objects: " + (newN * 3) + ", done.\nWriting objects: 100% (" + (newN * 3) + "/" + (newN * 3) + "), done.");
        p("To " + s.remote);
        if (!rem.length) p(" * [new branch]      " + br + " -> " + br, "ok");
        else p("   " + rem[rem.length - 1] + ".." + local[local.length - 1] + "  " + br + " -> " + br, "ok");
        s.remoteBranches[br] = local.slice();
        s.tracking[br] = local.slice();
        if (u) { s.upstream[br] = true; p("branch '" + br + "' set up to track 'origin/" + br + "'.", "ok"); }
        return done();
      }

      case "fetch": {
        if (!s.remote) return fail("fatal: 'origin' does not appear to be a git repository");
        var changed = false;
        Object.keys(s.remoteBranches).forEach(function (b) {
          if (!same(s.tracking[b], s.remoteBranches[b])) { changed = true; p("   " + (s.tracking[b] && s.tracking[b].length ? s.tracking[b][s.tracking[b].length - 1] : "(neu)") + ".." + self.tipList(s.remoteBranches[b]) + "  " + b + " -> origin/" + b, "ok"); }
          s.tracking[b] = s.remoteBranches[b].slice();
        });
        if (changed) p("From " + s.remote, "dim"); else p("(nichts Neues auf GitHub)", "dim");
        return done();
      }

      case "pull": {
        if (!s.remote) return fail("fatal: 'origin' does not appear to be a git repository");
        var b2 = s.head;
        if (!s.upstream[b2] && !a[1]) return fail("There is no tracking information for the current branch.\n    git pull origin " + b2 + "\n# oder einmalig: git push -u origin " + b2);
        var remoteList = s.remoteBranches[b2] || [];
        if (!remoteList.length) return fail("fatal: couldn't find remote ref " + b2);
        if (this.isDirty()) return fail("error: Your local changes would be overwritten by merge.\nPlease commit your changes or stash them before you merge.");
        s.tracking[b2] = remoteList.slice();
        var res = this.combine(s.branches[b2], remoteList, "branch '" + b2 + "' of github.com");
        if (res.kind === "uptodate") { p("Already up to date."); return done(); }
        p("From " + s.remote, "dim");
        s.branches[b2] = res.list;
        this.checkoutTree(res.tree);
        if (res.kind === "ff") p("Fast-forward", "ok");
        else p("Merge made by the 'ort' strategy. (Merge-Commit " + res.id + ")\n# Deine und die GitHub-Commits wurden zusammengeführt. Jetzt git push, damit GitHub den Merge auch hat.", "ok");
        return done();
      }

      case "clone":
        p("# In der Simulation bist du schon im Projektordner.\n# Auf einem neuen Rechner holst du ein Repo so:\n#   git clone https://github.com/<konto>/<repo>.git\n# Das macht init + remote add + pull in einem Schritt.", "dim");
        return done();

      case "branch": {
        var bn = arg(0);
        if (has("-d") || has("-D")) {
          if (!bn || !s.branches[bn]) return fail("error: branch '" + bn + "' not found.");
          if (bn === s.head) return fail("error: Cannot delete branch '" + bn + "' checked out");
          delete s.branches[bn]; p("Deleted branch " + bn + ".", "ok"); return done();
        }
        if (bn) {
          if (s.branches[bn]) return fail("fatal: a branch named '" + bn + "' already exists");
          if (!this.tip()) return fail("fatal: Not a valid object name: '" + s.head + "'. (erst einen Commit machen)");
          s.branches[bn] = s.branches[s.head].slice(); return done();
        }
        Object.keys(s.branches).sort().forEach(function (b) { p((b === s.head ? "* " : "  ") + b, b === s.head ? "green" : ""); });
        if (has("-a")) Object.keys(s.tracking).forEach(function (b) { p("  remotes/origin/" + b, "red"); });
        return done();
      }

      case "switch": case "checkout": {
        var create = has("-c") || has("-b"), target = arg(0);
        if (!target) return fail("fatal: missing branch name");
        if (sub === "checkout" && !create && !s.branches[target] && (target in s.files || target === "--")) return fail("# Für Dateien heute besser: git restore " + target);
        if (create) {
          if (s.branches[target]) return fail("fatal: a branch named '" + target + "' already exists");
          if (!this.tip()) return fail("fatal: Erst einen Commit machen, dann einen Branch anlegen.");
          s.branches[target] = s.branches[s.head].slice();
          s.head = target;
          p("Switched to a new branch '" + target + "'", "ok");
          return done();
        }
        if (!s.branches[target]) {
          if (s.remoteBranches[target]) { s.branches[target] = s.remoteBranches[target].slice(); s.upstream[target] = true; s.tracking[target] = s.branches[target].slice(); }
          else return fail("fatal: invalid reference: " + target);
        }
        if (target === s.head) { p("Already on '" + target + "'"); return done(); }
        if (this.isDirty()) return fail("error: Your local changes to the following files would be overwritten by checkout.\nPlease commit your changes or stash them before you switch branches.");
        var newTree = this.treeOf(this.tip(target));
        this.checkoutTree(newTree);
        s.head = target;
        p("Switched to branch '" + target + "'", "ok");
        return done();
      }

      case "merge": {
        var other = arg(0);
        if (!other || !s.branches[other]) return fail("merge: " + (other || "") + " - not something we can merge");
        if (other === s.head) return fail("Already up to date. (Du bist schon auf " + other + ")");
        if (this.isDirty()) return fail("error: Your local changes would be overwritten by merge. Commit or stash first.");
        var r2 = this.combine(s.branches[s.head], s.branches[other], "branch '" + other + "'");
        if (r2.kind === "uptodate") { p("Already up to date."); return done(); }
        s.branches[s.head] = r2.list;
        this.checkoutTree(r2.tree);
        p(r2.kind === "ff" ? "Updating … Fast-forward" : "Merge made by the 'ort' strategy.", "ok");
        return done();
      }

      case "restore": {
        var stagedOpt = has("--staged"), files = a.slice(1).filter(function (x) { return x[0] !== "-"; });
        if (!files.length) return fail("fatal: you must specify path(s) to restore");
        var ht = this.headTree();
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          if (stagedOpt) {
            if (!(f in s.index) && !(f in ht)) return fail("error: pathspec '" + f + "' did not match any file(s) known to git");
            if (f in ht) s.index[f] = ht[f]; else delete s.index[f];
          } else {
            if (!(f in s.index)) return fail("error: pathspec '" + f + "' did not match any file(s) known to git");
            s.files[f] = s.index[f];
          }
        }
        return done();
      }

      case "rm": {
        var cached = has("--cached"), f2 = arg(0);
        if (!f2) return fail("usage: git rm [--cached] <file>");
        if (!(f2 in s.index)) return fail("fatal: pathspec '" + f2 + "' did not match any files");
        delete s.index[f2];
        if (!cached) delete s.files[f2];
        p("rm '" + f2 + "'");
        return done();
      }

      case "revert": {
        var rid = arg(0);
        if (!rid || !s.commits[rid] || (s.branches[s.head] || []).indexOf(rid) < 0) return fail("fatal: bad revision '" + (rid || "") + "'");
        if (this.isDirty()) return fail("error: your local changes would be overwritten by revert.");
        var rc = s.commits[rid], before = rc.parents.length ? this.treeOf(rc.parents[0]) : {}, tree = copy(this.headTree());
        var keys2 = {}; for (var q in before) keys2[q] = 1; for (var w in rc.tree) keys2[w] = 1;
        Object.keys(keys2).forEach(function (f) { if (before[f] === rc.tree[f]) return; if (before[f] === undefined) delete tree[f]; else tree[f] = before[f]; });
        var vid = this.newCommit("Revert \"" + rc.msg + "\"", tree, [this.tip()]);
        s.branches[s.head].push(vid);
        this.checkoutTree(tree);
        p("[" + s.head + " " + vid + "] Revert \"" + rc.msg + "\"", "ok");
        return done();
      }

      case "stash": {
        var sa = a[1];
        if (sa === "list") { s.stash.forEach(function (x, n) { p("stash@{" + n + "}: WIP on " + x.branch); }); if (!s.stash.length) p("(leer)", "dim"); return done(); }
        if (sa === "pop" || sa === "apply") {
          if (!s.stash.length) return fail("error: No stash entries found.");
          var e = sa === "pop" ? s.stash.shift() : s.stash[0];
          Object.keys(e.files).forEach(function (f) { if (e.files[f] === null) delete s.files[f]; else s.files[f] = e.files[f]; });
          s.index = e.index;
          p("Änderungen zurückgeholt" + (sa === "pop" ? " und Stash-Eintrag entfernt." : "."), "ok");
          return done();
        }
        if (!this.isDirty()) { p("No local changes to save"); return done(); }
        var ht2 = this.headTree(), saved = {}, kk = {};
        for (var z in ht2) kk[z] = 1; for (var zz in s.index) kk[zz] = 1;
        Object.keys(kk).forEach(function (f) { saved[f] = f in s.files ? s.files[f] : null; });
        s.stash.unshift({ branch: s.head, files: saved, index: copy(s.index) });
        this.checkoutTree(ht2);
        p("Saved working directory and index state WIP on " + s.head, "ok");
        return done();
      }

      case "config": {
        if (a[1] === "--list" || a[1] === "-l") { p("user.name=" + s.user + "\ninit.defaultbranch=main" + (s.remote ? "\nremote.origin.url=" + s.remote : "")); return done(); }
        var key = a.filter(function (x) { return x[0] !== "-"; })[1], val = a.filter(function (x) { return x[0] !== "-"; })[2];
        if (key === "user.name") { if (val) { s.user = val; } else p(s.user); return done(); }
        if (key === "user.email") { if (!val) p("du@example.com"); return done(); }
        p("# In der Simulation werden nur user.name und --list unterstützt.", "dim");
        return done();
      }

      default:
        return fail("git: '" + sub + "' is not a git command. See 'git help'.");
    }
  };
  P.tipList = function (l) { return l.length ? l[l.length - 1] : "-"; };

  /* Simuliert: Auf dem Laptop wurde etwas geändert und gepusht */
  P.laptopPush = function () {
    var s = this.s, b = "main", rem = s.remoteBranches[b];
    if (!rem || !rem.length) return null;
    var tree = copy(this.treeOf(rem[rem.length - 1]));
    tree["TODO.md"] = "- Git-Werkstatt weiter durcharbeiten\n- Laptop eingerichtet";
    var id; do { id = hex7(); } while (s.commits[id]);
    s.commits[id] = { msg: "TODO-Liste ergänzt (vom Laptop)", tree: tree, parents: [rem[rem.length - 1]], branch: "main", time: Date.now(), author: s.user + " (Laptop)", laptop: true };
    rem.push(id);
    s.flags.laptopCommit = id;
    return id;
  };

  global.GitSim = Sim;
  global.GitSimUtil = { isPrefix: isPrefix, same: same, tokenize: tokenize };
})(window);

/* ---------- Missionen ---------- */
var GIT_MISSIONS = [
  { t: "Repo anlegen", task: "Mache den Ordner <code>~/projekt</code> zu einem Git-Repository.", why: "Erst danach beobachtet Git den Ordner. Es entsteht der versteckte Ordner <code>.git</code> (sieh mit <code>ls -a</code> nach).", hint: "git init",
    check: function (g) { return g.s.inited; } },
  { t: "Umschauen", task: "Lass dir anzeigen, in welchem Zustand das Repo ist.", why: "<code>git status</code> ist dein wichtigster Befehl. Achte auf „Untracked files“: Git kennt <code>notizen.txt</code> noch nicht.", hint: "git status",
    check: function (g) { return g.s.inited && g.s.stats.statusAfterInit > 0; } },
  { t: "Datei anlegen", task: "Lege eine Datei <code>README.md</code> mit einer kurzen Beschreibung an.", why: "Eine README erklärt jedem (auch deinem zukünftigen Ich), worum es im Projekt geht. GitHub zeigt sie auf der Startseite an.", hint: "echo \"# Mein Projekt\" > README.md",
    check: function (g) { return "README.md" in g.s.files; } },
  { t: "Stagen", task: "Nimm <b>alle</b> Dateien in den Staging-Bereich auf. Schau danach mit <code>git status</code>, was sich verändert hat.", why: "Erst was gestagt ist, kommt in den nächsten Commit. Rechts wandern die Dateien in „Staging“.", hint: "git add .",
    check: function (g) { var c = g.changes(); return g.s.inited && "README.md" in g.s.index && "notizen.txt" in g.s.index && !c.untracked.length && !c.unstaged.length; } },
  { t: "Erster Commit", task: "Speichere den gestagten Stand mit einer aussagekräftigen Nachricht.", why: "Ein Commit ist ein fester Schnappschuss. Ohne Commit gibt es nichts, was man hochladen könnte.", hint: "git commit -m \"Erster Stand\"",
    check: function (g) { return (g.s.branches.main || []).length >= 1; } },
  { t: "GitHub verbinden", task: "Verbinde dein Repo mit dem (leeren) GitHub-Repo <code>https://github.com/du/projekt.git</code> unter dem Namen <code>origin</code>.", why: "Dein lokales Repo weiß sonst nicht, wohin es hochladen soll. Prüfen kannst du es mit <code>git remote -v</code>.", hint: "git remote add origin https://github.com/du/projekt.git",
    check: function (g) { return !!g.s.remote; } },
  { t: "Erster Push", task: "Lade <code>main</code> hoch und lass Git sich die Verbindung merken.", why: "<code>-u</code> setzt den Upstream: Ab dann reichen <code>git push</code> und <code>git pull</code>, und <code>git status</code> zeigt den Abgleich mit GitHub.", hint: "git push -u origin main",
    check: function (g) { var s = g.s; return s.upstream.main && GitSimUtil.same(s.remoteBranches.main, s.branches.main) && s.branches.main.length > 0; } },
  { t: "Der Alltags-Kreislauf", task: "Ändere <code>notizen.txt</code>, speichere die Änderung als neuen Commit und lade sie hoch. Prüfe mit <code>git status</code>, dass alles oben ist.", why: "Das ist der Ablauf, den du täglich brauchst: ändern → add → commit → push.", hint: "echo \"Neue Zeile\" >> notizen.txt  &&  git add .  &&  git commit -m \"Notizen ergänzt\"  &&  git push",
    check: function (g) { var s = g.s, n = s.branches.main || []; return n.length >= 2 && GitSimUtil.same(s.remoteBranches.main, n) && !g.isDirty() && g.headTree()["notizen.txt"] !== s.commits[n[0]].tree["notizen.txt"]; } },
  { t: "Geheimnis schützen", task: "Lege eine Datei <code>.env</code> mit <code>PASSWORT=geheim</code> an. Sorge dafür, dass Git sie <b>nie</b> aufnimmt: Eine <code>.gitignore</code> mit dem Eintrag <code>.env</code> muss committet sein, die <code>.env</code> selbst darf in keinem Commit und nicht im Staging stehen.", why: "Ein einmal committetes Passwort bleibt in der Geschichte. Falls du die .env schon gestagt hast: <code>git restore --staged .env</code>. Schon committet: <code>git rm --cached .env</code> und neu committen.", hint: "echo \"PASSWORT=geheim\" > .env  &&  echo \".env\" > .gitignore  &&  git add .gitignore  &&  git commit -m \".env ignorieren\"",
    check: function (g) { var s = g.s, ht = g.headTree(); return ".env" in s.files && ".gitignore" in ht && /(^|\n)\s*\.env\s*(\n|$)/.test(ht[".gitignore"]) && !(".env" in ht) && !(".env" in s.index); } },
  { t: "Rechnerwechsel", task: "Auf deinem Laptop wurde inzwischen eine <code>TODO.md</code> ergänzt und gepusht. Hol diesen Stand zu dir. Tipp: <code>git status</code> zeigt es erst nach einem <code>git fetch</code> an.", why: "Vor dem Weiterarbeiten immer zuerst <code>git pull</code>. Versuchst du zuerst zu pushen, lehnt GitHub ab („fetch first“). Probier es ruhig aus!", hint: "git pull",
    onStart: function (g) { if (!g.s.flags.laptopCommit) return g.laptopPush(); },
    check: function (g) { var id = g.s.flags.laptopCommit; return !!id && (g.s.branches.main || []).indexOf(id) >= 0; } },
  { t: "Branch & Merge", task: "Lege einen Branch <code>feature</code> an, ergänze dort eine Datei <code>idee.txt</code> und committe sie. Wechsle zurück zu <code>main</code> und führe <code>feature</code> hinein.", why: "So probierst du Neues aus, ohne main zu gefährden. Beobachte rechts, wie <code>idee.txt</code> beim Wechsel auf main verschwindet und nach dem Merge zurückkommt.", hint: "git switch -c feature  &&  echo \"Idee\" > idee.txt  &&  git add .  &&  git commit -m \"Idee\"  &&  git switch main  &&  git merge feature",
    check: function (g) { var s = g.s, m = s.branches.main || []; return s.head === "main" && !!s.branches.feature && m.some(function (id) { return s.commits[id].branch === "feature"; }) && "idee.txt" in g.headTree(); } },
  { t: "Alles hochladen", task: "Bring GitHub auf deinen aktuellen Stand und kontrolliere mit <code>git status</code>.", why: "Ziel: „Your branch is up to date with 'origin/main'“ und „working tree clean“. Dann sind PC und GitHub identisch. 🎉", hint: "git push  &&  git status",
    check: function (g) { var s = g.s; return GitSimUtil.same(s.remoteBranches.main, s.branches.main) && !g.isDirty() && s.head === "main" && s.flags.laptopCommit && s.branches.main.indexOf(s.flags.laptopCommit) >= 0 && "idee.txt" in g.headTree(); } }
];
