/* Server-Terminal: simulierter Linux-Laptop + VPS. Website per SSH, nginx, Firewall, scp und HTTPS veröffentlichen. */
(function () {
  var W = window.WW, S = W.S, $ = W.$, el = W.el, esc = W.esc;
  var IP = "203.0.113.10", DOMAIN = "meine-seite.de";
  S.term = S.term || [];
  W.parts.push({ w: 6, f: function () { return S.term.length / MISSIONS.length; } });

  function fresh() {
    return {
      host: "laptop", hist: [], flags: {},
      cwd: { laptop: "/home/du", server: "/home/deploy" },
      fs: {
        laptop: {
          "/": "d", "/home": "d", "/home/du": "d", "/home/du/notizen.txt": "f:Server-IP: " + IP + "\nDomain: " + DOMAIN,
          "/home/du/website": "d", "/home/du/website/index.html": "f:<!DOCTYPE html>\n<html lang=\"de\"><head><title>Meine Seite</title><link rel=\"stylesheet\" href=\"style.css\"></head>\n<body><h1>Willkommen auf meiner Seite</h1></body></html>",
          "/home/du/website/style.css": "f:body { font-family: system-ui; }", "/home/du/website/bilder": "d", "/home/du/website/bilder/logo.svg": "f:<svg></svg>"
        },
        server: { "/": "d", "/home": "d", "/home/deploy": "d", "/var": "d", "/var/www": "d", "/etc": "d", "/var/log": "d" }
      },
      srv: { updated: false, pkgs: {}, nginx: "none", enabled: false, ufw: false, rules: [], wwwOwner: "root", cert: false, locked: false, log: [] }
    };
  }
  var T = S.termState || (S.termState = fresh());

  /* ---------- Dateisystem ---------- */
  function fs() { return T.fs[T.host]; }
  function home() { return T.host === "laptop" ? "/home/du" : "/home/deploy"; }
  function resolve(p) {
    if (!p) return T.cwd[T.host];
    if (p === "~" || p.indexOf("~/") === 0) p = home() + p.slice(1);
    var parts = (p[0] === "/" ? p : T.cwd[T.host] + "/" + p).split("/"), out = [];
    parts.forEach(function (x) { if (!x || x === ".") return; if (x === "..") out.pop(); else out.push(x); });
    return "/" + out.join("/");
  }
  function isDir(p, f) { return (f || fs())[p] === "d"; }
  function isFile(p, f) { var v = (f || fs())[p]; return typeof v === "string" && v.indexOf("f:") === 0; }
  function content(p, f) { return (f || fs())[p].slice(2); }
  function parent(p) { var i = p.lastIndexOf("/"); return i <= 0 ? "/" : p.slice(0, i); }
  function base(p) { return p.slice(p.lastIndexOf("/") + 1); }
  function children(p, f) { f = f || fs(); var pre = p === "/" ? "/" : p + "/"; return Object.keys(f).filter(function (k) { return k !== p && k.indexOf(pre) === 0 && k.slice(pre.length).indexOf("/") < 0; }).sort(); }
  function canWrite(p) { if (T.host === "laptop") return p.indexOf("/home/du") === 0; if (p.indexOf("/home/deploy") === 0) return true; if (p.indexOf("/var/www/html") === 0) return T.srv.wwwOwner === "deploy"; return false; }
  function writeFile(p, c, f) { (f || fs())[p] = "f:" + c; }
  function shortPath(p) { var h = home(); return p === h ? "~" : p.indexOf(h + "/") === 0 ? "~" + p.slice(h.length) : p; }
  function prompt() { return (T.host === "laptop" ? "du@laptop" : "deploy@server") + ":" + shortPath(T.cwd[T.host]) + "$"; }

  /* ---------- Ausgabe ---------- */
  var out;
  function p(t, c) { var d = el("div", c || ""); d.textContent = t; out.appendChild(d); }
  function tokenize(line) { var r = [], cur = "", q = null, had = false; for (var i = 0; i < line.length; i++) { var ch = line[i]; if (q) { if (ch === q) q = null; else cur += ch; continue; } if (ch === "'" || ch === '"') { q = ch; had = true; continue; } if (ch === " ") { if (cur || had) { r.push(cur); cur = ""; had = false; } continue; } if (ch === ">") { if (cur || had) { r.push(cur); cur = ""; had = false; } if (line[i + 1] === ">") { r.push(">>"); i++; } else r.push(">"); continue; } cur += ch; } if (cur || had) r.push(cur); return r; }

  /* ---------- Webserver-Logik ---------- */
  function siteReachable(proto) {
    var s = T.srv;
    if (s.nginx !== "active") return "Verbindung abgelehnt (nginx läuft nicht)";
    if (s.ufw && proto === "http" && !has(s.rules, ["Nginx Full", "Nginx HTTP", "80", "80/tcp"])) return "Zeitüberschreitung (Firewall blockiert Port 80)";
    if (s.ufw && proto === "https" && !has(s.rules, ["Nginx Full", "Nginx HTTPS", "443", "443/tcp"])) return "Zeitüberschreitung (Firewall blockiert Port 443)";
    if (proto === "https" && !s.cert) return "Verbindung fehlgeschlagen: Port 443 ohne Zertifikat (erst certbot)";
    return null;
  }
  function has(list, any) { return list.some(function (x) { return any.indexOf(x) >= 0; }); }
  function indexHtml() { var f = T.fs.server; return isFile("/var/www/html/index.html", f) ? content("/var/www/html/index.html", f) : isFile("/var/www/html/index.nginx-debian.html", f) ? "<h1>Welcome to nginx!</h1>" : null; }
  function curl(args) {
    var head = args.indexOf("-I") >= 0, url = args.filter(function (a) { return a[0] !== "-"; })[0];
    if (!url) return p("curl: Bitte URL angeben, z. B. curl -I http://" + IP, "err");
    var m = url.match(/^(https?):\/\/([^/]+)(\/.*)?$/);
    if (!m) return p("curl: (3) URL rejected: Bad hostname", "err");
    var proto = m[1], host = m[2], path = m[3] || "/";
    var local = T.host === "server" && (host === "localhost" || host === "127.0.0.1");
    if (!local && host !== IP && host !== DOMAIN && host !== "www." + DOMAIN) return p("curl: (6) Could not resolve host: " + host, "err");
    if (proto === "https" && host === IP) return p("curl: (60) SSL: Zertifikat gilt für " + DOMAIN + ", nicht für die IP-Adresse", "err");
    var err = local ? (T.srv.nginx !== "active" ? "Verbindung abgelehnt (nginx läuft nicht)" : proto === "https" && !T.srv.cert ? "Port 443 nicht konfiguriert" : null) : siteReachable(proto);
    if (err) return p("curl: (7) " + err, "err");
    var html = path === "/" ? indexHtml() : (isFile("/var/www/html" + path, T.fs.server) ? content("/var/www/html" + path, T.fs.server) : null);
    var code = html === null ? 404 : 200;
    T.srv.log.push((local ? "127.0.0.1" : "198.51.100.7") + " - - [" + new Date().toISOString().slice(0, 19) + "] \"GET " + path + " HTTP/1.1\" " + code + " " + (html ? html.length : 0) + " \"-\" \"curl/8.5\"");
    if (proto === "https") T.flags.httpsOk = code === 200;
    T.flags.curlOk = T.flags.curlOk || code === 200;
    if (!local && code === 200 && path === "/" && /Willkommen auf meiner Seite/.test(html)) T.flags.curlSite = true;
    if (head) { p("HTTP/1.1 " + code + (code === 200 ? " OK" : " Not Found"), code === 200 ? "ok" : "err"); p("Server: nginx/1.24.0 (Ubuntu)\nContent-Type: text/html" + (proto === "https" ? "\nStrict-Transport-Security: max-age=31536000" : "")); }
    else p(html === null ? "<html><body><h1>404 Not Found</h1></body></html>" : html);
  }

  /* ---------- Befehle ---------- */
  function sudoNeeded(cmd) { p(cmd + ": Permission denied. Für Systemänderungen brauchst du Administratorrechte → sudo " + cmd, "err"); }
  function exec(a, sudo) {
    var c = a[0], s = T.srv;
    switch (c) {
      case "help":
        p("Datei & Ordner: pwd · ls [-la] · cd · mkdir [-p] · touch · cat · echo \"…\" > datei · rm [-r] · cp [-r] · mv");
        p("Verbindung:     ssh deploy@" + IP + " · exit · scp [-r] quelle deploy@" + IP + ":/ziel/");
        p("Server:         sudo apt update · sudo apt install paket · sudo systemctl status|start|restart|enable nginx");
        p("                sudo ufw allow OpenSSH|'Nginx Full' · sudo ufw enable|status · sudo chown -R benutzer:gruppe pfad");
        p("                sudo certbot --nginx -d " + DOMAIN + " · curl [-I] url · sudo tail [-n 5] datei");
        p("Sonstiges:      whoami · hostname · history · df -h · free -h · uptime · clear");
        return;
      case "clear": out.innerHTML = ""; return;
      case "pwd": p(T.cwd[T.host]); T.flags.pwd = true; return;
      case "whoami": p(T.host === "laptop" ? "du" : (sudo ? "root" : "deploy")); return;
      case "hostname": p(T.host === "laptop" ? "laptop" : "server"); return;
      case "history": T.hist.slice(-20).forEach(function (h, i) { p(("  " + (i + 1)).slice(-4) + "  " + h); }); return;
      case "df": p("Dateisystem  Größe  Benutzt  Verf.  Verw%  Eingehängt\n/dev/sda1      38G     3,1G    33G     9%  /"); return;
      case "free": p("        gesamt  benutzt  frei\nSpeicher: 1,9Gi   " + (s.nginx === "active" ? "312Mi" : "280Mi") + "   1,4Gi"); return;
      case "uptime": p(" 10:42:17 up 3 days,  2:14,  1 user,  load average: 0.02, 0.01, 0.00"); return;
      case "nano": case "vim": case "vi": p("Ein Texteditor ist im Simulator nicht verfügbar. Nutze echo \"Inhalt\" > datei.", "warn"); return;
      case "ls": {
        var opts = a.filter(function (x) { return x[0] === "-"; }).join(""), target = resolve(a.slice(1).filter(function (x) { return x[0] !== "-"; })[0]);
        if (isFile(target)) { p(base(target)); return; }
        if (!isDir(target)) return p("ls: Zugriff auf '" + a[a.length - 1] + "' nicht möglich: Datei oder Verzeichnis nicht gefunden", "err");
        var ch = children(target);
        if (/l/.test(opts)) ch.forEach(function (k) { var d = isDir(k), own = k.indexOf("/var/www/html") === 0 ? s.wwwOwner : (T.host === "laptop" ? "du" : (k.indexOf("/home/deploy") === 0 ? "deploy" : "root")); p((d ? "drwxr-xr-x" : "-rw-r--r--") + " 1 " + own + " " + own + " " + (d ? 4096 : content(k).length) + " " + base(k) + (d ? "/" : "")); });
        else p(ch.map(function (k) { return base(k) + (isDir(k) ? "/" : ""); }).join("   ") || "");
        if (T.host === "laptop") T.flags.ls = true;
        if (T.host === "laptop" && target === "/home/du/website") T.flags.lsWebsite = true;
        return;
      }
      case "cd": { var t = resolve(a[1] || "~"); if (!isDir(t)) return p("cd: " + a[1] + ": Datei oder Verzeichnis nicht gefunden", "err"); T.cwd[T.host] = t; return; }
      case "mkdir": { var pathArg = a.slice(1).filter(function (x) { return x[0] !== "-"; })[0], mp = resolve(pathArg); if (!pathArg) return p("mkdir: Operand fehlt", "err"); if (!canWrite(mp) && !sudo) return p("mkdir: '" + pathArg + "' kann nicht angelegt werden: Keine Berechtigung", "err"); if (!isDir(parent(mp))) { if (a.indexOf("-p") < 0) return p("mkdir: '" + pathArg + "': Übergeordnetes Verzeichnis fehlt (Tipp: mkdir -p)", "err"); var acc = ""; mp.split("/").slice(1).forEach(function (seg) { acc += "/" + seg; if (!fs()[acc]) fs()[acc] = "d"; }); return; } fs()[mp] = "d"; return; }
      case "touch": { if (!a[1]) return p("touch: Operand fehlt", "err"); var tp = resolve(a[1]); if (!isDir(parent(tp))) return p("touch: Verzeichnis existiert nicht", "err"); if (!canWrite(tp) && !sudo) return p("touch: '" + a[1] + "' kann nicht berührt werden: Keine Berechtigung", "err"); if (!fs()[tp]) writeFile(tp, ""); return; }
      case "cat": { if (!a[1]) return p("cat: Operand fehlt", "err"); var cp = resolve(a[1]); if (isDir(cp)) return p("cat: " + a[1] + ": Ist ein Verzeichnis", "err"); if (!isFile(cp)) return p("cat: " + a[1] + ": Datei oder Verzeichnis nicht gefunden", "err"); p(content(cp)); return; }
      case "echo": {
        var gi = a.indexOf(">"), ai = a.indexOf(">>"), idx = gi >= 0 ? gi : ai;
        if (idx < 0) { p(a.slice(1).join(" ")); return; }
        var file = a[idx + 1], ep = resolve(file), txtc = a.slice(1, idx).join(" ");
        if (!file) return p("Syntaxfehler: Dateiname nach > fehlt", "err");
        if (!isDir(parent(ep))) return p("bash: " + file + ": Datei oder Verzeichnis nicht gefunden", "err");
        if (!canWrite(ep)) return p("bash: " + file + ": Keine Berechtigung" + (T.host === "server" ? " (Tipp: Rechte am Ordner fehlen, sudo hilft bei Umleitungen nicht)" : ""), "err");
        writeFile(ep, ai >= 0 && isFile(ep) ? content(ep) + "\n" + txtc : txtc);
        return;
      }
      case "rm": {
        var rec = a.some(function (x) { return /^-[a-z]*r/.test(x); }), rp;
        var arg = a.filter(function (x) { return x[0] !== "-"; }).slice(1)[0];
        if (!arg) return p("rm: Operand fehlt", "err");
        rp = resolve(arg);
        if (rp === "/" || rp === home()) return p("rm: Das lassen wir lieber. 😉 (Im echten Leben wäre das katastrophal.)", "err");
        if (!fs()[rp]) return p("rm: '" + arg + "' kann nicht entfernt werden: Datei nicht gefunden", "err");
        if (!canWrite(rp) && !sudo) return p("rm: Keine Berechtigung", "err");
        if (isDir(rp) && !rec) return p("rm: '" + arg + "' kann nicht entfernt werden: Ist ein Verzeichnis (Tipp: rm -r)", "err");
        Object.keys(fs()).forEach(function (k) { if (k === rp || k.indexOf(rp + "/") === 0) delete fs()[k]; });
        return;
      }
      case "cp": case "mv": {
        var args = a.filter(function (x) { return x[0] !== "-"; }).slice(1), rflag = a.some(function (x) { return /^-[a-z]*r/i.test(x); });
        if (args.length < 2) return p(c + ": Ziel fehlt", "err");
        var src = resolve(args[0]), dst = resolve(args[1]);
        if (!fs()[src]) return p(c + ": '" + args[0] + "' nicht gefunden", "err");
        if (isDir(src) && !rflag && c === "cp") return p("cp: -r nicht angegeben; Verzeichnis '" + args[0] + "' wird übersprungen", "err");
        if (isDir(dst)) dst = dst + "/" + base(src);
        if (!canWrite(dst) && !sudo) return p(c + ": Keine Berechtigung", "err");
        copyTree(fs(), src, fs(), dst);
        if (c === "mv") Object.keys(fs()).forEach(function (k) { if (k === src || k.indexOf(src + "/") === 0) delete fs()[k]; });
        return;
      }
      case "ssh": {
        if (T.host === "server") return p("Du bist bereits auf dem Server. (exit zum Verlassen)", "warn");
        var tgt = a[1] || "";
        if (!/@/.test(tgt)) return p("Benutzung: ssh benutzer@" + IP, "err");
        var user = tgt.split("@")[0], h = tgt.split("@")[1];
        if (h !== IP && h !== DOMAIN) return p("ssh: Could not resolve hostname " + h, "err");
        if (s.locked) return p("ssh: connect to host " + IP + " port 22: Connection timed out\n# Du hast dich mit der Firewall ausgesperrt. Rettung: Web-Konsole des Hosters → Befehl: konsole", "err");
        if (user === "root") return p("root@" + IP + ": Permission denied (publickey).\n# Root-Login per SSH ist (sinnvollerweise) deaktiviert. Nutze den Benutzer deploy.", "err");
        if (user !== "deploy") return p(user + "@" + IP + ": Permission denied (publickey).", "err");
        T.host = "server";
        p("Welcome to Ubuntu 24.04 LTS (GNU/Linux x86_64)\nLast login: " + new Date().toLocaleString("de-DE") + " from 198.51.100.7", "ok");
        return;
      }
      case "konsole": if (!s.locked) return p("Die Web-Konsole des Hosters brauchst du nur im Notfall.", "warn"); T.host = "server"; p("[Web-Konsole des Hosters] Angemeldet als deploy. Erlaube jetzt SSH: sudo ufw allow OpenSSH", "warn"); return;
      case "exit": case "logout": if (T.host !== "server") return p("Du bist auf deinem Laptop. (Zum Server: ssh deploy@" + IP + ")", "warn"); T.host = "laptop"; p("logout\nConnection to " + IP + " closed."); return;
      case "scp": {
        if (T.host !== "laptop") return p("scp startest du auf dem Laptop (erst exit).", "warn");
        var sargs = a.slice(1).filter(function (x) { return x[0] !== "-"; }), recursive = a.some(function (x) { return x === "-r"; });
        if (sargs.length < 2) return p("Benutzung: scp [-r] quelle deploy@" + IP + ":/ziel/", "err");
        var dest = sargs[sargs.length - 1], dm = dest.match(/^(\w+)@([^:]+):(.*)$/);
        if (!dm) return p("scp: Ziel muss die Form benutzer@host:/pfad haben", "err");
        if (dm[1] !== "deploy") return p("scp: Permission denied (publickey).", "err");
        if (dm[2] !== IP && dm[2] !== DOMAIN) return p("ssh: Could not resolve hostname " + dm[2], "err");
        if (s.locked) return p("ssh: connect to host " + IP + " port 22: Connection timed out", "err");
        var sf = T.fs.server, dpath = dm[3] || "/home/deploy"; if (dpath[0] !== "/") dpath = "/home/deploy/" + dpath; dpath = dpath.replace(/\/+$/, "") || "/";
        if (!isDir(dpath, sf)) return p("scp: " + dpath + ": No such file or directory", "err");
        if (!(dpath.indexOf("/home/deploy") === 0 || (dpath.indexOf("/var/www/html") === 0 && s.wwwOwner === "deploy"))) return p("scp: " + dpath + "/…: Permission denied\n# Der Ordner gehört root. Auf dem Server: sudo chown -R deploy:deploy " + dpath, "err");
        var sources = [];
        sargs.slice(0, -1).forEach(function (src) {
          if (/\/\*$/.test(src) || src === "*") { var dir = resolve(src === "*" ? "." : src.slice(0, -2)); children(dir).forEach(function (k) { sources.push(k); }); }
          else sources.push(resolve(src));
        });
        for (var i = 0; i < sources.length; i++) {
          var sp = sources[i];
          if (!fs()[sp]) return p("scp: " + sp + ": No such file or directory", "err");
          if (isDir(sp) && !recursive) { p("scp: " + base(sp) + ": not a regular file (Tipp: -r)", "err"); continue; }
          copyTree(fs(), sp, sf, dpath + "/" + base(sp));
          if (isFile(sp)) p(base(sp) + "                     100%  " + content(sp).length + "     1.2KB/s   00:00");
          else p(base(sp) + "/ (Ordner kopiert)");
        }
        return;
      }
      case "sudo": {
        if (T.host !== "server") return p("Auf deinem Laptop brauchst du dafür kein sudo.", "warn");
        if (!a[1]) return p("usage: sudo befehl", "err");
        T.flags.sudoUsed = true;
        return exec(a.slice(1), true);
      }
      case "apt": case "apt-get": {
        if (T.host !== "server") return p("apt gibt es nur auf dem Server (Linux). Verbinde dich erst per ssh.", "warn");
        if (!sudo) return sudoNeeded(c + " " + (a[1] || ""));
        if (a[1] === "update") { s.updated = true; p("Holen:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]\n…\nAlle Paketlisten werden gelesen… Fertig\n17 Pakete können aktualisiert werden.", "ok"); return; }
        if (a[1] === "upgrade") { p("17 aktualisiert, 0 neu installiert. Sicherheitsupdates eingespielt.", "ok"); T.flags.upgrade = true; return; }
        if (a[1] === "install") {
          var pk = a.slice(2).filter(function (x) { return x[0] !== "-"; });
          if (!pk.length) return p("apt: Paketname fehlt", "err");
          if (!s.updated) return p("E: Paket " + pk[0] + " kann nicht gefunden werden.\n# Tipp: Erst die Paketlisten aktualisieren: sudo apt update", "err");
          pk.forEach(function (n) {
            if (["nginx", "certbot", "python3-certbot-nginx", "git", "curl", "htop", "unattended-upgrades"].indexOf(n) < 0) return p("E: Paket " + n + " kann nicht gefunden werden.", "err");
            s.pkgs[n] = true;
            if (n === "nginx") { s.nginx = "active"; s.enabled = true; var sf2 = T.fs.server; ["/var/www/html", "/etc/nginx", "/etc/nginx/sites-available", "/var/log/nginx"].forEach(function (d) { sf2[d] = "d"; }); writeFile("/var/www/html/index.nginx-debian.html", "<h1>Welcome to nginx!</h1>", sf2); writeFile("/etc/nginx/sites-available/default", "server {\n  listen 80 default_server;\n  root /var/www/html;\n  index index.html index.nginx-debian.html;\n  server_name _;\n}", sf2); }
            p("Richte " + n + " ein …", "ok");
          });
          return;
        }
        return p("apt: unbekannter Befehl " + (a[1] || ""), "err");
      }
      case "systemctl": {
        if (T.host !== "server") return p("systemctl gibt es auf dem Server.", "warn");
        var act = a[1], unit = (a.filter(function (x) { return x[0] !== "-"; })[2] || "").replace(".service", "");
        if (unit !== "nginx") return p("Unit " + (unit || "?") + ".service could not be found." + (unit ? "" : " (z. B. systemctl status nginx)"), "err");
        if (!s.pkgs.nginx) return p("Unit nginx.service could not be found. (Erst installieren: sudo apt install nginx)", "err");
        if (act === "status") { p("● nginx.service - A high performance web server\n     Loaded: loaded (/usr/lib/systemd/system/nginx.service; " + (s.enabled ? "enabled" : "disabled") + ")\n     Active: " + (s.nginx === "active" ? "active (running)" : "inactive (dead)"), s.nginx === "active" ? "ok" : "err"); T.flags.status = true; return; }
        if (!sudo) return sudoNeeded("systemctl " + act + " nginx");
        if (act === "start" || act === "restart" || act === "reload") { s.nginx = "active"; return; }
        if (act === "stop") { s.nginx = "inactive"; return; }
        if (act === "enable") { s.enabled = true; if (a.indexOf("--now") >= 0) s.nginx = "active"; p("Created symlink … → nginx.service"); return; }
        if (act === "disable") { s.enabled = false; return; }
        return p("Unbekannte Aktion: " + act, "err");
      }
      case "ufw": {
        if (T.host !== "server") return p("ufw ist die Firewall des Servers.", "warn");
        if (!sudo) return sudoNeeded("ufw " + (a[1] || ""));
        if (a[1] === "status") { p("Status: " + (s.ufw ? "aktiv" : "inaktiv")); s.rules.forEach(function (r) { p(("  " + r).padEnd(22) + "ALLOW       Anywhere"); }); return; }
        if (a[1] === "allow") { var rule = a.slice(2).join(" "); if (!rule) return p("ufw allow: Regel fehlt (z. B. OpenSSH)", "err"); var known = ["OpenSSH", "Nginx Full", "Nginx HTTP", "Nginx HTTPS", "22", "80", "443", "22/tcp", "80/tcp", "443/tcp", "ssh"]; if (known.indexOf(rule) < 0) return p("ERROR: Could not find a profile matching '" + rule + "'", "err"); if (rule === "ssh" || rule === "22/tcp") rule = "22"; if (s.rules.indexOf(rule) < 0) s.rules.push(rule); p("Regel hinzugefügt"); if (s.locked && (rule === "OpenSSH" || rule === "22")) { s.locked = false; p("# SSH ist wieder erlaubt. Ab jetzt klappt ssh wieder normal.", "ok"); } return; }
        if (a[1] === "enable") {
          s.ufw = true; p("Firewall ist aktiv und wird beim Systemstart aktiviert", "ok");
          if (!has(s.rules, ["OpenSSH", "22"])) { s.locked = true; T.host = "laptop"; p("client_loop: send disconnect: Broken pipe\n# Autsch! SSH war nicht erlaubt. Die Firewall hat deine eigene Verbindung getrennt.\n# Im echten Leben: Web-Konsole des Hosters nutzen. Hier: Befehl konsole", "err"); }
          return;
        }
        if (a[1] === "disable") { s.ufw = false; return; }
        return p("ufw: unbekannter Befehl", "err");
      }
      case "chown": {
        if (T.host !== "server") return p("chown brauchst du hier nicht.", "warn");
        if (!sudo) return sudoNeeded("chown");
        var cargs = a.filter(function (x) { return x[0] !== "-"; }), owner = (cargs[1] || "").split(":")[0], cpath = resolve(cargs[2]);
        if (!owner || !cargs[2]) return p("Benutzung: sudo chown -R deploy:deploy /var/www/html", "err");
        if (!isDir(cpath) && !isFile(cpath)) return p("chown: '" + cargs[2] + "' nicht gefunden", "err");
        if (cpath.indexOf("/var/www/html") === 0) { if (cpath === "/var/www/html" && a.indexOf("-R") < 0) p("# Hinweis: Ohne -R gehören vorhandene Dateien darin weiter root.", "warn"); s.wwwOwner = owner; }
        return;
      }
      case "certbot": {
        if (T.host !== "server") return p("certbot läuft auf dem Server.", "warn");
        if (!s.pkgs.certbot) return p("certbot: Befehl nicht gefunden (sudo apt install certbot python3-certbot-nginx)", "err");
        if (!sudo) return sudoNeeded("certbot");
        if (a.indexOf("--nginx") < 0) return p("Tipp: certbot --nginx -d " + DOMAIN + " (richtet nginx gleich mit ein)", "warn");
        if (!s.pkgs["python3-certbot-nginx"]) return p("The requested nginx plugin does not appear to be installed (sudo apt install python3-certbot-nginx)", "err");
        var di = a.indexOf("-d"), dom = di >= 0 ? a[di + 1] : null;
        if (dom !== DOMAIN && dom !== "www." + DOMAIN) return p("Bitte Domain angeben: -d " + DOMAIN + " (der DNS-A-Eintrag zeigt bereits auf " + IP + ")", "err");
        var e = siteReachable("http");
        if (e) return p("Challenge failed for domain " + dom + ": " + e + "\n# Let's Encrypt prüft über Port 80, ob dir die Domain gehört.", "err");
        s.cert = true; if (!has(s.rules, ["Nginx Full", "Nginx HTTPS", "443", "443/tcp"]) && s.ufw) p("# Achtung: Port 443 ist in der Firewall noch zu (sudo ufw allow 'Nginx Full').", "warn");
        p("Successfully received certificate.\nCertificate is saved at: /etc/letsencrypt/live/" + DOMAIN + "/fullchain.pem\nThis certificate expires in 90 days; automatic renewal is set up.\nCongratulations! You have successfully enabled HTTPS on https://" + dom, "ok");
        return;
      }
      case "curl": return curl(a.slice(1));
      case "tail": case "less": case "head": {
        var fileArg = a.filter(function (x) { return x[0] !== "-" && !/^\d+$/.test(x); })[1];
        if (!fileArg) return p(c + ": Datei fehlt", "err");
        var lp = resolve(fileArg);
        if (lp === "/var/log/nginx/access.log" && T.host === "server") {
          if (!sudo) return p(c + ": '" + fileArg + "' kann nicht geöffnet werden: Keine Berechtigung (sudo)", "err");
          if (!s.pkgs.nginx) return p(c + ": Datei nicht gefunden", "err");
          (s.log.length ? s.log.slice(-5) : ["(noch keine Zugriffe, ruf die Seite erst mit curl auf)"]).forEach(function (l) { p(l); });
          T.flags.logs = s.log.length > 0; return;
        }
        if (!isFile(lp)) return p(c + ": '" + fileArg + "': Datei nicht gefunden", "err");
        p(content(lp).split("\n").slice(-10).join("\n")); return;
      }
      case "": return;
      default: p(c + ": Befehl nicht gefunden (help zeigt alle Befehle)", "err");
    }
  }
  function copyTree(fa, src, fb, dst) {
    Object.keys(fa).forEach(function (k) { if (k === src || k.indexOf(src + "/") === 0) fb[dst + k.slice(src.length)] = fa[k]; });
  }

  /* ---------- Missionen ---------- */
  var MISSIONS = [
    { t: "Orientierung", d: "Finde heraus, wo du bist (<code>pwd</code>) und was hier liegt (<code>ls</code>).", h: "pwd  dann  ls", ok: function () { return T.flags.pwd && T.flags.ls; } },
    { t: "Ins Projekt", d: "Wechsle in den Ordner <code>website</code> und sieh dir seinen Inhalt an.", h: "cd website  dann  ls", ok: function () { return T.cwd.laptop === "/home/du/website" && T.flags.lsWebsite; } },
    { t: "Impressum anlegen", d: "Lege in <code>website</code> die Datei <code>impressum.html</code> mit einer Überschrift an.", h: "echo \"<h1>Impressum</h1>\" > impressum.html", ok: function () { return isFile("/home/du/website/impressum.html", T.fs.laptop) && /<h1/i.test(content("/home/du/website/impressum.html", T.fs.laptop)); } },
    { t: "Zum Server verbinden", d: "Melde dich per SSH als Benutzer <code>deploy</code> auf deinem Server <code>" + IP + "</code> an.", h: "ssh deploy@" + IP, ok: function () { return T.host === "server"; } },
    { t: "Paketlisten aktualisieren", d: "Bring die Paketlisten des Servers auf den neuesten Stand (Administratorrechte nötig).", h: "sudo apt update", ok: function () { return T.srv.updated; } },
    { t: "Webserver installieren", d: "Installiere den Webserver <b>nginx</b> und prüfe mit <code>systemctl status nginx</code>, ob er läuft.", h: "sudo apt install nginx  dann  systemctl status nginx", ok: function () { return T.srv.pkgs.nginx && T.flags.status; } },
    { t: "Firewall einrichten", d: "Erlaube SSH (<code>OpenSSH</code>) und Web (<code>'Nginx Full'</code>) und schalte die Firewall ein. <b>Reihenfolge beachten!</b>", h: "sudo ufw allow OpenSSH  →  sudo ufw allow 'Nginx Full'  →  sudo ufw enable", ok: function () { return T.srv.ufw && has(T.srv.rules, ["OpenSSH", "22"]) && has(T.srv.rules, ["Nginx Full"]) && T.host === "server"; } },
    { t: "Schreibrechte für deploy", d: "Der Webordner <code>/var/www/html</code> gehört root. Übertrage ihn (rekursiv) an den Benutzer <code>deploy</code>.", h: "sudo chown -R deploy:deploy /var/www/html", ok: function () { return T.srv.wwwOwner === "deploy"; } },
    { t: "Website hochladen", d: "Zurück auf den Laptop (<code>exit</code>) und kopiere den <b>Inhalt</b> von <code>website</code> per <code>scp</code> nach <code>/var/www/html/</code> auf dem Server.", h: "exit  →  scp -r ~/website/* deploy@" + IP + ":/var/www/html/", ok: function () { var f = T.fs.server; return isFile("/var/www/html/index.html", f) && isFile("/var/www/html/impressum.html", f) && isDir("/var/www/html/bilder", f); } },
    { t: "Live testen", d: "Prüfe vom Laptop aus, ob deine Seite unter <code>http://" + IP + "</code> mit Status 200 antwortet.", h: "curl -I http://" + IP, ok: function () { return T.flags.curlSite && T.host === "laptop"; } },
    { t: "HTTPS aktivieren", d: "Verbinde dich wieder mit dem Server, installiere <code>certbot</code> mit dem nginx-Plugin und hole ein Zertifikat für <code>" + DOMAIN + "</code>.", h: "ssh …  →  sudo apt install certbot python3-certbot-nginx  →  sudo certbot --nginx -d " + DOMAIN, ok: function () { return T.srv.cert; } },
    { t: "Abschluss: HTTPS & Logs", d: "Rufe <code>https://" + DOMAIN + "</code> mit <code>curl -I</code> auf und sieh dir danach die letzten Zeilen des Zugriffsprotokolls <code>/var/log/nginx/access.log</code> an.", h: "curl -I https://" + DOMAIN + "  →  sudo tail /var/log/nginx/access.log", ok: function () { return T.flags.httpsOk && T.flags.logs; } }
  ];

  /* ---------- Oberfläche ---------- */
  var sec = $("#server");
  sec.innerHTML = "<div class=\"intro\"><h2>Server-Terminal</h2><p>Bring eine Website auf einen eigenen Linux-Server, so wie es im echten Betrieb läuft: SSH, Paketverwaltung, Webserver nginx, Firewall, Dateirechte, Upload per scp, HTTPS mit Let's Encrypt und Logs. Alles simuliert, aber mit echten Befehlen und echten Stolperfallen.</p></div>" +
    "<div class=\"practice-t\"><aside class=\"lessons\" id=\"tmList\"></aside><div><div id=\"tmBox\" class=\"lesson-head\"></div>" +
    "<div class=\"terminal-t\" id=\"tmTerm\"><div id=\"tmOut\" class=\"tm-out\"></div><div class=\"tm-in\"><span id=\"tmPrompt\" class=\"tm-prompt\"></span><input id=\"tmIn\" autocomplete=\"off\" spellcheck=\"false\" aria-label=\"Befehl\"></div></div>" +
    "<p class=\"meta\">help zeigt alle Befehle · ↑/↓ frühere Eingaben · <button class=\"ghost small\" id=\"tmReset\">Simulation neu starten</button></p></div></div>";
  out = $("#tmOut");
  var hpos = T.hist.length;
  function cur() { for (var i = 0; i < MISSIONS.length; i++) if (S.term.indexOf(i) < 0) return i; return -1; }
  function render() {
    $("#tmPrompt").textContent = prompt();
    var c = cur();
    $("#tmList").innerHTML = "<h4>Missionen</h4>" + MISSIONS.map(function (m, i) { return "<button class=\"" + (S.term.indexOf(i) >= 0 ? "ok " : "") + (i === c ? "cur" : "") + "\" tabindex=\"-1\">" + (i + 1) + ". " + m.t + "</button>"; }).join("");
    $("#tmBox").innerHTML = c < 0 ? "<h3>🎉 Deine Website ist live, mit HTTPS!</h3><p>Du hast den kompletten Weg geschafft: Server absichern, Webserver einrichten, deployen, verschlüsseln, überwachen. In der Praxis automatisiert man das Hochladen später per Git und CI/CD.</p>"
      : "<h3>Mission " + (c + 1) + " von " + MISSIONS.length + ": " + MISSIONS[c].t + "</h3><div class=\"task\">" + MISSIONS[c].d + "</div><p><button class=\"ghost small\" id=\"tmHint\">💡 Tipp</button> <span id=\"tmHintT\" class=\"meta\" hidden><code>" + esc(MISSIONS[c].h) + "</code></span></p>";
    var hb = $("#tmHint"); if (hb) hb.addEventListener("click", function () { $("#tmHintT").hidden = false; hb.hidden = true; });
  }
  function check() {
    var c, any = false;
    while ((c = cur()) >= 0 && MISSIONS[c].ok()) { S.term.push(c); any = true; p("✅ Mission " + (c + 1) + " geschafft: " + MISSIONS[c].t, "ok"); }
    if (any) { W.progress(); }
  }
  $("#tmIn").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var line = $("#tmIn").value; $("#tmIn").value = "";
      var pl = el("div", "cmd"); pl.textContent = prompt() + " " + line; out.appendChild(pl);
      if (line.trim()) { T.hist.push(line); hpos = T.hist.length; }
      line.split("&&").forEach(function (part) { exec(tokenize(part.trim()), false); });
      check(); W.save(); render(); out.scrollTop = 1e9;
    } else if (e.key === "ArrowUp") { if (hpos > 0) { hpos--; $("#tmIn").value = T.hist[hpos]; } e.preventDefault(); }
    else if (e.key === "ArrowDown") { if (hpos < T.hist.length - 1) { hpos++; $("#tmIn").value = T.hist[hpos]; } else { hpos = T.hist.length; $("#tmIn").value = ""; } e.preventDefault(); }
  });
  $("#tmTerm").addEventListener("click", function () { if (!window.getSelection().toString()) $("#tmIn").focus(); });
  $("#tmReset").addEventListener("click", function () { if (!confirm("Server-Simulation und Missionen neu starten?")) return; T = S.termState = fresh(); S.term.length = 0; out.innerHTML = ""; W.save(); W.progress(); welcome(); render(); });
  function welcome() { p("Simuliertes Terminal. Dein Laptop (Linux) und dein frisch gemieteter Server " + IP + " (Ubuntu 24.04).", "dim"); p("Die Domain " + DOMAIN + " zeigt per DNS-A-Eintrag bereits auf den Server. Tipp: help", "dim"); }
  welcome(); render();
  W.termRun = function (line) { $("#tmIn").value = line; $("#tmIn").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" })); };
})();
