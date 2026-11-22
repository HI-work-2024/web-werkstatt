/* Git-Labor: simuliertes Git (aus der Git-Werkstatt) mit 12 Missionen */
(function () {
  var W = window.WW, S = W.S, $ = W.$, el = W.el, esc = W.esc;
  if (typeof GitSim !== "function" || typeof GIT_MISSIONS === "undefined") return;
  var M = GIT_MISSIONS;
  S.gitDone = S.gitDone || []; S.gitHist = S.gitHist || [];
  W.parts.push({ w: 6, f: function () { return S.gitDone.length / M.length; } });
  var sim = new GitSim(S.gitSim || null);

  var sec = $("#git");
  sec.innerHTML = "<div class=\"intro\"><h2>Git-Labor</h2><p>Versionsverwaltung ist Pflicht im Beruf. Hier übst du Git in einem sicheren, simulierten Terminal: vom ersten <code>git init</code> über Push, Pull und das Schützen von Geheimnissen bis zu Branches und Merge. Rechts siehst du live, wo deine Dateien gerade liegen.</p></div>" +
    "<div class=\"git-grid\"><aside class=\"lessons\" id=\"gitList\"></aside>" +
    "<div><div class=\"lesson-head\" id=\"gitBox\"></div><div class=\"terminal-t\" id=\"gitTerm\"><div class=\"tm-out\" id=\"gitOut\"></div><div class=\"tm-in\"><span class=\"tm-prompt\">~/projekt $</span><input id=\"gitIn\" autocomplete=\"off\" spellcheck=\"false\" aria-label=\"Git-Befehl\"></div></div>" +
    "<p class=\"meta\"><code>help</code> zeigt alle Befehle · ↑/↓ frühere Eingaben · <button class=\"ghost small\" id=\"gitReset\">Simulation neu starten</button></p></div>" +
    "<div class=\"git-state\"><div class=\"state-box\"><h4>📁 Arbeitsordner</h4><ul id=\"gWork\"></ul></div><div class=\"state-box\"><h4>📋 Staging</h4><ul id=\"gStage\"></ul></div><div class=\"state-box\"><h4>🗄️ Lokales Repo <small id=\"gBranch\"></small></h4><ul id=\"gLocal\"></ul></div><div class=\"state-box\"><h4>☁️ GitHub <small id=\"gRemote\"></small></h4><ul id=\"gRemoteList\"></ul></div></div></div>";

  var out = $("#gitOut"), input = $("#gitIn"), hpos = S.gitHist.length;
  function print(lines) {
    lines.forEach(function (l) {
      if (l[0] === "clear") { out.innerHTML = ""; return; }
      var cls = { ok: "ok", err: "err", warn: "warn", dim: "dim", green: "ok", red: "err", cmdline: "cmd" }[l[0]] || "";
      var d = el("div", cls); d.textContent = l[1]; out.appendChild(d);
    });
    out.scrollTop = 1e9;
  }
  function cur() { for (var i = 0; i < M.length; i++) if (S.gitDone.indexOf(i) < 0) return i; return -1; }
  function start(i) { var m = M[i]; if (m && m.onStart) { var r = m.onStart(sim); if (r) print([["warn", "📡 Neuigkeit: Auf deinem Laptop wurde „TODO-Liste ergänzt“ committet und gepusht (Commit " + r + ")."]]); } }
  function check() {
    var i, any = false;
    while ((i = cur()) >= 0 && M[i].check(sim)) { S.gitDone.push(i); any = true; print([["ok", "✅ Mission " + (i + 1) + " geschafft: " + M[i].t]]); var n = cur(); if (n >= 0) start(n); else print([["ok", "🎉 Alle Git-Missionen erledigt!"]]); }
    if (any) { W.save(); W.progress(); }
  }
  function li(h, c) { return "<li" + (c ? " class=\"" + c + "\"" : "") + ">" + h + "</li>"; }
  function renderState() {
    var s = sim.s;
    if (!s.inited) {
      $("#gWork").innerHTML = Object.keys(s.files).sort().map(function (f) { return li(esc(f) + "<span class=\"gtag c\">kein Repo</span>"); }).join("") || li("leer", "empty");
      $("#gStage").innerHTML = li("(noch kein Repo)", "empty"); $("#gLocal").innerHTML = li("(noch kein Repo)", "empty"); $("#gBranch").textContent = "";
    } else {
      var c = sim.changes(), un = {}, ut = {};
      c.unstaged.forEach(function (x) { un[x[1]] = 1; }); c.untracked.forEach(function (x) { ut[x] = 1; });
      $("#gWork").innerHTML = Object.keys(s.files).sort().map(function (f) {
        var t = sim.isIgnored(f) && !(f in s.index) ? "<span class=\"gtag c\">ignoriert</span>" : ut[f] ? "<span class=\"gtag u\">unbekannt</span>" : un[f] ? "<span class=\"gtag m\">geändert</span>" : "<span class=\"gtag c\">gespeichert</span>";
        return li(esc(f) + t);
      }).join("") || li("leer", "empty");
      $("#gStage").innerHTML = c.staged.map(function (x) { return li(esc(x[1]) + "<span class=\"gtag s\">" + { "new file": "neu", modified: "geändert", deleted: "gelöscht" }[x[0]] + "</span>"); }).join("") || li("nichts vorgemerkt", "empty");
      $("#gBranch").textContent = "Branch: " + s.head;
      var tr = s.tracking[s.head] || [];
      $("#gLocal").innerHTML = (s.branches[s.head] || []).slice().reverse().map(function (id, n) {
        return li("<span><span class=\"id\">" + id + "</span> " + esc(s.commits[id].msg) + "</span>" + (n === 0 ? "<span class=\"gtag b\">HEAD</span>" : tr.length && tr[tr.length - 1] === id ? "<span class=\"gtag s\">origin</span>" : ""));
      }).join("") || li("noch keine Commits", "empty");
    }
    $("#gRemote").textContent = s.remote ? s.remote.replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "") : "nicht verbunden";
    $("#gRemoteList").innerHTML = !s.remote ? li("kein Remote eingetragen", "empty") : ((s.remoteBranches.main || []).slice().reverse().map(function (id) { return li("<span><span class=\"id\">" + id + "</span> " + esc(s.commits[id].msg) + "</span>"); }).join("") || li("leer, noch nichts gepusht", "empty"));
  }
  function renderMissions() {
    var c = cur();
    $("#gitList").innerHTML = "<h4>Missionen</h4>" + M.map(function (m, i) { return "<button class=\"" + (S.gitDone.indexOf(i) >= 0 ? "ok " : "") + (i === c ? "cur" : "") + "\" tabindex=\"-1\">" + (i + 1) + ". " + m.t + "</button>"; }).join("");
    if (c < 0) { $("#gitBox").innerHTML = "<h3>🎉 Alle 12 Git-Missionen geschafft</h3><p>Du beherrschst den kompletten Grundablauf. Übe weiter frei oder starte die Simulation neu.</p>"; return; }
    var m = M[c];
    $("#gitBox").innerHTML = "<h3>Mission " + (c + 1) + " von " + M.length + ": " + m.t + "</h3><div class=\"task\">" + m.task + "</div><p class=\"meta\">💡 " + m.why + "</p><p><button class=\"ghost small\" id=\"gHint\">Tipp anzeigen</button> <span id=\"gHintT\" hidden><code>" + esc(m.hint) + "</code> <button class=\"ghost small\" id=\"gUse\">übernehmen</button></span></p>";
    $("#gHint").addEventListener("click", function () { $("#gHintT").hidden = false; this.hidden = true; });
    $("#gUse").addEventListener("click", function () { input.value = m.hint.replace(/\s{2,}/g, " "); input.focus(); });
  }
  function run(line) {
    print([["cmdline", "$ " + line]]);
    if (line.trim()) { S.gitHist.push(line); if (S.gitHist.length > 200) S.gitHist.shift(); hpos = S.gitHist.length; }
    print(sim.run(line));
    S.gitSim = sim.s; check(); W.save(); renderState(); renderMissions();
  }
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { var l = input.value; input.value = ""; run(l); }
    else if (e.key === "ArrowUp") { if (hpos > 0) { hpos--; input.value = S.gitHist[hpos]; } e.preventDefault(); }
    else if (e.key === "ArrowDown") { if (hpos < S.gitHist.length - 1) { hpos++; input.value = S.gitHist[hpos]; } else { hpos = S.gitHist.length; input.value = ""; } e.preventDefault(); }
  });
  $("#gitTerm").addEventListener("click", function () { if (!window.getSelection().toString()) input.focus(); });
  $("#gitReset").addEventListener("click", function () { if (!confirm("Git-Simulation und Missionen neu starten?")) return; sim = new GitSim(null); S.gitSim = sim.s; S.gitDone.length = 0; W.save(); W.progress(); out.innerHTML = ""; welcome(); renderState(); renderMissions(); });
  function welcome() { print([["dim", "Simuliertes Git im Ordner ~/projekt. Hier liegt schon notizen.txt. Folge der Mission oben. Tipp: help"]]); }
  welcome();
  var c0 = cur(); if (c0 >= 0 && M[c0].onStart) start(c0);
  renderState(); renderMissions();
  W.gitRun = run; W.gitMissions = M;
})();
