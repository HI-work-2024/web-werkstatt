/* Lernkarten mit Leitner-System (5 Fächer, wachsende Abstände) */
(function () {
  var W = window.WW, S = W.S, $ = W.$, el = W.el, esc = W.esc;
  S.cards = S.cards || {};
  var DAY = 86400000, GAP = [0, 0, 1, 3, 7, 16]; // Tage bis zur nächsten Wiederholung je Fach
  function strip(h) { var d = document.createElement("div"); d.innerHTML = h; return d.textContent; }
  var DECK = [];
  C.glossary.forEach(function (g) { DECK.push({ id: "g:" + g[0], deck: "Glossar", front: esc(g[0]), back: esc(g[1]) }); });
  C.quiz.forEach(function (q, i) { DECK.push({ id: "q:" + strip(q.q).slice(0, 60), deck: q.cat, front: q.q, back: "<b>" + q.o[q.a] + "</b><br><span class=\"meta\">" + q.e + "</span>" }); });
  var DECKS = ["Alle", "Glossar"].concat(C.quiz.map(function (q) { return q.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
  function st(id) { return S.cards[id] || { b: 0, due: 0 }; }
  function learned() { return DECK.filter(function (c) { return st(c.id).b >= 3; }).length; }
  function due(deck) { var now = Date.now(); return DECK.filter(function (c) { var s = st(c.id); return (deck === "Alle" || c.deck === deck) && s.b > 0 && s.due <= now; }); }
  function fresh(deck) { return DECK.filter(function (c) { return (deck === "Alle" || c.deck === deck) && st(c.id).b === 0; }); }
  W.parts.push({ w: 5, f: function () { return learned() / DECK.length; } });
  W.cards = { total: DECK.length, due: function () { return due("Alle").length; }, learned: learned };

  var sec = $("#karten"), deck = "Alle", queue = [], cur = null, NEW = 10, sessionDone = 0, sessionRight = 0;
  sec.innerHTML = "<div class=\"intro\"><h2>Lernkarten</h2><p>Wissen dauerhaft verankern mit dem <b>Leitner-System</b>: Gewusste Karten wandern ein Fach weiter und kommen erst nach wachsenden Abständen (1, 3, 7, 16 Tage) wieder, nicht gewusste sofort zurück ins erste Fach. " + DECK.length + " Karten aus Glossar und Fragenpool.</p></div>" +
    "<div class=\"chips\" id=\"fcDecks\"></div><div class=\"fc-wrap\"><div id=\"fcMain\"></div><aside class=\"card\" id=\"fcStats\"></aside></div>";
  DECKS.forEach(function (d) { var b = el("button", "chip" + (d === deck ? " active" : ""), d); b.addEventListener("click", function () { deck = d; W.$$("#fcDecks .chip").forEach(function (x) { x.classList.toggle("active", x === b); }); begin(); }); $("#fcDecks").appendChild(b); });

  function begin() { queue = W.shuffle(due(deck)).concat(W.shuffle(fresh(deck)).slice(0, NEW)); sessionDone = 0; sessionRight = 0; next(); }
  function next() {
    stats();
    cur = queue.shift();
    var m = $("#fcMain");
    if (!cur) {
      m.innerHTML = "<div class=\"card\" style=\"text-align:center;padding:2.5rem\"><div style=\"font-size:3rem\">🎉</div><h3>Für heute alles wiederholt" + (sessionDone ? ": " + sessionRight + " von " + sessionDone + " gewusst" : "") + "</h3><p class=\"note\">Neue Karten kommen pro Sitzung in Zehnerschritten dazu.</p><button id=\"fcMore\">Weitere neue Karten lernen</button></div>";
      $("#fcMore").addEventListener("click", begin); return;
    }
    var s = st(cur.id);
    m.innerHTML = "<div class=\"flashcard\" id=\"fc\" tabindex=\"0\" role=\"button\" aria-label=\"Karte umdrehen\"><div class=\"fc-in\"><div class=\"fc-face fc-front\"><span class=\"fc-tag\">" + esc(cur.deck) + " · " + (s.b ? "Fach " + s.b : "neu") + "</span><div class=\"fc-q\">" + cur.front + "</div><span class=\"fc-hint\">Klicken oder Leertaste zum Umdrehen</span></div>" +
      "<div class=\"fc-face fc-back\"><span class=\"fc-tag\">Antwort</span><div class=\"fc-a\">" + cur.back + "</div></div></div></div>" +
      "<div class=\"fc-actions\"><button class=\"no\" id=\"fcNo\" disabled>✗ Nicht gewusst <kbd>1</kbd></button><button class=\"ok\" id=\"fcOk\" disabled>✓ Gewusst <kbd>2</kbd></button></div><p class=\"meta\" style=\"text-align:center\">Noch " + queue.length + " Karte(n) in dieser Sitzung</p>";
    var fc = $("#fc");
    function flip() { fc.classList.toggle("flip"); $("#fcNo").disabled = $("#fcOk").disabled = !fc.classList.contains("flip"); }
    fc.addEventListener("click", flip);
    fc.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
    $("#fcNo").addEventListener("click", function () { answer(false); });
    $("#fcOk").addEventListener("click", function () { answer(true); });
    fc.focus({ preventScroll: true });
  }
  function answer(ok) {
    var s = st(cur.id), b = ok ? Math.min(5, Math.max(1, s.b) + (s.b ? 1 : 1)) : 1;
    if (ok && s.b === 0) b = 2;
    S.cards[cur.id] = { b: b, due: Date.now() + GAP[b] * DAY };
    if (!ok) queue.splice(Math.min(3, queue.length), 0, cur);
    sessionDone++; if (ok) sessionRight++;
    W.save(); W.progress(); next();
  }
  document.addEventListener("keydown", function (e) {
    if (!sec.classList.contains("active") || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || "")) return;
    var fc = $("#fc"); if (!fc) return;
    if ((e.key === " ") && document.activeElement !== fc) { e.preventDefault(); fc.click(); }
    if (fc.classList.contains("flip") && e.key === "1") answer(false);
    if (fc.classList.contains("flip") && e.key === "2") answer(true);
  });
  function stats() {
    var cnt = [0, 0, 0, 0, 0, 0]; DECK.forEach(function (c) { cnt[st(c.id).b]++; });
    $("#fcStats").innerHTML = "<h3>Dein Kartenstand</h3><p><b>" + learned() + "</b> von " + DECK.length + " Karten sicher (ab Fach 3)</p>" +
      "<div class=\"boxes\">" + [1, 2, 3, 4, 5].map(function (i) { return "<div class=\"box\"><b>" + cnt[i] + "</b><small>Fach " + i + "</small></div>"; }).join("") + "</div>" +
      "<p class=\"meta\">Neu: " + cnt[0] + " · heute fällig: " + due("Alle").length + "</p><p class=\"meta\">Abstände: Fach 1 sofort · 2 → 1 Tag · 3 → 3 Tage · 4 → 7 Tage · 5 → 16 Tage</p>" +
      "<button class=\"ghost small\" id=\"fcReset\">Kartenstand zurücksetzen</button>";
    $("#fcReset").addEventListener("click", function () { if (confirm("Alle Lernkarten auf „neu“ zurücksetzen?")) { S.cards = {}; W.S.cards = S.cards; W.save(); W.progress(); begin(); } });
  }
  begin();
  document.addEventListener("ww:show", function (e) { if (e.detail === "karten" && !cur) begin(); });
})();
