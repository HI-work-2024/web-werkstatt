/* Web-Werkstatt 3.0 · Oberfläche: Startseite, Navigation, Suche, Dunkelmodus, Datensicherung
   © 2026 Ibtissam Hommada */
(function () {
  var W = window.WW, S = W.S, $ = W.$, $$ = W.$$, el = W.el, esc = W.esc, CFG = window.WW_CONFIG || {};
  var NAV = $$(".tabs.side button[data-tab]").map(function (b) {
    var icon = (b.querySelector("i") || {}).textContent || "";
    return { tab: b.dataset.tab, label: b.textContent.replace(icon, "").trim(), icon: icon, group: b.closest(".nav-group").querySelector(".nav-h").textContent };
  });
  function navOf(tab) { for (var i = 0; i < NAV.length; i++) if (NAV[i].tab === tab) return NAV[i]; return null; }
  function strip(h) { var d = document.createElement("div"); d.innerHTML = h || ""; return d.textContent; }
  function count(obj) { return Object.keys(obj || {}).filter(function (k) { return obj[k]; }).length; }

  /* ---------- Dunkelmodus ---------- */
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); $("#themeBtn").textContent = t === "dark" ? "☀️" : "🌙"; $("#themeBtn").setAttribute("aria-label", t === "dark" ? "Hellen Modus einschalten" : "Dunkelmodus einschalten"); }
  applyTheme(S.theme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#themeBtn").addEventListener("click", function () { S.theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"; W.save(); applyTheme(S.theme); });

  /* ---------- Mobiles Menü ---------- */
  var side = $("#sidenav"), bd = $("#navBackdrop"), mb = $("#menuBtn");
  function menu(open) { side.classList.toggle("open", open); bd.hidden = !open; mb.setAttribute("aria-expanded", String(open)); }
  mb.addEventListener("click", function () { menu(!side.classList.contains("open")); });
  bd.addEventListener("click", function () { menu(false); });

  /* ---------- Fortschrittsring + erledigte Bereiche ---------- */
  function ring() {
    var p = parseInt($("#progressText").textContent, 10) || 0;
    $("#ringFg").style.strokeDashoffset = String(97.4 * (1 - p / 100));
    var lessonsAll = C.lessons.every(function (l) { return S.lessons[l.id]; });
    var done = { labor: lessonsAll, sql: (S.sql || []).length >= 20, git: (S.gitDone || []).length >= (W.gitMissions || []).length && (S.gitDone || []).length > 0, server: (S.term || []).length >= 12, pruefung: S.exam && S.exam.passed, backend: S.api.length >= C.apiTasks.length };
    $$(".tabs.side button[data-tab]").forEach(function (b) { b.classList.toggle("done", !!done[b.dataset.tab]); });
  }
  new MutationObserver(ring).observe($("#progressText"), { childList: true, characterData: true, subtree: true });

  /* ---------- Seitenköpfe & Vor/Zurück ---------- */
  var META = {
    web: ["Grundlagen", "ca. 30 Min."], backend: ["Simulator", "8 Aufgaben"], tools: ["Überblick"], profi: ["6 Themen", "Prüflisten"],
    labor: [C.lessons.length + " Lektionen", "3 Projekte", "automatische Prüfung"], sql: ["echte SQLite-Datenbank", "20 Aufgaben"], git: ["Simulator", "12 Missionen"], server: ["Linux-Simulator", "12 Missionen"],
    hosting: ["Berater", "DNS-Editor", "Checkliste"], business: ["Rechner", "Recht in DE"], karriere: ["24-Wochen-Plan", "Interview"], karten: ["Leitner-System"], quiz: [C.quiz.length + " Fragen"], pruefung: ["40 Fragen", "45 Min.", "Zertifikat"],
    spick: ["8 Bereiche", "druckbar"], glossar: [C.glossary.length + " Begriffe"], ueber: ["Version " + (CFG.version || "")], pfad: ["9 Stufen"]
  };
  /* idempotent: Module, die ihren Bereich neu zeichnen (z. B. Prüfung), bekommen Kopf und Navigation automatisch zurück */
  function decorate(n, i) {
    var p = document.getElementById(n.tab); if (!p || n.tab === "start") return;
    var intro = p.querySelector(":scope > .intro");
    if (intro && !intro.querySelector(".crumb")) {
      intro.insertAdjacentHTML("afterbegin", "<div class=\"crumb\"><span>" + esc(n.group) + "</span><span aria-hidden=\"true\">›</span><b>" + esc(n.label) + "</b></div>");
      if (META[n.tab]) intro.insertAdjacentHTML("beforeend", "<div class=\"page-meta\">" + META[n.tab].map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("") + "</div>");
    }
    if (!p.querySelector(":scope > .page-nav")) {
      var prev = NAV[i - 1], next = NAV[i + 1], pn = el("nav", "page-nav"); pn.setAttribute("aria-label", "Seitennavigation");
      pn.innerHTML = (prev ? "<button class=\"prev\" data-go=\"" + prev.tab + "\"><small>← Zurück</small>" + prev.icon + " " + esc(prev.label) + "</button>" : "<span></span>") +
        (next ? "<button class=\"next\" data-go=\"" + next.tab + "\"><small>Weiter →</small>" + next.icon + " " + esc(next.label) + "</button>" : "");
      p.appendChild(pn);
    }
  }
  NAV.forEach(function (n, i) {
    decorate(n, i);
    var p = document.getElementById(n.tab);
    if (p && n.tab !== "start") new MutationObserver(function () { decorate(n, i); }).observe(p, { childList: true });
  });
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-go]"); if (b) { e.preventDefault(); W.show(b.dataset.go); } });
  document.addEventListener("ww:show", function (e) {
    var n = navOf(e.detail);
    document.title = (n && e.detail !== "start" ? n.label + " · " : "") + (CFG.titel || "Web-Werkstatt") + " · " + (CFG.autorin || "");
    menu(false);
    if (e.detail === "start") home();
    ring();
  });

  /* ---------- Signatur in der Seitenleiste ---------- */
  $("#navSig").innerHTML = "<span>Konzept &amp; Umsetzung</span><div class=\"sig\">" + esc(CFG.autorin || "") + "</div><span>Version " + esc(CFG.version || "") + " · © " + (CFG.jahr || "") + "</span>";

  /* ---------- Startseite ---------- */
  function lessonsDone() { return count(S.lessons); }
  function projDone() { var g = {}; C.lessons.forEach(function (l) { if (/^Projekt/.test(l.sec)) { g[l.sec] = g[l.sec] || []; g[l.sec].push(l.id); } }); return Object.keys(g).filter(function (k) { return g[k].every(function (id) { return S.lessons[id]; }); }).length; }
  function nextLesson() { for (var i = 0; i < C.lessons.length; i++) if (!S.lessons[C.lessons[i].id]) return C.lessons[i]; return null; }
  function lessonById(id) { for (var i = 0; i < C.lessons.length; i++) if (C.lessons[i].id === id) return C.lessons[i]; return null; }
  function home() {
    var sec = $("#start"), last = lessonById(S.lastLesson), nl = nextLesson(), cont = last && !S.lessons[last.id] ? last : nl;
    var gm = (W.gitMissions || []).length, cards = W.cards || { total: 0, due: function () { return 0; }, learned: function () { return 0; } };
    var k = [
      ["🧪", "Lektionen", lessonsDone(), C.lessons.length, "labor"], ["🏗️", "Projekte", projDone(), 3, "labor"], ["🗄️", "SQL-Aufgaben", (S.sql || []).length, 20, "sql"], ["🌿", "Git-Missionen", (S.gitDone || []).length, gm, "git"],
      ["🐧", "Server-Missionen", (S.term || []).length, 12, "server"], ["🃏", "Karten sicher", cards.learned(), cards.total, "karten"], ["❓", "Quiz (bestes)", S.quizBest || 0, 100, "quiz", "%"], ["🎓", "Prüfung (bestes)", S.exam ? S.exam.best : 0, 100, "pruefung", "%"]
    ];
    var feats = [
      ["🧭", "Lernpfad", "9 Stufen vom ersten HTML-Tag bis zur Selbstständigkeit", "pfad", "9 Stufen"], ["🧪", "Code-Labor", "Echtes HTML, CSS & JavaScript mit Live-Vorschau und automatischer Prüfung", "labor", C.lessons.length + " Lektionen"],
      ["🏗️", "Abschlussprojekte", "Portfolio, To-do-App und Mini-Shop in geführten Etappen", "labor", "16 Etappen"], ["🗄️", "SQL-Labor", "Echte SQLite-Datenbank im Browser", "sql", "20 Aufgaben"],
      ["🌿", "Git-Labor", "Commit, Push, Pull, Branches: sicher simuliert", "git", gm + " Missionen"], ["🐧", "Server-Terminal", "Website per SSH, nginx, Firewall & HTTPS live bringen", "server", "12 Missionen"],
      ["🔌", "Backend & APIs", "HTTP verstehen mit eigener Shop-API", "backend", "Simulator"], ["🚀", "Hosting & DNS", "Hosting-Berater, DNS-Zonen-Editor, Go-Live-Checkliste", "hosting", "4 DNS-Szenarien"],
      ["💶", "Verkaufen & Recht", "Stundensatz, Angebot, Impressum, DSGVO, BFSG", "business", "2 Rechner"], ["🏆", "Profi-Wissen", "Performance, Sicherheit, Barrierefreiheit, SEO, Tests", "profi", "6 Themen"],
      ["💼", "Karriere", "Rollen, Kompetenzmatrix, 24-Wochen-Plan, Interview", "karriere", "Bewerbung"], ["🃏", "Lernkarten", "Wissen dauerhaft verankern mit Wiederholungssystem", "karten", cards.total + " Karten"],
      ["🎓", "Prüfung & Zertifikat", "40 Fragen, 45 Minuten, signiertes Zertifikat", "pruefung", C.quiz.length + " Fragen im Pool"], ["📑", "Spickzettel", "Alles Wichtige zum Nachschlagen & Drucken", "spick", "8 Bereiche"]
    ];
    var tip = C.glossary[Math.floor(Date.now() / 86400000) % C.glossary.length];
    sec.innerHTML = "<div class=\"hero\"><div class=\"eyebrow\">" + esc(CFG.titel || "") + " · Version " + esc(CFG.version || "") + "</div>" +
      "<h2>Werde Schritt für Schritt zur professionellen Webentwicklerin.</h2><p>" + esc(CFG.untertitel || "") + ": verstehen, üben, veröffentlichen und verkaufen. Alles interaktiv, direkt im Browser, ohne Installation.</p>" +
      "<div class=\"hero-actions\">" + (cont ? "<button class=\"btn-white\" id=\"hContinue\">▶ " + (lessonsDone() ? "Weiterlernen" : "Jetzt starten") + ": " + esc(cont.t) + "</button>" : "<button class=\"btn-white\" data-go=\"pruefung\">🎓 Zur Abschlussprüfung</button>") +
      "<button class=\"btn-glass\" data-go=\"pfad\">🧭 Lernpfad ansehen</button>" + (cards.due() ? "<button class=\"btn-glass\" data-go=\"karten\">🃏 " + cards.due() + " Karten fällig</button>" : "") + "</div>" +
      "<div class=\"by\">Konzept, Inhalte &amp; Umsetzung<div class=\"sig\">" + esc(CFG.autorin || "") + "</div></div></div>" +
      "<div class=\"kpis\">" + k.map(function (x) { var pct = x[3] ? Math.round(100 * x[2] / x[3]) : 0; return "<button class=\"kpi\" data-go=\"" + x[4] + "\"><span class=\"k-ico\">" + x[0] + "</span><span class=\"k-val\">" + x[2] + (x[5] ? " " + x[5] : " / " + x[3]) + "</span><span class=\"k-lbl\">" + x[1] + "</span><div class=\"k-bar\"><i style=\"width:" + Math.min(100, pct) + "%\"></i></div></button>"; }).join("") + "</div>" +
      "<h2>Dein Weg in 9 Stufen</h2><div class=\"card\"><div class=\"roadmap-v\">" + C.path.map(function (st, i) {
        var t = st.skills.filter(function (s, j) { return S.skills[i + "." + j]; }).length, cls = t === st.skills.length ? "done" : t ? "part" : "";
        return "<button class=\"rv-step " + cls + "\" data-stage=\"" + i + "\"><div class=\"rv-dot\">" + (cls === "done" ? "✓" : i) + "</div>" + esc(st.t) + "<small>" + t + "/" + st.skills.length + "</small></button>";
      }).join("") + "</div><p class=\"meta\" style=\"margin:0\">Klick auf eine Stufe öffnet sie im Lernpfad. Hake dort ab, was du sicher kannst.</p></div>" +
      "<div class=\"two-col\" style=\"margin-top:1.2rem\"><div class=\"card\"><h3>Als Nächstes empfohlen</h3>" + recs() + "</div>" +
      "<div class=\"card\"><h3>💡 Begriff des Tages</h3><p><b>" + esc(tip[0]) + "</b>: " + esc(tip[1]) + "</p><hr style=\"border:0;border-top:1px solid var(--line)\"><h3>Tastenkürzel</h3><p class=\"meta\"><kbd>Strg</kbd>+<kbd>K</kbd> Suche · <kbd>Strg</kbd>+<kbd>Enter</kbd> Lektion prüfen · <kbd>Leertaste</kbd> Lernkarte umdrehen · <kbd>1</kbd>/<kbd>2</kbd> nicht gewusst/gewusst</p></div></div>" +
      "<h2>Alles, was dich erwartet</h2><div class=\"features\">" + feats.map(function (f) { return "<button class=\"feature\" data-go=\"" + f[3] + "\"><span class=\"f-ico\">" + f[0] + "</span><b>" + f[1] + "</b><span>" + f[2] + "</span><em>" + f[4] + "</em></button>"; }).join("") + "</div>";
    var hc = $("#hContinue"); if (hc) hc.addEventListener("click", function () { W.show("labor"); W.openLesson(cont.id); });
    $$(".rv-step", sec).forEach(function (b) { b.addEventListener("click", function () { W.show("pfad"); var s = $$(".stage")[+b.dataset.stage]; if (s) { s.classList.add("open"); s.scrollIntoView({ block: "start" }); } }); });
    $$("[data-lesson]", sec).forEach(function (b) { b.addEventListener("click", function () { W.show("labor"); W.openLesson(b.dataset.lesson); }); });
    if (!sec.querySelector(".page-nav")) { var pn = el("nav", "page-nav"); pn.innerHTML = "<span></span><button class=\"next\" data-go=\"pfad\"><small>Weiter →</small>🧭 Lernpfad</button>"; sec.appendChild(pn); }
  }
  function recs() {
    var r = [], nl = nextLesson();
    if (nl) r.push(["🧪", "Lektion: " + nl.t, nl.sec, "data-lesson=\"" + nl.id + "\""]);
    if ((S.sql || []).length < 20) r.push(["🗄️", "SQL-Aufgabe " + ((S.sql || []).length + 1) + " von 20", "SQL-Labor", "data-go=\"sql\""]);
    if ((S.gitDone || []).length < (W.gitMissions || []).length) r.push(["🌿", "Git-Mission " + ((S.gitDone || []).length + 1), "Git-Labor", "data-go=\"git\""]);
    if ((S.term || []).length < 12) r.push(["🐧", "Server-Mission " + ((S.term || []).length + 1) + " von 12", "Server-Terminal", "data-go=\"server\""]);
    if (W.cards && W.cards.due()) r.push(["🃏", W.cards.due() + " Lernkarten wiederholen", "Lernkarten", "data-go=\"karten\""]);
    if (!(S.exam && S.exam.passed)) r.push(["🎓", "Abschlussprüfung ablegen", "Prüfung & Zertifikat", "data-go=\"pruefung\""]);
    return r.slice(0, 5).map(function (x) { return "<button class=\"feature\" style=\"margin:.4rem 0;flex-direction:row;align-items:center;gap:.8rem;width:100%\" " + x[3] + "><span class=\"f-ico\" style=\"font-size:1.3rem\">" + x[0] + "</span><span style=\"color:var(--ink)\"><b>" + esc(x[1]) + "</b><br><small class=\"meta\">" + esc(x[2]) + "</small></span></button>"; }).join("") || "<p>Alles erledigt. Großartig! 🎉</p>";
  }

  /* ---------- Globale Suche ---------- */
  var IDX = null, gs = $("#gSearch"), gr = $("#gResults"), sel = -1, hits = [];
  function build() {
    IDX = [];
    NAV.forEach(function (n) { var p = document.getElementById(n.tab), intro = p && p.querySelector(".intro p"); IDX.push({ g: "Bereiche", t: n.icon + " " + n.label, d: intro ? intro.textContent : n.group, go: function () { W.show(n.tab); } }); });
    C.lessons.forEach(function (l) { IDX.push({ g: "Lektionen", t: l.t, d: l.sec + " · " + strip(l.task).slice(0, 120), x: strip(l.theory), go: function () { W.show("labor"); W.openLesson(l.id); } }); });
    C.glossary.forEach(function (g) { IDX.push({ g: "Glossar", t: g[0], d: g[1], go: function () { W.show("glossar"); var s = $("#glossSearch"); s.value = g[0]; s.dispatchEvent(new Event("input")); } }); });
    $$("#spOut .sp").forEach(function (card) { var h = card.querySelector("h3").textContent; $$("tr", card).forEach(function (tr) { var c = tr.children[0].textContent, d = tr.children[1].textContent; IDX.push({ g: "Spickzettel · " + h, t: c, d: d, go: function () { W.show("spick"); var s = $("#spSearch"); s.value = c.split(" ")[0]; s.dispatchEvent(new Event("input")); } }); }); });
    (C.beParts || []).forEach(function (b, i) { IDX.push({ g: "Backend", t: b.n, d: strip(b.d), go: function () { W.show("backend"); var p = $$("#beParts .part")[i]; if (p) { p.click(); p.scrollIntoView({ block: "center" }); } } }); });
    (C.pro || []).forEach(function (t, i) { IDX.push({ g: "Profi-Wissen", t: t.t, d: strip(t.k).slice(0, 140), go: function () { W.show("profi"); $$("#proChips .chip")[i].click(); } }); });
    (C.legal || []).forEach(function (l, i) { IDX.push({ g: "Recht", t: l.t, d: strip(l.b).slice(0, 140), go: function () { W.show("business"); var d = $$("#legalList details")[i]; if (d) { d.open = true; d.scrollIntoView({ block: "center" }); } } }); });
    (C.tools || []).forEach(function (t) { IDX.push({ g: "Werkzeuge", t: t.t, d: strip(t.d).slice(0, 140), go: function () { W.show("tools"); } }); });
    (W.sqlTasks || []).forEach(function (t, i) { IDX.push({ g: "SQL-Aufgaben", t: t.t, d: strip(t.d), go: function () { W.show("sql"); var b = $$("#sqlTasks button")[i]; if (b) b.click(); } }); });
    (W.gitMissions || []).forEach(function (m) { IDX.push({ g: "Git-Missionen", t: m.t, d: strip(m.task), go: function () { W.show("git"); } }); });
  }
  function search(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var res = IDX.map(function (it) {
      var t = it.t.toLowerCase(), all = (it.t + " " + it.d + " " + (it.x || "")).toLowerCase();
      if (!terms.every(function (w) { return all.indexOf(w) >= 0; })) return null;
      var sc = terms.reduce(function (s, w) { return s + (t.indexOf(w) === 0 ? 6 : t.indexOf(w) >= 0 ? 4 : 1); }, 0);
      return { it: it, sc: sc };
    }).filter(Boolean).sort(function (a, b) { return b.sc - a.sc; });
    var per = {}; return res.filter(function (r) { per[r.it.g] = (per[r.it.g] || 0) + 1; return per[r.it.g] <= 5; }).slice(0, 25).map(function (r) { return r.it; });
  }
  function hl(s, q) { var t = esc(s); q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; }).forEach(function (w) { t = t.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); }); return t; }
  function render() {
    var q = gs.value.trim();
    if (q.length < 2) { gr.hidden = true; gs.setAttribute("aria-expanded", "false"); return; }
    if (!IDX) build();
    hits = search(q); sel = hits.length ? 0 : -1;
    var g = null, html = "";
    hits.forEach(function (h, i) { if (h.g !== g) { g = h.g; html += "<div class=\"gs-group\">" + esc(g) + "</div>"; } html += "<button class=\"gs-item\" role=\"option\" data-i=\"" + i + "\" aria-selected=\"" + (i === sel) + "\">" + hl(h.t, q) + "<small>" + hl(h.d.slice(0, 120), q) + "</small></button>"; });
    gr.innerHTML = html || "<div class=\"gs-empty\">Keine Treffer für „" + esc(q) + "“</div>";
    gr.hidden = false; gs.setAttribute("aria-expanded", "true");
    $$(".gs-item", gr).forEach(function (b) { b.addEventListener("mousedown", function (e) { e.preventDefault(); pick(+b.dataset.i); }); });
  }
  function mark() { $$(".gs-item", gr).forEach(function (b) { var on = +b.dataset.i === sel; b.setAttribute("aria-selected", on); if (on) b.scrollIntoView({ block: "nearest" }); }); }
  function pick(i) { var h = hits[i]; if (!h) return; gr.hidden = true; gs.value = ""; gs.blur(); h.go(); }
  gs.addEventListener("input", render);
  gs.addEventListener("focus", render);
  gs.addEventListener("blur", function () { setTimeout(function () { gr.hidden = true; }, 150); });
  gs.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { sel = Math.min(hits.length - 1, sel + 1); mark(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); mark(); e.preventDefault(); }
    else if (e.key === "Enter") { pick(sel); e.preventDefault(); }
    else if (e.key === "Escape") { gr.hidden = true; gs.blur(); }
  });
  document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); gs.focus(); gs.select(); } });
  W.search = function (q) { if (!IDX) build(); return search(q); };

  /* ---------- Daten sichern / laden (z. B. PC ↔ Laptop) ---------- */
  var ab = $("#ueber .about");
  if (ab) {
    var card = el("div", "card");
    card.innerHTML = "<h3>💾 Dein Fortschritt: sichern &amp; übertragen</h3><p>Dein Fortschritt (Lektionen, Code, Karten, Prüfung …) liegt nur in diesem Browser. Sichere ihn als Datei, z. B. um auf dem Laptop weiterzulernen, und lade ihn dort wieder.</p>" +
      "<div class=\"data-actions\"><button id=\"dExport\">⬇ Fortschritt sichern</button><label class=\"chip\" style=\"cursor:pointer\">⬆ Sicherung laden<input type=\"file\" id=\"dImport\" accept=\"application/json\" hidden></label></div><p class=\"meta\" id=\"dMsg\"></p>";
    ab.appendChild(card);
    $("#dExport").addEventListener("click", function () {
      var data = { app: "Web-Werkstatt", version: CFG.version, exportiert: new Date().toISOString(), daten: S };
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
      a.download = "web-werkstatt-fortschritt-" + new Date().toISOString().slice(0, 10) + ".json"; document.body.appendChild(a); a.click(); a.remove();
      $("#dMsg").textContent = "Sicherung erstellt. Sie enthält auch deinen Code aus dem Labor.";
    });
    $("#dImport").addEventListener("change", function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var j = JSON.parse(r.result), d = j.daten || j;
          if (j.app !== "Web-Werkstatt" || typeof d.lessons !== "object") throw new Error("Das ist keine Web-Werkstatt-Sicherung.");
          if (!confirm("Sicherung vom " + (j.exportiert || "?").slice(0, 10) + " laden? Dein aktueller Fortschritt in diesem Browser wird ersetzt.")) return;
          localStorage.setItem(W.KEY, JSON.stringify(d)); location.reload();
        } catch (err) { $("#dMsg").textContent = "Fehler: " + err.message; }
      };
      r.readAsText(f);
    });
  }

  ring();
  if (!location.hash || /start/.test(location.hash)) home();
})();
