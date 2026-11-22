/* Spickzettel, Karriere, Über/Signatur, Fortschritts-Übersicht */
(function () {
  var W = window.WW, S = W.S, $ = W.$, el = W.el, esc = W.esc, CFG = window.WW_CONFIG || {};

  /* ---------- Signatur ---------- */
  var sig = "© " + (CFG.jahr || 2026) + " " + (CFG.autorin || "");
  document.querySelector("footer").innerHTML = "<p><b>" + esc(CFG.titel || "Web-Werkstatt") + "</b> " + esc(CFG.version || "") + " · erstellt von <b>" + esc(CFG.autorin || "") + "</b> · " + esc(sig) + " · Fortschritt bleibt lokal in deinem Browser · Keine Rechtsberatung · <a href=\"#/ueber\" id=\"footUeber\">Über</a></p>";
  $("#footUeber").addEventListener("click", function (e) { e.preventDefault(); W.show("ueber"); });
  var sub = $(".brand .sub"); if (sub) sub.innerHTML = "Bauen · Hosten · Betreiben · Verkaufen · von <b>" + esc(CFG.autorin || "") + "</b>";
  var meta = document.createElement("meta"); meta.name = "author"; meta.content = CFG.autorin || ""; document.head.appendChild(meta);

  /* ---------- Fortschritts-Übersicht im Lernpfad ---------- */
  function dash() {
    var lessons = Object.keys(S.lessons).filter(function (k) { return S.lessons[k]; }).length;
    var proj = { "Projekt: Portfolio": 0, "Projekt: To-do-App": 0, "Projekt: Mini-Shop": 0 }, projN = {};
    C.lessons.forEach(function (l) { if (l.sec in proj) { projN[l.sec] = (projN[l.sec] || 0) + 1; if (S.lessons[l.id]) proj[l.sec]++; } });
    var items = [
      ["🧪", "Code-Labor", lessons + " / " + C.lessons.length, "labor"],
      ["🏗️", "Projekte", Object.keys(proj).filter(function (k) { return proj[k] === projN[k]; }).length + " / 3", "labor"],
      ["🗄️", "SQL", (S.sql || []).length + " / 20", "sql"],
      ["🐧", "Server", (S.term || []).length + " / 12", "server"],
      ["🔌", "API", S.api.length + " / " + C.apiTasks.length, "backend"],
      ["🌐", "DNS", ((S.zoneDone || []).length + S.dns.length) + " / " + (4 + C.dnsQuiz.length), "hosting"],
      ["❓", "Quiz", (S.quizBest || 0) + " %", "quiz"],
      ["🎓", "Prüfung", S.exam && S.exam.passed ? "bestanden" : (S.exam ? S.exam.best : 0) + " %", "pruefung"]
    ];
    var d = $("#dash");
    d.innerHTML = items.map(function (x) { return "<button class=\"dash-i\" data-t=\"" + x[3] + "\"><span>" + x[0] + "</span><b>" + x[2] + "</b><small>" + x[1] + "</small></button>"; }).join("");
    W.$$(".dash-i", d).forEach(function (b) { b.addEventListener("click", function () { W.show(b.dataset.t); }); });
  }
  var dh = el("div", "dash"); dh.id = "dash";
  $("#pfad .intro").insertAdjacentElement("afterend", dh);
  dash();
  W.$$(".tabs button").forEach(function (b) { if (b.dataset.tab === "pfad") b.addEventListener("click", dash); });

  /* ---------- Spickzettel ---------- */
  var SP = {
    "HTML": [["<!DOCTYPE html>", "Dokumenttyp HTML5 (erste Zeile)"], ["<html lang=\"de\">", "Sprache angeben (Screenreader, SEO)"], ["<meta charset=\"utf-8\">", "Zeichenkodierung"], ["<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", "Mobile Darstellung"], ["<title>…</title>", "Seitentitel (Tab, Google)"], ["<header> <nav> <main> <article> <section> <aside> <footer>", "Semantische Bereiche"], ["<h1>…<h6>", "Überschriften-Hierarchie, eine h1 pro Seite"], ["<a href=\"…\" target=\"_blank\" rel=\"noopener\">", "Link (neuer Tab, sicher)"], ["<img src alt width height loading=\"lazy\">", "Bild, barrierefrei & performant"], ["<picture><source type=\"image/avif\" srcset>…", "Moderne Bildformate mit Fallback"], ["<form> <label for> <input id required>", "Formular mit Label"], ["type=email|tel|url|number|date|password", "Eingabetypen (passende Handytastatur!)"], ["<button type=\"button|submit\">", "Schaltfläche"], ["<details><summary>", "Aufklapper ohne JS"], ["<dialog> + showModal()", "Modal"], ["<table><caption><thead><th scope>", "Barrierefreie Tabelle"], ["data-*", "Eigene Daten für JS (el.dataset)"]],
    "CSS": [["* { box-sizing: border-box; }", "Breite inkl. padding & border"], ["display: flex; gap; justify-content; align-items", "Flexbox (eine Achse)"], ["flex: 1 1 200px", "wachsen, schrumpfen, Basis"], ["display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))", "Responsives Raster ohne Media Query"], ["grid-template-areas", "Benannte Layout-Bereiche"], ["position: relative | absolute | fixed | sticky", "Positionierung"], ["@media (min-width: 700px) { … }", "Media Query (Mobile First)"], ["@container (min-width: 400px)", "Container Query"], [":root { --farbe: #6d3df5 } color: var(--farbe)", "Variablen"], ["clamp(1rem, 2vw + .5rem, 2rem)", "Flüssige Werte"], [":hover :focus-visible :focus-within :nth-child(odd) :not()", "Pseudo-Klassen"], ["::before ::after { content: \"\" }", "Pseudo-Elemente"], ["transition: transform .2s ease", "Weiche Übergänge"], ["@keyframes name { … } animation: name 1s infinite", "Animation"], ["@media (prefers-reduced-motion: reduce)", "Bewegung reduzieren respektieren"], ["@media (prefers-color-scheme: dark)", "Dark Mode des Systems"], ["Spezifität: ID 1-0-0 > Klasse 0-1-0 > Element 0-0-1", "Welche Regel gewinnt"]],
    "JavaScript": [["const / let", "Konstante / veränderbare Variable"], ["`Text ${wert}`", "Template-String"], ["arr.map / filter / reduce / find / some / every", "Array-Methoden"], ["const { a, b } = obj; const [x, ...rest] = arr", "Destrukturierung"], ["{ ...obj, neu: 1 }", "Spread: Kopie mit Änderung"], ["a ?? b   a?.b", "Nullish & optionale Verkettung"], ["document.querySelector(\".x\") / querySelectorAll", "Elemente finden"], ["el.textContent = …  (statt innerHTML)", "Text sicher setzen"], ["el.classList.add/remove/toggle", "Klassen"], ["el.addEventListener(\"click\", fn)", "Ereignisse"], ["e.target.closest(\"li\")", "Event-Delegation"], ["e.preventDefault()", "Standardverhalten verhindern"], ["const r = await fetch(url); if (!r.ok) throw …; await r.json()", "API-Aufruf"], ["try { … } catch (e) { … }", "Fehler behandeln"], ["Promise.all([…])", "Parallel warten"], ["JSON.stringify / JSON.parse", "Objekt ↔ Text"], ["localStorage.setItem / getItem", "Im Browser speichern"], ["new Intl.NumberFormat(\"de-DE\", {style:\"currency\",currency:\"EUR\"})", "Geld formatieren"]],
    "HTTP & APIs": [["GET", "lesen"], ["POST", "anlegen"], ["PUT / PATCH", "ersetzen / teilweise ändern"], ["DELETE", "löschen"], ["200 / 201 / 204", "OK / angelegt / ohne Inhalt"], ["301 / 304", "dauerhaft umgezogen / Cache aktuell"], ["400 / 401 / 403 / 404 / 429", "falsch / nicht angemeldet / verboten / nicht gefunden / zu viele"], ["500 / 503", "Serverfehler / nicht verfügbar"], ["Content-Type: application/json", "Format des Inhalts"], ["Authorization: Bearer <token>", "Zugangsnachweis"], ["Cache-Control: max-age=31536000, immutable", "Langes Caching"], ["Set-Cookie: id=…; HttpOnly; Secure; SameSite=Lax", "Sicheres Cookie"], ["Access-Control-Allow-Origin", "CORS-Freigabe"], ["Content-Security-Policy", "Schutz vor XSS"]],
    "SQL": [["SELECT a, b FROM t WHERE x = 1 ORDER BY a DESC LIMIT 10", "Abfrage"], ["WHERE name LIKE '%teil%'", "Textsuche"], ["COUNT(*) SUM() AVG() MIN() MAX()", "Aggregate"], ["GROUP BY k HAVING COUNT(*) > 2", "Gruppieren & Gruppen filtern"], ["JOIN b ON b.a_id = a.id", "Verknüpfen"], ["LEFT JOIN … WHERE b.id IS NULL", "Ohne Partner"], ["WHERE id IN (SELECT …)", "Unterabfrage"], ["INSERT INTO t (a, b) VALUES (1, 2)", "Einfügen"], ["UPDATE t SET a = 1 WHERE id = 5", "Ändern (WHERE nie vergessen!)"], ["DELETE FROM t WHERE …", "Löschen"], ["CREATE TABLE t (id INTEGER PRIMARY KEY, …)", "Tabelle anlegen"], ["REFERENCES andere(id)", "Fremdschlüssel"], ["CHECK (x BETWEEN 1 AND 5)", "Regel"], ["CREATE INDEX i ON t(spalte)", "Index"], ["BEGIN; … COMMIT;", "Transaktion"]],
    "Linux & Server": [["pwd · ls -la · cd ordner · cd ..", "Navigieren"], ["mkdir -p a/b · touch datei · cp -r · mv · rm -r", "Dateien"], ["cat · less · tail -f /var/log/…", "Lesen & Logs live"], ["sudo befehl", "Als Administrator"], ["ssh benutzer@host", "Anmelden"], ["scp -r ordner/* benutzer@host:/pfad/", "Kopieren auf Server"], ["rsync -avz --delete ordner/ host:/pfad/", "Synchronisieren (besser als scp)"], ["sudo apt update && sudo apt upgrade", "System aktualisieren"], ["sudo systemctl status|restart|enable nginx", "Dienste"], ["sudo ufw allow OpenSSH && sudo ufw enable", "Firewall (SSH zuerst!)"], ["sudo chown -R user:group pfad · chmod 644 datei", "Besitzer & Rechte"], ["sudo certbot --nginx -d domain.de", "HTTPS-Zertifikat"], ["df -h · free -h · htop", "Speicher & Last"], ["ssh-keygen -t ed25519", "SSH-Schlüssel erzeugen"]],
    "Git": [["git init / git clone url", "Starten"], ["git status", "Zustand"], ["git add . && git commit -m \"…\"", "Speichern"], ["git push / git pull", "Hoch- / Runterladen"], ["git switch -c feature", "Neuer Branch"], ["git merge feature", "Zusammenführen"], ["git log --oneline --graph", "Verlauf"], ["git diff / git diff --staged", "Änderungen"], ["git restore datei / --staged", "Rückgängig"], ["git stash / git stash pop", "Beiseitelegen"], [".gitignore", "Ausschließen (.env, node_modules)"]],
    "DevTools & Tastatur": [["F12 / Strg+Umschalt+I", "Entwicklertools"], ["Strg+Umschalt+C", "Element auswählen"], ["Strg+Umschalt+M", "Gerätemodus (Handy)"], ["Netzwerk-Tab + „Cache deaktivieren“", "Anfragen prüfen"], ["Lighthouse-Tab", "Qualität messen"], ["Konsole: $0", "Zuletzt ausgewähltes Element"], ["Sources: Haltepunkt setzen", "Debuggen"], ["Application: Local Storage / Cookies", "Speicher ansehen"], ["VS Code: Strg+P / Strg+Umschalt+P", "Datei / Befehl öffnen"], ["VS Code: Alt+↑/↓, Strg+D, F2", "Zeile verschieben, Mehrfachauswahl, Umbenennen"]]
  };
  var ss = $("#spick");
  ss.innerHTML = "<div class=\"intro\"><h2>Spickzettel</h2><p>Das Wichtigste zum Nachschlagen. Durchsuchbar über alle Bereiche; mit 🖨 druckbar.</p></div><div class=\"filterbar\"><input id=\"spSearch\" type=\"search\" class=\"search\" placeholder=\"Suchen, z. B. flex, join, ssh …\"><button class=\"ghost small\" id=\"spPrint\">🖨 Drucken</button></div><div id=\"spOut\" class=\"sp-grid\"></div>";
  function renderSp() {
    var q = $("#spSearch").value.trim().toLowerCase();
    $("#spOut").innerHTML = Object.keys(SP).map(function (k) {
      var rows = SP[k].filter(function (r) { return !q || (r[0] + " " + r[1] + " " + k).toLowerCase().indexOf(q) >= 0; });
      if (!rows.length) return "";
      return "<div class=\"card sp\"><h3>" + k + "</h3><table>" + rows.map(function (r) { return "<tr><td><code>" + esc(r[0]) + "</code></td><td>" + esc(r[1]) + "</td></tr>"; }).join("") + "</table></div>";
    }).join("") || "<p class=\"note\">Nichts gefunden.</p>";
  }
  $("#spSearch").addEventListener("input", renderSp);
  $("#spPrint").addEventListener("click", function () { document.body.classList.add("print-spick"); window.print(); setTimeout(function () { document.body.classList.remove("print-spick"); }, 500); });
  renderSp();

  /* ---------- Karriere ---------- */
  var ROLES = [
    ["🎨 Frontend-Entwicklerin", "Baut die Oberfläche: HTML/CSS/JS, Framework (React/Vue), Barrierefreiheit, Performance. Arbeitet eng mit Design."],
    ["⚙️ Backend-Entwicklerin", "APIs, Datenbanken, Geschäftslogik, Sicherheit. Sprachen: Node.js, Python, Java, C#, PHP, Go."],
    ["🔁 Full-Stack", "Beides plus Deployment. Häufig in Startups und kleinen Teams."],
    ["🧱 WordPress-/CMS-Entwicklerin", "Themes, Plugins, Kundenwebsites. Sehr gefragt bei Agenturen und Freelancern."],
    ["🚀 DevOps / Platform", "CI/CD, Container, Cloud, Monitoring, Infrastruktur als Code."],
    ["♿ Accessibility-Spezialistin", "Prüft und verbessert Barrierefreiheit. Seit dem BFSG stark nachgefragt."],
    ["🧪 QA / Test-Automatisierung", "Teststrategien, Playwright/Cypress, Qualitätssicherung."],
    ["📐 UX-Engineer / Design-Systeme", "Brücke zwischen Design und Code, Komponentenbibliotheken."]
  ];
  var MATRIX = { h: ["Bereich", "Junior", "Mid", "Senior"], r: [
    ["Code", "Löst klar beschriebene Aufgaben mit Unterstützung", "Setzt Features selbstständig um, schreibt Tests", "Entwirft Architektur, trifft Technikentscheidungen"],
    ["Qualität", "Kennt Grundlagen von a11y, Sicherheit, Performance", "Wendet sie konsequent an, findet Probleme im Review", "Setzt Standards, macht das Team besser"],
    ["Fehlersuche", "Debuggt mit Hilfe", "Findet Ursachen selbstständig", "Löst systemische Probleme, verbessert Monitoring"],
    ["Zusammenarbeit", "Fragt früh, nimmt Feedback an", "Gibt gute Code-Reviews, schätzt Aufwände", "Mentoring, Abstimmung mit Produkt/Kunden"],
    ["Erfahrung (grob)", "0–2 Jahre", "2–5 Jahre", "5+ Jahre"]] };
  var PORT = ["3–5 echte Projekte (kein reiner Tutorial-Nachbau)", "Jedes Projekt: Live-Demo + Code auf GitHub", "README: Problem, Lösung, Technik, Screenshot, Setup", "Mindestens ein Projekt mit API/Datenbank", "Lighthouse ≥ 90, barrierefrei, responsiv", "Saubere Git-Historie mit sinnvollen Commits", "Eigene Portfolio-Seite mit Kontakt", "Ein Projekt für einen echten Nutzer (Verein, Familie, Kunde)"];
  var QA = [
    ["Was passiert, wenn man eine URL im Browser eingibt?", "DNS-Auflösung → TCP/TLS-Verbindung → HTTP-Anfrage → Server/CDN antwortet → Browser parst HTML, lädt CSS/JS/Bilder, baut DOM & CSSOM, Layout, Paint. Bonus: Caching, HTTP/2, CDN erwähnen."],
    ["Unterschied zwischen let, const und var?", "const: nicht neu zuweisbar; let: veränderbar; beide block-scoped. var ist function-scoped und wird „gehoistet“, das führt leicht zu Fehlern, daher vermeiden."],
    ["Wie machst du eine Seite barrierefrei?", "Semantisches HTML, Tastaturbedienbarkeit, sichtbarer Fokus, alt-Texte, Labels, Kontrast nach WCAG AA, ARIA nur wo nötig, Test mit Screenreader (NVDA) und Lighthouse/axe."],
    ["Wie verhinderst du XSS?", "Ausgaben escapen (textContent / Framework-Templates), kein innerHTML mit Nutzerdaten, Content-Security-Policy, HTML-Eingaben mit DOMPurify bereinigen, httpOnly-Cookies."],
    ["Was ist Event-Delegation?", "Ein Listener am Elternelement, der über e.target.closest() erkennt, welches Kind betroffen ist. Funktioniert auch für später hinzugefügte Elemente und spart Listener."],
    ["Wie optimierst du die Ladezeit?", "Messen (Lighthouse, Web Vitals), Bilder optimieren (AVIF/WebP, Größen, lazy), JS reduzieren/splitten, Caching + CDN, kritisches CSS, Schriften lokal mit font-display: swap."],
    ["Erzähl von einem Fehler, den du gemacht hast.", "STAR-Methode: Situation, Aufgabe, Aktion, Resultat. Ehrlich, konkret, Fokus darauf, was du gelernt und verändert hast (z. B. Tests, Checklisten)."],
    ["Was ist der Unterschied zwischen SQL und NoSQL?", "SQL: Tabellen mit festem Schema und Beziehungen, Transaktionen, JOINs. NoSQL: flexible Dokumente/Schlüssel-Werte, horizontal skalierbar, keine JOINs. Wahl nach Datenstruktur und Anforderungen."],
    ["Warum sollte man dich einstellen?", "Verbinde deine Projekte mit den Anforderungen der Stelle. Zeig Lernfähigkeit (z. B. diesen Lernpfad), Qualitätsbewusstsein (a11y, Sicherheit) und Teamfähigkeit."],
    ["Welche Fragen hast du an uns?", "Immer welche stellen: Wie sieht Onboarding aus? Wie laufen Code-Reviews? Wie viel Zeit gibt es für Weiterbildung? Wie wird Qualität sichergestellt?"]
  ];
  var PLAN = { h: ["Wochen", "Schwerpunkt", "Ergebnis"], r: [
    ["1–2", "Web-Grundlagen, HTML (Labor 1–12)", "Erste mehrseitige HTML-Seite"], ["3–5", "CSS: Box-Modell, Flexbox, Grid, Responsive (Labor CSS)", "Portfolio-Projekt Etappe 1–3"], ["6–9", "JavaScript-Grundlagen, DOM, Events (Labor JS 1–12)", "Portfolio fertig (Etappe 4–5)"], ["10–12", "Async, fetch, Speichern, a11y & Sicherheit", "To-do-App komplett"], ["13–15", "Git & GitHub, Werkzeuge, ein Framework", "Projekt mit Vite/React oder Vue"], ["16–19", "Backend & SQL (SQL-Labor, API-Simulator)", "Mini-Shop + eigene kleine API"], ["20–22", "Hosting, DNS, Server (Server-Terminal, DNS-Editor)", "Alles live unter eigener Domain"], ["23–24", "Profi-Wissen, Prüfung, Bewerbung", "Zertifikat + Bewerbungsunterlagen"]] };
  var LINKS = [["MDN Web Docs", "https://developer.mozilla.org/de/"], ["web.dev (Google)", "https://web.dev/learn"], ["The Odin Project (kostenloser Lehrplan)", "https://www.theodinproject.com/"], ["freeCodeCamp", "https://www.freecodecamp.org/"], ["javascript.info", "https://javascript.info/"], ["Frontend Mentor (Praxisaufgaben nach Designvorlage)", "https://www.frontendmentor.io/"], ["Can I use (Browser-Unterstützung)", "https://caniuse.com/"], ["A11y Project (Barrierefreiheit)", "https://www.a11yproject.com/"]];
  S.portfolio = S.portfolio || {};
  var ks = $("#karriere");
  ks.innerHTML = "<div class=\"intro\"><h2>Karriere als Webentwicklerin</h2><p>Rollen, Erwartungen nach Erfahrungsstufe, ein 24-Wochen-Plan, Portfolio-Checkliste und typische Interviewfragen mit Antwortskizzen.</p></div>" +
    "<h2>Rollen im Web</h2><div class=\"cards four\">" + ROLES.map(function (r) { return "<div class=\"card\"><h3>" + r[0] + "</h3><p>" + r[1] + "</p></div>"; }).join("") + "</div>" +
    "<h2>Was wird auf welcher Stufe erwartet?</h2><div class=\"table-wrap\"><table class=\"cmp\" id=\"krMatrix\"></table></div>" +
    "<h2>24-Wochen-Plan (bei ca. 10 Std./Woche)</h2><div class=\"table-wrap\"><table class=\"cmp\" id=\"krPlan\"></table></div>" +
    "<h2>Portfolio-Checkliste</h2><div class=\"card checklist\" style=\"display:block\" id=\"krPort\"></div>" +
    "<h2>Typische Interviewfragen</h2><div class=\"accordion\">" + QA.map(function (q) { return "<details><summary><span>" + q[0] + "</span></summary><div class=\"body\"><p>" + q[1] + "</p></div></details>"; }).join("") + "</div>" +
    "<h2>Bewerbung: kurz &amp; wirksam</h2><div class=\"cards three\"><div class=\"card\"><h3>📄 Lebenslauf</h3><p>Max. 2 Seiten. Oben: Skills und Links (Portfolio, GitHub). Projekte mit Ergebnis statt Aufgabenliste.</p></div><div class=\"card\"><h3>✉️ Anschreiben</h3><p>Kurz, auf die Stelle zugeschnitten: Warum diese Firma, welches deiner Projekte passt, was du beitragen kannst.</p></div><div class=\"card\"><h3>🤝 Netzwerk</h3><p>Meetups, Konferenzen, Open-Source-Beiträge, LinkedIn/XING. Viele Stellen werden über Kontakte vergeben.</p></div></div>" +
    "<h2>Weiterlernen</h2><ul>" + LINKS.map(function (l) { return "<li><a href=\"" + l[1] + "\" target=\"_blank\" rel=\"noopener\">" + l[0] + "</a></li>"; }).join("") + "</ul>";
  W.table("#krMatrix", MATRIX); W.table("#krPlan", PLAN);
  function renderPort() {
    var b = $("#krPort"); b.innerHTML = "<h3>Mein Portfolio <small class=\"meta\">" + PORT.filter(function (x, i) { return S.portfolio[i]; }).length + " / " + PORT.length + "</small></h3>";
    PORT.forEach(function (t, i) { var l = el("label", S.portfolio[i] ? "on" : "", "<input type=\"checkbox\"" + (S.portfolio[i] ? " checked" : "") + "><span>" + esc(t) + "</span>"); $("input", l).addEventListener("change", function (e) { S.portfolio[i] = e.target.checked; W.save(); renderPort(); }); b.appendChild(l); });
  }
  renderPort();

  /* ---------- Über ---------- */
  $("#ueber").innerHTML = "<div class=\"intro\"><h2>Über die Web-Werkstatt</h2></div><div class=\"about\"><div class=\"card\">" +
    "<p class=\"cert-k\" style=\"text-align:left\">Konzept, Inhalte &amp; Umsetzung</p><p class=\"sig\" style=\"text-align:left\">" + esc(CFG.autorin || "") + "</p>" +
    "<p>Die <b>" + esc(CFG.titel || "Web-Werkstatt") + "</b> ist ein interaktiver Lernpfad, der von den Grundlagen bis zur professionellen Webentwicklung führt: bauen, veröffentlichen, betreiben und verkaufen. Statt nur zu lesen, wird geübt: im Code-Labor mit automatischer Prüfung, in geführten Projekten, in einer echten SQL-Datenbank, an einem simulierten Linux-Server und im DNS-Editor.</p>" +
    "<p><b>Version</b> " + esc(CFG.version || "") + " · " + esc(sig) + "</p></div>" +
    "<div class=\"card\"><h3>Hinweise</h3><ul><li>Dein Fortschritt und dein Code werden <b>nur lokal</b> in deinem Browser gespeichert (localStorage). Es werden keine Daten an Server übertragen.</li><li>Rechtliche und steuerliche Inhalte sind eine sorgfältig erstellte Orientierung (Stand 2025/26), <b>keine Rechts- oder Steuerberatung</b>.</li><li>Preise und Anbieter sind Beispiele ohne Gewähr und ohne Werbeabsicht.</li><li>Das Zertifikat ist ein persönlicher Lernnachweis ohne staatliche Anerkennung.</li><li>Externe Bilder in Übungen stammen von picsum.photos; Links führen zu externen Seiten, für deren Inhalte deren Betreiber verantwortlich sind.</li></ul>" +
    "<h3>Verwendete Software</h3><ul><li><a href=\"https://github.com/sql-js/sql.js\" target=\"_blank\" rel=\"noopener\">sql.js</a> (SQLite im Browser), MIT-Lizenz, siehe <code>vendor/sqljs/LICENSE</code></li></ul>" +
    "<h3>Urheberrecht</h3><p>Texte, Aufgaben, Gestaltung und Code der Web-Werkstatt: " + esc(sig) + ". Alle Rechte vorbehalten, sofern nicht anders angegeben.</p></div></div>";
})();
