/* Abschlussprüfung (Zeitlimit) + druckbares Zertifikat */
(function () {
  var W = window.WW, S = W.S, $ = W.$, el = W.el, esc = W.esc, CFG = window.WW_CONFIG || {};
  var N = 40, MIN = 45, PASS = 75;
  S.exam = S.exam || { best: 0, passed: false, attempts: 0, date: null };
  W.parts.push({ w: 10, f: function () { return S.exam.passed ? 1 : S.exam.best / 100 * 0.6; } });

  var sec = $("#pruefung");
  var E = null, timer = null;
  function lessonsDone() { return Object.keys(S.lessons).filter(function (k) { return S.lessons[k]; }).length; }
  function projectsDone() {
    var groups = {}; C.lessons.forEach(function (l) { if (/^Projekt/.test(l.sec)) { groups[l.sec] = groups[l.sec] || []; groups[l.sec].push(l.id); } });
    return Object.keys(groups).filter(function (g) { return groups[g].every(function (id) { return S.lessons[id]; }); }).length;
  }
  function reqs() {
    return [
      ["Abschlussprüfung bestanden (≥ " + PASS + " %)", S.exam.passed, S.exam.best + " % bestes Ergebnis"],
      ["Mindestens 40 Lektionen im Code-Labor", lessonsDone() >= 40, lessonsDone() + " / " + C.lessons.length],
      ["Mindestens 1 Abschlussprojekt komplett", projectsDone() >= 1, projectsDone() + " / 3 Projekte"],
      ["Mindestens 10 SQL-Aufgaben", (S.sql || []).length >= 10, (S.sql || []).length + " / 20"],
      ["Mindestens 8 Server-Missionen", (S.term || []).length >= 8, (S.term || []).length + " / 12"]
    ];
  }
  function home() {
    clearInterval(timer);
    var r = reqs(), ok = r.every(function (x) { return x[1]; });
    sec.innerHTML = "<div class=\"intro\"><h2>Abschlussprüfung &amp; Zertifikat</h2><p>Die Prüfung umfasst <b>" + N + " Fragen</b> aus allen Bereichen, Zeit: <b>" + MIN + " Minuten</b>, bestanden ab <b>" + PASS + " %</b>. Du kannst zwischen Fragen springen und Antworten ändern. Danach siehst du eine Auswertung nach Themen mit Erklärungen.</p></div>" +
      "<div class=\"cards two\"><div class=\"card\"><h3>📝 Prüfung</h3><p>Versuche bisher: " + S.exam.attempts + " · Bestes Ergebnis: <b>" + S.exam.best + " %</b>" + (S.exam.passed ? " ✅ bestanden" : "") + "</p><p class=\"meta\">Fragenpool: " + C.quiz.length + " Fragen in " + cats().length + " Bereichen; jede Prüfung wird neu zusammengestellt.</p><button id=\"exStart\">Prüfung starten</button></div>" +
      "<div class=\"card\"><h3>🎓 Zertifikat</h3><ul class=\"req\">" + r.map(function (x) { return "<li class=\"" + (x[1] ? "y" : "n") + "\">" + (x[1] ? "✔" : "○") + " " + x[0] + " <span class=\"meta\">(" + x[2] + ")</span></li>"; }).join("") + "</ul>" +
      "<label class=\"small-l\" for=\"certName\">Name auf dem Zertifikat</label><input id=\"certName\" class=\"search\" value=\"" + esc(S.certName || "") + "\" placeholder=\"Vor- und Nachname\">" +
      "<p><button id=\"certBtn\"" + (ok ? "" : " class=\"ghost\"") + ">" + (ok ? "Zertifikat erstellen" : "Vorschau ansehen") + "</button></p></div></div><div id=\"certOut\"></div>";
    $("#exStart").addEventListener("click", start);
    $("#certBtn").addEventListener("click", function () { S.certName = $("#certName").value.trim(); W.save(); cert(ok); });
  }
  function cats() { return C.quiz.map(function (q) { return q.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }); }
  function start() {
    var pool = W.shuffle(C.quiz), pick = [], used = {};
    cats().forEach(function (c) { pool.filter(function (q) { return q.cat === c; }).slice(0, 2).forEach(function (q) { pick.push(q); used[C.quiz.indexOf(q)] = 1; }); });
    pool.forEach(function (q) { if (pick.length < N && !used[C.quiz.indexOf(q)]) pick.push(q); });
    pick = W.shuffle(pick.slice(0, N)).map(function (q) { var o = W.shuffle(q.o.map(function (t, i) { return { t: t, ok: i === q.a }; })); return { q: q, o: o, a: null }; });
    E = { qs: pick, i: 0, end: Date.now() + MIN * 60000 };
    timer = setInterval(tick, 1000);
    render();
  }
  function tick() { var left = Math.max(0, E.end - Date.now()); var t = $("#exTime"); if (t) t.textContent = String(Math.floor(left / 60000)).padStart(2, "0") + ":" + String(Math.floor(left / 1000) % 60).padStart(2, "0"); if (left <= 0) finish(true); }
  function render() {
    var x = E.qs[E.i], answered = E.qs.filter(function (q) { return q.a !== null; }).length;
    sec.innerHTML = "<div class=\"exam-top\"><b>Abschlussprüfung</b><span>Beantwortet: " + answered + " / " + E.qs.length + "</span><span class=\"exam-time\">⏱ <span id=\"exTime\"></span></span><button class=\"ghost small\" id=\"exAbort\">Abbrechen</button></div>" +
      "<div class=\"exam-nav\">" + E.qs.map(function (q, i) { return "<button class=\"" + (i === E.i ? "cur " : "") + (q.a !== null ? "done" : "") + "\" data-i=\"" + i + "\" aria-label=\"Frage " + (i + 1) + "\">" + (i + 1) + "</button>"; }).join("") + "</div>" +
      "<div class=\"quiz-box\"><div class=\"q-head\"><span>Frage " + (E.i + 1) + " von " + E.qs.length + " · " + x.q.cat + "</span></div><div class=\"q-text\">" + x.q.q + "</div><div class=\"q-opts\">" +
      x.o.map(function (o, j) { return "<button class=\"q-opt" + (x.a === j ? " chosen" : "") + "\" data-j=\"" + j + "\">" + o.t + "</button>"; }).join("") + "</div>" +
      "<div class=\"q-foot\" style=\"justify-content:space-between\"><button class=\"ghost\" id=\"exPrev\"" + (E.i === 0 ? " disabled" : "") + ">◀ Zurück</button>" + (E.i < E.qs.length - 1 ? "<button id=\"exNext\">Weiter ▶</button>" : "<button id=\"exDone\">Prüfung abgeben</button>") + "</div></div>";
    tick();
    W.$$(".exam-nav button", sec).forEach(function (b) { b.addEventListener("click", function () { E.i = +b.dataset.i; render(); }); });
    W.$$(".q-opt", sec).forEach(function (b) { b.addEventListener("click", function () { x.a = +b.dataset.j; if (E.i < E.qs.length - 1) E.i++; render(); }); });
    $("#exPrev").addEventListener("click", function () { E.i--; render(); });
    var n = $("#exNext"); if (n) n.addEventListener("click", function () { E.i++; render(); });
    var d = $("#exDone"); if (d) d.addEventListener("click", function () { var open = E.qs.length - answered; if (open && !confirm(open + " Frage(n) unbeantwortet. Trotzdem abgeben?")) return; finish(false); });
    $("#exAbort").addEventListener("click", function () { if (confirm("Prüfung abbrechen? Der Versuch wird nicht gewertet.")) { E = null; home(); } });
  }
  function finish(timeout) {
    clearInterval(timer);
    var right = E.qs.filter(function (q) { return q.a !== null && q.o[q.a].ok; }).length, pct = Math.round(right / E.qs.length * 100), passed = pct >= PASS;
    S.exam.attempts++; if (pct > S.exam.best) S.exam.best = pct; if (passed && !S.exam.passed) { S.exam.passed = true; S.exam.date = new Date().toISOString().slice(0, 10); } W.save(); W.progress();
    var by = {}; E.qs.forEach(function (q) { var c = q.q.cat; by[c] = by[c] || [0, 0]; by[c][1]++; if (q.a !== null && q.o[q.a].ok) by[c][0]++; });
    var wrong = E.qs.filter(function (q) { return q.a === null || !q.o[q.a].ok; });
    sec.innerHTML = "<div class=\"quiz-box q-result\" style=\"max-width:none\">" + (timeout ? "<p>⏱ Zeit abgelaufen, Prüfung automatisch abgegeben.</p>" : "") + "<div class=\"big\">" + pct + " %</div><p>" + right + " von " + E.qs.length + " richtig · " + (passed ? "<b style=\"color:var(--green)\">Bestanden! 🎉</b>" : "<b style=\"color:var(--red)\">Noch nicht bestanden</b> (ab " + PASS + " %)") + "</p></div>" +
      "<h2>Auswertung nach Bereichen</h2><div class=\"cards four\">" + Object.keys(by).sort().map(function (c) { var v = by[c], pc = Math.round(v[0] / v[1] * 100); return "<div class=\"card\"><b>" + c + "</b><div class=\"bar\" style=\"width:100%;margin:.4rem 0\"><div style=\"height:100%;width:" + pc + "%;background:" + (pc >= 75 ? "var(--green)" : pc >= 50 ? "var(--orange)" : "var(--red)") + "\"></div></div><span class=\"meta\">" + v[0] + " / " + v[1] + "</span></div>"; }).join("") + "</div>" +
      (wrong.length ? "<h2>Das solltest du wiederholen</h2><div class=\"accordion\">" + wrong.map(function (q) { var r = q.o.filter(function (o) { return o.ok; })[0]; return "<details><summary><span>" + q.q.q + "</span></summary><div class=\"body\"><p>" + (q.a === null ? "Nicht beantwortet." : "Deine Antwort: " + q.o[q.a].t) + "</p><p><b>Richtig:</b> " + r.t + "</p><p>" + q.q.e + "</p></div></details>"; }).join("") + "</div>" : "") +
      "<p><button id=\"exHome\">Zur Übersicht</button></p>";
    $("#exHome").addEventListener("click", home);
    E = null;
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ("00000000" + (h >>> 0).toString(16)).slice(-8).toUpperCase(); }
  function cert(ok) {
    var name = S.certName || "Vorname Nachname", date = S.exam.date || new Date().toISOString().slice(0, 10);
    var dDe = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(date + "T12:00:00"));
    var id = "WW-" + hash(name + "|" + date + "|" + S.exam.best + "|" + lessonsDone());
    $("#certOut").innerHTML = "<div class=\"cert" + (ok ? "" : " preview") + "\" id=\"certificate\">" + (ok ? "" : "<div class=\"wm\">VORSCHAU</div>") +
      "<div class=\"cert-in\"><div class=\"cert-logo\">&lt;/&gt;</div><p class=\"cert-k\">Zertifikat</p><h2>" + esc(CFG.titel || "Web-Werkstatt") + "</h2><p class=\"cert-sub\">" + esc(CFG.untertitel || "") + "</p>" +
      "<p>Hiermit wird bestätigt, dass</p><p class=\"cert-name\">" + esc(name) + "</p><p>den Lernpfad zur professionellen Webentwicklung erfolgreich durchlaufen und die Abschlussprüfung bestanden hat.</p>" +
      "<ul class=\"cert-list\"><li><b>" + lessonsDone() + "</b> Lektionen im Code-Labor (HTML, CSS, JavaScript, Barrierefreiheit, Sicherheit)</li><li><b>" + projectsDone() + "</b> geführte Abschlussprojekte</li><li><b>" + (S.sql || []).length + "</b> SQL-Aufgaben · <b>" + (S.term || []).length + "</b> Server-Missionen · <b>" + (S.zoneDone || []).length + "</b> DNS-Szenarien</li><li>Abschlussprüfung: <b>" + S.exam.best + " %</b></li></ul>" +
      "<div class=\"cert-foot\"><div><p class=\"cert-date\">" + dDe + "</p><span class=\"meta\">Datum</span></div><div><p class=\"sig\">" + esc(CFG.autorin || "") + "</p><span class=\"meta\">" + esc(CFG.autorin || "") + " · Autorin der Web-Werkstatt</span></div></div>" +
      "<p class=\"cert-id\">Zertifikats-ID: " + id + " · Lernnachweis ohne staatliche Anerkennung</p></div></div>" +
      (ok ? "<p><button id=\"certPrint\">🖨 Drucken / als PDF speichern</button></p>" : "<p class=\"note\">Das ist eine Vorschau. Das Zertifikat wird freigeschaltet, wenn alle Voraussetzungen erfüllt sind.</p>");
    var pb = $("#certPrint"); if (pb) pb.addEventListener("click", function () { window.print(); });
  }
  home();
  W.examHome = home;
})();
