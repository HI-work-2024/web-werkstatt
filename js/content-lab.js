/* Code-Labor: Lektionen mit automatischen Prüfungen.
   Prüffunktion: function (doc, win, src, logs) -> true/false oder Promise.
   src = {html, css, js} (dein Quelltext), logs = Ausgaben von console.log */
function $q(doc, s) { return doc.querySelector(s); }
function $all(doc, s) { return Array.prototype.slice.call(doc.querySelectorAll(s)); }
function txt(el) { return el ? el.textContent.trim() : ""; }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

C.lessons = [
/* ---------------- HTML ---------------- */
{ id: "h1", sec: "HTML", t: "Deine erste Seite",
  theory: "<p>HTML beschreibt die <b>Struktur</b> einer Seite mit <b>Tags</b>: <code>&lt;h1&gt;</code> ist die Hauptüberschrift, <code>&lt;p&gt;</code> ein Absatz. Fast jedes Tag hat ein öffnendes und ein schließendes Gegenstück.</p><pre>&lt;h1&gt;Überschrift&lt;/h1&gt;\n&lt;p&gt;Ein Absatz mit &lt;strong&gt;wichtigem&lt;/strong&gt; Text.&lt;/p&gt;</pre>",
  task: "Schreibe eine Hauptüberschrift mit deinem Namen und zwei Absätze über dich. Hebe in einem Absatz ein Wort mit <code>&lt;strong&gt;</code> hervor.",
  start: { html: "<!-- Schreibe hier dein HTML -->\n", css: "", js: "" },
  sol: { html: "<h1>Hallo, ich bin Lea</h1>\n<p>Ich lerne gerade <strong>Webentwicklung</strong>.</p>\n<p>Mein Ziel: eigene Webseiten bauen.</p>", css: "", js: "" },
  hints: ["Eine Überschrift: <code>&lt;h1&gt;Hallo, ich bin …&lt;/h1&gt;</code>", "Zwei Absätze = zweimal <code>&lt;p&gt;…&lt;/p&gt;</code>"],
  checks: [
    ["Es gibt eine h1-Überschrift mit Text", function (d) { return txt($q(d, "h1")).length > 2; }],
    ["Es gibt mindestens zwei Absätze", function (d) { return $all(d, "p").filter(function (p) { return txt(p); }).length >= 2; }],
    ["Ein Wort ist mit strong hervorgehoben", function (d) { return !!$q(d, "p strong"); }]
  ] },
{ id: "h2", sec: "HTML", t: "Links & Bilder",
  theory: "<p>Links (<code>&lt;a&gt;</code>) verbinden Seiten, Attribute stehen im öffnenden Tag. Bilder (<code>&lt;img&gt;</code>) haben kein schließendes Tag. Das <code>alt</code>-Attribut beschreibt das Bild für Screenreader und falls es nicht lädt. Es ist <b>Pflicht</b> für barrierefreie Seiten.</p><pre>&lt;a href=\"https://example.com\"&gt;Zur Seite&lt;/a&gt;\n&lt;img src=\"foto.jpg\" alt=\"Team beim Workshop\" width=\"300\"&gt;</pre>",
  task: "Füge einen Link zu <code>https://developer.mozilla.org</code> mit dem Text „MDN“ ein, der sich in einem neuen Tab öffnet (<code>target=\"_blank\"</code>). Füge außerdem ein Bild von <code>https://picsum.photos/300/200</code> mit sinnvollem alt-Text ein.",
  start: { html: "<h1>Meine Lieblingsseiten</h1>\n", css: "", js: "" },
  sol: { html: "<h1>Meine Lieblingsseiten</h1>\n<p><a href=\"https://developer.mozilla.org\" target=\"_blank\" rel=\"noopener\">MDN</a></p>\n<img src=\"https://picsum.photos/300/200\" alt=\"Zufälliges Landschaftsfoto\">", css: "", js: "" },
  hints: ["<code>&lt;a href=\"https://developer.mozilla.org\" target=\"_blank\"&gt;MDN&lt;/a&gt;</code>", "<code>&lt;img src=\"…\" alt=\"Beschreibung\"&gt;</code>"],
  checks: [
    ["Link zu developer.mozilla.org mit Text „MDN“", function (d) { var a = $q(d, "a[href*='developer.mozilla.org']"); return !!a && /mdn/i.test(txt(a)); }],
    ["Der Link öffnet sich in neuem Tab", function (d) { var a = $q(d, "a[href*='developer.mozilla.org']"); return !!a && a.getAttribute("target") === "_blank"; }],
    ["Bild von picsum.photos vorhanden", function (d) { return !!$q(d, "img[src*='picsum.photos']"); }],
    ["Bild hat einen aussagekräftigen alt-Text (≥ 5 Zeichen)", function (d) { var i = $q(d, "img"); return !!i && (i.getAttribute("alt") || "").trim().length >= 5; }]
  ] },
{ id: "h3", sec: "HTML", t: "Listen",
  theory: "<p><code>&lt;ul&gt;</code> ist eine Aufzählung (Punkte), <code>&lt;ol&gt;</code> eine nummerierte Liste. Jeder Eintrag steckt in <code>&lt;li&gt;</code>. Listen dürfen verschachtelt werden. Navigationen sind technisch übrigens auch Listen.</p><pre>&lt;ol&gt;\n  &lt;li&gt;Erster Schritt&lt;/li&gt;\n  &lt;li&gt;Zweiter Schritt&lt;/li&gt;\n&lt;/ol&gt;</pre>",
  task: "Erstelle eine Einkaufsliste als <code>ul</code> mit mindestens 3 Einträgen und darunter ein Rezept als nummerierte Liste (<code>ol</code>) mit mindestens 3 Schritten.",
  start: { html: "<h2>Einkauf</h2>\n\n<h2>Zubereitung</h2>\n", css: "", js: "" },
  sol: { html: "<h2>Einkauf</h2>\n<ul>\n  <li>Mehl</li>\n  <li>Eier</li>\n  <li>Milch</li>\n</ul>\n<h2>Zubereitung</h2>\n<ol>\n  <li>Alles verrühren</li>\n  <li>Pfanne erhitzen</li>\n  <li>Ausbacken</li>\n</ol>", css: "", js: "" },
  hints: ["<code>&lt;ul&gt;&lt;li&gt;Mehl&lt;/li&gt;…&lt;/ul&gt;</code>"],
  checks: [
    ["ul mit mindestens 3 Einträgen", function (d) { return $all(d, "ul > li").length >= 3; }],
    ["ol mit mindestens 3 Schritten", function (d) { return $all(d, "ol > li").length >= 3; }]
  ] },
{ id: "h4", sec: "HTML", t: "Semantische Struktur",
  theory: "<p>Semantische Elemente sagen, <b>welche Rolle</b> ein Bereich hat. Das hilft Screenreadern, Suchmaschinen und dir selbst beim Lesen.</p><pre>&lt;header&gt; Kopf mit Logo &lt;/header&gt;\n&lt;nav&gt; Hauptnavigation &lt;/nav&gt;\n&lt;main&gt; einzigartiger Hauptinhalt (nur 1×) &lt;/main&gt;\n&lt;article&gt; eigenständiger Beitrag &lt;/article&gt;\n&lt;footer&gt; Fuß mit Impressum-Link &lt;/footer&gt;</pre><p>Faustregel: Pro Seite genau <b>eine</b> <code>h1</code>.</p>",
  task: "Baue das Grundgerüst einer Firmenseite: <code>header</code> (mit der einzigen <code>h1</code>), darin ein <code>nav</code> mit 3 Links, ein <code>main</code> mit einem <code>article</code> (mit <code>h2</code>), und ein <code>footer</code> mit einem Link „Impressum“.",
  start: { html: "<div>\n  <!-- Ersetze die divs durch semantische Elemente -->\n</div>\n", css: "", js: "" },
  sol: { html: "<header>\n  <h1>Bäckerei Sonne</h1>\n  <nav>\n    <a href=\"#\">Start</a> <a href=\"#angebot\">Angebot</a> <a href=\"#kontakt\">Kontakt</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>Frisch seit 1985</h2>\n    <p>Jeden Morgen frisches Brot.</p>\n  </article>\n</main>\n<footer><a href=\"impressum.html\">Impressum</a></footer>", css: "", js: "" },
  hints: ["Reihenfolge: header → main → footer", "nav gehört in den header und enthält die Links"],
  checks: [
    ["header enthält die h1", function (d) { return !!$q(d, "header h1"); }],
    ["Genau eine h1 auf der Seite", function (d) { return $all(d, "h1").length === 1; }],
    ["nav mit mindestens 3 Links", function (d) { return $all(d, "nav a").length >= 3; }],
    ["main mit article und h2", function (d) { return !!$q(d, "main article h2"); }],
    ["footer mit Link „Impressum“", function (d) { return $all(d, "footer a").some(function (a) { return /impressum/i.test(txt(a)); }); }]
  ] },
{ id: "h5", sec: "HTML", t: "Formulare",
  theory: "<p>Formulare sammeln Eingaben. Jedes Feld braucht ein <code>&lt;label&gt;</code>, verbunden über <code>for</code> = <code>id</code>. Der Browser prüft schon selbst mit <code>type=\"email\"</code> und <code>required</code>.</p><pre>&lt;form&gt;\n  &lt;label for=\"mail\"&gt;E-Mail&lt;/label&gt;\n  &lt;input id=\"mail\" name=\"mail\" type=\"email\" required&gt;\n  &lt;button type=\"submit\"&gt;Senden&lt;/button&gt;\n&lt;/form&gt;</pre>",
  task: "Baue ein Kontaktformular: Feld <b>Name</b> (Text, Pflicht), <b>E-Mail</b> (type email, Pflicht), <b>Nachricht</b> (<code>textarea</code>) und einen Absenden-Button. Jedes Feld mit verknüpftem Label.",
  start: { html: "<h2>Kontakt</h2>\n<form>\n\n</form>\n", css: "", js: "" },
  sol: { html: "<h2>Kontakt</h2>\n<form>\n  <label for=\"name\">Name</label>\n  <input id=\"name\" name=\"name\" required>\n  <label for=\"mail\">E-Mail</label>\n  <input id=\"mail\" name=\"mail\" type=\"email\" required>\n  <label for=\"msg\">Nachricht</label>\n  <textarea id=\"msg\" name=\"msg\"></textarea>\n  <button type=\"submit\">Senden</button>\n</form>", css: "form{display:grid;gap:.4rem;max-width:320px}", js: "" },
  hints: ["Label und Feld verbinden: <code>for=\"mail\"</code> und <code>id=\"mail\"</code>", "Pflichtfeld: Attribut <code>required</code>"],
  checks: [
    ["E-Mail-Feld mit type=email und required", function (d) { return !!$q(d, "form input[type=email][required]"); }],
    ["Ein weiteres Pflicht-Textfeld (Name)", function (d) { return $all(d, "form input[required]").filter(function (i) { return (i.type || "text") === "text"; }).length >= 1; }],
    ["Eine textarea für die Nachricht", function (d) { return !!$q(d, "form textarea"); }],
    ["Jedes Feld hat ein verknüpftes label", function (d) { var f = $all(d, "form input, form textarea"); return f.length >= 3 && f.every(function (x) { return x.id && $q(d, "label[for='" + x.id + "']"); }); }],
    ["Absenden-Button vorhanden", function (d) { return !!$q(d, "form button:not([type=button]), form input[type=submit]"); }]
  ] },
{ id: "h6", sec: "HTML", t: "Tabellen",
  theory: "<p>Tabellen nur für <b>tabellarische Daten</b> (Preise, Stundenpläne), nicht fürs Layout. <code>&lt;thead&gt;</code> mit <code>&lt;th&gt;</code> für Spaltenköpfe, <code>&lt;tbody&gt;</code> mit Zeilen <code>&lt;tr&gt;</code> und Zellen <code>&lt;td&gt;</code>.</p>",
  task: "Erstelle eine Preistabelle mit Spaltenköpfen „Paket“ und „Preis“ (in <code>thead</code>) und mindestens 3 Zeilen im <code>tbody</code>.",
  start: { html: "<h2>Preise</h2>\n", css: "table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .6rem}", js: "" },
  sol: { html: "<h2>Preise</h2>\n<table>\n  <thead><tr><th>Paket</th><th>Preis</th></tr></thead>\n  <tbody>\n    <tr><td>Start</td><td>490 €</td></tr>\n    <tr><td>Business</td><td>1.490 €</td></tr>\n    <tr><td>Shop</td><td>3.900 €</td></tr>\n  </tbody>\n</table>", css: "table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .6rem}", js: "" },
  hints: ["<code>&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Paket&lt;/th&gt;&lt;th&gt;Preis&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;</code>"],
  checks: [
    ["thead mit Spaltenköpfen Paket und Preis", function (d) { var t = $all(d, "thead th").map(txt).join(" "); return /paket/i.test(t) && /preis/i.test(t); }],
    ["tbody mit mindestens 3 Zeilen", function (d) { return $all(d, "tbody tr").length >= 3; }]
  ] },
/* ---------------- CSS ---------------- */
{ id: "c1", sec: "CSS", t: "Farben & Schrift",
  theory: "<p>CSS-Regeln bestehen aus <b>Selektor</b> und <b>Deklarationen</b>. Farben als Name, Hex (<code>#6d3df5</code>) oder <code>rgb()</code>. Schriftgrößen am besten in <code>rem</code> (relativ zur Grundgröße, meist 16px).</p><pre>h1 {\n  color: #6d3df5;\n  font-family: Georgia, serif;\n}\np { font-size: 1.2rem; line-height: 1.6; }</pre>",
  task: "Gestalte die Seite: Die h1 bekommt eine Farbe (nicht schwarz), die Absätze eine Schriftgröße von mindestens 18px (z. B. <code>1.2rem</code>), und der <code>body</code> eine Hintergrundfarbe.",
  start: { html: "<h1>Willkommen</h1>\n<p>Schön, dass du da bist.</p>\n<p>Hier lernst du CSS.</p>", css: "/* Dein CSS */\n", js: "" },
  sol: { html: "<h1>Willkommen</h1>\n<p>Schön, dass du da bist.</p>\n<p>Hier lernst du CSS.</p>", css: "body { background: #f6f3ff; font-family: system-ui, sans-serif; }\nh1 { color: #6d3df5; }\np { font-size: 1.2rem; line-height: 1.6; }", js: "" },
  hints: ["<code>h1 { color: tomato; }</code>", "<code>body { background: #f6f3ff; }</code>"],
  checks: [
    ["h1 ist farbig (nicht schwarz)", function (d, w) { var c = w.getComputedStyle($q(d, "h1")).color; return c !== "rgb(0, 0, 0)"; }],
    ["Absätze ≥ 18px", function (d, w) { return parseFloat(w.getComputedStyle($q(d, "p")).fontSize) >= 18; }],
    ["body hat eine Hintergrundfarbe", function (d, w) { var b = w.getComputedStyle(d.body).backgroundColor; return b !== "rgba(0, 0, 0, 0)" && b !== "transparent"; }]
  ] },
{ id: "c2", sec: "CSS", t: "Das Box-Modell",
  theory: "<p>Jedes Element ist eine Box: <b>content</b> → <b>padding</b> (Innenabstand) → <b>border</b> (Rahmen) → <b>margin</b> (Außenabstand). Mit <code>box-sizing: border-box</code> zählen padding und border zur angegebenen Breite. Das ist Profi-Standard.</p><pre>* { box-sizing: border-box; }\n.box { padding: 20px; border: 2px solid; margin: 30px; }</pre><p>Tipp: In den DevTools (F12) zeigt der Tab „Berechnet“ das Box-Modell grafisch.</p>",
  task: "Gib <code>.karte</code> 20px Innenabstand, einen 2px durchgezogenen Rahmen, 30px Außenabstand, abgerundete Ecken (<code>border-radius</code>) und eine Breite von 250px mit <code>box-sizing: border-box</code>.",
  start: { html: "<div class=\"karte\">\n  <h3>Starter-Paket</h3>\n  <p>Alles für den Einstieg.</p>\n</div>", css: ".karte {\n  \n}", js: "" },
  sol: { html: "<div class=\"karte\">\n  <h3>Starter-Paket</h3>\n  <p>Alles für den Einstieg.</p>\n</div>", css: ".karte {\n  box-sizing: border-box;\n  width: 250px;\n  padding: 20px;\n  border: 2px solid #6d3df5;\n  border-radius: 12px;\n  margin: 30px;\n}", js: "" },
  hints: ["<code>border: 2px solid #333;</code>", "Mit border-box ist die Box genau 250px breit (offsetWidth)."],
  checks: [
    ["padding 20px", function (d, w) { return w.getComputedStyle($q(d, ".karte")).paddingTop === "20px"; }],
    ["2px durchgezogener Rahmen", function (d, w) { var s = w.getComputedStyle($q(d, ".karte")); return s.borderTopWidth === "2px" && s.borderTopStyle === "solid"; }],
    ["margin 30px", function (d, w) { return w.getComputedStyle($q(d, ".karte")).marginTop === "30px"; }],
    ["Abgerundete Ecken", function (d, w) { return parseFloat(w.getComputedStyle($q(d, ".karte")).borderTopLeftRadius) > 0; }],
    ["Gesamtbreite genau 250px (border-box)", function (d) { return $q(d, ".karte").offsetWidth === 250; }]
  ] },
{ id: "c3", sec: "CSS", t: "Flexbox",
  theory: "<p>Flexbox ordnet Elemente in <b>einer Richtung</b> (Zeile oder Spalte) an. Ideal für Navigationen, Kopfzeilen, Button-Gruppen.</p><pre>.leiste {\n  display: flex;\n  justify-content: space-between; /* Hauptachse */\n  align-items: center;            /* Querachse */\n  gap: 1rem;\n}</pre><p>Spielerisch üben: <a href=\"https://flexboxfroggy.com/#de\" target=\"_blank\">Flexbox Froggy</a>.</p>",
  task: "Mach aus <code>.navbar</code> eine Flex-Leiste: Logo links, Links rechts (<code>space-between</code>), vertikal zentriert. Die Links in <code>.links</code> sollen ebenfalls nebeneinander stehen mit Abstand (<code>gap</code>).",
  start: { html: "<header class=\"navbar\">\n  <strong class=\"logo\">Logo</strong>\n  <nav class=\"links\">\n    <a href=\"#\">Start</a>\n    <a href=\"#\">Leistungen</a>\n    <a href=\"#\">Kontakt</a>\n  </nav>\n</header>", css: ".navbar { background:#1b2132; color:#fff; padding:1rem; }\n.navbar a { color:#fff; display:block; }\n", js: "" },
  sol: { html: "<header class=\"navbar\">\n  <strong class=\"logo\">Logo</strong>\n  <nav class=\"links\">\n    <a href=\"#\">Start</a>\n    <a href=\"#\">Leistungen</a>\n    <a href=\"#\">Kontakt</a>\n  </nav>\n</header>", css: ".navbar { background:#1b2132; color:#fff; padding:1rem; display:flex; justify-content:space-between; align-items:center; }\n.navbar a { color:#fff; display:block; }\n.links { display:flex; gap:1rem; }", js: "" },
  hints: ["<code>.navbar { display:flex; justify-content:space-between; align-items:center; }</code>", "<code>.links { display:flex; gap:1rem; }</code>"],
  checks: [
    [".navbar ist ein Flex-Container mit space-between", function (d, w) { var s = w.getComputedStyle($q(d, ".navbar")); return s.display === "flex" && s.justifyContent === "space-between"; }],
    ["Vertikal zentriert", function (d, w) { return w.getComputedStyle($q(d, ".navbar")).alignItems === "center"; }],
    ["Links stehen nebeneinander", function (d) { var a = $all(d, ".links a"); return a.length === 3 && a[0].getBoundingClientRect().top === a[2].getBoundingClientRect().top; }],
    ["Abstand zwischen den Links (gap)", function (d, w) { return parseFloat(w.getComputedStyle($q(d, ".links")).columnGap) > 0; }]
  ] },
{ id: "c4", sec: "CSS", t: "Grid-Layout",
  theory: "<p>Grid ordnet in <b>zwei Dimensionen</b> (Zeilen und Spalten). <code>fr</code> ist ein Anteil des freien Platzes.</p><pre>.galerie {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n/* automatisch so viele Spalten wie passen: */\ngrid-template-columns: repeat(auto-fill, minmax(200px, 1fr));</pre>",
  task: "Ordne die 6 Karten in <code>.raster</code> als Grid mit genau <b>3 gleich breiten Spalten</b> und Abstand an. Die erste Karte (<code>.gross</code>) soll sich über <b>2 Spalten</b> erstrecken.",
  start: { html: "<div class=\"raster\">\n  <div class=\"k gross\">1</div><div class=\"k\">2</div><div class=\"k\">3</div>\n  <div class=\"k\">4</div><div class=\"k\">5</div><div class=\"k\">6</div>\n</div>", css: ".k { background:#efe9ff; padding:1rem; border-radius:8px; text-align:center; }\n", js: "" },
  sol: { html: "<div class=\"raster\">\n  <div class=\"k gross\">1</div><div class=\"k\">2</div><div class=\"k\">3</div>\n  <div class=\"k\">4</div><div class=\"k\">5</div><div class=\"k\">6</div>\n</div>", css: ".k { background:#efe9ff; padding:1rem; border-radius:8px; text-align:center; }\n.raster { display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; }\n.gross { grid-column: span 2; }", js: "" },
  hints: ["<code>grid-template-columns: repeat(3, 1fr);</code>", "<code>.gross { grid-column: span 2; }</code>"],
  checks: [
    [".raster ist ein Grid", function (d, w) { return w.getComputedStyle($q(d, ".raster")).display === "grid"; }],
    ["Genau 3 gleich breite Spalten", function (d, w) { var c = w.getComputedStyle($q(d, ".raster")).gridTemplateColumns.split(" "); return c.length === 3 && Math.abs(parseFloat(c[0]) - parseFloat(c[2])) < 1; }],
    ["Abstand zwischen den Zellen", function (d, w) { return parseFloat(w.getComputedStyle($q(d, ".raster")).rowGap) > 0; }],
    [".gross erstreckt sich über 2 Spalten", function (d) { var g = $q(d, ".gross"), k = $all(d, ".k")[1]; return g.offsetWidth > k.offsetWidth * 1.8; }]
  ] },
{ id: "c5", sec: "CSS", t: "Responsive Design",
  theory: "<p>Mobile First: Zuerst die Handy-Ansicht gestalten, dann mit <b>Media Queries</b> für größere Bildschirme erweitern. Bilder nie breiter als ihr Container.</p><pre>.spalten { display: grid; gap: 1rem; }      /* Handy: 1 Spalte */\n@media (min-width: 700px) {\n  .spalten { grid-template-columns: 1fr 1fr; } /* ab Tablet: 2 */\n}\nimg { max-width: 100%; height: auto; }</pre><p>In echten Seiten gehört außerdem <code>&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"&gt;</code> in den <code>&lt;head&gt;</code>.</p>",
  task: "Mach das Layout responsive: <code>.spalten</code> ist ein Grid mit <b>einer</b> Spalte und bekommt erst ab <b>min-width 600px</b> zwei Spalten (Media Query). Bilder dürfen nie breiter als 100 % sein. Tipp: Zieh das Browserfenster schmal und breit.",
  start: { html: "<div class=\"spalten\">\n  <section><h3>Links</h3><img src=\"https://picsum.photos/900/300\" alt=\"Beispielbild\"></section>\n  <section><h3>Rechts</h3><p>Text daneben.</p></section>\n</div>", css: "", js: "" },
  sol: { html: "<div class=\"spalten\">\n  <section><h3>Links</h3><img src=\"https://picsum.photos/900/300\" alt=\"Beispielbild\"></section>\n  <section><h3>Rechts</h3><p>Text daneben.</p></section>\n</div>", css: ".spalten { display:grid; gap:1rem; }\nimg { max-width:100%; height:auto; }\n@media (min-width: 600px) {\n  .spalten { grid-template-columns: 1fr 1fr; }\n}", js: "" },
  hints: ["<code>@media (min-width: 600px) { .spalten { grid-template-columns: 1fr 1fr; } }</code>", "<code>img { max-width: 100%; }</code>"],
  checks: [
    [".spalten ist ein Grid", function (d, w) { return w.getComputedStyle($q(d, ".spalten")).display === "grid"; }],
    ["Media Query mit min-width vorhanden, die .spalten ändert", function (d) {
      return Array.prototype.some.call(d.styleSheets, function (sh) { return Array.prototype.some.call(sh.cssRules, function (r) { return r.type === 4 && /min-width/.test(r.conditionText || r.media.mediaText) && /\.spalten/.test(r.cssText); }); }); }],
    ["Ohne Media Query nur eine Spalte (Mobile First)", function (d) {
      return !Array.prototype.some.call(d.styleSheets, function (sh) { return Array.prototype.some.call(sh.cssRules, function (r) { return r.type === 1 && /\.spalten/.test(r.selectorText) && /grid-template-columns/.test(r.cssText); }); }); }],
    ["Bilder max. 100 % breit", function (d, w) { return w.getComputedStyle($q(d, "img")).maxWidth === "100%"; }]
  ] },
{ id: "c6", sec: "CSS", t: "Variablen & Hover-Effekte",
  theory: "<p>CSS-Variablen (Custom Properties) speichern Werte zentral. Farbschema ändern = eine Zeile ändern. Pseudo-Klassen wie <code>:hover</code> und <code>:focus-visible</code> reagieren auf Maus und Tastatur, <code>transition</code> macht Änderungen weich.</p><pre>:root { --haupt: #6d3df5; }\n.btn { background: var(--haupt); transition: transform .2s; }\n.btn:hover { transform: scale(1.05); }</pre>",
  task: "Lege in <code>:root</code> die Variable <code>--haupt</code> an und nutze sie als Hintergrund des Buttons <code>.btn</code>. Gib dem Button eine <code>transition</code> und einen <code>:hover</code>-Effekt.",
  start: { html: "<button class=\"btn\">Jetzt anfragen</button>", css: ".btn { color:#fff; border:0; padding:.8rem 1.4rem; border-radius:8px; font-size:1rem; }\n", js: "" },
  sol: { html: "<button class=\"btn\">Jetzt anfragen</button>", css: ":root { --haupt: #6d3df5; }\n.btn { color:#fff; border:0; padding:.8rem 1.4rem; border-radius:8px; font-size:1rem; background: var(--haupt); transition: transform .2s; }\n.btn:hover { transform: scale(1.05); }", js: "" },
  hints: ["<code>:root { --haupt: #6d3df5; }</code>", "<code>.btn:hover { … }</code>"],
  checks: [
    ["Variable --haupt in :root definiert", function (d, w) { return w.getComputedStyle(d.documentElement).getPropertyValue("--haupt").trim() !== ""; }],
    ["Button nutzt var(--haupt) als Hintergrund", function (d, w, s) { return /background(-color)?\s*:\s*var\(\s*--haupt\s*\)/.test(s.css) && w.getComputedStyle($q(d, ".btn")).backgroundColor !== "rgba(0, 0, 0, 0)"; }],
    ["transition gesetzt", function (d, w) { return parseFloat(w.getComputedStyle($q(d, ".btn")).transitionDuration) > 0; }],
    [":hover-Regel für .btn vorhanden", function (d, w, s) { return /\.btn:hover\s*\{/.test(s.css); }]
  ] },
/* ---------------- JavaScript ---------------- */
{ id: "j1", sec: "JavaScript", t: "Variablen & Konsole",
  theory: "<p>Variablen speichern Werte: <code>const</code> (wird nicht neu zugewiesen) und <code>let</code> (kann sich ändern). <code>var</code> ist veraltet. Template-Strings mit Backticks setzen Werte ein. <code>console.log</code> gibt in die Konsole aus. Das ist dein wichtigstes Werkzeug zur Fehlersuche.</p><pre>const name = \"Lea\";\nlet alter = 27;\nalter = alter + 1;\nconsole.log(`Ich heiße ${name} und bin ${alter} Jahre alt`);</pre>",
  task: "Lege <code>const name</code> und <code>let alter</code> an, erhöhe das Alter um 1 und gib genau diesen Satz aus: <code>Ich heiße NAME und bin ALTER Jahre alt</code>.",
  start: { html: "<p>Schau in die Konsole unter der Vorschau.</p>", css: "", js: "// Dein JavaScript\n" },
  sol: { html: "<p>Schau in die Konsole unter der Vorschau.</p>", css: "", js: "const name = \"Lea\";\nlet alter = 27;\nalter = alter + 1;\nconsole.log(`Ich heiße ${name} und bin ${alter} Jahre alt`);" },
  hints: ["Backticks: <code>`… ${variable} …`</code>", "<code>alter = alter + 1;</code> oder <code>alter++;</code>"],
  checks: [
    ["const und let verwendet", function (d, w, s) { return /\bconst\s+name\b/.test(s.js) && /\blet\s+alter\b/.test(s.js); }],
    ["Alter wird erhöht", function (d, w, s) { return /alter\s*(\+\+|\+=\s*1|=\s*alter\s*\+\s*1)/.test(s.js); }],
    ["Richtiger Satz in der Konsole", function (d, w, s, logs) { return logs.some(function (l) { return /^Ich heiße \S.* und bin \d+ Jahre alt$/.test(l); }); }]
  ] },
{ id: "j2", sec: "JavaScript", t: "DOM verändern",
  theory: "<p>Der <b>DOM</b> ist die Seite als Objektbaum. Mit <code>document.querySelector</code> findest du Elemente über CSS-Selektoren und änderst Text, Klassen oder Stile.</p><pre>const titel = document.querySelector(\"#titel\");\ntitel.textContent = \"Neuer Text\";\ntitel.classList.add(\"aktiv\");\n\nconst li = document.createElement(\"li\");\nli.textContent = \"Neu\";\ndocument.querySelector(\"ul\").append(li);</pre>",
  task: "Ändere per JavaScript (nicht im HTML!) den Text von <code>#titel</code> in „Hallo DOM“, füge ihm die Klasse <code>aktiv</code> hinzu und hänge an die Liste <code>#liste</code> einen neuen Eintrag „Drei“ an.",
  start: { html: "<h1 id=\"titel\">Alter Titel</h1>\n<ul id=\"liste\"><li>Eins</li><li>Zwei</li></ul>", css: ".aktiv { color:#6d3df5; }", js: "// Dein JavaScript\n" },
  sol: { html: "<h1 id=\"titel\">Alter Titel</h1>\n<ul id=\"liste\"><li>Eins</li><li>Zwei</li></ul>", css: ".aktiv { color:#6d3df5; }", js: "const titel = document.querySelector(\"#titel\");\ntitel.textContent = \"Hallo DOM\";\ntitel.classList.add(\"aktiv\");\n\nconst li = document.createElement(\"li\");\nli.textContent = \"Drei\";\ndocument.querySelector(\"#liste\").append(li);" },
  hints: ["<code>document.querySelector(\"#titel\").textContent = …</code>", "<code>document.createElement(\"li\")</code> und <code>.append(…)</code>"],
  checks: [
    ["HTML unverändert („Alter Titel“ steht noch im HTML)", function (d, w, s) { return /Alter Titel/.test(s.html); }],
    ["Titel lautet „Hallo DOM“", function (d) { return txt($q(d, "#titel")) === "Hallo DOM"; }],
    ["Titel hat Klasse aktiv", function (d) { return $q(d, "#titel").classList.contains("aktiv"); }],
    ["Liste hat neuen Eintrag „Drei“", function (d) { var l = $all(d, "#liste li"); return l.length === 3 && txt(l[2]) === "Drei"; }]
  ] },
{ id: "j3", sec: "JavaScript", t: "Events: Klick-Zähler",
  theory: "<p>Mit <code>addEventListener</code> reagierst du auf Ereignisse wie <code>click</code>, <code>input</code> oder <code>submit</code>.</p><pre>let zahl = 0;\nconst knopf = document.querySelector(\"#plus\");\nknopf.addEventListener(\"click\", () =&gt; {\n  zahl++;\n  document.querySelector(\"#anzeige\").textContent = zahl;\n});</pre>",
  task: "Baue einen Zähler: <code>#plus</code> erhöht, <code>#minus</code> verringert, <code>#reset</code> setzt auf 0. Der Wert steht in <code>#anzeige</code>. Bonus: Der Wert soll nie unter 0 fallen.",
  start: { html: "<button id=\"minus\">−</button>\n<span id=\"anzeige\">0</span>\n<button id=\"plus\">+</button>\n<button id=\"reset\">Reset</button>", css: "#anzeige{display:inline-block;min-width:3ch;text-align:center;font-size:2rem}", js: "// Dein JavaScript\n" },
  sol: { html: "<button id=\"minus\">−</button>\n<span id=\"anzeige\">0</span>\n<button id=\"plus\">+</button>\n<button id=\"reset\">Reset</button>", css: "#anzeige{display:inline-block;min-width:3ch;text-align:center;font-size:2rem}", js: "let zahl = 0;\nconst anzeige = document.querySelector(\"#anzeige\");\nfunction zeigen() { anzeige.textContent = zahl; }\ndocument.querySelector(\"#plus\").addEventListener(\"click\", () => { zahl++; zeigen(); });\ndocument.querySelector(\"#minus\").addEventListener(\"click\", () => { if (zahl > 0) zahl--; zeigen(); });\ndocument.querySelector(\"#reset\").addEventListener(\"click\", () => { zahl = 0; zeigen(); });" },
  hints: ["Eine Variable <code>let zahl = 0;</code> außerhalb der Funktionen", "Nach jeder Änderung <code>#anzeige</code> aktualisieren"],
  checks: [
    ["+ zweimal geklickt → 2", function (d) { $q(d, "#reset").click(); $q(d, "#plus").click(); $q(d, "#plus").click(); return txt($q(d, "#anzeige")) === "2"; }],
    ["− einmal geklickt → 1", function (d) { $q(d, "#minus").click(); return txt($q(d, "#anzeige")) === "1"; }],
    ["Reset → 0", function (d) { $q(d, "#reset").click(); return txt($q(d, "#anzeige")) === "0"; }],
    ["Bonus: nie unter 0", function (d) { $q(d, "#reset").click(); $q(d, "#minus").click(); return txt($q(d, "#anzeige")) === "0"; }]
  ] },
{ id: "j4", sec: "JavaScript", t: "Arrays & Schleifen",
  theory: "<p>Arrays sind Listen. Moderne Methoden ersetzen viele Schleifen: <code>map</code> (umwandeln), <code>filter</code> (auswählen), <code>reduce</code> (zusammenfassen), <code>forEach</code> (für jedes).</p><pre>const preise = [5, 12, 30];\nconst teuer = preise.filter(p =&gt; p &gt; 10);       // [12, 30]\nconst summe = preise.reduce((s, p) =&gt; s + p, 0); // 47\npreise.forEach(p =&gt; console.log(p));</pre>",
  task: "Zeige alle Aufgaben aus dem Array <code>aufgaben</code> als <code>li</code> in <code>#liste</code> an. Erledigte (<code>erledigt: true</code>) bekommen die Klasse <code>done</code>. In <code>#offen</code> steht die Anzahl der offenen Aufgaben.",
  start: { html: "<h3>To-dos (<span id=\"offen\">?</span> offen)</h3>\n<ul id=\"liste\"></ul>", css: ".done{text-decoration:line-through;color:#999}", js: "const aufgaben = [\n  { text: \"HTML lernen\", erledigt: true },\n  { text: \"CSS lernen\", erledigt: true },\n  { text: \"JavaScript lernen\", erledigt: false },\n  { text: \"Portfolio bauen\", erledigt: false }\n];\n\n// Dein Code\n" },
  sol: { html: "<h3>To-dos (<span id=\"offen\">?</span> offen)</h3>\n<ul id=\"liste\"></ul>", css: ".done{text-decoration:line-through;color:#999}", js: "const aufgaben = [\n  { text: \"HTML lernen\", erledigt: true },\n  { text: \"CSS lernen\", erledigt: true },\n  { text: \"JavaScript lernen\", erledigt: false },\n  { text: \"Portfolio bauen\", erledigt: false }\n];\n\nconst liste = document.querySelector(\"#liste\");\naufgaben.forEach(a => {\n  const li = document.createElement(\"li\");\n  li.textContent = a.text;\n  if (a.erledigt) li.classList.add(\"done\");\n  liste.append(li);\n});\ndocument.querySelector(\"#offen\").textContent = aufgaben.filter(a => !a.erledigt).length;" },
  hints: ["<code>aufgaben.forEach(a =&gt; { … })</code>", "Offene zählen: <code>aufgaben.filter(a =&gt; !a.erledigt).length</code>"],
  checks: [
    ["4 Einträge in der Liste", function (d) { return $all(d, "#liste li").length === 4; }],
    ["Texte stimmen", function (d) { return txt($all(d, "#liste li")[3]) === "Portfolio bauen"; }],
    ["Genau 2 mit Klasse done", function (d) { return $all(d, "#liste li.done").length === 2; }],
    ["Anzahl offen = 2", function (d) { return txt($q(d, "#offen")) === "2"; }],
    ["Nicht von Hand ins HTML geschrieben", function (d, w, s) { return !/<li/.test(s.html); }]
  ] },
{ id: "j5", sec: "JavaScript", t: "Formulare auswerten",
  theory: "<p>Beim Absenden lädt ein Formular normalerweise die Seite neu. <code>event.preventDefault()</code> verhindert das, dann wertest du selbst aus. Eingaben liest du mit <code>.value</code>; prüfe sie immer (leer? zu lang?).</p><pre>form.addEventListener(\"submit\", (e) =&gt; {\n  e.preventDefault();\n  const name = input.value.trim();\n  if (!name) { fehler.textContent = \"Bitte Namen eingeben\"; return; }\n  …\n});</pre>",
  task: "Beim Absenden von <code>#form</code> soll in <code>#gruss</code> „Hallo, NAME!“ stehen (Name aus <code>#name</code>, ohne Leerzeichen am Rand). Ist das Feld leer, steht dort „Bitte Namen eingeben“. Die Seite darf nicht neu laden.",
  start: { html: "<form id=\"form\">\n  <label for=\"name\">Dein Name</label>\n  <input id=\"name\">\n  <button>Begrüßen</button>\n</form>\n<p id=\"gruss\"></p>", css: "", js: "// Dein JavaScript\n" },
  sol: { html: "<form id=\"form\">\n  <label for=\"name\">Dein Name</label>\n  <input id=\"name\">\n  <button>Begrüßen</button>\n</form>\n<p id=\"gruss\"></p>", css: "", js: "const form = document.querySelector(\"#form\");\nconst gruss = document.querySelector(\"#gruss\");\nform.addEventListener(\"submit\", (e) => {\n  e.preventDefault();\n  const name = document.querySelector(\"#name\").value.trim();\n  gruss.textContent = name ? `Hallo, ${name}!` : \"Bitte Namen eingeben\";\n});" },
  hints: ["<code>form.addEventListener(\"submit\", (e) =&gt; { e.preventDefault(); … })</code>", "<code>.value.trim()</code> entfernt Leerzeichen"],
  checks: [
    ["Name „  Lea “ → „Hallo, Lea!“", function (d) { $q(d, "#name").value = "  Lea "; $q(d, "#form").requestSubmit(); return txt($q(d, "#gruss")) === "Hallo, Lea!"; }],
    ["Leeres Feld → Hinweis", function (d) { $q(d, "#name").value = "   "; $q(d, "#form").requestSubmit(); return txt($q(d, "#gruss")) === "Bitte Namen eingeben"; }],
    ["Kein Neuladen (preventDefault)", function (d, w, s) { return /preventDefault\s*\(/.test(s.js); }]
  ] },
{ id: "j6", sec: "JavaScript", t: "JSON verarbeiten",
  theory: "<p>APIs liefern Daten als <b>JSON</b>-Text. <code>JSON.parse</code> macht daraus JavaScript-Objekte, <code>JSON.stringify</code> umgekehrt. Danach sortieren, filtern und anzeigen.</p><pre>const daten = JSON.parse('[{\"name\":\"A\",\"preis\":5}]');\ndaten.sort((a, b) =&gt; a.preis - b.preis);\nconst euro = new Intl.NumberFormat(\"de-DE\", { style: \"currency\", currency: \"EUR\" });\neuro.format(1499.5); // \"1.499,50 €\"</pre>",
  task: "Wandle <code>antwort</code> mit <code>JSON.parse</code> um, zeige die Produkte <b>aufsteigend nach Preis</b> in <code>#produkte</code> als <code>li</code> im Format „Name – 1.234,00 €“ (mit <code>Intl.NumberFormat</code>) und schreibe die Gesamtsumme in <code>#summe</code>.",
  start: { html: "<ul id=\"produkte\"></ul>\n<p>Summe: <strong id=\"summe\"></strong></p>", css: "", js: "const antwort = '[{\"name\":\"Laptop\",\"preis\":999},{\"name\":\"Maus\",\"preis\":25},{\"name\":\"Monitor\",\"preis\":249.5}]';\n\n// Dein Code\n" },
  sol: { html: "<ul id=\"produkte\"></ul>\n<p>Summe: <strong id=\"summe\"></strong></p>", css: "", js: "const antwort = '[{\"name\":\"Laptop\",\"preis\":999},{\"name\":\"Maus\",\"preis\":25},{\"name\":\"Monitor\",\"preis\":249.5}]';\n\nconst euro = new Intl.NumberFormat(\"de-DE\", { style: \"currency\", currency: \"EUR\" });\nconst produkte = JSON.parse(antwort).sort((a, b) => a.preis - b.preis);\nconst ul = document.querySelector(\"#produkte\");\nprodukte.forEach(p => {\n  const li = document.createElement(\"li\");\n  li.textContent = `${p.name} – ${euro.format(p.preis)}`;\n  ul.append(li);\n});\ndocument.querySelector(\"#summe\").textContent = euro.format(produkte.reduce((s, p) => s + p.preis, 0));" },
  hints: ["Sortieren: <code>liste.sort((a, b) =&gt; a.preis - b.preis)</code>", "Summe: <code>reduce((s, p) =&gt; s + p.preis, 0)</code>"],
  checks: [
    ["JSON.parse verwendet", function (d, w, s) { return /JSON\.parse\s*\(/.test(s.js); }],
    ["3 Produkte, aufsteigend sortiert", function (d) { var l = $all(d, "#produkte li").map(txt); return l.length === 3 && /^Maus/.test(l[0]) && /^Monitor/.test(l[1]) && /^Laptop/.test(l[2]); }],
    ["Preis im deutschen Format (249,50 €)", function (d) { return /249,50\s?€/.test(txt($all(d, "#produkte li")[1] || null)); }],
    ["Summe 1.273,50 €", function (d) { return /1\.273,50\s?€/.test(txt($q(d, "#summe"))); }]
  ] },
{ id: "j7", sec: "JavaScript", t: "Async/await & Ladezustände",
  theory: "<p>Netzwerkanfragen dauern. <code>fetch</code> liefert ein <b>Promise</b>; mit <code>async</code>/<code>await</code> schreibst du asynchronen Code wie normalen. Profis zeigen immer drei Zustände: <b>Laden</b>, <b>Erfolg</b>, <b>Fehler</b>.</p><pre>async function laden() {\n  status.textContent = \"Lade …\";\n  try {\n    const res = await fetch(\"/api/produkte\");\n    if (!res.ok) throw new Error(res.status);\n    const daten = await res.json();\n    status.textContent = \"Fertig\";\n  } catch (err) {\n    status.textContent = \"Fehler: \" + err.message;\n  }\n}</pre>",
  task: "<code>holeNutzer()</code> simuliert eine API (dauert 300 ms). Schreibe eine <code>async</code>-Funktion, die beim Klick auf <code>#laden</code> zuerst „Lade …“ in <code>#status</code> schreibt, dann auf die Daten wartet, die Namen als <code>li</code> in <code>#nutzer</code> einfügt und „Fertig“ anzeigt. Bei Fehler (Checkbox <code>#fehler</code> an): „Fehler: …“.",
  start: { html: "<label><input type=\"checkbox\" id=\"fehler\"> Fehler simulieren</label>\n<button id=\"laden\">Nutzer laden</button>\n<p id=\"status\">Bereit</p>\n<ul id=\"nutzer\"></ul>", css: "", js: "// Simulierte API, nicht ändern\nfunction holeNutzer() {\n  return new Promise((resolve, reject) => setTimeout(() => {\n    if (document.querySelector(\"#fehler\").checked) reject(new Error(\"Server nicht erreichbar\"));\n    else resolve([{ name: \"Lea\" }, { name: \"Max\" }, { name: \"Ayşe\" }]);\n  }, 300));\n}\n\n// Dein Code\n" },
  sol: { html: "<label><input type=\"checkbox\" id=\"fehler\"> Fehler simulieren</label>\n<button id=\"laden\">Nutzer laden</button>\n<p id=\"status\">Bereit</p>\n<ul id=\"nutzer\"></ul>", css: "", js: "// Simulierte API, nicht ändern\nfunction holeNutzer() {\n  return new Promise((resolve, reject) => setTimeout(() => {\n    if (document.querySelector(\"#fehler\").checked) reject(new Error(\"Server nicht erreichbar\"));\n    else resolve([{ name: \"Lea\" }, { name: \"Max\" }, { name: \"Ayşe\" }]);\n  }, 300));\n}\n\nconst statusEl = document.querySelector(\"#status\");\nconst ul = document.querySelector(\"#nutzer\");\nasync function laden() {\n  statusEl.textContent = \"Lade …\";\n  ul.innerHTML = \"\";\n  try {\n    const nutzer = await holeNutzer();\n    nutzer.forEach(n => { const li = document.createElement(\"li\"); li.textContent = n.name; ul.append(li); });\n    statusEl.textContent = \"Fertig\";\n  } catch (err) {\n    statusEl.textContent = \"Fehler: \" + err.message;\n  }\n}\ndocument.querySelector(\"#laden\").addEventListener(\"click\", laden);" },
  hints: ["<code>async function laden() { … const nutzer = await holeNutzer(); … }</code>", "Fehler abfangen mit <code>try { … } catch (err) { … }</code>"],
  checks: [
    ["Sofort nach Klick: „Lade …“", function (d) { $q(d, "#fehler").checked = false; $q(d, "#laden").click(); return /lade/i.test(txt($q(d, "#status"))); }],
    ["Nach dem Laden: 3 Namen + „Fertig“", function (d) { return wait(500).then(function () { return $all(d, "#nutzer li").length === 3 && /fertig/i.test(txt($q(d, "#status"))); }); }],
    ["Bei Fehler: „Fehler: …“", function (d) { $q(d, "#fehler").checked = true; $q(d, "#laden").click(); return wait(500).then(function () { return /^Fehler:/.test(txt($q(d, "#status"))); }); }],
    ["async/await und try/catch verwendet", function (d, w, s) { return /async\s/.test(s.js) && /await\s/.test(s.js) && /catch\s*\(/.test(s.js); }]
  ] }
];
