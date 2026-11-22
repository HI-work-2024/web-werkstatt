/* Geführte Abschlussprojekte: Jede Etappe baut auf dem Stand der vorigen auf (carry: true). */
(function () {
  function P(o) { C.lessons.push(o); }
  function J(a) { return a.join("\n"); }

  /* ======================= PORTFOLIO ======================= */
  var pfHTML1 = J([
    '<header class="kopf">',
    '  <a class="logo" href="#">Lea Muster</a>',
    '  <nav id="hauptnav" aria-label="Hauptnavigation">',
    '    <a href="#ueber">Über mich</a>',
    '    <a href="#projekte">Projekte</a>',
    '    <a href="#kontakt">Kontakt</a>',
    '  </nav>',
    '</header>',
    '<main>',
    '  <section id="ueber">',
    '    <h1>Hallo, ich bin Lea, Webentwicklerin</h1>',
    '    <p>Ich baue schnelle, barrierefreie Websites für kleine Unternehmen.</p>',
    '  </section>',
    '  <section id="projekte">',
    '    <h2>Projekte</h2>',
    '    <div class="projekte"></div>',
    '  </section>',
    '  <section id="kontakt">',
    '    <h2>Kontakt</h2>',
    '  </section>',
    '</main>',
    '<footer>',
    '  <p>© 2026 Lea Muster · <a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></p>',
    '</footer>']);
  var pfCSS2 = J([
    ':root { --farbe: #6d3df5; --text: #1b2132; --bg: #fbfaff; --abstand: 1.5rem; --radius: 12px; }',
    '* { box-sizing: border-box; }',
    'body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); background: var(--bg); line-height: 1.6; }',
    '.kopf { display: flex; justify-content: space-between; align-items: center; padding: 1rem var(--abstand); }',
    '.logo { font-weight: 700; color: var(--farbe); text-decoration: none; }',
    '#hauptnav { display: flex; gap: 1rem; }',
    'main, footer { max-width: 960px; margin-inline: auto; padding: 0 var(--abstand); }',
    'section { padding: 2rem 0; }',
    'a { color: var(--farbe); }']);
  function karte(seed, titel, text, alt) { return '      <article class="projekt"><img src="https://picsum.photos/seed/' + seed + '/400/250" alt="' + alt + '" width="400" height="250"><h3>' + titel + '</h3><p>' + text + '</p><a href="#">Projekt ansehen</a></article>'; }
  var pfHTML3 = pfHTML1.replace('    <div class="projekte"></div>', J([
    '    <div class="projekte">',
    karte("baeckerei", "Bäckerei Sonne", "Firmenwebsite mit Online-Vorbestellung.", "Screenshot der Website einer Bäckerei"),
    karte("praxis", "Physio Nord", "Barrierefreie Praxisseite mit Terminbuchung.", "Screenshot einer Physiotherapie-Website"),
    karte("shop", "Kaffee-Shop", "Kleiner Online-Shop mit 20 Produkten.", "Screenshot eines Online-Shops für Kaffee"),
    '    </div>']));
  var pfCSS3 = pfCSS2 + "\n" + J([
    '.projekte { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--abstand); }',
    '.projekt { background: #fff; border-radius: var(--radius); overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.08); }',
    '.projekt img { width: 100%; height: auto; display: block; }',
    '.projekt h3, .projekt p, .projekt a { margin: .5rem 1rem; }',
    '.projekt a { display: inline-block; margin-bottom: 1rem; }']);
  var pfHTML4 = pfHTML3.replace('  <nav id="hauptnav"', '  <button class="menu-toggle" aria-expanded="false" aria-controls="hauptnav">Menü</button>\n  <nav id="hauptnav"');
  var pfCSS4 = pfCSS3 + "\n" + J([
    '.menu-toggle { display: none; }',
    '@media (max-width: 600px) {',
    '  .kopf { flex-wrap: wrap; }',
    '  .menu-toggle { display: block; }',
    '  #hauptnav { display: none; width: 100%; }',
    '  #hauptnav.offen { display: flex; flex-direction: column; }',
    '}']);
  var pfJS4 = J([
    'const toggle = document.querySelector(".menu-toggle");',
    'const nav = document.querySelector("#hauptnav");',
    'toggle.addEventListener("click", () => {',
    '  const offen = toggle.getAttribute("aria-expanded") === "true";',
    '  toggle.setAttribute("aria-expanded", String(!offen));',
    '  nav.classList.toggle("offen", !offen);',
    '});']);
  var pfHTML5 = pfHTML4.replace('    <h2>Kontakt</h2>\n  </section>', J([
    '    <h2>Kontakt</h2>',
    '    <form id="kontakt-form" novalidate>',
    '      <label for="k-name">Name</label>',
    '      <input id="k-name" name="name" required autocomplete="name">',
    '      <label for="k-email">E-Mail</label>',
    '      <input id="k-email" name="email" type="email" required autocomplete="email">',
    '      <label for="k-nachricht">Nachricht</label>',
    '      <textarea id="k-nachricht" name="nachricht" rows="4" required></textarea>',
    '      <button type="submit">Senden</button>',
    '    </form>',
    '    <p id="formstatus" role="status"></p>',
    '  </section>']));
  var pfCSS5 = pfCSS4 + "\n" + J([
    '#kontakt-form { display: grid; gap: .5rem; max-width: 480px; }',
    '#kontakt-form input, #kontakt-form textarea { padding: .6rem; border: 1px solid #ccc; border-radius: 8px; font: inherit; }',
    '[aria-invalid="true"] { border-color: #b00020 !important; }',
    '#kontakt-form button { background: var(--farbe); color: #fff; border: 0; padding: .7rem; border-radius: 8px; }']);
  var pfJS5 = pfJS4 + "\n\n" + J([
    'const form = document.querySelector("#kontakt-form");',
    'const formStatus = document.querySelector("#formstatus");',
    'form.addEventListener("submit", (e) => {',
    '  e.preventDefault();',
    '  let ersterFehler = null;',
    '  form.querySelectorAll("input, textarea").forEach((feld) => {',
    '    const ok = feld.checkValidity() && feld.value.trim() !== "";',
    '    feld.setAttribute("aria-invalid", String(!ok));',
    '    if (!ok && !ersterFehler) ersterFehler = feld;',
    '  });',
    '  if (ersterFehler) {',
    '    formStatus.textContent = "Bitte alle Felder korrekt ausfüllen.";',
    '    ersterFehler.focus();',
    '    return;',
    '  }',
    '  formStatus.textContent = "Danke, " + document.querySelector("#k-name").value.trim() + "! Ich melde mich bald.";',
    '  form.reset();',
    '});']);

  var PF = "Projekt: Portfolio";
  P({ id: "pf1", sec: PF, t: "1 · Grundgerüst", carry: false,
    theory: "<p><b>Projektziel:</b> Dein eigenes Portfolio, die wichtigste Visitenkarte für Jobs und Aufträge. In 5 Etappen entsteht eine vollständige One-Page-Website: semantisch, responsiv, barrierefrei, mit funktionierendem Kontaktformular. Jede Etappe startet mit deinem Stand der vorigen.</p><p>Etappe 1: die Struktur. Profis planen zuerst den Inhalt und die Gliederung, dann das Design.</p>",
    task: "Baue: <code>header.kopf</code> mit Logo-Link und <code>nav#hauptnav</code> (3 Links auf <code>#ueber</code>, <code>#projekte</code>, <code>#kontakt</code>), ein <code>main</code> mit den drei <code>section</code>s (passende ids; in <code>#ueber</code> die einzige <code>h1</code>; in <code>#projekte</code> ein leeres <code>div.projekte</code>), und einen <code>footer</code> mit Links „Impressum“ und „Datenschutz“.",
    start: { html: "<!-- Etappe 1: Grundgerüst deines Portfolios -->\n", css: "", js: "" },
    sol: { html: pfHTML1, css: "", js: "" },
    hints: ["Gliederung: header (Logo + nav) → main (3 sections) → footer", "Die h1 gehört in <code>#ueber</code>, die anderen Abschnitte bekommen h2."],
    checks: [
      ["Navigation mit 3 Ankern auf vorhandene Abschnitte", function (d) { var a = $all(d, "header nav#hauptnav a[href^='#']"); return a.length === 3 && a.every(function (x) { var t = d.getElementById(x.getAttribute("href").slice(1)); return t && t.tagName === "SECTION" && t.closest("main"); }); }],
      ["Genau eine h1, im Abschnitt #ueber", function (d) { return $all(d, "h1").length === 1 && !!$q(d, "#ueber h1"); }],
      ["#projekte enthält div.projekte", function (d) { return !!$q(d, "#projekte .projekte"); }],
      ["Footer mit Impressum und Datenschutz", function (d) { var t = $all(d, "footer a").map(txt).join(" "); return /impressum/i.test(t) && /datenschutz/i.test(t); }]
    ] });
  P({ id: "pf2", sec: PF, t: "2 · Design-System", carry: true,
    theory: "<p>Ein <b>Design-System</b> legt Farben, Abstände, Radien und Schriften zentral fest. Mit CSS-Variablen änderst du später das ganze Erscheinungsbild an einer Stelle. Dazu kommen eine lesbare Inhaltsbreite und eine Kopfzeile mit Flexbox.</p>",
    task: "Lege in <code>:root</code> mindestens <code>--farbe</code>, <code>--text</code>, <code>--bg</code> und <code>--abstand</code> an. <code>body</code> nutzt <code>var(--text)</code> und <code>var(--bg)</code>, Zeilenhöhe ≥ 1.5. <code>.kopf</code>: Flex, Logo links, Navigation rechts, vertikal zentriert. <code>main</code> höchstens 1100px breit und zentriert.",
    sol: { html: pfHTML1, css: pfCSS2, js: "" },
    hints: ["<code>main { max-width: 960px; margin-inline: auto; }</code>"],
    checks: [
      ["Variablen --farbe, --text, --bg, --abstand", function (d, w) { var s = cs(w, d.documentElement); return ["--farbe", "--text", "--bg", "--abstand"].every(function (v) { return s.getPropertyValue(v).trim() !== ""; }); }],
      ["body nutzt var(--text) und var(--bg)", function (d, w, s) { return /body\s*\{[^}]*var\(\s*--text\s*\)/.test(s.css) && /body\s*\{[^}]*var\(\s*--bg\s*\)/.test(s.css); }],
      ["Zeilenhöhe ≥ 1.5", function (d, w) { var s = cs(w, d.body); return parseFloat(s.lineHeight) / parseFloat(s.fontSize) >= 1.49; }],
      [".kopf: Flex, space-between, zentriert", function (d, w) { var s = cs(w, $q(d, ".kopf")); return s.display === "flex" && s.justifyContent === "space-between" && s.alignItems === "center"; }],
      ["main begrenzt und zentriert", function (d, w) { var s = cs(w, $q(d, "main")); return parseFloat(s.maxWidth) <= 1100 && /margin-inline\s*:\s*auto|margin\s*:\s*[^;]*auto/.test(arguments[2].css); }]
    ] });
  P({ id: "pf3", sec: PF, t: "3 · Projekt-Karten", carry: true,
    theory: "<p>Deine Projekte sind das Herzstück. Jede Karte: Bild (mit <b>width/height</b> gegen Layout-Sprünge und aussagekräftigem alt-Text), Titel, kurzer Nutzen-Satz, Link. Das Raster passt sich mit <code>auto-fit</code> + <code>minmax</code> ohne Media Query an jede Breite an.</p>",
    task: "Fülle <code>.projekte</code> mit mindestens 3 <code>article.projekt</code> (je <code>img</code> mit alt, width und height, <code>h3</code>, <code>p</code>, Link). <code>.projekte</code> ist ein Grid mit <code>repeat(auto-fit, minmax(…))</code>. Bilder füllen die Kartenbreite (<code>width: 100%</code>, <code>height: auto</code>).",
    sol: { html: pfHTML3, css: pfCSS3, js: "" },
    hints: ["<code>grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));</code>"],
    checks: [
      ["≥ 3 Projektkarten mit h3 und Link", function (d) { var a = $all(d, ".projekte article.projekt"); return a.length >= 3 && a.every(function (x) { return $q(x, "h3") && $q(x, "a"); }); }],
      ["Bilder mit alt, width und height", function (d) { var i = $all(d, ".projekt img"); return i.length >= 3 && i.every(function (x) { return (x.getAttribute("alt") || "").length >= 5 && x.getAttribute("width") && x.getAttribute("height"); }); }],
      ["Grid mit auto-fit/minmax", function (d, w, s) { return cs(w, $q(d, ".projekte")).display === "grid" && /auto-(fit|fill)\s*,\s*minmax/.test(s.css); }],
      ["Bilder füllen die Karte", function (d) { var i = $q(d, ".projekt img"), k = i.closest(".projekt"); return Math.abs(i.getBoundingClientRect().width - k.clientWidth) < 2; }]
    ] });
  P({ id: "pf4", sec: PF, t: "4 · Mobile Navigation", carry: true,
    theory: "<p>Auf dem Handy wird die Navigation hinter einem Menü-Button versteckt. Barrierefrei heißt: echter <code>button</code>, <code>aria-expanded</code> zeigt den Zustand, <code>aria-controls</code> verweist auf die Navigation.</p>",
    task: "Füge im Header einen <code>button.menu-toggle</code> mit <code>aria-expanded=\"false\"</code> und <code>aria-controls=\"hauptnav\"</code> ein. Klick schaltet <code>aria-expanded</code> um und die Klasse <code>offen</code> an <code>#hauptnav</code>. Per Media Query (max-width) ist der Button nur auf schmalen Bildschirmen sichtbar und die Navigation dort nur mit <code>.offen</code>.",
    sol: { html: pfHTML4, css: pfCSS4, js: pfJS4 },
    hints: ["<code>toggle.setAttribute(\"aria-expanded\", String(!offen))</code>"],
    checks: [
      ["Button mit aria-controls und aria-expanded=false", function (d) { var b = $q(d, "button.menu-toggle"); return !!b && b.getAttribute("aria-controls") === "hauptnav" && b.getAttribute("aria-expanded") === "false"; }],
      ["Klick öffnet (aria-expanded=true, .offen)", function (d) { var b = $q(d, ".menu-toggle"); b.click(); return b.getAttribute("aria-expanded") === "true" && $q(d, "#hauptnav").classList.contains("offen"); }],
      ["Zweiter Klick schließt", function (d) { var b = $q(d, ".menu-toggle"); b.click(); return b.getAttribute("aria-expanded") === "false" && !$q(d, "#hauptnav").classList.contains("offen"); }],
      ["Media Query für #hauptnav/.menu-toggle", function (d) { return Array.prototype.some.call(d.styleSheets, function (sh) { return Array.prototype.some.call(sh.cssRules, function (r) { return r.type === 4 && /max-width/.test(r.conditionText || r.media.mediaText) && /hauptnav/.test(r.cssText) && /menu-toggle/.test(r.cssText); }); }); }]
    ] });
  P({ id: "pf5", sec: PF, t: "5 · Kontaktformular", carry: true,
    theory: "<p>Letzte Etappe: ein Kontaktformular mit eigener, zugänglicher Validierung. (Für den echten Versand brauchst du später einen Dienst oder ein eigenes Backend. Im Formular dann Datenschutzhinweis nicht vergessen!)</p>",
    task: "Füge in <code>#kontakt</code> ein <code>form#kontakt-form</code> mit <code>novalidate</code> ein: Name, E-Mail (type email), Nachricht (textarea), alle Pflicht und mit Label. Beim Absenden: ungültige Felder bekommen <code>aria-invalid=\"true\"</code>, <code>#formstatus</code> (role status) zeigt einen Hinweis, Fokus aufs erste fehlerhafte Feld. Ist alles gültig: „Danke, NAME! …“ anzeigen und Formular zurücksetzen.",
    sol: { html: pfHTML5, css: pfCSS5, js: pfJS5 },
    hints: ["<code>feld.checkValidity()</code> nutzt die HTML-Regeln (required, type=email) auch mit novalidate."],
    checks: [
      ["3 Felder mit Labels, alle required", function (d) { var f = $all(d, "#kontakt-form input, #kontakt-form textarea"); return f.length === 3 && f.every(function (x) { return x.required && x.id && $q(d, "label[for='" + x.id + "']"); }); }],
      ["Leeres Absenden → aria-invalid, Hinweis, Fokus", function (d) { $q(d, "#kontakt-form").requestSubmit(); var f = $all(d, "#kontakt-form input, #kontakt-form textarea"); return f.every(function (x) { return x.getAttribute("aria-invalid") === "true"; }) && txt($q(d, "#formstatus")).length > 5 && d.activeElement === f[0]; }],
      ["Gültig → Danke-Meldung mit Name", function (d) { $q(d, "#k-name").value = "Lea"; $q(d, "#k-email").value = "lea@example.de"; $q(d, "#k-nachricht").value = "Hallo!"; $q(d, "#kontakt-form").requestSubmit(); return /Danke, Lea!/.test(txt($q(d, "#formstatus"))); }],
      ["Formular danach zurückgesetzt", function (d) { return $q(d, "#k-name").value === "" && $q(d, "#k-nachricht").value === ""; }]
    ] });

  /* ======================= TO-DO-APP ======================= */
  var tdHTML = J([
    '<h1>Meine Aufgaben</h1>',
    '<form id="neu">',
    '  <label for="text">Neue Aufgabe</label>',
    '  <input id="text" autocomplete="off">',
    '  <button>Hinzufügen</button>',
    '</form>',
    '<div class="filter" role="group" aria-label="Filter">',
    '  <button data-filter="alle" aria-pressed="true">Alle</button>',
    '  <button data-filter="offen" aria-pressed="false">Offen</button>',
    '  <button data-filter="erledigt" aria-pressed="false">Erledigt</button>',
    '</div>',
    '<ul id="liste"></ul>',
    '<p id="zaehler" role="status"></p>']);
  var tdCSS = J([
    'body { max-width: 480px; }',
    '#neu { display: flex; gap: .5rem; align-items: center; }',
    '#liste { list-style: none; padding: 0; }',
    '#liste li { display: flex; align-items: center; gap: .5rem; padding: .4rem; border-bottom: 1px solid #eee; }',
    '#liste li.erledigt span { text-decoration: line-through; color: #888; }',
    '#liste li button { margin-left: auto; }',
    '.filter [aria-pressed="true"] { background: #6d3df5; color: #fff; }']);
  function tdJS(n) {
    var c = [];
    if (n >= 5) c.push(J([
      'const STANDARD = [',
      '  { id: 1, text: "Projekt planen", erledigt: true },',
      '  { id: 2, text: "HTML schreiben", erledigt: false }',
      '];',
      'let todos = JSON.parse(localStorage.getItem("todos") ?? "null") ?? STANDARD;',
      'function speichern() { localStorage.setItem("todos", JSON.stringify(todos)); }']));
    else c.push(J([
      'let todos = [',
      '  { id: 1, text: "Projekt planen", erledigt: true },',
      '  { id: 2, text: "HTML schreiben", erledigt: false }',
      '];']));
    if (n >= 6) c.push('let filter = "alle";');
    c.push(J([
      'const liste = document.querySelector("#liste");',
      '',
      'function render() {',
      '  liste.innerHTML = "";',
      n >= 6 ? '  const sichtbar = todos.filter((t) => filter === "alle" || (filter === "offen" ? !t.erledigt : t.erledigt));' : '  const sichtbar = todos;',
      '  sichtbar.forEach((t) => {',
      '    const li = document.createElement("li");',
      '    li.dataset.id = t.id;',
      '    li.classList.toggle("erledigt", t.erledigt);',
      '    const box = document.createElement("input");',
      '    box.type = "checkbox";',
      '    box.checked = t.erledigt;',
      '    box.setAttribute("aria-label", "Erledigt: " + t.text);',
      '    const span = document.createElement("span");',
      '    span.textContent = t.text;',
      '    const del = document.createElement("button");',
      '    del.textContent = "✕";',
      '    del.dataset.aktion = "loeschen";',
      '    del.setAttribute("aria-label", "Löschen: " + t.text);',
      '    li.append(box, span, del);',
      '    liste.append(li);',
      '  });',
      '  const offen = todos.filter((t) => !t.erledigt).length;',
      '  document.querySelector("#zaehler").textContent = offen + " offen";',
      n >= 5 ? '  speichern();' : '',
      '}']).replace(/\n\n}/, "\n}"));
    if (n >= 3) c.push(J([
      'function neueId() { return todos.reduce((m, t) => Math.max(m, t.id), 0) + 1; }',
      'document.querySelector("#neu").addEventListener("submit", (e) => {',
      '  e.preventDefault();',
      '  const feld = document.querySelector("#text");',
      '  const text = feld.value.trim();',
      '  if (!text) return;',
      '  todos.push({ id: neueId(), text: text, erledigt: false });',
      '  feld.value = "";',
      '  feld.focus();',
      '  render();',
      '});']));
    if (n >= 4) c.push(J([
      'liste.addEventListener("change", (e) => {',
      '  if (!e.target.matches(\'input[type="checkbox"]\')) return;',
      '  const id = Number(e.target.closest("li").dataset.id);',
      '  const t = todos.find((x) => x.id === id);',
      '  t.erledigt = e.target.checked;',
      '  render();',
      '});',
      'liste.addEventListener("click", (e) => {',
      '  const btn = e.target.closest(\'[data-aktion="loeschen"]\');',
      '  if (!btn) return;',
      '  const id = Number(btn.closest("li").dataset.id);',
      '  todos = todos.filter((x) => x.id !== id);',
      '  render();',
      '});']));
    if (n >= 6) c.push(J([
      'document.querySelector(".filter").addEventListener("click", (e) => {',
      '  const b = e.target.closest("[data-filter]");',
      '  if (!b) return;',
      '  filter = b.dataset.filter;',
      '  document.querySelectorAll("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));',
      '  render();',
      '});']));
    c.push("render();");
    return c.join("\n\n");
  }
  function addTodo(d, text) { $q(d, "#text").value = text; $q(d, "#neu").requestSubmit(); }
  function items(d) { return $all(d, "#liste li"); }
  function freshTodos(w, reload) { w.localStorage.removeItem("todos"); return reload(); }

  var TD = "Projekt: To-do-App";
  P({ id: "td1", sec: TD, t: "1 · Oberfläche", carry: false,
    theory: "<p><b>Projektziel:</b> Eine vollständige To-do-App, wie sie in Bewerbungsgesprächen gern verlangt wird: Hinzufügen, Erledigen, Löschen, Filtern, dauerhaft Speichern, mit sauberem <b>Zustand</b> (state) und einer <b>render</b>-Funktion. Das ist genau das Prinzip hinter React, Vue & Co.</p><p>Etappe 1: das HTML-Gerüst.</p>",
    task: "Baue: <code>h1</code>; <code>form#neu</code> mit Label + <code>input#text</code> + Button; ein <code>div.filter</code> (role group, aria-label) mit drei Buttons <code>data-filter=\"alle|offen|erledigt\"</code> und <code>aria-pressed</code> („alle“ = true); eine leere <code>ul#liste</code>; einen Zähler <code>p#zaehler</code> mit <code>role=\"status\"</code>.",
    start: { html: "<!-- Etappe 1: Oberfläche der To-do-App -->\n", css: "", js: "" },
    sol: { html: tdHTML, css: tdCSS, js: "" },
    hints: ["Filter-Buttons: <code>&lt;button data-filter=\"offen\" aria-pressed=\"false\"&gt;Offen&lt;/button&gt;</code>"],
    checks: [
      ["Formular mit Label für #text", function (d) { return !!$q(d, "form#neu input#text") && !!$q(d, "label[for=text]"); }],
      ["3 Filter-Buttons mit data-filter und aria-pressed", function (d) { var b = $all(d, ".filter button[data-filter]"); return b.length === 3 && b.every(function (x) { return x.hasAttribute("aria-pressed"); }) && $q(d, "[data-filter=alle]").getAttribute("aria-pressed") === "true"; }],
      ["Filtergruppe beschriftet", function (d) { var f = $q(d, ".filter"); return f.getAttribute("role") === "group" && !!f.getAttribute("aria-label"); }],
      ["ul#liste und p#zaehler (role=status)", function (d) { return !!$q(d, "ul#liste") && $q(d, "#zaehler") && $q(d, "#zaehler").getAttribute("role") === "status"; }]
    ] });
  P({ id: "td2", sec: TD, t: "2 · Zustand & render()", carry: true,
    theory: "<p>Profi-Muster: Die Daten (<b>Zustand</b>) liegen in einem Array. Eine Funktion <code>render()</code> zeichnet die Oberfläche <i>komplett</i> aus diesem Zustand. Jede Änderung = Zustand ändern + <code>render()</code>. So können Daten und Anzeige nie auseinanderlaufen.</p>",
    task: "Lege <code>let todos</code> mit zwei Aufgaben an („Projekt planen“ erledigt, „HTML schreiben“ offen; jeweils <code>id</code>, <code>text</code>, <code>erledigt</code>). <code>render()</code> erzeugt pro Aufgabe ein <code>li</code> mit <code>data-id</code>, Checkbox (Zustand + aria-label), <code>span</code> mit dem Text (per textContent!) und Lösch-Button <code>data-aktion=\"loeschen\"</code> mit aria-label. Erledigte <code>li</code> bekommen die Klasse <code>erledigt</code>. <code>#zaehler</code>: „1 offen“.",
    sol: { html: tdHTML, css: tdCSS, js: tdJS(2) },
    hints: ["<code>li.classList.toggle(\"erledigt\", t.erledigt)</code>", "<code>li.append(box, span, del)</code>"],
    checks: [
      ["2 Einträge mit data-id", function (d) { var l = items(d); return l.length === 2 && l.every(function (x) { return x.dataset.id; }); }],
      ["Erster ist erledigt (Klasse + Checkbox)", function (d) { var l = items(d)[0]; return l.classList.contains("erledigt") && $q(l, "input[type=checkbox]").checked && txt($q(l, "span")) === "Projekt planen"; }],
      ["Lösch-Buttons mit aria-label", function (d) { return $all(d, "#liste [data-aktion=loeschen]").every(function (b) { return /löschen/i.test(b.getAttribute("aria-label") || ""); }) && $all(d, "#liste [data-aktion=loeschen]").length === 2; }],
      ["Zähler „1 offen“", function (d) { return txt($q(d, "#zaehler")) === "1 offen"; }],
      ["Text sicher per textContent (kein innerHTML mit t.text)", function (d, w, s) { return !/innerHTML\s*[+]?=\s*[^;]*\.text/.test(s.js); }]
    ] });
  P({ id: "td3", sec: TD, t: "3 · Hinzufügen", carry: true,
    theory: "<p>Neue Aufgaben: Formular absenden → Eingabe säubern (<code>trim</code>) → leere ignorieren → zum Zustand hinzufügen → <code>render()</code>. Danach Feld leeren und Fokus zurück, damit man direkt weitertippen kann. Eindeutige IDs: höchste vorhandene ID + 1.</p>",
    task: "Beim Absenden von <code>#neu</code>: Aufgabe mit neuer eindeutiger ID hinzufügen (nicht bei leerer Eingabe oder nur Leerzeichen), Feld leeren, Fokus ins Feld, neu rendern.",
    sol: { html: tdHTML, css: tdCSS, js: tdJS(3) },
    hints: ["<code>todos.reduce((m, t) =&gt; Math.max(m, t.id), 0) + 1</code>"],
    checks: [
      ["„  Einkaufen “ wird als „Einkaufen“ hinzugefügt", function (d) { addTodo(d, "  Einkaufen "); var l = items(d); return l.length === 3 && txt($q(l[2], "span")) === "Einkaufen"; }],
      ["Feld geleert und fokussiert", function (d) { return $q(d, "#text").value === "" && d.activeElement === $q(d, "#text"); }],
      ["Leere Eingabe wird ignoriert", function (d) { addTodo(d, "   "); return items(d).length === 3; }],
      ["Zähler „2 offen“, IDs eindeutig", function (d) { var ids = items(d).map(function (x) { return x.dataset.id; }); return txt($q(d, "#zaehler")) === "2 offen" && new Set(ids).size === ids.length; }]
    ] });
  P({ id: "td4", sec: TD, t: "4 · Erledigen & Löschen", carry: true,
    theory: "<p>Zwei Listener per <b>Event-Delegation</b> an der Liste: <code>change</code> für Checkboxen, <code>click</code> für Lösch-Buttons. Über <code>closest(\"li\").dataset.id</code> findest du die Aufgabe im Zustand. Löschen = neues Array ohne diese Aufgabe (<code>filter</code>).</p>",
    task: "Checkbox umschalten setzt <code>erledigt</code> im Zustand und rendert neu. „✕“ entfernt die Aufgabe. Beides per Delegation an <code>#liste</code>.",
    sol: { html: tdHTML, css: tdCSS, js: tdJS(4) },
    hints: ["<code>liste.addEventListener(\"change\", (e) =&gt; { … })</code>"],
    checks: [
      ["Abhaken von „HTML schreiben“ → erledigt, „0 offen“", function (d) { $q(items(d)[1], "input[type=checkbox]").click(); var l = items(d)[1]; return l.classList.contains("erledigt") && txt($q(d, "#zaehler")) === "0 offen"; }],
      ["Wieder abhaken → offen", function (d) { $q(items(d)[1], "input[type=checkbox]").click(); return !items(d)[1].classList.contains("erledigt") && txt($q(d, "#zaehler")) === "1 offen"; }],
      ["Löschen entfernt die Aufgabe", function (d) { $q(items(d)[0], "[data-aktion=loeschen]").click(); return items(d).length === 1 && txt($q(items(d)[0], "span")) === "HTML schreiben"; }],
      ["Neue Aufgabe lässt sich auch erledigen", function (d) { addTodo(d, "Neu"); var l = items(d); $q(l[l.length - 1], "input[type=checkbox]").click(); l = items(d); return l[l.length - 1].classList.contains("erledigt"); }],
      ["Delegation (keine Listener-Schleife)", function (d, w, s) { return !/forEach[\s\S]{0,200}addEventListener/.test(s.js.replace(/sichtbar\.forEach[\s\S]*?\}\);/, "")); }]
    ] });
  P({ id: "td5", sec: TD, t: "5 · Dauerhaft speichern", carry: true,
    theory: "<p>Damit Aufgaben einen Neustart überleben: Zustand nach jeder Änderung in <code>localStorage</code> schreiben (am einfachsten am Ende von <code>render()</code>) und beim Start laden. Fallback: Standardaufgaben, wenn noch nichts gespeichert ist. Der Operator <code>??</code> nimmt den rechten Wert nur bei <code>null</code>/<code>undefined</code>.</p>",
    task: "Lade <code>todos</code> beim Start aus <code>localStorage</code> (Schlüssel <code>todos</code>, JSON) mit den zwei Standardaufgaben als Fallback, und speichere nach jeder Änderung.",
    sol: { html: tdHTML, css: tdCSS, js: tdJS(5) },
    hints: ["<code>let todos = JSON.parse(localStorage.getItem(\"todos\") ?? \"null\") ?? STANDARD;</code>"],
    checks: [
      ["Ohne Speicher: 2 Standardaufgaben", function (d, w, s, l, reload) { return freshTodos(w, reload).then(function (c) { return items(c.d).length === 2; }); }],
      ["Neue Aufgabe übersteht Neuladen", function (d, w, s, l, reload, ctx) { addTodo(ctx.d, "Persistenz testen"); return reload().then(function (c) { return items(c.d).some(function (x) { return txt($q(x, "span")) === "Persistenz testen"; }); }); }],
      ["Erledigt-Status übersteht Neuladen", function (d, w, s, l, reload, ctx) { $q(items(ctx.d)[1], "input[type=checkbox]").click(); return reload().then(function (c) { return items(c.d)[1].classList.contains("erledigt"); }); }]
    ] });
  P({ id: "td6", sec: TD, t: "6 · Filter", carry: true,
    theory: "<p>Der Filter ist <b>Anzeige-Zustand</b>, keine Daten: Er bestimmt, <i>welche</i> Aufgaben <code>render()</code> zeichnet, verändert aber das Array nicht. Der Zähler zeigt weiterhin alle offenen Aufgaben. <code>aria-pressed</code> verrät Screenreadern, welcher Filter aktiv ist.</p>",
    task: "Klick auf einen Filter-Button setzt den Filter („alle“, „offen“, „erledigt“), aktualisiert <code>aria-pressed</code> (nur der aktive true) und rendert. Die Liste zeigt nur passende Aufgaben; der Zähler bleibt „N offen“ über alle Aufgaben.",
    sol: { html: tdHTML, css: tdCSS, js: tdJS(6) },
    hints: ["In render(): <code>todos.filter((t) =&gt; filter === \"alle\" || …)</code>"],
    checks: [
      ["Start mit Standardaufgaben", function (d, w, s, l, reload) { return freshTodos(w, reload).then(function (c) { return items(c.d).length === 2; }); }],
      ["Filter „offen“ → nur „HTML schreiben“", function (d, w, s, l, r, ctx) { $q(ctx.d, "[data-filter=offen]").click(); var it = items(ctx.d); return it.length === 1 && txt($q(it[0], "span")) === "HTML schreiben"; }],
      ["aria-pressed folgt dem Filter", function (d, w, s, l, r, ctx) { return $q(ctx.d, "[data-filter=offen]").getAttribute("aria-pressed") === "true" && $q(ctx.d, "[data-filter=alle]").getAttribute("aria-pressed") === "false"; }],
      ["Filter „erledigt“ → nur „Projekt planen“, Zähler unverändert", function (d, w, s, l, r, ctx) { $q(ctx.d, "[data-filter=erledigt]").click(); var it = items(ctx.d); return it.length === 1 && txt($q(it[0], "span")) === "Projekt planen" && txt($q(ctx.d, "#zaehler")) === "1 offen"; }],
      ["„alle“ zeigt wieder alles", function (d, w, s, l, r, ctx) { $q(ctx.d, "[data-filter=alle]").click(); return items(ctx.d).length === 2; }]
    ] });

  /* ======================= MINI-SHOP ======================= */
  function shHTML(n) {
    return J([
      '<header class="shopkopf">',
      '  <h1>Mini-Shop</h1>',
      '  <span aria-live="polite">🛒 <span id="anzahl">0</span> Artikel</span>',
      '</header>',
      '<main class="shop">',
      '  <section aria-labelledby="h-produkte">',
      '    <h2 id="h-produkte">Produkte</h2>',
      '    <div id="produkte" class="raster"></div>',
      '  </section>',
      '  <aside aria-labelledby="h-korb">',
      '    <h2 id="h-korb">Warenkorb</h2>',
      '    <ul id="warenkorb"></ul>'].concat(n >= 3 ? [
      '    <p>Zwischensumme: <span id="summe">0,00 €</span></p>',
      '    <p>Versand: <span id="versand">kostenlos</span></p>',
      '    <p><strong>Gesamt: <span id="gesamt">0,00 €</span></strong></p>'] : []).concat(n >= 5 ? [
      '    <form id="checkout" novalidate>',
      '      <h3>Bestellen</h3>',
      '      <label for="c-name">Name</label>',
      '      <input id="c-name" required autocomplete="name">',
      '      <label for="c-email">E-Mail</label>',
      '      <input id="c-email" type="email" required autocomplete="email">',
      '      <button>Zahlungspflichtig bestellen</button>',
      '    </form>',
      '    <p id="bestaetigung" role="status"></p>'] : []).concat([
      '  </aside>',
      '</main>']));
  }
  var shCSS = J([
    '.shopkopf { display: flex; justify-content: space-between; align-items: center; }',
    '.shop { display: grid; grid-template-columns: 1fr 240px; gap: 1.5rem; }',
    '.raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }',
    '.produkt { border: 1px solid #ddd; border-radius: 10px; padding: .6rem; }',
    '.produkt img { width: 100%; height: auto; border-radius: 6px; }',
    '.preis { font-weight: 700; }',
    '#warenkorb { padding-left: 1rem; }',
    '#checkout { display: grid; gap: .3rem; }',
    '@media (max-width: 600px) { .shop { grid-template-columns: 1fr; } }']);
  function shJS(n) {
    var c = [J([
      'const produkte = [',
      '  { id: 1, name: "Notizbuch", preis: 12.9, bild: "https://picsum.photos/seed/notiz/300/200" },',
      '  { id: 2, name: "Kaffeebecher", preis: 9.5, bild: "https://picsum.photos/seed/becher/300/200" },',
      '  { id: 3, name: "Rucksack", preis: 49, bild: "https://picsum.photos/seed/rucksack/300/200" },',
      '  { id: 4, name: "Sticker-Set", preis: 4.2, bild: "https://picsum.photos/seed/sticker/300/200" }',
      '];',
      'const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });',
      '',
      'function zeigeProdukte() {',
      '  const ziel = document.querySelector("#produkte");',
      '  produkte.forEach((p) => {',
      '    const art = document.createElement("article");',
      '    art.className = "produkt";',
      '    art.innerHTML = \'<img alt="" width="300" height="200"><h3></h3><p class="preis"></p><button type="button">In den Warenkorb</button>\';',
      '    art.querySelector("img").src = p.bild;',
      '    art.querySelector("img").alt = p.name;',
      '    art.querySelector("h3").textContent = p.name;',
      '    art.querySelector(".preis").textContent = euro.format(p.preis);',
      '    art.querySelector("button").dataset.id = p.id;',
      '    ziel.append(art);',
      '  });',
      '}',
      'zeigeProdukte();'])];
    if (n >= 2) {
      c.push(n >= 4 ? J(['let korb = JSON.parse(localStorage.getItem("warenkorb") ?? "{}");', 'function produkt(id) { return produkte.find((x) => x.id === Number(id)); }'])
                   : J(['let korb = {}; // Produkt-ID → Menge', 'function produkt(id) { return produkte.find((x) => x.id === Number(id)); }']));
      c.push('function anzahlGesamt() { return Object.values(korb).reduce((s, m) => s + m, 0); }');
      if (n >= 3) c.push(J([
        'function summen() {',
        '  const zwischen = Object.entries(korb).reduce((s, [id, m]) => s + produkt(id).preis * m, 0);',
        '  const versand = zwischen === 0 || zwischen >= 50 ? 0 : 4.9;',
        '  document.querySelector("#summe").textContent = euro.format(zwischen);',
        '  document.querySelector("#versand").textContent = versand ? euro.format(versand) : "kostenlos";',
        '  document.querySelector("#gesamt").textContent = euro.format(zwischen + versand);',
        '}']));
      c.push(J([
        'function zeigeKorb() {',
        '  const ul = document.querySelector("#warenkorb");',
        '  ul.innerHTML = "";',
        '  for (const [id, menge] of Object.entries(korb)) {',
        '    const li = document.createElement("li");',
        '    li.dataset.id = id;',
        n >= 3 ? '    li.innerHTML = \'<span></span> <button type="button" data-aktion="minus">−</button> <button type="button" data-aktion="plus">+</button>\';' : '',
        n >= 3 ? '    li.querySelector("span").textContent = produkt(id).name + " × " + menge;' : '    li.textContent = produkt(id).name + " × " + menge;',
        n >= 3 ? '    li.querySelector("[data-aktion=minus]").setAttribute("aria-label", produkt(id).name + " entfernen");' : '',
        n >= 3 ? '    li.querySelector("[data-aktion=plus]").setAttribute("aria-label", produkt(id).name + " hinzufügen");' : '',
        '    ul.append(li);',
        '  }',
        '  document.querySelector("#anzahl").textContent = anzahlGesamt();',
        n >= 3 ? '  summen();' : '',
        n >= 4 ? '  localStorage.setItem("warenkorb", JSON.stringify(korb));' : '',
        '}']).replace(/\n(?=\n)/g, "").replace(/\n\s*\n/g, "\n"));
      c.push(J([
        'document.querySelector("#produkte").addEventListener("click", (e) => {',
        '  const b = e.target.closest("button[data-id]");',
        '  if (!b) return;',
        '  korb[b.dataset.id] = (korb[b.dataset.id] || 0) + 1;',
        '  zeigeKorb();',
        '});']));
      if (n >= 3) c.push(J([
        'document.querySelector("#warenkorb").addEventListener("click", (e) => {',
        '  const b = e.target.closest("button[data-aktion]");',
        '  if (!b) return;',
        '  const id = b.closest("li").dataset.id;',
        '  korb[id] += b.dataset.aktion === "plus" ? 1 : -1;',
        '  if (korb[id] <= 0) delete korb[id];',
        '  zeigeKorb();',
        '});']));
      if (n >= 5) c.push(J([
        'document.querySelector("#checkout").addEventListener("submit", (e) => {',
        '  e.preventDefault();',
        '  const meldung = document.querySelector("#bestaetigung");',
        '  const name = document.querySelector("#c-name");',
        '  const email = document.querySelector("#c-email");',
        '  if (anzahlGesamt() === 0) { meldung.textContent = "Dein Warenkorb ist leer."; return; }',
        '  if (!name.value.trim() || !email.value || !email.checkValidity()) { meldung.textContent = "Bitte Name und gültige E-Mail angeben."; return; }',
        '  meldung.textContent = "Danke, " + name.value.trim() + "! Deine Bestellung über " + document.querySelector("#gesamt").textContent + " ist eingegangen.";',
        '  korb = {};',
        '  zeigeKorb();',
        '  e.target.reset();',
        '});']));
      c.push("zeigeKorb();");
    }
    return c.join("\n\n");
  }
  function addP(d, id) { $q(d, "#produkte button[data-id='" + id + "']").click(); }
  function korbLi(d) { return $all(d, "#warenkorb li"); }
  function freshKorb(w, reload) { w.localStorage.removeItem("warenkorb"); return reload(); }

  var SH = "Projekt: Mini-Shop";
  P({ id: "sh1", sec: SH, t: "1 · Produkte aus Daten", carry: false,
    theory: "<p><b>Projektziel:</b> Ein kleiner Shop mit Produktkatalog, Warenkorb, Versandkostenlogik, Speichern und Bestellformular. Er folgt dem deutschen „Button-Lösung“-Prinzip (§ 312j BGB). Produkte kommen später aus einer API oder einem CMS, daher werden sie schon jetzt <b>aus Daten</b> erzeugt statt im HTML festgeschrieben.</p>",
    task: "Gegeben ist das Seitengerüst (HTML/CSS). Schreibe das JavaScript: Für jedes Produkt im Array <code>produkte</code> ein <code>article.produkt</code> in <code>#produkte</code> mit Bild (alt = Name), <code>h3</code>, Preis im deutschen Format (<code>p.preis</code>, Intl) und Button „In den Warenkorb“ mit <code>data-id</code>.",
    start: { html: shHTML(1), css: shCSS, js: "const produkte = [\n  { id: 1, name: \"Notizbuch\", preis: 12.9, bild: \"https://picsum.photos/seed/notiz/300/200\" },\n  { id: 2, name: \"Kaffeebecher\", preis: 9.5, bild: \"https://picsum.photos/seed/becher/300/200\" },\n  { id: 3, name: \"Rucksack\", preis: 49, bild: \"https://picsum.photos/seed/rucksack/300/200\" },\n  { id: 4, name: \"Sticker-Set\", preis: 4.2, bild: \"https://picsum.photos/seed/sticker/300/200\" }\n];\n\n// Dein Code\n" },
    sol: { html: shHTML(1), css: shCSS, js: shJS(1) },
    hints: ["<code>const euro = new Intl.NumberFormat(\"de-DE\", { style: \"currency\", currency: \"EUR\" });</code>"],
    checks: [
      ["4 Produktkarten", function (d) { return $all(d, "#produkte article.produkt").length === 4; }],
      ["Namen in h3, Bilder mit alt", function (d) { var a = $all(d, "#produkte article"); return a.length === 4 && txt($q(a[0], "h3")) === "Notizbuch" && $q(a[2], "img").alt === "Rucksack"; }],
      ["Preise im deutschen Format", function (d) { return /^12,90\s€$/.test(txt($q(d, "#produkte .preis"))) && /^4,20\s€$/.test(txt($all(d, "#produkte .preis")[3])); }],
      ["Buttons mit data-id", function (d) { return $all(d, "#produkte button[data-id]").length === 4; }]
    ] });
  P({ id: "sh2", sec: SH, t: "2 · Warenkorb", carry: true,
    theory: "<p>Der Warenkorb ist ein Objekt <code>{ produktId: menge }</code>. Ein Klick-Listener (Delegation) an <code>#produkte</code> erhöht die Menge; <code>zeigeKorb()</code> zeichnet die Liste und die Artikelanzahl im Kopf (in einer <code>aria-live</code>-Region, damit Screenreader die Änderung ansagen).</p>",
    task: "Klick auf „In den Warenkorb“ erhöht die Menge des Produkts. <code>#warenkorb</code> zeigt pro Produkt ein <code>li</code> mit <code>data-id</code> und Text „Name × Menge“. <code>#anzahl</code> zeigt die Gesamtzahl der Artikel.",
    sol: { html: shHTML(2), css: shCSS, js: shJS(2) },
    hints: ["<code>korb[id] = (korb[id] || 0) + 1;</code>", "<code>Object.entries(korb)</code> liefert [id, menge]-Paare."],
    checks: [
      ["2× Notizbuch, 1× Rucksack → 3 Artikel", function (d) { addP(d, 1); addP(d, 1); addP(d, 3); return txt($q(d, "#anzahl")) === "3"; }],
      ["Warenkorb zeigt 2 Positionen", function (d) { var l = korbLi(d); return l.length === 2 && /Notizbuch × 2/.test(txt(l[0])) && /Rucksack × 1/.test(txt(l[1])); }],
      ["Positionen mit data-id", function (d) { return korbLi(d).every(function (x) { return x.dataset.id; }); }]
    ] });
  P({ id: "sh3", sec: SH, t: "3 · Mengen, Summe & Versand", carry: true,
    theory: "<p>Geschäftslogik: Zwischensumme, Versandkosten (4,90 €, ab 50 € kostenlos) und Gesamtsumme. Plus/Minus-Buttons in jeder Position; bei Menge 0 verschwindet sie. Geld immer mit <code>Intl.NumberFormat</code> anzeigen.</p>",
    task: "Ergänze das HTML um <code>#summe</code>, <code>#versand</code>, <code>#gesamt</code>. Jede Warenkorb-Position bekommt Buttons <code>data-aktion=\"minus\"</code>/<code>\"plus\"</code> (mit aria-label). Versand: 4,90 € unter 50 € Zwischensumme, sonst „kostenlos“ (leerer Korb: kostenlos).",
    sol: { html: shHTML(3), css: shCSS, js: shJS(3) },
    hints: ["<code>const versand = zwischen === 0 || zwischen &gt;= 50 ? 0 : 4.9;</code>"],
    checks: [
      ["1× Notizbuch → 12,90 + 4,90 = 17,80 €", function (d) { addP(d, 1); return /12,90/.test(txt($q(d, "#summe"))) && /4,90/.test(txt($q(d, "#versand"))) && /17,80/.test(txt($q(d, "#gesamt"))); }],
      ["+ Rucksack (61,90 €) → Versand kostenlos", function (d) { addP(d, 3); return /kostenlos/i.test(txt($q(d, "#versand"))) && /61,90/.test(txt($q(d, "#gesamt"))); }],
      ["Plus erhöht, Minus bis 0 entfernt", function (d) { var r = korbLi(d)[1]; $q(r, "[data-aktion=plus]").click(); var ok = /Rucksack × 2/.test(txt(korbLi(d)[1])); var r2 = korbLi(d)[1]; $q(r2, "[data-aktion=minus]").click(); $q(korbLi(d)[1], "[data-aktion=minus]").click(); return ok && korbLi(d).length === 1 && txt($q(d, "#anzahl")) === "1"; }],
      ["Buttons beschriftet (aria-label)", function (d) { return $all(d, "#warenkorb [data-aktion]").every(function (b) { return (b.getAttribute("aria-label") || "").length > 3; }); }]
    ] });
  P({ id: "sh4", sec: SH, t: "4 · Warenkorb merken", carry: true,
    theory: "<p>Ein Warenkorb, der beim Neuladen verschwindet, kostet Umsatz. Speichere den Korb nach jeder Änderung (z. B. am Ende von <code>zeigeKorb()</code>) und lade ihn beim Start. Echte Shops speichern zusätzlich auf dem Server, damit er geräteübergreifend erhalten bleibt.</p>",
    task: "Lade <code>korb</code> beim Start aus <code>localStorage</code> (Schlüssel <code>warenkorb</code>, Fallback <code>{}</code>) und speichere ihn nach jeder Änderung.",
    sol: { html: shHTML(4), css: shCSS, js: shJS(4) },
    hints: ["<code>let korb = JSON.parse(localStorage.getItem(\"warenkorb\") ?? \"{}\");</code>"],
    checks: [
      ["Leerer Speicher → leerer Korb", function (d, w, s, l, reload) { return freshKorb(w, reload).then(function (c) { return txt($q(c.d, "#anzahl")) === "0" && korbLi(c.d).length === 0; }); }],
      ["Korb übersteht Neuladen", function (d, w, s, l, reload, ctx) { addP(ctx.d, 2); addP(ctx.d, 2); addP(ctx.d, 4); return reload().then(function (c) { return txt($q(c.d, "#anzahl")) === "3" && /Kaffeebecher × 2/.test(txt(korbLi(c.d)[0])); }); }],
      ["Summen nach Neuladen korrekt", function (d, w, s, l, r, ctx) { return /23,20/.test(txt($q(ctx.d, "#summe"))); }]
    ] });
  P({ id: "sh5", sec: SH, t: "5 · Bestellung abschließen", carry: true,
    theory: "<p>Letzte Etappe: das Bestellformular. In Deutschland muss der Bestellbutton eindeutig auf die Zahlungspflicht hinweisen, z. B. „Zahlungspflichtig bestellen“ (§ 312j BGB). Sonst kommt kein wirksamer Vertrag zustande. Validierung, verständliche Meldungen in einer Live-Region, danach Korb leeren. (Echte Zahlungen laufen über einen Zahlungsdienst wie Stripe, nie selbst gebaut.)</p>",
    task: "Ergänze <code>form#checkout</code> (novalidate) mit Name, E-Mail und dem Button „Zahlungspflichtig bestellen“ sowie <code>p#bestaetigung</code> (role status). Beim Absenden: leerer Korb → „Dein Warenkorb ist leer.“; fehlende/ungültige Angaben → Hinweis „Bitte …“; sonst „Danke, NAME! Deine Bestellung über GESAMT ist eingegangen.“, Korb leeren, Formular zurücksetzen.",
    sol: { html: shHTML(5), css: shCSS, js: shJS(5) },
    hints: ["Gesamtbetrag einfach aus <code>#gesamt</code> lesen.", "Nach Erfolg: <code>korb = {}; zeigeKorb();</code>"],
    checks: [
      ["Button-Lösung: „Zahlungspflichtig bestellen“", function (d) { var b = $q(d, "#checkout button"); return !!b && /zahlungspflichtig bestellen/i.test(txt(b)); }],
      ["Leerer Korb wird gemeldet", function (d, w, s, l, reload) { return freshKorb(w, reload).then(function (c) { $q(c.d, "#checkout").requestSubmit(); return /leer/i.test(txt($q(c.d, "#bestaetigung"))); }); }],
      ["Fehlende Angaben werden gemeldet", function (d, w, s, l, r, ctx) { addP(ctx.d, 1); $q(ctx.d, "#c-name").value = ""; $q(ctx.d, "#checkout").requestSubmit(); return /^Bitte/.test(txt($q(ctx.d, "#bestaetigung"))); }],
      ["Erfolgreiche Bestellung mit Name und Betrag", function (d, w, s, l, r, ctx) { $q(ctx.d, "#c-name").value = "Lea"; $q(ctx.d, "#c-email").value = "lea@example.de"; $q(ctx.d, "#checkout").requestSubmit(); return /Danke, Lea!.*17,80/.test(txt($q(ctx.d, "#bestaetigung"))); }],
      ["Korb danach leer, Formular zurückgesetzt", function (d, w, s, l, r, ctx) { return txt($q(ctx.d, "#anzahl")) === "0" && $q(ctx.d, "#c-name").value === ""; }]
    ] });
})();
