/* Code-Labor, Teil 2: Vertiefung HTML, CSS, JavaScript, Barrierefreiheit, Sicherheit & Performance */
function cs(w, el) { return w.getComputedStyle(el); }
function L(o) { C.lessons.push(o); }
function same(o) { return { html: o.html || "", css: o.css || "", js: o.js || "" }; }

/* ================= HTML ================= */
L({ id: "h7", sec: "HTML", t: "Medien: figure, Video & Audio",
  theory: "<p><code>&lt;figure&gt;</code> fasst ein Bild (oder Diagramm, Code) mit Bildunterschrift <code>&lt;figcaption&gt;</code> zusammen. Videos und Audio bindest du nativ ein. Mit <code>controls</code> bekommt der Nutzer Bedienelemente. Untertitel (<code>&lt;track&gt;</code>) sind für Barrierefreiheit wichtig.</p><pre>&lt;figure&gt;\n  &lt;img src=\"team.jpg\" alt=\"Unser Team im Büro\"&gt;\n  &lt;figcaption&gt;Das Team 2026&lt;/figcaption&gt;\n&lt;/figure&gt;\n&lt;video src=\"film.mp4\" controls width=\"400\"&gt;&lt;/video&gt;</pre><p>Videos nie automatisch mit Ton starten. Große Videos besser über einen Dienst ausliefern.</p>",
  task: "Erstelle eine <code>figure</code> mit einem Bild (<code>https://picsum.photos/400/250</code>, alt-Text) und einer <code>figcaption</code>. Füge darunter ein <code>video</code> mit Bedienelementen (<code>controls</code>) und der Quelle <code>https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4</code> ein.",
  start: same({ html: "<h2>Galerie</h2>\n" }),
  sol: same({ html: "<h2>Galerie</h2>\n<figure>\n  <img src=\"https://picsum.photos/400/250\" alt=\"Zufälliges Landschaftsfoto\">\n  <figcaption>Ein Bild mit Unterschrift</figcaption>\n</figure>\n<video src=\"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4\" controls width=\"400\"></video>" }),
  hints: ["<code>&lt;figure&gt;&lt;img …&gt;&lt;figcaption&gt;…&lt;/figcaption&gt;&lt;/figure&gt;</code>", "Video: <code>&lt;video src=\"…\" controls&gt;&lt;/video&gt;</code>"],
  checks: [
    ["figure mit img und figcaption", function (d) { return !!$q(d, "figure img") && txt($q(d, "figure figcaption")).length > 2; }],
    ["Bild hat alt-Text", function (d) { var i = $q(d, "figure img"); return !!i && (i.getAttribute("alt") || "").trim().length >= 5; }],
    ["video mit controls", function (d) { var v = $q(d, "video"); return !!v && v.hasAttribute("controls"); }],
    ["Video startet nicht automatisch", function (d) { var v = $q(d, "video"); return !!v && !v.hasAttribute("autoplay"); }]
  ] });

L({ id: "h8", sec: "HTML", t: "Formular-Validierung im Browser",
  theory: "<p>Der Browser kann viel selbst prüfen, ganz ohne JavaScript:</p><pre>&lt;input type=\"number\" min=\"1\" max=\"10\"&gt;\n&lt;input minlength=\"8\" required&gt;\n&lt;input pattern=\"[0-9]{5}\" title=\"5 Ziffern\"&gt;   &lt;!-- PLZ --&gt;\n&lt;fieldset&gt;&lt;legend&gt;Zahlungsart&lt;/legend&gt; … &lt;/fieldset&gt;</pre><p><b>Wichtig:</b> Browser-Validierung ist nur Komfort. Ein Server muss <i>immer</i> selbst prüfen, denn Angreifer umgehen das Formular einfach.</p>",
  task: "Ergänze das Formular: <b>PLZ</b> (genau 5 Ziffern per <code>pattern</code>, Pflicht), <b>Passwort</b> (<code>type=password</code>, mindestens 8 Zeichen, Pflicht), <b>Anzahl</b> (Zahl von 1 bis 10). Gruppiere zwei Radio-Buttons „Rechnung“/„PayPal“ (gleicher <code>name</code>) in einem <code>fieldset</code> mit <code>legend</code>.",
  start: same({ html: "<form id=\"f\">\n  <!-- Felder hier -->\n  <button>Absenden</button>\n</form>", css: "form{display:grid;gap:.4rem;max-width:300px}" }),
  sol: same({ html: "<form id=\"f\">\n  <label for=\"plz\">PLZ</label>\n  <input id=\"plz\" name=\"plz\" pattern=\"[0-9]{5}\" title=\"5 Ziffern\" required>\n  <label for=\"pw\">Passwort</label>\n  <input id=\"pw\" name=\"pw\" type=\"password\" minlength=\"8\" required>\n  <label for=\"anz\">Anzahl</label>\n  <input id=\"anz\" name=\"anz\" type=\"number\" min=\"1\" max=\"10\">\n  <fieldset>\n    <legend>Zahlungsart</legend>\n    <label><input type=\"radio\" name=\"zahlung\" value=\"rechnung\"> Rechnung</label>\n    <label><input type=\"radio\" name=\"zahlung\" value=\"paypal\"> PayPal</label>\n  </fieldset>\n  <button>Absenden</button>\n</form>", css: "form{display:grid;gap:.4rem;max-width:300px}" }),
  hints: ["PLZ: <code>pattern=\"[0-9]{5}\"</code>", "Radio-Buttons einer Gruppe teilen sich denselben <code>name</code>."],
  checks: [
    ["PLZ: „1234“ ungültig, „12345“ gültig", function (d) { var p = $q(d, "input[pattern]"); if (!p || !p.required) return false; p.value = "1234"; var a = p.checkValidity(); p.value = "12345"; return !a && p.checkValidity(); }],
    ["Passwortfeld mit mind. 8 Zeichen, Pflicht", function (d) { var p = $q(d, "input[type=password]"); return !!p && p.required && +p.getAttribute("minlength") >= 8; }],
    ["Zahl 1–10", function (d) { var n = $q(d, "input[type=number]"); return !!n && n.min === "1" && n.max === "10"; }],
    ["fieldset mit legend und 2 Radios gleicher Gruppe", function (d) { var r = $all(d, "fieldset input[type=radio]"); return !!$q(d, "fieldset legend") && r.length >= 2 && r[0].name && r.every(function (x) { return x.name === r[0].name; }); }]
  ] });

L({ id: "h9", sec: "HTML", t: "Aufklappbare FAQ mit details",
  theory: "<p><code>&lt;details&gt;</code> und <code>&lt;summary&gt;</code> ergeben ein aufklappbares Element, ganz ohne JavaScript, per Tastatur bedienbar und von Screenreadern verstanden. Mit dem Attribut <code>name</code> (gleicher Wert) verhalten sich mehrere wie ein Akkordeon: Es ist immer nur eins offen.</p><pre>&lt;details name=\"faq\"&gt;\n  &lt;summary&gt;Was kostet eine Website?&lt;/summary&gt;\n  &lt;p&gt;Das hängt ab von …&lt;/p&gt;\n&lt;/details&gt;</pre>",
  task: "Baue eine FAQ mit mindestens 3 Fragen als <code>details</code>/<code>summary</code>. Alle gehören zur Gruppe <code>name=\"faq\"</code>, die erste ist standardmäßig geöffnet (<code>open</code>).",
  start: same({ html: "<h2>Häufige Fragen</h2>\n" }),
  sol: same({ html: "<h2>Häufige Fragen</h2>\n<details name=\"faq\" open>\n  <summary>Wie lange dauert ein Projekt?</summary>\n  <p>Meist 4–8 Wochen.</p>\n</details>\n<details name=\"faq\">\n  <summary>Kann ich Texte selbst ändern?</summary>\n  <p>Ja, über ein CMS.</p>\n</details>\n<details name=\"faq\">\n  <summary>Gibt es Wartung?</summary>\n  <p>Ja, als monatliches Paket.</p>\n</details>" }),
  hints: ["Erstes Element: <code>&lt;details name=\"faq\" open&gt;</code>"],
  checks: [
    ["Mindestens 3 details mit summary", function (d) { var x = $all(d, "details"); return x.length >= 3 && x.every(function (e) { return txt($q(e, "summary")).length > 3; }); }],
    ["Alle mit name=\"faq\"", function (d) { return $all(d, "details").every(function (e) { return e.getAttribute("name") === "faq"; }); }],
    ["Genau die erste ist offen", function (d) { var x = $all(d, "details"); return x[0].open && x.slice(1).every(function (e) { return !e.open; }); }]
  ] });

L({ id: "h10", sec: "HTML", t: "Barrierefreie Datentabelle",
  theory: "<p>Screenreader lesen Tabellen Zelle für Zelle. Damit Nutzer wissen, wozu ein Wert gehört, braucht die Tabelle:</p><ul><li><code>&lt;caption&gt;</code>: Titel der Tabelle</li><li><code>&lt;th scope=\"col\"&gt;</code> für Spalten-, <code>scope=\"row\"</code> für Zeilenköpfe</li><li><code>&lt;tfoot&gt;</code> für Summen</li></ul>",
  task: "Erstelle eine Umsatztabelle mit <code>caption</code>, Spaltenköpfen mit <code>scope=\"col\"</code> (Monat, Umsatz), mind. 3 Zeilen, bei denen der Monat ein <code>th scope=\"row\"</code> ist, und einer Summenzeile in <code>tfoot</code>.",
  start: same({ html: "", css: "table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .6rem}" }),
  sol: same({ html: "<table>\n  <caption>Umsatz 1. Quartal</caption>\n  <thead><tr><th scope=\"col\">Monat</th><th scope=\"col\">Umsatz</th></tr></thead>\n  <tbody>\n    <tr><th scope=\"row\">Januar</th><td>4.200 €</td></tr>\n    <tr><th scope=\"row\">Februar</th><td>3.800 €</td></tr>\n    <tr><th scope=\"row\">März</th><td>5.100 €</td></tr>\n  </tbody>\n  <tfoot><tr><th scope=\"row\">Summe</th><td>13.100 €</td></tr></tfoot>\n</table>", css: "table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .6rem}" }),
  hints: ["<code>&lt;caption&gt;</code> ist das erste Kind von <code>&lt;table&gt;</code>."],
  checks: [
    ["caption vorhanden", function (d) { return txt($q(d, "table > caption")).length > 3; }],
    ["Spaltenköpfe mit scope=col", function (d) { return $all(d, "thead th[scope=col]").length >= 2; }],
    ["≥ 3 Zeilen mit th scope=row", function (d) { return $all(d, "tbody tr th[scope=row]").length >= 3; }],
    ["Summenzeile im tfoot", function (d) { return !!$q(d, "tfoot tr"); }]
  ] });

L({ id: "h11", sec: "HTML", t: "Sprungmarken & Inhaltsverzeichnis",
  theory: "<p>Jedes Element mit <code>id</code> ist ein Sprungziel. Ein Link <code>href=\"#preise\"</code> springt dorthin. So entstehen Inhaltsverzeichnisse und One-Pager. Mit CSS <code>scroll-behavior: smooth</code> wird es weich, mit <code>scroll-margin-top</code> verschwindet nichts unter einer fixen Kopfzeile.</p>",
  task: "Baue ein Inhaltsverzeichnis (<code>nav</code> mit Liste) mit 3 Links auf die drei Abschnitte. Jeder <code>section</code> braucht eine passende <code>id</code>. Schalte sanftes Scrollen für <code>html</code> ein.",
  start: same({ html: "<nav>\n  <!-- Inhaltsverzeichnis -->\n</nav>\n<section><h2>Leistungen</h2><p style=\"height:300px\">…</p></section>\n<section><h2>Preise</h2><p style=\"height:300px\">…</p></section>\n<section><h2>Kontakt</h2><p style=\"height:300px\">…</p></section>" }),
  sol: same({ html: "<nav>\n  <ul>\n    <li><a href=\"#leistungen\">Leistungen</a></li>\n    <li><a href=\"#preise\">Preise</a></li>\n    <li><a href=\"#kontakt\">Kontakt</a></li>\n  </ul>\n</nav>\n<section id=\"leistungen\"><h2>Leistungen</h2><p style=\"height:300px\">…</p></section>\n<section id=\"preise\"><h2>Preise</h2><p style=\"height:300px\">…</p></section>\n<section id=\"kontakt\"><h2>Kontakt</h2><p style=\"height:300px\">…</p></section>", css: "html { scroll-behavior: smooth; }" }),
  hints: ["<code>&lt;section id=\"preise\"&gt;</code> + <code>&lt;a href=\"#preise\"&gt;</code>"],
  checks: [
    ["nav mit 3 Anker-Links", function (d) { return $all(d, "nav a[href^='#']").length >= 3; }],
    ["Jeder Link zeigt auf eine vorhandene section", function (d) { var a = $all(d, "nav a[href^='#']"); return a.length >= 3 && a.every(function (x) { var t = d.getElementById(x.getAttribute("href").slice(1)); return t && t.tagName === "SECTION"; }); }],
    ["scroll-behavior: smooth", function (d, w) { return cs(w, d.documentElement).scrollBehavior === "smooth"; }]
  ] });

L({ id: "h12", sec: "HTML", t: "Daten-Attribute & Zeitangaben",
  theory: "<p><code>data-*</code>-Attribute speichern eigene Daten am Element, ideal als Brücke zu JavaScript (<code>el.dataset.preis</code>). <code>&lt;time datetime=\"2026-03-01\"&gt;</code> macht Datumsangaben maschinenlesbar (Suchmaschinen, Kalender). <code>&lt;abbr title&gt;</code> erklärt Abkürzungen.</p>",
  task: "Erstelle eine Produktliste mit 3 <code>li</code>, jedes mit <code>data-preis</code> (Zahl) und <code>data-kategorie</code>. Darunter ein Absatz mit einem <code>time</code>-Element mit gültigem <code>datetime</code> (JJJJ-MM-TT) und einer <code>abbr</code> mit <code>title</code>.",
  start: same({ html: "<ul id=\"produkte\">\n</ul>\n" }),
  sol: same({ html: "<ul id=\"produkte\">\n  <li data-preis=\"19.9\" data-kategorie=\"buch\">HTML-Buch</li>\n  <li data-preis=\"5\" data-kategorie=\"sticker\">Sticker</li>\n  <li data-preis=\"29\" data-kategorie=\"shirt\">T-Shirt</li>\n</ul>\n<p>Lieferung ab <time datetime=\"2026-03-01\">1. März</time>, Versand per <abbr title=\"Deutsche Post\">DP</abbr>.</p>" }),
  hints: ["<code>&lt;li data-preis=\"19.9\" data-kategorie=\"buch\"&gt;</code>"],
  checks: [
    ["3 Einträge mit numerischem data-preis", function (d) { var l = $all(d, "#produkte li"); return l.length >= 3 && l.every(function (x) { return x.dataset.preis !== undefined && !isNaN(parseFloat(x.dataset.preis)); }); }],
    ["Alle mit data-kategorie", function (d) { var l = $all(d, "#produkte li"); return l.length >= 3 && l.every(function (x) { return !!x.dataset.kategorie; }); }],
    ["time mit gültigem datetime", function (d) { var t = $q(d, "time[datetime]"); return !!t && /^\d{4}-\d{2}-\d{2}/.test(t.getAttribute("datetime")); }],
    ["abbr mit title", function (d) { var a = $q(d, "abbr[title]"); return !!a && a.title.length > 2; }]
  ] });

/* ================= CSS ================= */
L({ id: "c7", sec: "CSS", t: "Selektoren & Spezifität",
  theory: "<p>Wenn mehrere Regeln dasselbe Element treffen, gewinnt die <b>spezifischere</b>: <code>#id</code> (1-0-0) &gt; <code>.klasse</code>, <code>[attr]</code>, <code>:hover</code> (0-1-0) &gt; <code>element</code> (0-0-1). Bei Gleichstand gewinnt die spätere Regel.</p><pre>nav a            /* Nachfahre */\nul &gt; li          /* direktes Kind */\nh2 + p           /* direkt folgender Nachbar */\na[href^=\"https\"] /* Attribut beginnt mit */\nli:nth-child(odd)\n.karte:not(.aktiv)</pre><p>Profi-Tipp: Mit Klassen arbeiten, IDs für Styling vermeiden, <code>!important</code> nur im Notfall.</p>",
  task: "Ohne das HTML zu ändern: (1) Jede <b>ungerade</b> Tabellenzeile im tbody bekommt einen grauen Hintergrund. (2) Externe Links (<code>href</code> beginnt mit <code>https</code>) werden <b>fett</b>. (3) Nur der <b>erste Absatz direkt nach einer h2</b> wird kursiv.",
  start: same({ html: "<h2>Bericht</h2>\n<p>Einleitung (soll kursiv sein)</p>\n<p>Weiterer Absatz (normal)</p>\n<p><a href=\"/intern\">Interner Link</a> und <a href=\"https://example.com\">externer Link</a></p>\n<table><tbody>\n<tr><td>Zeile 1</td></tr><tr><td>Zeile 2</td></tr><tr><td>Zeile 3</td></tr><tr><td>Zeile 4</td></tr>\n</tbody></table>", css: "" }),
  sol: same({ html: "<h2>Bericht</h2>\n<p>Einleitung (soll kursiv sein)</p>\n<p>Weiterer Absatz (normal)</p>\n<p><a href=\"/intern\">Interner Link</a> und <a href=\"https://example.com\">externer Link</a></p>\n<table><tbody>\n<tr><td>Zeile 1</td></tr><tr><td>Zeile 2</td></tr><tr><td>Zeile 3</td></tr><tr><td>Zeile 4</td></tr>\n</tbody></table>", css: "tbody tr:nth-child(odd) { background: #eee; }\na[href^=\"https\"] { font-weight: bold; }\nh2 + p { font-style: italic; }" }),
  hints: ["<code>tbody tr:nth-child(odd)</code>", "<code>a[href^=\"https\"]</code> und <code>h2 + p</code>"],
  checks: [
    ["Ungerade Zeilen grau, gerade nicht", function (d, w) { var r = $all(d, "tbody tr"); var b = function (x) { return cs(w, x).backgroundColor; }; return b(r[0]) !== "rgba(0, 0, 0, 0)" && b(r[1]) === "rgba(0, 0, 0, 0)" && b(r[2]) === b(r[0]); }],
    ["Externer Link fett, interner normal", function (d, w) { var a = $all(d, "a"); return +cs(w, a[1]).fontWeight >= 600 && +cs(w, a[0]).fontWeight < 600; }],
    ["Nur der erste Absatz nach h2 kursiv", function (d, w) { var p = $all(d, "p"); return cs(w, p[0]).fontStyle === "italic" && cs(w, p[1]).fontStyle === "normal"; }],
    ["HTML nicht verändert (keine Klassen/Styles ergänzt)", function (d, w, s) { return !/class=|style=/.test(s.html); }]
  ] });

L({ id: "c8", sec: "CSS", t: "Pseudo-Elemente ::before & ::after",
  theory: "<p>Pseudo-Elemente erzeugen zusätzliche Boxen ohne zusätzliches HTML, z. B. für Dekorationen, Icons oder Hinweise. Sie brauchen immer <code>content</code>.</p><pre>.neu::after {\n  content: \"NEU\";\n  background: crimson; color: #fff;\n  font-size: .7rem; padding: 0 .4em; margin-left: .4em;\n}\nblockquote::before { content: \"„\"; font-size: 3rem; }</pre><p>Rein dekorativ verwenden; wichtige Inhalte gehören ins HTML (Screenreader lesen <code>content</code> nicht zuverlässig).</p>",
  task: "Füge jedem <code>li.neu</code> per <code>::after</code> ein Badge „NEU“ mit farbigem Hintergrund hinzu. Gib <code>.zitat</code> per <code>::before</code> ein großes Anführungszeichen <code>„</code>.",
  start: same({ html: "<ul>\n  <li>Website-Check</li>\n  <li class=\"neu\">Barrierefreiheits-Audit</li>\n  <li class=\"neu\">Shop-Paket</li>\n</ul>\n<p class=\"zitat\">Die beste Agentur, mit der wir je gearbeitet haben.</p>", css: "" }),
  sol: same({ html: "<ul>\n  <li>Website-Check</li>\n  <li class=\"neu\">Barrierefreiheits-Audit</li>\n  <li class=\"neu\">Shop-Paket</li>\n</ul>\n<p class=\"zitat\">Die beste Agentur, mit der wir je gearbeitet haben.</p>", css: ".neu::after { content: \"NEU\"; background: crimson; color: #fff; font-size: .7rem; padding: 0 .4em; margin-left: .4em; border-radius: 4px; }\n.zitat::before { content: \"„\"; font-size: 3rem; line-height: 0; vertical-align: -.4em; margin-right: .2em; }" }),
  hints: ["<code>.neu::after { content: \"NEU\"; … }</code>"],
  checks: [
    ["Badge „NEU“ bei .neu", function (d, w) { return /NEU/.test(w.getComputedStyle($q(d, ".neu"), "::after").content); }],
    ["Badge hat Hintergrundfarbe", function (d, w) { var b = w.getComputedStyle($q(d, ".neu"), "::after").backgroundColor; return b !== "rgba(0, 0, 0, 0)"; }],
    ["Kein Badge beim normalen li", function (d, w) { var c = w.getComputedStyle($q(d, "li:not(.neu)"), "::after").content; return c === "none" || c === "normal"; }],
    ["Anführungszeichen vor dem Zitat", function (d, w) { return /„/.test(w.getComputedStyle($q(d, ".zitat"), "::before").content); }]
  ] });

L({ id: "c9", sec: "CSS", t: "Positionierung: relative, absolute, sticky",
  theory: "<ul><li><code>relative</code>: bleibt im Fluss, dient als Bezugspunkt für Kinder</li><li><code>absolute</code>: aus dem Fluss, positioniert relativ zum nächsten positionierten Vorfahren</li><li><code>fixed</code>: relativ zum Fenster</li><li><code>sticky</code>: scrollt mit, bis eine Kante erreicht ist, dann bleibt es kleben</li></ul><pre>.karte { position: relative; }\n.badge { position: absolute; top: 8px; right: 8px; }\nheader { position: sticky; top: 0; z-index: 10; }</pre>",
  task: "(1) Die Kopfzeile <code>header</code> soll beim Scrollen oben kleben bleiben (sticky, top 0). (2) Das <code>.badge</code> soll in der oberen rechten Ecke der <code>.karte</code> sitzen (10px Abstand).",
  start: same({ html: "<header>Kopfzeile</header>\n<div class=\"karte\">\n  <span class=\"badge\">-20 %</span>\n  <h3>Sommer-Angebot</h3>\n  <p>Website-Paket zum Sonderpreis.</p>\n</div>\n<p style=\"height:600px\">Langer Inhalt zum Scrollen …</p>", css: "header{background:#1b2132;color:#fff;padding:.6rem}\n.karte{border:1px solid #ccc;border-radius:10px;padding:1rem;margin:1rem 0;width:260px}\n.badge{background:crimson;color:#fff;padding:.2rem .5rem;border-radius:6px}\n" }),
  sol: same({ html: "<header>Kopfzeile</header>\n<div class=\"karte\">\n  <span class=\"badge\">-20 %</span>\n  <h3>Sommer-Angebot</h3>\n  <p>Website-Paket zum Sonderpreis.</p>\n</div>\n<p style=\"height:600px\">Langer Inhalt zum Scrollen …</p>", css: "header{background:#1b2132;color:#fff;padding:.6rem;position:sticky;top:0;z-index:10}\n.karte{border:1px solid #ccc;border-radius:10px;padding:1rem;margin:1rem 0;width:260px;position:relative}\n.badge{background:crimson;color:#fff;padding:.2rem .5rem;border-radius:6px;position:absolute;top:10px;right:10px}\n" }),
  hints: ["Eltern-Element <code>position: relative</code>, Kind <code>position: absolute</code>"],
  checks: [
    ["header ist sticky mit top 0", function (d, w) { var s = cs(w, $q(d, "header")); return s.position === "sticky" && s.top === "0px"; }],
    [".karte ist Bezugspunkt (relative)", function (d, w) { return cs(w, $q(d, ".karte")).position === "relative"; }],
    ["Badge sitzt oben rechts in der Karte", function (d) { var k = $q(d, ".karte").getBoundingClientRect(), b = $q(d, ".badge").getBoundingClientRect(); return Math.abs(k.right - b.right - 10) <= 2 && Math.abs(b.top - k.top - 10) <= 2; }]
  ] });

L({ id: "c10", sec: "CSS", t: "Flexbox für Kartenreihen: wrap & grow",
  theory: "<p>Mit <code>flex-wrap: wrap</code> brechen Elemente in neue Zeilen um. <code>flex: 1 1 200px</code> heißt: wachsen (1), schrumpfen (1), Basisbreite 200px. So entsteht ohne Media Query eine flexible Kartenreihe.</p><pre>.reihe { display: flex; flex-wrap: wrap; gap: 1rem; }\n.karte { flex: 1 1 200px; }\n.reihe .karte:last-child { margin-left: auto; }</pre>",
  task: "<code>.reihe</code>: Flex mit Umbruch und Abstand. Jede <code>.karte</code>: Basisbreite 180px, darf wachsen. Der <code>.cta</code>-Button in jeder Karte sitzt ganz unten (Tipp: Karte selbst als Flex-Spalte, Button mit <code>margin-top: auto</code>).",
  start: same({ html: "<div class=\"reihe\">\n  <div class=\"karte\"><h3>Start</h3><p>Kurz.</p><a class=\"cta\" href=\"#\">Wählen</a></div>\n  <div class=\"karte\"><h3>Business</h3><p>Ein deutlich längerer Text, der die Karte höher macht als die anderen beiden Karten.</p><a class=\"cta\" href=\"#\">Wählen</a></div>\n  <div class=\"karte\"><h3>Shop</h3><p>Mittel lang.</p><a class=\"cta\" href=\"#\">Wählen</a></div>\n</div>", css: ".karte{border:1px solid #ccc;border-radius:10px;padding:1rem}\n.cta{background:#6d3df5;color:#fff;padding:.4rem;text-align:center;border-radius:6px;text-decoration:none}\n" }),
  sol: same({ html: "<div class=\"reihe\">\n  <div class=\"karte\"><h3>Start</h3><p>Kurz.</p><a class=\"cta\" href=\"#\">Wählen</a></div>\n  <div class=\"karte\"><h3>Business</h3><p>Ein deutlich längerer Text, der die Karte höher macht als die anderen beiden Karten.</p><a class=\"cta\" href=\"#\">Wählen</a></div>\n  <div class=\"karte\"><h3>Shop</h3><p>Mittel lang.</p><a class=\"cta\" href=\"#\">Wählen</a></div>\n</div>", css: ".karte{border:1px solid #ccc;border-radius:10px;padding:1rem}\n.cta{background:#6d3df5;color:#fff;padding:.4rem;text-align:center;border-radius:6px;text-decoration:none}\n.reihe{display:flex;flex-wrap:wrap;gap:1rem}\n.karte{flex:1 1 180px;display:flex;flex-direction:column}\n.cta{margin-top:auto}" }),
  hints: ["<code>.karte { flex: 1 1 180px; display: flex; flex-direction: column; }</code>"],
  checks: [
    [".reihe: flex + wrap + gap", function (d, w) { var s = cs(w, $q(d, ".reihe")); return s.display === "flex" && s.flexWrap === "wrap" && parseFloat(s.columnGap) > 0; }],
    ["Karten: Basis 180px, wachsen", function (d, w) { var s = cs(w, $q(d, ".karte")); return s.flexBasis === "180px" && +s.flexGrow >= 1; }],
    ["Buttons sitzen jeweils ganz unten in ihrer Karte", function (d, w) { return $all(d, ".karte").every(function (k) { var b = $q(k, ".cta").getBoundingClientRect(), r = k.getBoundingClientRect(), s = cs(w, k); return Math.abs(r.bottom - parseFloat(s.paddingBottom) - parseFloat(s.borderBottomWidth) - b.bottom) < 2; }); }]
  ] });

L({ id: "c11", sec: "CSS", t: "Seitenlayout mit grid-template-areas",
  theory: "<p>Mit benannten Bereichen beschreibst du ein Layout fast wie eine Zeichnung:</p><pre>.seite {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas:\n    \"kopf  kopf\"\n    \"seite inhalt\"\n    \"fuss  fuss\";\n}\nheader { grid-area: kopf; }</pre>",
  task: "Ordne <code>header</code>, <code>aside</code>, <code>main</code> und <code>footer</code> in <code>.seite</code> mit <code>grid-template-areas</code> an: Kopf und Fuß über die volle Breite, darunter links die Seitenleiste (150px), rechts der Inhalt.",
  start: same({ html: "<div class=\"seite\">\n  <header>Kopf</header>\n  <main>Inhalt</main>\n  <aside>Seitenleiste</aside>\n  <footer>Fuß</footer>\n</div>", css: ".seite>*{padding:1rem;background:#efe9ff;border-radius:8px}\n" }),
  sol: same({ html: "<div class=\"seite\">\n  <header>Kopf</header>\n  <main>Inhalt</main>\n  <aside>Seitenleiste</aside>\n  <footer>Fuß</footer>\n</div>", css: ".seite>*{padding:1rem;background:#efe9ff;border-radius:8px}\n.seite{display:grid;gap:.5rem;grid-template-columns:150px 1fr;grid-template-areas:\"kopf kopf\" \"seite inhalt\" \"fuss fuss\"}\nheader{grid-area:kopf}\naside{grid-area:seite}\nmain{grid-area:inhalt}\nfooter{grid-area:fuss}" }),
  hints: ["Jedes Kind braucht <code>grid-area: name;</code>"],
  checks: [
    ["grid-template-areas verwendet", function (d, w) { return cs(w, $q(d, ".seite")).gridTemplateAreas !== "none"; }],
    ["Kopf und Fuß volle Breite", function (d) { var s = $q(d, ".seite").clientWidth; return $q(d, "header").offsetWidth > s * 0.9 && $q(d, "footer").offsetWidth > s * 0.9; }],
    ["Seitenleiste links (150px), Inhalt rechts daneben", function (d) { var a = $q(d, "aside").getBoundingClientRect(), m = $q(d, "main").getBoundingClientRect(); return Math.round(a.width) === 150 && a.left < m.left && Math.abs(a.top - m.top) < 2; }],
    ["Reihenfolge im HTML unverändert (main vor aside)", function (d, w, s) { return s.html.indexOf("<main") < s.html.indexOf("<aside"); }]
  ] });

L({ id: "c12", sec: "CSS", t: "Flüssige Typografie mit clamp()",
  theory: "<p><code>clamp(min, ideal, max)</code> wählt einen Wert, der mit der Fensterbreite wächst, aber Grenzen einhält, ohne Media Queries.</p><pre>h1 { font-size: clamp(1.8rem, 4vw + 1rem, 3.5rem); }\n.container { width: min(100% - 2rem, 70ch); margin-inline: auto; }</pre><p><code>ch</code> ist die Breite des Zeichens „0“. 60–75 Zeichen pro Zeile sind gut lesbar.</p>",
  task: "Gib der <code>h1</code> eine Schriftgröße mit <code>clamp()</code> (min 1.8rem, max 3.5rem). Begrenze <code>.text</code> auf höchstens <code>65ch</code> Breite und zentriere ihn mit <code>margin-inline: auto</code>. Zeilenhöhe der Absätze mindestens 1.5.",
  start: same({ html: "<div class=\"text\">\n  <h1>Gut lesbare Texte</h1>\n  <p>Lange Zeilen sind anstrengend zu lesen. Begrenze die Breite, wähle eine angenehme Zeilenhöhe und lass die Überschrift mit dem Bildschirm mitwachsen. So wirken Texte professionell auf jedem Gerät, vom Handy bis zum großen Monitor.</p>\n</div>", css: "" }),
  sol: same({ html: "<div class=\"text\">\n  <h1>Gut lesbare Texte</h1>\n  <p>Lange Zeilen sind anstrengend zu lesen. Begrenze die Breite, wähle eine angenehme Zeilenhöhe und lass die Überschrift mit dem Bildschirm mitwachsen. So wirken Texte professionell auf jedem Gerät, vom Handy bis zum großen Monitor.</p>\n</div>", css: "h1 { font-size: clamp(1.8rem, 4vw + 1rem, 3.5rem); }\n.text { max-width: 65ch; margin-inline: auto; }\np { line-height: 1.6; }" }),
  hints: ["<code>font-size: clamp(1.8rem, 4vw + 1rem, 3.5rem);</code>"],
  checks: [
    ["h1 nutzt clamp()", function (d, w, s) { return /h1[^{]*\{[^}]*clamp\(/.test(s.css); }],
    ["h1 zwischen 1.8rem und 3.5rem", function (d, w) { var f = parseFloat(cs(w, $q(d, "h1")).fontSize); return f >= 28.7 && f <= 56.1; }],
    [".text max. 65ch und zentriert", function (d, w, s) { var st = cs(w, $q(d, ".text")); return /max-width\s*:\s*65ch/.test(s.css) && /margin-inline\s*:\s*auto/.test(s.css) && st.marginLeft === st.marginRight; }],
    ["Zeilenhöhe ≥ 1.5", function (d, w) { var s = cs(w, $q(d, "p")); return parseFloat(s.lineHeight) / parseFloat(s.fontSize) >= 1.49; }]
  ] });

L({ id: "c13", sec: "CSS", t: "Transitions & Transform",
  theory: "<p><code>transform</code> verschiebt, skaliert, dreht, und zwar ohne das Layout neu zu berechnen; das macht es flüssig. <code>transition</code> animiert Änderungen zwischen zwei Zuständen.</p><pre>.karte { transition: transform .25s ease, box-shadow .25s; }\n.karte:hover, .karte:focus-within {\n  transform: translateY(-6px);\n  box-shadow: 0 10px 25px rgba(0,0,0,.15);\n}</pre><p>Animiere bevorzugt <code>transform</code> und <code>opacity</code>, das schont die Performance.</p>",
  task: "Lass <code>.karte</code> beim Überfahren (<code>:hover</code>) und wenn ein Element darin fokussiert ist (<code>:focus-within</code>) um 6px nach oben schweben und einen Schatten bekommen. Übergang 0.2–0.4 s für <code>transform</code>.",
  start: same({ html: "<div class=\"karte\"><h3>Projekt</h3><a href=\"#\">Ansehen</a></div>", css: ".karte{width:220px;padding:1rem;border:1px solid #ddd;border-radius:12px;margin:1.5rem}\n" }),
  sol: same({ html: "<div class=\"karte\"><h3>Projekt</h3><a href=\"#\">Ansehen</a></div>", css: ".karte{width:220px;padding:1rem;border:1px solid #ddd;border-radius:12px;margin:1.5rem;transition:transform .25s ease, box-shadow .25s}\n.karte:hover,.karte:focus-within{transform:translateY(-6px);box-shadow:0 10px 25px rgba(0,0,0,.15)}" }),
  hints: ["<code>.karte:hover, .karte:focus-within { … }</code>"],
  checks: [
    ["transition für transform (0.2–0.4 s)", function (d, w) { var s = cs(w, $q(d, ".karte")), props = s.transitionProperty.split(", "), durs = s.transitionDuration.split(", "); var i = props.indexOf("transform"); if (i < 0) i = props.indexOf("all"); var t = parseFloat(durs[i] || durs[0]); return i >= 0 && t >= 0.2 && t <= 0.4; }],
    [":hover-Regel mit translateY", function (d, w, s) { return /:hover[^{]*\{[^}]*translateY\(\s*-6px/.test(s.css); }],
    [":focus-within ebenfalls", function (d, w, s) { return /:focus-within/.test(s.css); }],
    ["Schatten im Hover-Zustand", function (d, w, s) { return /:hover[^{]*\{[^}]*box-shadow/.test(s.css); }]
  ] });

L({ id: "c14", sec: "CSS", t: "Keyframe-Animationen & reduzierte Bewegung",
  theory: "<p>Für Abläufe mit mehreren Schritten gibt es <code>@keyframes</code>. Manche Menschen bekommen von Bewegung Schwindel oder Übelkeit; sie stellen im System „Bewegung reduzieren“ ein. Das musst du respektieren:</p><pre>@keyframes puls { 0%,100% { transform: scale(1) } 50% { transform: scale(1.1) } }\n.icon { animation: puls 1.5s ease-in-out infinite; }\n\n@media (prefers-reduced-motion: reduce) {\n  .icon { animation: none; }\n}</pre>",
  task: "Erstelle eine Keyframe-Animation <code>drehen</code> (0° → 360°) und wende sie unendlich auf <code>.lader</code> an (1 s, linear). Schalte sie in einer Media Query <code>prefers-reduced-motion: reduce</code> ab.",
  start: same({ html: "<div class=\"lader\" role=\"status\" aria-label=\"Wird geladen\"></div>", css: ".lader{width:40px;height:40px;border:5px solid #ddd;border-top-color:#6d3df5;border-radius:50%}\n" }),
  sol: same({ html: "<div class=\"lader\" role=\"status\" aria-label=\"Wird geladen\"></div>", css: ".lader{width:40px;height:40px;border:5px solid #ddd;border-top-color:#6d3df5;border-radius:50%;animation:drehen 1s linear infinite}\n@keyframes drehen{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}\n@media (prefers-reduced-motion: reduce){.lader{animation:none}}" }),
  hints: ["<code>@keyframes drehen { to { transform: rotate(360deg); } }</code>"],
  checks: [
    ["@keyframes drehen definiert", function (d) { return Array.prototype.some.call(d.styleSheets, function (sh) { return Array.prototype.some.call(sh.cssRules, function (r) { return r.type === 7 && r.name === "drehen"; }); }); }],
    [".lader animiert unendlich, 1 s, linear", function (d, w) { var s = cs(w, $q(d, ".lader")); return s.animationName === "drehen" && s.animationIterationCount === "infinite" && s.animationDuration === "1s" && s.animationTimingFunction === "linear"; }],
    ["Abschaltung bei prefers-reduced-motion", function (d) { return Array.prototype.some.call(d.styleSheets, function (sh) { return Array.prototype.some.call(sh.cssRules, function (r) { return r.type === 4 && /prefers-reduced-motion/.test(r.conditionText || r.media.mediaText) && /animation/.test(r.cssText); }); }); }]
  ] });

L({ id: "c15", sec: "CSS", t: "Dark Mode mit Variablen",
  theory: "<p>Mit Variablen wird ein Farbschema-Wechsel trivial: Nur die Variablen ändern sich, der Rest bleibt gleich.</p><pre>:root { --bg: #fff; --text: #1b2132; }\n.dark { --bg: #121420; --text: #e8eaf2; }\nbody { background: var(--bg); color: var(--text); }\n\n/* automatisch nach Systemeinstellung: */\n@media (prefers-color-scheme: dark) { :root { --bg: #121420; … } }</pre>",
  task: "Definiere <code>--bg</code> und <code>--text</code> in <code>:root</code> (hell) und überschreibe sie in der Klasse <code>.dark</code> (dunkel). <code>body</code> nutzt beide Variablen. Der Button <code>#umschalten</code> schaltet per JavaScript die Klasse <code>dark</code> am <code>html</code>-Element um.",
  start: same({ html: "<h1>Hallo Nacht</h1>\n<p>Teste den Schalter.</p>\n<button id=\"umschalten\">🌙 Dunkel/Hell</button>", css: "", js: "" }),
  sol: same({ html: "<h1>Hallo Nacht</h1>\n<p>Teste den Schalter.</p>\n<button id=\"umschalten\">🌙 Dunkel/Hell</button>", css: ":root{--bg:#ffffff;--text:#1b2132}\n.dark{--bg:#121420;--text:#e8eaf2}\nbody{background:var(--bg);color:var(--text)}", js: "document.querySelector(\"#umschalten\").addEventListener(\"click\", () => {\n  document.documentElement.classList.toggle(\"dark\");\n});" }),
  hints: ["JS: <code>document.documentElement.classList.toggle(\"dark\")</code>"],
  checks: [
    ["Hell: body nutzt die Variablen", function (d, w, s) { d.documentElement.classList.remove("dark"); return /var\(\s*--bg\s*\)/.test(s.css) && /var\(\s*--text\s*\)/.test(s.css) && cs(w, d.body).backgroundColor !== cs(w, d.body).color; }],
    ["Klick schaltet auf dunkel", function (d, w) { var hell = cs(w, d.body).backgroundColor; $q(d, "#umschalten").click(); var ok = d.documentElement.classList.contains("dark") && cs(w, d.body).backgroundColor !== hell; return ok; }],
    ["Zweiter Klick wieder hell", function (d) { $q(d, "#umschalten").click(); return !d.documentElement.classList.contains("dark"); }],
    ["Farben nur über Variablen (kein festes Farbschema im .dark-body)", function (d, w, s) { return /\.dark\s*\{[^}]*--bg/.test(s.css); }]
  ] });

L({ id: "c16", sec: "CSS", t: "Container Queries",
  theory: "<p>Media Queries fragen die <b>Fensterbreite</b> ab. Container Queries fragen die Breite des <b>umgebenden Elements</b> ab. Perfekt für Komponenten, die mal schmal (Seitenleiste) und mal breit (Hauptbereich) erscheinen.</p><pre>.wrapper { container-type: inline-size; }\n@container (min-width: 400px) {\n  .karte { display: flex; gap: 1rem; }\n}</pre>",
  task: "Mach <code>.box</code> zum Container (<code>container-type: inline-size</code>). In Containern ab 400px Breite soll <code>.karte</code> Bild und Text nebeneinander zeigen (<code>display: flex</code>). Die schmale Box (200px) bleibt untereinander.",
  start: same({ html: "<div class=\"box\" style=\"width:200px\">\n  <div class=\"karte\"><img src=\"https://picsum.photos/120/80\" alt=\"Beispiel\"><p>Schmal: untereinander</p></div>\n</div>\n<div class=\"box\" style=\"width:500px\">\n  <div class=\"karte\"><img src=\"https://picsum.photos/120/80\" alt=\"Beispiel\"><p>Breit: nebeneinander</p></div>\n</div>", css: ".box{border:1px dashed #aaa;margin:.5rem 0;padding:.5rem}\nimg{display:block}\n" }),
  sol: same({ html: "<div class=\"box\" style=\"width:200px\">\n  <div class=\"karte\"><img src=\"https://picsum.photos/120/80\" alt=\"Beispiel\"><p>Schmal: untereinander</p></div>\n</div>\n<div class=\"box\" style=\"width:500px\">\n  <div class=\"karte\"><img src=\"https://picsum.photos/120/80\" alt=\"Beispiel\"><p>Breit: nebeneinander</p></div>\n</div>", css: ".box{border:1px dashed #aaa;margin:.5rem 0;padding:.5rem;container-type:inline-size}\nimg{display:block}\n@container (min-width: 400px){.karte{display:flex;gap:1rem}}" }),
  hints: ["<code>@container (min-width: 400px) { .karte { display: flex; } }</code>"],
  checks: [
    [".box ist Container", function (d, w) { return cs(w, $q(d, ".box")).containerType === "inline-size"; }],
    ["Schmale Karte: block", function (d, w) { return cs(w, $all(d, ".karte")[0]).display === "block"; }],
    ["Breite Karte: flex", function (d, w) { return cs(w, $all(d, ".karte")[1]).display === "flex"; }]
  ] });

/* ================= JavaScript ================= */
L({ id: "j8", sec: "JavaScript", t: "Funktionen & Rückgabewerte",
  theory: "<p>Funktionen kapseln Logik und <b>geben Werte zurück</b>. Gute Funktionen sind klein, tun eine Sache und sind leicht testbar.</p><pre>function brutto(netto, satz = 0.19) {\n  return Math.round(netto * (1 + satz) * 100) / 100;\n}\nconst rabatt = (preis, prozent) =&gt; preis * (1 - prozent / 100); // Pfeilfunktion</pre><p>Geld rechnet man im Profi-Alltag oft in Cent (ganze Zahlen), um Rundungsfehler zu vermeiden: <code>0.1 + 0.2 !== 0.3</code>!</p>",
  task: "Schreibe drei Funktionen: <code>brutto(netto, satz = 0.19)</code> (auf 2 Nachkommastellen gerundet), <code>rabatt(preis, prozent)</code> und <code>formatEuro(betrag)</code>, die z. B. <code>\"1.234,50 €\"</code> liefert (Intl.NumberFormat).",
  start: same({ html: "<p>Die Prüfung ruft deine Funktionen direkt auf.</p>", js: "// Deine Funktionen\n" }),
  sol: same({ html: "<p>Die Prüfung ruft deine Funktionen direkt auf.</p>", js: "function brutto(netto, satz = 0.19) {\n  return Math.round(netto * (1 + satz) * 100) / 100;\n}\nfunction rabatt(preis, prozent) {\n  return preis * (1 - prozent / 100);\n}\nfunction formatEuro(betrag) {\n  return new Intl.NumberFormat(\"de-DE\", { style: \"currency\", currency: \"EUR\" }).format(betrag);\n}" }),
  hints: ["Runden: <code>Math.round(x * 100) / 100</code>", "Standardwert: <code>function brutto(netto, satz = 0.19)</code>"],
  checks: [
    ["brutto(100) === 119", function (d, w) { return w.brutto && w.brutto(100) === 119; }],
    ["brutto(10, 0.07) === 10.7", function (d, w) { return w.brutto && w.brutto(10, 0.07) === 10.7; }],
    ["brutto(19.99) === 23.79 (gerundet)", function (d, w) { return w.brutto && w.brutto(19.99) === 23.79; }],
    ["rabatt(200, 25) === 150", function (d, w) { return w.rabatt && w.rabatt(200, 25) === 150; }],
    ["formatEuro(1234.5) → 1.234,50 €", function (d, w) { return w.formatEuro && /^1\.234,50\s€$/.test(w.formatEuro(1234.5)); }]
  ] });

L({ id: "j9", sec: "JavaScript", t: "Objekte, Destrukturierung & Spread",
  theory: "<pre>const kunde = { name: \"Lea\", ort: \"Darmstadt\", plz: \"64283\" };\nconst { name, ort } = kunde;              // Destrukturierung\nconst kopie = { ...kunde, ort: \"Mainz\" }; // Spread: Kopie mit Änderung\nconst [erstes, ...rest] = [1, 2, 3];       // auch bei Arrays\nObject.entries(kunde).forEach(([k, v]) =&gt; …);</pre><p>Profi-Regel: Daten nicht verändern (mutieren), sondern Kopien mit Änderungen erzeugen. Das vermeidet schwer auffindbare Fehler.</p>",
  task: "Schreibe <code>umziehen(kunde, neuerOrt)</code>, die eine <b>Kopie</b> mit neuem Ort zurückgibt (Original bleibt unverändert). Schreibe <code>adresszeile({ name, plz, ort })</code> mit Destrukturierung, die „Lea, 64283 Darmstadt“ liefert.",
  start: same({ js: "// Deine Funktionen\n" }),
  sol: same({ js: "function umziehen(kunde, neuerOrt) {\n  return { ...kunde, ort: neuerOrt };\n}\nfunction adresszeile({ name, plz, ort }) {\n  return `${name}, ${plz} ${ort}`;\n}" }),
  hints: ["<code>return { ...kunde, ort: neuerOrt };</code>"],
  checks: [
    ["umziehen liefert neuen Ort", function (d, w) { return w.umziehen && w.umziehen({ name: "A", ort: "X" }, "Y").ort === "Y"; }],
    ["Original bleibt unverändert", function (d, w) { var k = { name: "A", ort: "X" }; w.umziehen(k, "Y"); return k.ort === "X"; }],
    ["Es ist eine Kopie (neues Objekt)", function (d, w) { var k = { name: "A", ort: "X" }; return w.umziehen(k, "Y") !== k; }],
    ["adresszeile korrekt", function (d, w) { return w.adresszeile && w.adresszeile({ name: "Lea", plz: "64283", ort: "Darmstadt" }) === "Lea, 64283 Darmstadt"; }],
    ["Destrukturierung im Parameter", function (d, w, s) { return /adresszeile\s*\(\s*\{/.test(s.js) || /adresszeile\s*=\s*\(\s*\{/.test(s.js); }]
  ] });

L({ id: "j10", sec: "JavaScript", t: "Klassen: ein Warenkorb",
  theory: "<p>Klassen bündeln Daten und das Verhalten dazu. Private Felder (<code>#</code>) schützen den inneren Zustand.</p><pre>class Konto {\n  #stand = 0;\n  einzahlen(betrag) {\n    if (betrag &lt;= 0) throw new Error(\"Betrag muss positiv sein\");\n    this.#stand += betrag;\n  }\n  get stand() { return this.#stand; }\n}</pre>",
  task: "Schreibe eine Klasse <code>Warenkorb</code> mit <code>hinzufuegen(name, preis, menge = 1)</code> (gleicher Name erhöht die Menge), <code>entfernen(name)</code>, Getter <code>summe</code> und Getter <code>anzahl</code> (Summe aller Mengen).",
  start: same({ js: "class Warenkorb {\n  // dein Code\n}\n" }),
  sol: same({ js: "class Warenkorb {\n  #posten = new Map();\n  hinzufuegen(name, preis, menge = 1) {\n    const p = this.#posten.get(name);\n    if (p) p.menge += menge;\n    else this.#posten.set(name, { preis, menge });\n  }\n  entfernen(name) { this.#posten.delete(name); }\n  get summe() { let s = 0; for (const p of this.#posten.values()) s += p.preis * p.menge; return s; }\n  get anzahl() { let n = 0; for (const p of this.#posten.values()) n += p.menge; return n; }\n}\nwindow.Warenkorb = Warenkorb;" }),
  hints: ["Eine <code>Map</code> mit dem Namen als Schlüssel ist praktisch.", "Damit die Prüfung die Klasse findet: <code>window.Warenkorb = Warenkorb;</code>"],
  checks: [
    ["Klasse ist erreichbar (window.Warenkorb)", function (d, w) { return typeof w.Warenkorb === "function"; }],
    ["Summe & Anzahl korrekt", function (d, w) { var k = new w.Warenkorb(); k.hinzufuegen("Maus", 25); k.hinzufuegen("Kabel", 5, 2); return k.summe === 35 && k.anzahl === 3; }],
    ["Gleicher Name erhöht Menge", function (d, w) { var k = new w.Warenkorb(); k.hinzufuegen("Maus", 25); k.hinzufuegen("Maus", 25); return k.anzahl === 2 && k.summe === 50; }],
    ["entfernen funktioniert", function (d, w) { var k = new w.Warenkorb(); k.hinzufuegen("A", 10); k.hinzufuegen("B", 5); k.entfernen("A"); return k.summe === 5; }]
  ] });

L({ id: "j11", sec: "JavaScript", t: "Fehler werfen & behandeln",
  theory: "<p>Ungültige Zustände früh mit <code>throw</code> melden, an der richtigen Stelle mit <code>try/catch</code> abfangen und dem Nutzer verständlich anzeigen. Eigene Fehlerklassen machen die Unterscheidung leicht.</p><pre>class ValidierungsFehler extends Error {}\nfunction pruefeAlter(a) {\n  if (!Number.isInteger(a)) throw new ValidierungsFehler(\"Alter muss eine ganze Zahl sein\");\n}\ntry { pruefeAlter(\"x\"); }\ncatch (e) { if (e instanceof ValidierungsFehler) zeige(e.message); else throw e; }</pre>",
  task: "Schreibe <code>pruefeBestellung({ menge, email })</code>: wirft einen <code>Error</code> mit Text, wenn <code>menge</code> keine ganze Zahl von 1 bis 99 ist oder <code>email</code> kein „@“ enthält; sonst gibt sie <code>true</code> zurück. Beim Klick auf <code>#pruefen</code> wird das Ergebnis in <code>#meldung</code> angezeigt („OK“ oder die Fehlermeldung).",
  start: same({ html: "<label>Menge <input id=\"menge\" type=\"number\" value=\"0\"></label>\n<label>E-Mail <input id=\"email\" value=\"lea\"></label>\n<button id=\"pruefen\">Prüfen</button>\n<p id=\"meldung\" role=\"status\"></p>", js: "// Dein Code\n" }),
  sol: same({ html: "<label>Menge <input id=\"menge\" type=\"number\" value=\"0\"></label>\n<label>E-Mail <input id=\"email\" value=\"lea\"></label>\n<button id=\"pruefen\">Prüfen</button>\n<p id=\"meldung\" role=\"status\"></p>", js: "function pruefeBestellung({ menge, email }) {\n  if (!Number.isInteger(menge) || menge < 1 || menge > 99) throw new Error(\"Menge muss zwischen 1 und 99 liegen\");\n  if (!String(email).includes(\"@\")) throw new Error(\"Bitte gültige E-Mail angeben\");\n  return true;\n}\ndocument.querySelector(\"#pruefen\").addEventListener(\"click\", () => {\n  const meldung = document.querySelector(\"#meldung\");\n  try {\n    pruefeBestellung({ menge: Number(document.querySelector(\"#menge\").value), email: document.querySelector(\"#email\").value });\n    meldung.textContent = \"OK\";\n  } catch (e) {\n    meldung.textContent = e.message;\n  }\n});" }),
  hints: ["<code>Number.isInteger(menge)</code>", "Im Klick-Handler: <code>try { … } catch (e) { meldung.textContent = e.message; }</code>"],
  checks: [
    ["Gültige Bestellung → true", function (d, w) { return w.pruefeBestellung && w.pruefeBestellung({ menge: 3, email: "a@b.de" }) === true; }],
    ["menge 0 → Fehler", function (d, w) { try { w.pruefeBestellung({ menge: 0, email: "a@b.de" }); return false; } catch (e) { return !!e.message; } }],
    ["menge 2.5 → Fehler", function (d, w) { try { w.pruefeBestellung({ menge: 2.5, email: "a@b.de" }); return false; } catch (e) { return true; } }],
    ["E-Mail ohne @ → Fehler", function (d, w) { try { w.pruefeBestellung({ menge: 1, email: "ab.de" }); return false; } catch (e) { return true; } }],
    ["Oberfläche zeigt Fehler bzw. OK", function (d) { $q(d, "#menge").value = "0"; $q(d, "#pruefen").click(); var f = txt($q(d, "#meldung")); $q(d, "#menge").value = "2"; $q(d, "#email").value = "x@y.de"; $q(d, "#pruefen").click(); return f.length > 3 && f !== "OK" && txt($q(d, "#meldung")) === "OK"; }]
  ] });

L({ id: "j12", sec: "JavaScript", t: "Event-Delegation",
  theory: "<p>Statt jedem Listenelement einen eigenen Listener zu geben, hängst du <b>einen</b> Listener an den Container und prüfst mit <code>event.target.closest()</code>, was geklickt wurde. Vorteil: funktioniert auch für Elemente, die später dazukommen, und spart Speicher.</p><pre>liste.addEventListener(\"click\", (e) =&gt; {\n  const knopf = e.target.closest(\"button[data-aktion]\");\n  if (!knopf) return;\n  const li = knopf.closest(\"li\");\n  if (knopf.dataset.aktion === \"loeschen\") li.remove();\n});</pre>",
  task: "Mit <b>einem einzigen</b> Listener an <code>#liste</code>: Klick auf „✕“ (<code>data-aktion=\"loeschen\"</code>) entfernt den Eintrag, Klick auf „★“ (<code>data-aktion=\"merken\"</code>) schaltet die Klasse <code>gemerkt</code> am <code>li</code> um. Der Button <code>#neu</code> fügt einen weiteren Eintrag mit beiden Knöpfen hinzu, der ebenfalls funktionieren muss.",
  start: same({ html: "<ul id=\"liste\">\n  <li>Eins <button data-aktion=\"merken\">★</button> <button data-aktion=\"loeschen\">✕</button></li>\n  <li>Zwei <button data-aktion=\"merken\">★</button> <button data-aktion=\"loeschen\">✕</button></li>\n</ul>\n<button id=\"neu\">Neuer Eintrag</button>", css: ".gemerkt{background:#fff3c4}", js: "// Dein Code\n" }),
  sol: same({ html: "<ul id=\"liste\">\n  <li>Eins <button data-aktion=\"merken\">★</button> <button data-aktion=\"loeschen\">✕</button></li>\n  <li>Zwei <button data-aktion=\"merken\">★</button> <button data-aktion=\"loeschen\">✕</button></li>\n</ul>\n<button id=\"neu\">Neuer Eintrag</button>", css: ".gemerkt{background:#fff3c4}", js: "const liste = document.querySelector(\"#liste\");\nliste.addEventListener(\"click\", (e) => {\n  const knopf = e.target.closest(\"button[data-aktion]\");\n  if (!knopf) return;\n  const li = knopf.closest(\"li\");\n  if (knopf.dataset.aktion === \"loeschen\") li.remove();\n  if (knopf.dataset.aktion === \"merken\") li.classList.toggle(\"gemerkt\");\n});\nlet n = 3;\ndocument.querySelector(\"#neu\").addEventListener(\"click\", () => {\n  const li = document.createElement(\"li\");\n  li.innerHTML = `Eintrag ${n++} <button data-aktion=\"merken\">★</button> <button data-aktion=\"loeschen\">✕</button>`;\n  liste.append(li);\n});" }),
  hints: ["<code>e.target.closest(\"button[data-aktion]\")</code>"],
  checks: [
    ["★ schaltet gemerkt um", function (d) { var li = $all(d, "#liste li")[0]; $q(li, "[data-aktion=merken]").click(); var a = li.classList.contains("gemerkt"); $q(li, "[data-aktion=merken]").click(); return a && !li.classList.contains("gemerkt"); }],
    ["✕ entfernt den Eintrag", function (d) { var n = $all(d, "#liste li").length; $q($all(d, "#liste li")[0], "[data-aktion=loeschen]").click(); return $all(d, "#liste li").length === n - 1; }],
    ["Neuer Eintrag funktioniert auch", function (d) { $q(d, "#neu").click(); var l = $all(d, "#liste li"), li = l[l.length - 1]; var b = $q(li, "[data-aktion=merken]"); if (!b) return false; b.click(); var ok = li.classList.contains("gemerkt"); $q(li, "[data-aktion=loeschen]").click(); return ok && $all(d, "#liste li").length === l.length - 1; }],
    ["Nur ein Listener auf der Liste (keine Listener-Schleife)", function (d, w, s) { return !/forEach[\s\S]{0,120}addEventListener/.test(s.js) && !/onclick=/.test(s.html); }]
  ] });

L({ id: "j13", sec: "JavaScript", t: "Daten im Browser speichern (localStorage)",
  theory: "<p><code>localStorage</code> speichert Text dauerhaft im Browser (pro Domain, ca. 5 MB). Objekte vorher mit <code>JSON.stringify</code> in Text umwandeln.</p><pre>localStorage.setItem(\"einstellungen\", JSON.stringify({ theme: \"dark\" }));\nconst e = JSON.parse(localStorage.getItem(\"einstellungen\") ?? \"{}\");</pre><p>Nicht für Passwörter oder sensible Daten. Jedes Skript auf der Seite kann es lesen.</p><p class=\"meta\">(Im Labor bekommt dein Code einen eigenen, abgeschotteten Speicherbereich.)</p>",
  task: "Ein Notizfeld <code>#notiz</code>: Bei jeder Eingabe (<code>input</code>-Event) wird der Text unter dem Schlüssel <code>notiz</code> gespeichert. Beim Laden der Seite wird er wiederhergestellt. <code>#loeschen</code> entfernt die Notiz aus Feld und Speicher.",
  start: same({ html: "<label for=\"notiz\">Notiz</label><br>\n<textarea id=\"notiz\" rows=\"4\" cols=\"40\"></textarea><br>\n<button id=\"loeschen\">Löschen</button>", js: "// Dein Code\n" }),
  sol: same({ html: "<label for=\"notiz\">Notiz</label><br>\n<textarea id=\"notiz\" rows=\"4\" cols=\"40\"></textarea><br>\n<button id=\"loeschen\">Löschen</button>", js: "const feld = document.querySelector(\"#notiz\");\nfeld.value = localStorage.getItem(\"notiz\") ?? \"\";\nfeld.addEventListener(\"input\", () => localStorage.setItem(\"notiz\", feld.value));\ndocument.querySelector(\"#loeschen\").addEventListener(\"click\", () => {\n  localStorage.removeItem(\"notiz\");\n  feld.value = \"\";\n});" }),
  hints: ["<code>feld.addEventListener(\"input\", () =&gt; localStorage.setItem(\"notiz\", feld.value))</code>"],
  checks: [
    ["Eingabe wird gespeichert", function (d, w) { var f = $q(d, "#notiz"); f.value = "Test 123"; f.dispatchEvent(new w.Event("input", { bubbles: true })); return w.localStorage.getItem("notiz") === "Test 123"; }],
    ["Nach Neuladen wiederhergestellt", function (d, w, s, l, reload) { return reload().then(function (c) { return $q(c.d, "#notiz").value === "Test 123"; }); }],
    ["Löschen leert Feld und Speicher", function (d, w) { $q(d, "#loeschen").click(); return $q(d, "#notiz").value === "" && w.localStorage.getItem("notiz") === null; }]
  ] });

L({ id: "j14", sec: "JavaScript", t: "Live-Suche & Filter",
  theory: "<p>Beim <code>input</code>-Event filterst du eine Liste live. Unabhängig von Groß-/Kleinschreibung vergleichen und Ergebnisse zählen:</p><pre>suche.addEventListener(\"input\", () =&gt; {\n  const q = suche.value.trim().toLowerCase();\n  const treffer = daten.filter(x =&gt; x.name.toLowerCase().includes(q));\n  render(treffer);\n});</pre>",
  task: "Zeige alle Städte aus <code>staedte</code> in <code>#liste</code>. Bei Eingabe in <code>#suche</code> werden nur passende Städte angezeigt (Groß-/Kleinschreibung egal). <code>#anzahl</code> zeigt die Trefferzahl. Bei 0 Treffern zeigt <code>#liste</code> ein <code>li</code> mit „Keine Treffer“.",
  start: same({ html: "<label for=\"suche\">Stadt suchen</label>\n<input id=\"suche\" type=\"search\">\n<p><span id=\"anzahl\"></span> Treffer</p>\n<ul id=\"liste\"></ul>", js: "const staedte = [\"Berlin\", \"Hamburg\", \"München\", \"Köln\", \"Frankfurt\", \"Darmstadt\", \"Bremen\", \"Bonn\"];\n\n// Dein Code\n" }),
  sol: same({ html: "<label for=\"suche\">Stadt suchen</label>\n<input id=\"suche\" type=\"search\">\n<p><span id=\"anzahl\"></span> Treffer</p>\n<ul id=\"liste\"></ul>", js: "const staedte = [\"Berlin\", \"Hamburg\", \"München\", \"Köln\", \"Frankfurt\", \"Darmstadt\", \"Bremen\", \"Bonn\"];\n\nconst liste = document.querySelector(\"#liste\");\nconst suche = document.querySelector(\"#suche\");\nfunction render(arr) {\n  liste.innerHTML = \"\";\n  document.querySelector(\"#anzahl\").textContent = arr.length;\n  if (!arr.length) { const li = document.createElement(\"li\"); li.textContent = \"Keine Treffer\"; liste.append(li); return; }\n  arr.forEach(s => { const li = document.createElement(\"li\"); li.textContent = s; liste.append(li); });\n}\nsuche.addEventListener(\"input\", () => {\n  const q = suche.value.trim().toLowerCase();\n  render(staedte.filter(s => s.toLowerCase().includes(q)));\n});\nrender(staedte);" }),
  hints: ["Eine Funktion <code>render(arr)</code> für die Anzeige, einmal am Anfang aufrufen."],
  checks: [
    ["Anfangs alle 8 Städte", function (d) { return $all(d, "#liste li").length === 8 && txt($q(d, "#anzahl")) === "8"; }],
    ["„b“ findet Berlin, Hamburg, Bremen, Bonn", function (d, w) { var s = $q(d, "#suche"); s.value = "b"; s.dispatchEvent(new w.Event("input")); return $all(d, "#liste li").length === 4 && txt($q(d, "#anzahl")) === "4"; }],
    ["„DARM“ findet Darmstadt", function (d, w) { var s = $q(d, "#suche"); s.value = "DARM"; s.dispatchEvent(new w.Event("input")); var l = $all(d, "#liste li"); return l.length === 1 && txt(l[0]) === "Darmstadt"; }],
    ["Keine Treffer → Hinweis", function (d, w) { var s = $q(d, "#suche"); s.value = "xyz"; s.dispatchEvent(new w.Event("input")); return /keine treffer/i.test(txt($q(d, "#liste"))) && txt($q(d, "#anzahl")) === "0"; }]
  ] });

L({ id: "j15", sec: "JavaScript", t: "Tabelle sortieren",
  theory: "<p><code>Array.prototype.sort</code> sortiert mit einer Vergleichsfunktion. Für Texte mit Umlauten: <code>a.localeCompare(b, \"de\")</code>. Für Zahlen: <code>a - b</code>. Barrierefrei: Den Sortierzustand per <code>aria-sort</code> am Spaltenkopf kennzeichnen.</p><pre>daten.sort((a, b) =&gt; a.name.localeCompare(b.name, \"de\"));\nth.setAttribute(\"aria-sort\", \"ascending\");</pre>",
  task: "Klick auf einen Spaltenkopf-Button sortiert die Tabelle nach dieser Spalte (Name alphabetisch mit <code>localeCompare</code>, Preis numerisch) aufsteigend; ein zweiter Klick auf dieselbe Spalte sortiert absteigend. Das zugehörige <code>th</code> bekommt <code>aria-sort=\"ascending\"</code> bzw. <code>\"descending\"</code>.",
  start: same({ html: "<table>\n  <thead><tr>\n    <th><button data-spalte=\"name\">Name</button></th>\n    <th><button data-spalte=\"preis\">Preis</button></th>\n  </tr></thead>\n  <tbody id=\"zeilen\"></tbody>\n</table>", js: "const daten = [\n  { name: \"Übersetzung\", preis: 90 },\n  { name: \"Logo\", preis: 350 },\n  { name: \"Audit\", preis: 120 },\n  { name: \"Hosting\", preis: 8 }\n];\n\n// Dein Code (zeichne die Zeilen auch anfangs)\n" }),
  sol: same({ html: "<table>\n  <thead><tr>\n    <th><button data-spalte=\"name\">Name</button></th>\n    <th><button data-spalte=\"preis\">Preis</button></th>\n  </tr></thead>\n  <tbody id=\"zeilen\"></tbody>\n</table>", js: "const daten = [\n  { name: \"Übersetzung\", preis: 90 },\n  { name: \"Logo\", preis: 350 },\n  { name: \"Audit\", preis: 120 },\n  { name: \"Hosting\", preis: 8 }\n];\n\nlet aktiv = null, auf = true;\nfunction zeichnen() {\n  document.querySelector(\"#zeilen\").innerHTML = \"\";\n  daten.forEach(d => {\n    const tr = document.createElement(\"tr\");\n    tr.innerHTML = \"<td></td><td></td>\";\n    tr.children[0].textContent = d.name;\n    tr.children[1].textContent = d.preis;\n    document.querySelector(\"#zeilen\").append(tr);\n  });\n}\ndocument.querySelector(\"thead\").addEventListener(\"click\", (e) => {\n  const b = e.target.closest(\"button[data-spalte]\");\n  if (!b) return;\n  const sp = b.dataset.spalte;\n  auf = aktiv === sp ? !auf : true;\n  aktiv = sp;\n  daten.sort((x, y) => (sp === \"preis\" ? x.preis - y.preis : x.name.localeCompare(y.name, \"de\")) * (auf ? 1 : -1));\n  document.querySelectorAll(\"th\").forEach(th => th.removeAttribute(\"aria-sort\"));\n  b.closest(\"th\").setAttribute(\"aria-sort\", auf ? \"ascending\" : \"descending\");\n  zeichnen();\n});\nzeichnen();" }),
  hints: ["Zustand merken: <code>let aktiv = null, auf = true;</code>", "Richtung umkehren: Ergebnis der Vergleichsfunktion mit -1 multiplizieren."],
  checks: [
    ["Anfangs 4 Zeilen", function (d) { return $all(d, "#zeilen tr").length === 4; }],
    ["Name aufsteigend: Audit, Hosting, Logo, Übersetzung", function (d) { $q(d, "[data-spalte=name]").click(); var n = $all(d, "#zeilen tr td:first-child").map(txt); return n.join() === "Audit,Hosting,Logo,Übersetzung"; }],
    ["aria-sort=ascending gesetzt", function (d) { return $q(d, "[data-spalte=name]").closest("th").getAttribute("aria-sort") === "ascending"; }],
    ["Zweiter Klick: absteigend", function (d) { $q(d, "[data-spalte=name]").click(); var n = $all(d, "#zeilen tr td:first-child").map(txt); return n[0] === "Übersetzung" && $q(d, "[data-spalte=name]").closest("th").getAttribute("aria-sort") === "descending"; }],
    ["Preis numerisch: 8, 90, 120, 350", function (d) { $q(d, "[data-spalte=preis]").click(); return $all(d, "#zeilen tr td:last-child").map(txt).join() === "8,90,120,350"; }]
  ] });

L({ id: "j16", sec: "JavaScript", t: "Timer: Countdown",
  theory: "<p><code>setInterval(fn, ms)</code> ruft eine Funktion wiederholt auf, <code>clearInterval(id)</code> stoppt sie. <code>setTimeout</code> einmalig. Zeit immer mit <code>padStart</code> formatieren: <code>String(5).padStart(2, \"0\")</code> → „05“.</p>",
  task: "Ein Countdown startet bei <code>#start</code>-Klick mit dem Wert aus <code>#sekunden</code> und zählt jede Sekunde in <code>#anzeige</code> herunter (Format <code>MM:SS</code>, z. B. „01:05“). Bei 0 steht dort „Fertig!“ und das Intervall wird gestoppt. <code>#stopp</code> hält an. Ein erneuter Start darf keine zwei Intervalle gleichzeitig laufen lassen.",
  start: same({ html: "<input id=\"sekunden\" type=\"number\" value=\"65\" min=\"1\">\n<button id=\"start\">Start</button> <button id=\"stopp\">Stopp</button>\n<p id=\"anzeige\" style=\"font-size:2rem\">00:00</p>", js: "// Dein Code\n" }),
  sol: same({ html: "<input id=\"sekunden\" type=\"number\" value=\"65\" min=\"1\">\n<button id=\"start\">Start</button> <button id=\"stopp\">Stopp</button>\n<p id=\"anzeige\" style=\"font-size:2rem\">00:00</p>", js: "let timer = null, rest = 0;\nconst anzeige = document.querySelector(\"#anzeige\");\nfunction format(s) { return String(Math.floor(s / 60)).padStart(2, \"0\") + \":\" + String(s % 60).padStart(2, \"0\"); }\nfunction stopp() { clearInterval(timer); timer = null; }\ndocument.querySelector(\"#start\").addEventListener(\"click\", () => {\n  stopp();\n  rest = Number(document.querySelector(\"#sekunden\").value);\n  anzeige.textContent = format(rest);\n  timer = setInterval(() => {\n    rest--;\n    if (rest <= 0) { stopp(); anzeige.textContent = \"Fertig!\"; }\n    else anzeige.textContent = format(rest);\n  }, 1000);\n});\ndocument.querySelector(\"#stopp\").addEventListener(\"click\", stopp);" }),
  hints: ["Vor jedem Start <code>clearInterval(timer)</code>", "<code>String(n).padStart(2, \"0\")</code>"],
  checks: [
    ["Start zeigt 01:05", function (d) { $q(d, "#sekunden").value = "65"; $q(d, "#start").click(); return txt($q(d, "#anzeige")) === "01:05"; }],
    ["Nach ~1 s: 01:04", function (d) { return wait(1150).then(function () { return txt($q(d, "#anzeige")) === "01:04"; }); }],
    ["Doppelter Start: zählt trotzdem nur 1 pro Sekunde", function (d) { $q(d, "#sekunden").value = "10"; $q(d, "#start").click(); $q(d, "#start").click(); return wait(1150).then(function () { return txt($q(d, "#anzeige")) === "00:09"; }); }],
    ["Ende zeigt „Fertig!“", function (d) { $q(d, "#sekunden").value = "1"; $q(d, "#start").click(); return wait(1300).then(function () { return txt($q(d, "#anzeige")) === "Fertig!"; }); }]
  ] });

L({ id: "j17", sec: "JavaScript", t: "Reguläre Ausdrücke für Eingaben",
  theory: "<p>Reguläre Ausdrücke beschreiben Textmuster. Für Formulare praktisch, aber: nicht übertreiben, E-Mail-Adressen sind z. B. extrem vielfältig.</p><pre>/^\\d{5}$/.test(\"64283\")            // deutsche PLZ\n/^\\+?[0-9 ()\\/-]{6,}$/              // grobe Telefonnummer\n\"DE89 3704 0044 0532 0130 00\".replace(/\\s/g, \"\") // Leerzeichen entfernen</pre>",
  task: "Schreibe <code>istPLZ(s)</code> (genau 5 Ziffern), <code>istIBAN_DE(s)</code> (beginnt mit DE, dann 20 Ziffern; Leerzeichen erlaubt und vor der Prüfung entfernt) und <code>slug(s)</code>, die aus „Über uns & Team!“ den URL-Teil „ueber-uns-team“ macht (ä→ae, ö→oe, ü→ue, ß→ss, alles klein, Nicht-Buchstaben/Ziffern → „-“, keine doppelten/rahmenden Bindestriche).",
  start: same({ js: "// Deine Funktionen\n" }),
  sol: same({ js: "function istPLZ(s) { return /^\\d{5}$/.test(s); }\nfunction istIBAN_DE(s) { return /^DE\\d{20}$/.test(String(s).replace(/\\s/g, \"\")); }\nfunction slug(s) {\n  return s.toLowerCase()\n    .replace(/ä/g, \"ae\").replace(/ö/g, \"oe\").replace(/ü/g, \"ue\").replace(/ß/g, \"ss\")\n    .replace(/[^a-z0-9]+/g, \"-\")\n    .replace(/^-+|-+$/g, \"\");\n}" }),
  hints: ["<code>/^\\d{5}$/</code>", "<code>.replace(/[^a-z0-9]+/g, \"-\")</code> und danach Ränder mit <code>/^-+|-+$/g</code> entfernen"],
  checks: [
    ["istPLZ", function (d, w) { return w.istPLZ && w.istPLZ("64283") && !w.istPLZ("6428") && !w.istPLZ("64283a"); }],
    ["istIBAN_DE", function (d, w) { return w.istIBAN_DE && w.istIBAN_DE("DE89 3704 0044 0532 0130 00") && !w.istIBAN_DE("AT61 1904 3002 3457 3201") && !w.istIBAN_DE("DE12 3"); }],
    ["slug(„Über uns & Team!“)", function (d, w) { return w.slug && w.slug("Über uns & Team!") === "ueber-uns-team"; }],
    ["slug(„  Größe  –  Preis 2026 “)", function (d, w) { return w.slug && w.slug("  Größe  –  Preis 2026 ") === "groesse-preis-2026"; }]
  ] });

L({ id: "j18", sec: "JavaScript", t: "fetch: Daten von einer API",
  theory: "<p>So sieht echter API-Code aus: Ladezustand, Status prüfen, JSON lesen, Fehler anzeigen. Im Labor ersetzt eine simulierte <code>fetch</code>-Funktion den Server (sie verhält sich wie die echte).</p><pre>const res = await fetch(\"/api/produkte?kategorie=buch\");\nif (!res.ok) throw new Error(`HTTP ${res.status}`);\nconst produkte = await res.json();</pre>",
  task: "Beim Klick auf <code>#laden</code>: <code>fetch(\"/api/produkte?kategorie=\" + kategorie)</code> mit dem Wert aus <code>#kategorie</code>. Zeige „Lädt …“ in <code>#status</code>, dann die Produktnamen als <code>li</code> in <code>#liste</code> und „N Produkte“ in <code>#status</code>. Antwortet die API mit Fehler (Kategorie „kaputt“ → 500), zeige „Fehler: HTTP 500“.",
  start: same({ html: "<select id=\"kategorie\"><option>buch</option><option>kurs</option><option>kaputt</option></select>\n<button id=\"laden\">Laden</button>\n<p id=\"status\"></p>\n<ul id=\"liste\"></ul>", js: "// --- Simulierte API (nicht ändern) ---\nwindow.fetch = async (url) => {\n  await new Promise(r => setTimeout(r, 200));\n  const kat = new URLSearchParams(String(url).split(\"?\")[1] || \"\").get(\"kategorie\");\n  const daten = { buch: [{ name: \"HTML & CSS\" }, { name: \"JavaScript\" }], kurs: [{ name: \"React-Kurs\" }, { name: \"SQL-Kurs\" }, { name: \"Git-Kurs\" }] };\n  if (kat === \"kaputt\") return new Response(\"Serverfehler\", { status: 500 });\n  return new Response(JSON.stringify(daten[kat] || []), { status: 200, headers: { \"Content-Type\": \"application/json\" } });\n};\n// --- Dein Code ---\n" }),
  sol: same({ html: "<select id=\"kategorie\"><option>buch</option><option>kurs</option><option>kaputt</option></select>\n<button id=\"laden\">Laden</button>\n<p id=\"status\"></p>\n<ul id=\"liste\"></ul>", js: "// --- Simulierte API (nicht ändern) ---\nwindow.fetch = async (url) => {\n  await new Promise(r => setTimeout(r, 200));\n  const kat = new URLSearchParams(String(url).split(\"?\")[1] || \"\").get(\"kategorie\");\n  const daten = { buch: [{ name: \"HTML & CSS\" }, { name: \"JavaScript\" }], kurs: [{ name: \"React-Kurs\" }, { name: \"SQL-Kurs\" }, { name: \"Git-Kurs\" }] };\n  if (kat === \"kaputt\") return new Response(\"Serverfehler\", { status: 500 });\n  return new Response(JSON.stringify(daten[kat] || []), { status: 200, headers: { \"Content-Type\": \"application/json\" } });\n};\n// --- Dein Code ---\nconst statusEl = document.querySelector(\"#status\");\nconst liste = document.querySelector(\"#liste\");\ndocument.querySelector(\"#laden\").addEventListener(\"click\", async () => {\n  statusEl.textContent = \"Lädt …\";\n  liste.innerHTML = \"\";\n  try {\n    const kat = document.querySelector(\"#kategorie\").value;\n    const res = await fetch(\"/api/produkte?kategorie=\" + encodeURIComponent(kat));\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    const produkte = await res.json();\n    produkte.forEach(p => { const li = document.createElement(\"li\"); li.textContent = p.name; liste.append(li); });\n    statusEl.textContent = `${produkte.length} Produkte`;\n  } catch (e) {\n    statusEl.textContent = \"Fehler: \" + e.message;\n  }\n});" }),
  hints: ["<code>if (!res.ok) throw new Error(`HTTP ${res.status}`);</code>"],
  checks: [
    ["Sofort „Lädt …“", function (d) { $q(d, "#kategorie").value = "kurs"; $q(d, "#laden").click(); return /lädt/i.test(txt($q(d, "#status"))); }],
    ["Kurs: 3 Produkte", function (d) { return wait(450).then(function () { return $all(d, "#liste li").length === 3 && /3 Produkte/.test(txt($q(d, "#status"))); }); }],
    ["Fehler wird angezeigt", function (d) { $q(d, "#kategorie").value = "kaputt"; $q(d, "#laden").click(); return wait(450).then(function () { return /Fehler: HTTP 500/.test(txt($q(d, "#status"))); }); }],
    ["res.ok wird geprüft", function (d, w, s) { return /\.ok\b/.test(s.js.split("Dein Code")[1] || ""); }]
  ] });

L({ id: "j19", sec: "JavaScript", t: "Parallel laden mit Promise.all",
  theory: "<p>Unabhängige Anfragen nacheinander abzuwarten, verschwendet Zeit. <code>Promise.all</code> startet alle gleichzeitig und wartet auf alle. <code>Promise.allSettled</code> wartet auch, wenn einzelne fehlschlagen.</p><pre>const [nutzer, bestellungen] = await Promise.all([\n  ladeNutzer(), ladeBestellungen()\n]);</pre>",
  task: "<code>lade(name)</code> braucht je 300 ms. Schreibe <code>async function dashboard()</code>, die <code>\"umsatz\"</code>, <code>\"kunden\"</code> und <code>\"bestellungen\"</code> <b>parallel</b> lädt und ein Objekt <code>{ umsatz, kunden, bestellungen }</code> zurückgibt. Gesamtdauer deutlich unter 900 ms.",
  start: same({ js: "// Simulierte API (nicht ändern)\nconst werte = { umsatz: 12400, kunden: 87, bestellungen: 133 };\nfunction lade(name) { return new Promise(r => setTimeout(() => r(werte[name]), 300)); }\n\n// Dein Code\n" }),
  sol: same({ js: "// Simulierte API (nicht ändern)\nconst werte = { umsatz: 12400, kunden: 87, bestellungen: 133 };\nfunction lade(name) { return new Promise(r => setTimeout(() => r(werte[name]), 300)); }\n\nasync function dashboard() {\n  const [umsatz, kunden, bestellungen] = await Promise.all([lade(\"umsatz\"), lade(\"kunden\"), lade(\"bestellungen\")]);\n  return { umsatz, kunden, bestellungen };\n}" }),
  hints: ["<code>const [a, b, c] = await Promise.all([lade(\"umsatz\"), …]);</code>"],
  checks: [
    ["dashboard() liefert alle Werte", function (d, w) { if (!w.dashboard) return false; return w.dashboard().then(function (r) { return r.umsatz === 12400 && r.kunden === 87 && r.bestellungen === 133; }); }],
    ["Parallel: unter 600 ms", function (d, w) { var t = Date.now(); return w.dashboard().then(function () { return Date.now() - t < 600; }); }],
    ["Promise.all verwendet", function (d, w, s) { return /Promise\.all(Settled)?\s*\(/.test(s.js); }]
  ] });

L({ id: "j20", sec: "JavaScript", t: "Datum & Internationalisierung",
  theory: "<p>Datumsangaben sind tückisch (Zeitzonen, Formate). Für die Anzeige immer <code>Intl</code> verwenden:</p><pre>new Intl.DateTimeFormat(\"de-DE\", { dateStyle: \"full\" }).format(datum)\n// \"Montag, 2. März 2026\"\nconst rtf = new Intl.RelativeTimeFormat(\"de\", { numeric: \"auto\" });\nrtf.format(-1, \"day\") // \"gestern\"\nrtf.format(3, \"day\")  // \"in 3 Tagen\"</pre>",
  task: "Schreibe <code>datumLang(date)</code> → z. B. „Montag, 2. März 2026“ (dateStyle full, de-DE) und <code>relativ(tageDifferenz)</code> → „heute“, „morgen“, „gestern“, „in 3 Tagen“, „vor 5 Tagen“ (Intl.RelativeTimeFormat mit numeric auto). Plus <code>tageBis(ziel, heute)</code>: ganze Tage zwischen zwei Datumsangaben.",
  start: same({ js: "// Deine Funktionen\n" }),
  sol: same({ js: "function datumLang(date) {\n  return new Intl.DateTimeFormat(\"de-DE\", { dateStyle: \"full\" }).format(date);\n}\nfunction relativ(tage) {\n  return new Intl.RelativeTimeFormat(\"de\", { numeric: \"auto\" }).format(tage, \"day\");\n}\nfunction tageBis(ziel, heute) {\n  const tag = 24 * 60 * 60 * 1000;\n  return Math.round((Date.UTC(ziel.getFullYear(), ziel.getMonth(), ziel.getDate()) - Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate())) / tag);\n}" }),
  hints: ["<code>new Intl.RelativeTimeFormat(\"de\", { numeric: \"auto\" }).format(n, \"day\")</code>", "Für tageBis: beide Daten auf Mitternacht (UTC) bringen, sonst stört die Sommerzeit."],
  checks: [
    ["datumLang(2. März 2026)", function (d, w) { return w.datumLang && w.datumLang(new Date(2026, 2, 2)) === "Montag, 2. März 2026"; }],
    ["relativ: gestern / heute / in 3 Tagen", function (d, w) { return w.relativ && w.relativ(-1) === "gestern" && w.relativ(0) === "heute" && w.relativ(3) === "in 3 Tagen"; }],
    ["tageBis über Sommerzeit-Umstellung", function (d, w) { return w.tageBis && w.tageBis(new Date(2026, 3, 5), new Date(2026, 2, 25)) === 11; }]
  ] });

/* ================= Barrierefreiheit ================= */
L({ id: "a1", sec: "Barrierefreiheit", t: "Tastatur, Fokus & Skip-Link",
  theory: "<p>Viele Menschen bedienen Seiten nur mit der Tastatur (Tab, Enter, Leertaste, Pfeile). Dafür nötig:</p><ul><li>Echte Bedienelemente (<code>button</code>, <code>a href</code>) statt klickbarer <code>div</code>s</li><li>Ein deutlich <b>sichtbarer Fokus</b>: niemals <code>outline: none</code> ohne Ersatz</li><li>Ein <b>Skip-Link</b> „Zum Inhalt springen“ als erstes Element, sichtbar beim Fokussieren</li></ul><pre>.skip { position: absolute; left: -9999px; }\n.skip:focus { left: 1rem; top: 1rem; }</pre>",
  task: "(1) Ersetze das klickbare <code>div.knopf</code> durch einen echten <code>button</code> (gleiche Klasse, gleicher Text). (2) Füge als erstes Element im body einen Skip-Link <code>a.skip</code> mit <code>href=\"#inhalt\"</code> ein, der nur bei Fokus sichtbar ist. (3) Gib allen fokussierbaren Elementen einen sichtbaren <code>:focus-visible</code>-Rahmen (outline ≥ 2px).",
  start: same({ html: "<nav><a href=\"#\">Start</a> <a href=\"#\">Blog</a> <a href=\"#\">Kontakt</a></nav>\n<main id=\"inhalt\">\n  <h1>Inhalt</h1>\n  <div class=\"knopf\" onclick=\"alert('Gesendet')\">Senden</div>\n</main>", css: "*:focus { outline: none; }\n.knopf { background:#6d3df5; color:#fff; padding:.5rem 1rem; display:inline-block; border:0; border-radius:6px; }\n" }),
  sol: same({ html: "<a class=\"skip\" href=\"#inhalt\">Zum Inhalt springen</a>\n<nav><a href=\"#\">Start</a> <a href=\"#\">Blog</a> <a href=\"#\">Kontakt</a></nav>\n<main id=\"inhalt\" tabindex=\"-1\">\n  <h1>Inhalt</h1>\n  <button class=\"knopf\" type=\"button\" onclick=\"alert('Gesendet')\">Senden</button>\n</main>", css: ".knopf { background:#6d3df5; color:#fff; padding:.5rem 1rem; display:inline-block; border:0; border-radius:6px; }\n:focus-visible { outline: 3px solid #ff9800; outline-offset: 2px; }\n.skip { position:absolute; left:-9999px; }\n.skip:focus { left:1rem; top:1rem; background:#fff; padding:.5rem; }" }),
  hints: ["Die Regel <code>*:focus { outline: none; }</code> muss weg.", "<code>:focus-visible { outline: 3px solid orange; }</code>"],
  checks: [
    ["Kein div.knopf mehr, sondern button.knopf", function (d) { return !$q(d, "div.knopf") && !!$q(d, "button.knopf"); }],
    ["Skip-Link ist erstes Element im body und zeigt auf #inhalt", function (d) { var f = d.body.firstElementChild; return f && f.matches("a.skip[href='#inhalt']"); }],
    ["Skip-Link unsichtbar, beim Fokus sichtbar", function (d, w) { var s = $q(d, ".skip"); var vorher = s.getBoundingClientRect().right; s.focus(); var r = s.getBoundingClientRect(); s.blur(); return vorher <= 0 && r.left >= 0 && r.width > 0; }],
    ["Fokus sichtbar (outline ≥ 2px, kein outline:none für alle)", function (d, w, s) { return !/\*\s*:focus\s*\{[^}]*outline\s*:\s*(none|0)/.test(s.css) && /:focus(-visible)?\s*[,{][^}]*outline\s*:\s*[2-9]px/.test(s.css); }]
  ] });

L({ id: "a2", sec: "Barrierefreiheit", t: "Tabs-Komponente mit ARIA",
  theory: "<p>Eigene Bedienelemente müssen sich für Screenreader und Tastatur wie die Originale verhalten. Das <b>ARIA-Muster „Tabs“</b>:</p><pre>&lt;div role=\"tablist\"&gt;\n  &lt;button role=\"tab\" aria-selected=\"true\" aria-controls=\"p1\" id=\"t1\"&gt;Preise&lt;/button&gt;\n  &lt;button role=\"tab\" aria-selected=\"false\" aria-controls=\"p2\" id=\"t2\" tabindex=\"-1\"&gt;FAQ&lt;/button&gt;\n&lt;/div&gt;\n&lt;div role=\"tabpanel\" id=\"p1\" aria-labelledby=\"t1\"&gt;…&lt;/div&gt;\n&lt;div role=\"tabpanel\" id=\"p2\" aria-labelledby=\"t2\" hidden&gt;…&lt;/div&gt;</pre><p>Pfeiltasten wechseln zwischen Tabs, nur der aktive Tab ist per Tab-Taste erreichbar (<code>tabindex</code>).</p>",
  task: "Das HTML hat schon die ARIA-Struktur. Schreibe das JavaScript: Klick auf einen Tab aktiviert ihn (<code>aria-selected</code>, zugehöriges Panel sichtbar, andere <code>hidden</code>; aktiver Tab <code>tabindex=0</code>, andere <code>-1</code>). Pfeil rechts/links wechselt zum nächsten/vorigen Tab (mit Umlauf) und setzt den Fokus darauf.",
  start: same({ html: "<div role=\"tablist\" aria-label=\"Infos\">\n  <button role=\"tab\" id=\"t1\" aria-controls=\"p1\" aria-selected=\"true\">Preise</button>\n  <button role=\"tab\" id=\"t2\" aria-controls=\"p2\" aria-selected=\"false\" tabindex=\"-1\">Ablauf</button>\n  <button role=\"tab\" id=\"t3\" aria-controls=\"p3\" aria-selected=\"false\" tabindex=\"-1\">FAQ</button>\n</div>\n<div role=\"tabpanel\" id=\"p1\" aria-labelledby=\"t1\">Preise ab 490 €</div>\n<div role=\"tabpanel\" id=\"p2\" aria-labelledby=\"t2\" hidden>Erst Gespräch, dann Entwurf …</div>\n<div role=\"tabpanel\" id=\"p3\" aria-labelledby=\"t3\" hidden>Fragen & Antworten</div>", css: "[role=tab][aria-selected=true]{background:#6d3df5;color:#fff}", js: "// Dein Code\n" }),
  sol: same({ html: "<div role=\"tablist\" aria-label=\"Infos\">\n  <button role=\"tab\" id=\"t1\" aria-controls=\"p1\" aria-selected=\"true\">Preise</button>\n  <button role=\"tab\" id=\"t2\" aria-controls=\"p2\" aria-selected=\"false\" tabindex=\"-1\">Ablauf</button>\n  <button role=\"tab\" id=\"t3\" aria-controls=\"p3\" aria-selected=\"false\" tabindex=\"-1\">FAQ</button>\n</div>\n<div role=\"tabpanel\" id=\"p1\" aria-labelledby=\"t1\">Preise ab 490 €</div>\n<div role=\"tabpanel\" id=\"p2\" aria-labelledby=\"t2\" hidden>Erst Gespräch, dann Entwurf …</div>\n<div role=\"tabpanel\" id=\"p3\" aria-labelledby=\"t3\" hidden>Fragen & Antworten</div>", css: "[role=tab][aria-selected=true]{background:#6d3df5;color:#fff}", js: "const tabs = [...document.querySelectorAll('[role=\"tab\"]')];\nfunction aktiviere(tab) {\n  tabs.forEach(t => {\n    const an = t === tab;\n    t.setAttribute(\"aria-selected\", an);\n    t.tabIndex = an ? 0 : -1;\n    document.getElementById(t.getAttribute(\"aria-controls\")).hidden = !an;\n  });\n  tab.focus();\n}\ntabs.forEach((t, i) => {\n  t.addEventListener(\"click\", () => aktiviere(t));\n  t.addEventListener(\"keydown\", (e) => {\n    if (e.key === \"ArrowRight\") aktiviere(tabs[(i + 1) % tabs.length]);\n    if (e.key === \"ArrowLeft\") aktiviere(tabs[(i - 1 + tabs.length) % tabs.length]);\n  });\n});" }),
  hints: ["Für jeden Tab: <code>aria-selected</code>, <code>tabIndex</code> und das Panel (<code>hidden</code>) setzen.", "Umlauf: <code>(i + 1) % tabs.length</code>"],
  checks: [
    ["Klick auf „Ablauf“ zeigt Panel 2", function (d) { $q(d, "#t2").click(); return $q(d, "#t2").getAttribute("aria-selected") === "true" && !$q(d, "#p2").hidden && $q(d, "#p1").hidden; }],
    ["tabindex: aktiv 0, andere -1", function (d) { return $q(d, "#t2").tabIndex === 0 && $q(d, "#t1").tabIndex === -1 && $q(d, "#t3").tabIndex === -1; }],
    ["Pfeil rechts → nächster Tab mit Fokus", function (d, w) { $q(d, "#t2").dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); return $q(d, "#t3").getAttribute("aria-selected") === "true" && d.activeElement === $q(d, "#t3"); }],
    ["Pfeil rechts am Ende → erster Tab (Umlauf)", function (d, w) { $q(d, "#t3").dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); return $q(d, "#t1").getAttribute("aria-selected") === "true"; }],
    ["Pfeil links am Anfang → letzter Tab", function (d, w) { $q(d, "#t1").dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })); return $q(d, "#t3").getAttribute("aria-selected") === "true" && !$q(d, "#p3").hidden; }]
  ] });

L({ id: "a3", sec: "Barrierefreiheit", t: "Modaler Dialog mit <dialog>",
  theory: "<p>Das native <code>&lt;dialog&gt;</code>-Element bringt alles mit, was ein barrierefreies Modal braucht: <code>showModal()</code> sperrt den Rest der Seite, hält den Fokus im Dialog, schließt mit <b>Escape</b> und bietet einen abdunkelnden Hintergrund (<code>::backdrop</code>). Mit <code>dlg.close(wert)</code> schließt du ihn und hinterlegst, welche Wahl getroffen wurde; im <code>close</code>-Event steht sie in <code>dlg.returnValue</code>.</p><pre>&lt;dialog id=\"d\" aria-labelledby=\"dt\"&gt;\n  &lt;h2 id=\"dt\"&gt;Wirklich löschen?&lt;/h2&gt;\n  &lt;button type=\"button\" value=\"nein\"&gt;Abbrechen&lt;/button&gt;\n  &lt;button type=\"button\" value=\"ja\"&gt;Löschen&lt;/button&gt;\n&lt;/dialog&gt;\n\nd.addEventListener(\"click\", (e) =&gt; {\n  const b = e.target.closest(\"button[value]\");\n  if (b) d.close(b.value);\n});\nd.addEventListener(\"close\", () =&gt; console.log(d.returnValue));</pre><p>Alternative ohne JS für die Buttons: ein <code>&lt;form method=\"dialog\"&gt;</code> im Dialog.</p>",
  task: "Baue einen <code>dialog#bestaetigen</code> mit Überschrift (verknüpft per <code>aria-labelledby</code>) und zwei Buttons „Abbrechen“ (<code>value=\"nein\"</code>) und „Löschen“ (<code>value=\"ja\"</code>). <code>#loeschen</code> öffnet ihn modal. Ein Klick auf einen der Buttons schließt ihn mit <code>dlg.close(button.value)</code>. Nach dem Schließen steht in <code>#ergebnis</code> „Gelöscht“ (bei ja) oder „Abgebrochen“ (auch bei Escape).",
  start: same({ html: "<button id=\"loeschen\">Eintrag löschen</button>\n<p id=\"ergebnis\" role=\"status\"></p>\n<!-- Dialog hier -->", css: "dialog::backdrop{background:rgba(0,0,0,.5)}", js: "// Dein Code\n" }),
  sol: same({ html: "<button id=\"loeschen\">Eintrag löschen</button>\n<p id=\"ergebnis\" role=\"status\"></p>\n<dialog id=\"bestaetigen\" aria-labelledby=\"dtitel\">\n  <h2 id=\"dtitel\">Wirklich löschen?</h2>\n  <button type=\"button\" value=\"nein\">Abbrechen</button>\n  <button type=\"button\" value=\"ja\">Löschen</button>\n</dialog>", css: "dialog::backdrop{background:rgba(0,0,0,.5)}", js: "const dlg = document.querySelector(\"#bestaetigen\");\ndocument.querySelector(\"#loeschen\").addEventListener(\"click\", () => {\n  dlg.returnValue = \"\";\n  dlg.showModal();\n});\nfunction zeigeErgebnis() {\n  document.querySelector(\"#ergebnis\").textContent = dlg.returnValue === \"ja\" ? \"Gelöscht\" : \"Abgebrochen\";\n}\ndlg.addEventListener(\"click\", (e) => {\n  const b = e.target.closest(\"button[value]\");\n  if (!b) return;\n  dlg.close(b.value);\n  zeigeErgebnis();\n});\ndlg.addEventListener(\"close\", zeigeErgebnis); // z. B. bei Escape" }),
  hints: ["<code>dlg.showModal()</code> zum Öffnen, <code>dlg.close(b.value)</code> zum Schließen", "Vor dem Öffnen <code>dlg.returnValue = \"\"</code> zurücksetzen, sonst bleibt bei Escape der alte Wert stehen."],
  checks: [
    ["dialog mit aria-labelledby auf Überschrift", function (d) { var g = $q(d, "dialog#bestaetigen"); if (!g) return false; var t = d.getElementById(g.getAttribute("aria-labelledby") || "-"); return !!t && /^H\d$/.test(t.tagName); }],
    ["Öffnet modal", function (d) { $q(d, "#loeschen").click(); var g = $q(d, "dialog"); return g.open && g.matches(":modal"); }],
    ["„Löschen“ → „Gelöscht“", function (d) { $q(d, "dialog button[value=ja]").click(); return wait(60).then(function () { return !$q(d, "dialog").open && txt($q(d, "#ergebnis")) === "Gelöscht"; }); }],
    ["„Abbrechen“ → „Abgebrochen“", function (d) { $q(d, "#loeschen").click(); $q(d, "dialog button[value=nein]").click(); return wait(60).then(function () { return txt($q(d, "#ergebnis")) === "Abgebrochen"; }); }],
    ["Escape/Schließen wird behandelt (close- oder cancel-Ereignis)", function (d, w, s) { return /addEventListener\(\s*["']\s*(close|cancel)\s*["']/.test(s.js); }]
  ] });

L({ id: "a4", sec: "Barrierefreiheit", t: "Zugängliche Fehlermeldungen",
  theory: "<p>Fehler im Formular müssen <b>wahrnehmbar</b> sein, auch ohne Farbe und für Screenreader:</p><ul><li>Feld bekommt <code>aria-invalid=\"true\"</code></li><li>Meldung steht in einem Element, das per <code>aria-describedby</code> mit dem Feld verknüpft ist</li><li>Fokus springt zum ersten fehlerhaften Feld</li><li>Statusmeldungen in einer Live-Region (<code>role=\"status\"</code> / <code>aria-live</code>) werden vorgelesen</li></ul>",
  task: "Beim Absenden von <code>#form</code> (mit <code>novalidate</code>): Ist <code>#email</code> leer oder ohne „@“, setze <code>aria-invalid=\"true\"</code>, schreibe „Bitte gültige E-Mail eingeben“ in <code>#email-fehler</code>, verknüpfe es per <code>aria-describedby</code> und setze den Fokus ins Feld. Ist sie gültig, entferne den Fehlerzustand und schreibe „Danke!“ in die Live-Region <code>#status</code>.",
  start: same({ html: "<form id=\"form\" novalidate>\n  <label for=\"email\">E-Mail</label>\n  <input id=\"email\" type=\"email\">\n  <p id=\"email-fehler\" class=\"fehler\"></p>\n  <button>Anmelden</button>\n</form>\n<p id=\"status\" role=\"status\"></p>", css: ".fehler{color:#b00020}\n[aria-invalid=true]{border:2px solid #b00020}", js: "// Dein Code\n" }),
  sol: same({ html: "<form id=\"form\" novalidate>\n  <label for=\"email\">E-Mail</label>\n  <input id=\"email\" type=\"email\">\n  <p id=\"email-fehler\" class=\"fehler\"></p>\n  <button>Anmelden</button>\n</form>\n<p id=\"status\" role=\"status\"></p>", css: ".fehler{color:#b00020}\n[aria-invalid=true]{border:2px solid #b00020}", js: "const form = document.querySelector(\"#form\");\nconst email = document.querySelector(\"#email\");\nconst fehler = document.querySelector(\"#email-fehler\");\nform.addEventListener(\"submit\", (e) => {\n  e.preventDefault();\n  if (!email.value.includes(\"@\")) {\n    email.setAttribute(\"aria-invalid\", \"true\");\n    email.setAttribute(\"aria-describedby\", \"email-fehler\");\n    fehler.textContent = \"Bitte gültige E-Mail eingeben\";\n    email.focus();\n    return;\n  }\n  email.removeAttribute(\"aria-invalid\");\n  fehler.textContent = \"\";\n  document.querySelector(\"#status\").textContent = \"Danke!\";\n});" }),
  hints: ["<code>email.setAttribute(\"aria-describedby\", \"email-fehler\")</code>"],
  checks: [
    ["Leer → aria-invalid + Meldung", function (d) { $q(d, "#email").value = ""; $q(d, "#form").requestSubmit(); return $q(d, "#email").getAttribute("aria-invalid") === "true" && /gültige/.test(txt($q(d, "#email-fehler"))); }],
    ["Meldung per aria-describedby verknüpft", function (d) { return ($q(d, "#email").getAttribute("aria-describedby") || "").split(" ").indexOf("email-fehler") >= 0; }],
    ["Fokus im Feld", function (d) { return d.activeElement === $q(d, "#email"); }],
    ["Gültig → Fehler weg, „Danke!“", function (d) { $q(d, "#email").value = "a@b.de"; $q(d, "#form").requestSubmit(); return $q(d, "#email").getAttribute("aria-invalid") !== "true" && txt($q(d, "#email-fehler")) === "" && txt($q(d, "#status")) === "Danke!"; }]
  ] });

/* ================= Sicherheit & Performance ================= */
L({ id: "s1", sec: "Sicherheit & Performance", t: "XSS verhindern",
  theory: "<p><b>Cross-Site-Scripting</b>: Ein Angreifer schreibt z. B. in ein Kommentarfeld <code>&lt;img src=x onerror=\"…\"&gt;</code>. Wird das mit <code>innerHTML</code> angezeigt, läuft sein Code im Browser aller Besucher und kann Sitzungen stehlen.</p><pre>// GEFÄHRLICH\nli.innerHTML = kommentar.text;\n// SICHER\nli.textContent = kommentar.text;</pre><p>Brauchst du wirklich HTML von Nutzern: mit einer Bibliothek wie DOMPurify bereinigen.</p>",
  task: "Die Kommentarliste ist anfällig für XSS. Repariere <code>zeigeKommentare</code> so, dass Kommentartexte und Namen immer als <b>Text</b> erscheinen (der Angriff wird sichtbar als Text angezeigt, aber nicht ausgeführt). Die Struktur (<code>strong</code> für den Namen) soll erhalten bleiben.",
  start: same({ html: "<ul id=\"kommentare\"></ul>", js: "const kommentare = [\n  { name: \"Lea\", text: \"Toller Artikel!\" },\n  { name: \"Hacker\", text: '<img src=x onerror=\"window.gehackt=true\">Klick mich' }\n];\nfunction zeigeKommentare() {\n  const ul = document.querySelector(\"#kommentare\");\n  kommentare.forEach(k => {\n    const li = document.createElement(\"li\");\n    li.innerHTML = \"<strong>\" + k.name + \"</strong>: \" + k.text;\n    ul.append(li);\n  });\n}\nzeigeKommentare();" }),
  sol: same({ html: "<ul id=\"kommentare\"></ul>", js: "const kommentare = [\n  { name: \"Lea\", text: \"Toller Artikel!\" },\n  { name: \"Hacker\", text: '<img src=x onerror=\"window.gehackt=true\">Klick mich' }\n];\nfunction zeigeKommentare() {\n  const ul = document.querySelector(\"#kommentare\");\n  kommentare.forEach(k => {\n    const li = document.createElement(\"li\");\n    const name = document.createElement(\"strong\");\n    name.textContent = k.name;\n    li.append(name, \": \" + k.text);\n    ul.append(li);\n  });\n}\nzeigeKommentare();" }),
  hints: ["<code>strong.textContent = k.name;</code> und <code>li.append(strong, \": \" + k.text)</code>"],
  checks: [
    ["Kein eingeschleustes img im DOM", function (d) { return !$q(d, "#kommentare img"); }],
    ["Angriffscode wurde nicht ausgeführt", function (d, w) { return wait(100).then(function () { return !w.gehackt; }); }],
    ["Angriffstext sichtbar als Text", function (d) { return /<img src=x/.test(txt($all(d, "#kommentare li")[1])); }],
    ["Namen weiterhin in strong", function (d) { return $all(d, "#kommentare li strong").length === 2 && txt($q(d, "#kommentare li strong")) === "Lea"; }],
    ["Kein innerHTML mit Nutzerdaten", function (d, w, s) { return !/innerHTML\s*=\s*[^;]*k\./.test(s.js); }]
  ] });

L({ id: "s2", sec: "Sicherheit & Performance", t: "Sichere Links & externe Inhalte",
  theory: "<p>Links mit <code>target=\"_blank\"</code> sollten <code>rel=\"noopener noreferrer\"</code> tragen: Die geöffnete Seite bekommt so keinen Zugriff auf dein Fenster (<code>window.opener</code>) und keine Herkunftsinfo. Eingebettete fremde Inhalte (<code>iframe</code>) mit <code>sandbox</code> einschränken und mit <code>loading=\"lazy\"</code> nachladen. Und Eingaben in URLs immer mit <code>encodeURIComponent</code> kodieren.</p><pre>&lt;a href=\"https://partner.de\" target=\"_blank\" rel=\"noopener noreferrer\"&gt;Partner&lt;/a&gt;\nconst url = \"/suche?q=\" + encodeURIComponent(eingabe);</pre>",
  task: "(1) Alle Links mit <code>target=\"_blank\"</code> bekommen <code>rel=\"noopener noreferrer\"</code>. (2) Das <code>iframe</code> bekommt <code>sandbox</code> (ohne Werte) und <code>loading=\"lazy\"</code> sowie einen <code>title</code>. (3) Schreibe <code>suchUrl(begriff)</code>, die <code>/suche?q=…</code> mit korrekt kodiertem Begriff liefert.",
  start: same({ html: "<p><a href=\"https://example.com\" target=\"_blank\">Partner 1</a> · <a href=\"https://example.org\" target=\"_blank\">Partner 2</a> · <a href=\"/intern\">Intern</a></p>\n<iframe src=\"https://example.com\" width=\"300\" height=\"150\"></iframe>", js: "// suchUrl\n" }),
  sol: same({ html: "<p><a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Partner 1</a> · <a href=\"https://example.org\" target=\"_blank\" rel=\"noopener noreferrer\">Partner 2</a> · <a href=\"/intern\">Intern</a></p>\n<iframe src=\"https://example.com\" width=\"300\" height=\"150\" sandbox loading=\"lazy\" title=\"Beispielseite\"></iframe>", js: "function suchUrl(begriff) {\n  return \"/suche?q=\" + encodeURIComponent(begriff);\n}" }),
  hints: ["<code>rel=\"noopener noreferrer\"</code>", "<code>encodeURIComponent(\"a&b c\")</code> → <code>a%26b%20c</code>"],
  checks: [
    ["Alle _blank-Links mit noopener", function (d) { var a = $all(d, "a[target=_blank]"); return a.length === 2 && a.every(function (x) { return /noopener/.test(x.rel); }); }],
    ["iframe: sandbox, lazy, title", function (d) { var f = $q(d, "iframe"); return f.hasAttribute("sandbox") && f.getAttribute("sandbox") === "" && f.getAttribute("loading") === "lazy" && f.title.length > 2; }],
    ["suchUrl kodiert korrekt", function (d, w) { return w.suchUrl && w.suchUrl("a&b c/ü") === "/suche?q=a%26b%20c%2F%C3%BC"; }]
  ] });

L({ id: "s3", sec: "Sicherheit & Performance", t: "Schnelles Rendern großer Listen",
  theory: "<p>Jede einzelne DOM-Änderung kann Layout-Berechnungen auslösen. Bei vielen Elementen: erst alles im Speicher zusammenbauen (<code>DocumentFragment</code>), dann <b>einmal</b> einfügen. Und messen statt raten: <code>performance.now()</code>.</p><pre>const frag = document.createDocumentFragment();\nfor (const x of daten) { const li = document.createElement(\"li\"); li.textContent = x; frag.append(li); }\nliste.append(frag); // ein einziger Einfüge-Vorgang</pre>",
  task: "Schreibe <code>renderListe(n)</code>, die <code>n</code> Einträge „Eintrag 1“ … „Eintrag n“ in <code>#liste</code> anzeigt (vorherige ersetzt) und dabei ein <code>DocumentFragment</code> nutzt. Gib die Dauer in ms (gerundet) in <code>#dauer</code> aus.",
  start: same({ html: "<button onclick=\"renderListe(5000)\">5000 rendern</button> <span id=\"dauer\"></span> ms\n<ul id=\"liste\"></ul>", css: "#liste{height:200px;overflow:auto}", js: "// Dein Code\n" }),
  sol: same({ html: "<button onclick=\"renderListe(5000)\">5000 rendern</button> <span id=\"dauer\"></span> ms\n<ul id=\"liste\"></ul>", css: "#liste{height:200px;overflow:auto}", js: "function renderListe(n) {\n  const t0 = performance.now();\n  const frag = document.createDocumentFragment();\n  for (let i = 1; i <= n; i++) {\n    const li = document.createElement(\"li\");\n    li.textContent = \"Eintrag \" + i;\n    frag.append(li);\n  }\n  document.querySelector(\"#liste\").replaceChildren(frag);\n  document.querySelector(\"#dauer\").textContent = Math.round(performance.now() - t0);\n}" }),
  hints: ["<code>liste.replaceChildren(frag)</code> ersetzt alte Einträge in einem Schritt."],
  checks: [
    ["renderListe(5000) erzeugt 5000 Einträge", function (d, w) { w.renderListe(5000); var l = $all(d, "#liste li"); return l.length === 5000 && txt(l[4999]) === "Eintrag 5000"; }],
    ["Erneuter Aufruf ersetzt statt anzuhängen", function (d, w) { w.renderListe(10); return $all(d, "#liste li").length === 10; }],
    ["DocumentFragment und performance.now verwendet", function (d, w, s) { return /createDocumentFragment|new DocumentFragment/.test(s.js) && /performance\.now/.test(s.js); }],
    ["Dauer wird angezeigt", function (d) { return /^\d+$/.test(txt($q(d, "#dauer"))); }]
  ] });

L({ id: "s4", sec: "Sicherheit & Performance", t: "Debounce: weniger Anfragen",
  theory: "<p>Ein Suchfeld, das bei jedem Tastendruck den Server fragt, erzeugt unnötig viel Last. <b>Debounce</b> wartet, bis der Nutzer kurz aufhört zu tippen:</p><pre>function debounce(fn, ms) {\n  let t;\n  return (...args) =&gt; {\n    clearTimeout(t);\n    t = setTimeout(() =&gt; fn(...args), ms);\n  };\n}\nsuche.addEventListener(\"input\", debounce(e =&gt; laden(e.target.value), 300));</pre><p>Das ist eine <b>Closure</b>: Die innere Funktion „merkt“ sich <code>t</code>.</p>",
  task: "Schreibe eine allgemeine Funktion <code>debounce(fn, ms)</code>. Nutze sie, damit <code>sucheAufrufen</code> beim Tippen in <code>#suche</code> erst 300 ms nach der letzten Eingabe aufgerufen wird.",
  start: same({ html: "<input id=\"suche\" placeholder=\"Tippe schnell …\">\n<p>Server-Anfragen: <span id=\"anfragen\">0</span></p>", js: "let anfragen = 0;\nfunction sucheAufrufen(begriff) {\n  anfragen++;\n  document.querySelector(\"#anfragen\").textContent = anfragen;\n  console.log(\"Suche nach:\", begriff);\n}\n\n// Dein Code\n" }),
  sol: same({ html: "<input id=\"suche\" placeholder=\"Tippe schnell …\">\n<p>Server-Anfragen: <span id=\"anfragen\">0</span></p>", js: "let anfragen = 0;\nfunction sucheAufrufen(begriff) {\n  anfragen++;\n  document.querySelector(\"#anfragen\").textContent = anfragen;\n  console.log(\"Suche nach:\", begriff);\n}\n\nfunction debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}\ndocument.querySelector(\"#suche\").addEventListener(\"input\", debounce((e) => sucheAufrufen(e.target.value), 300));" }),
  hints: ["Die zurückgegebene Funktion löscht den alten Timer und startet einen neuen."],
  checks: [
    ["debounce ruft nach Pause genau einmal auf", function (d, w) { var n = 0, f = w.debounce(function () { n++; }, 100); f(); f(); f(); return wait(200).then(function () { return n === 1; }); }],
    ["Argumente werden weitergereicht", function (d, w) { var got, f = w.debounce(function (a, b) { got = a + b; }, 50); f(1, 2); return wait(120).then(function () { return got === 3; }); }],
    ["5 schnelle Eingaben → 1 Anfrage mit letztem Wert", function (d, w) { var s = $q(d, "#suche"), vor = +txt($q(d, "#anfragen")); "abcde".split("").forEach(function (c, i) { s.value = "abcde".slice(0, i + 1); s.dispatchEvent(new w.Event("input")); }); return wait(450).then(function () { return +txt($q(d, "#anfragen")) === vor + 1; }); }]
  ] });
