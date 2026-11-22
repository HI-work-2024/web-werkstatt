/* SQL-Labor: echte SQLite-Datenbank im Browser (sql.js, MIT-Lizenz) */
(function () {
  var W = window.WW, S = W.S, $ = W.$, el = W.el, esc = W.esc;
  S.sql = S.sql || [];
  W.parts.push({ w: 8, f: function () { return S.sql.length / TASKS.length; } });

  var SEED = [
    "CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT NOT NULL, stadt TEXT, email TEXT UNIQUE, seit DATE);",
    "CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT NOT NULL, kategorie TEXT, preis REAL, lager INTEGER);",
    "CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER REFERENCES kunden(id), datum DATE, status TEXT);",
    "CREATE TABLE positionen (bestellung_id INTEGER REFERENCES bestellungen(id), produkt_id INTEGER REFERENCES produkte(id), menge INTEGER);",
    "INSERT INTO kunden VALUES (1,'Lea Schmidt','Berlin','lea@example.de','2024-03-12'),(2,'Max Becker','Hamburg','max@example.de','2023-11-02'),(3,'Ayşe Yılmaz','Berlin','ayse@example.de','2025-01-20'),(4,'Jonas Weber','München','jonas@example.de','2024-07-30'),(5,'Sofia Rossi','Köln','sofia@example.de','2025-05-14'),(6,'Paul Wagner','Darmstadt','paul@example.de','2022-09-01'),(7,'Emma Koch','Berlin','emma@example.de','2025-09-09'),(8,'Noah Richter','Leipzig','noah@example.de','2026-01-03');",
    "INSERT INTO produkte VALUES (1,'USB-C-Kabel','Zubehör',9.9,120),(2,'Laptop-Ständer','Zubehör',34.5,40),(3,'Mechanische Tastatur','Eingabe',89,25),(4,'Funkmaus','Eingabe',24.9,60),(5,'27-Zoll-Monitor','Bildschirm',229,12),(6,'Webcam HD','Video',49.9,30),(7,'HDMI-Kabel','Zubehör',7.5,200),(8,'Headset','Audio',59,18),(9,'Mauspad XL','Zubehör',14.9,75),(10,'Docking-Station','Zubehör',119,9);",
    "INSERT INTO bestellungen VALUES (1,1,'2026-01-05','bezahlt'),(2,2,'2026-01-07','versandt'),(3,1,'2026-01-15','versandt'),(4,3,'2026-01-20','storniert'),(5,4,'2026-02-01','bezahlt'),(6,6,'2026-02-03','versandt'),(7,2,'2026-02-10','offen'),(8,5,'2026-02-11','storniert'),(9,6,'2026-02-20','bezahlt'),(10,1,'2026-02-28','offen');",
    "INSERT INTO positionen VALUES (1,3,1),(1,4,1),(2,5,2),(2,1,3),(3,8,1),(4,6,1),(5,2,1),(5,9,2),(6,10,1),(6,1,2),(7,4,2),(7,7,4),(8,3,1),(9,5,1),(9,7,1),(10,9,1),(10,1,1);"
  ].join("\n");

  var TASKS = [
    { t: "Alle Kunden", d: "Zeige alle Spalten und Zeilen der Tabelle <code>kunden</code>.", sol: "SELECT * FROM kunden;", tip: "<code>SELECT * FROM tabelle;</code>. Der Stern steht für alle Spalten." },
    { t: "Bestimmte Spalten", d: "Zeige nur <code>name</code> und <code>stadt</code> aller Kunden.", sol: "SELECT name, stadt FROM kunden;", tip: "Spalten durch Komma trennen. Profis vermeiden <code>*</code> in echtem Code: Man holt nur, was man braucht." },
    { t: "Filtern mit WHERE", d: "Alle Kunden (alle Spalten) aus <b>Berlin</b>.", sol: "SELECT * FROM kunden WHERE stadt = 'Berlin';", tip: "Texte stehen in einfachen Anführungszeichen: <code>WHERE stadt = 'Berlin'</code>" },
    { t: "Sortieren", d: "Name und Preis aller Produkte <b>unter 20 €</b>, aufsteigend nach Preis.", sol: "SELECT name, preis FROM produkte WHERE preis < 20 ORDER BY preis;", ordered: true, tip: "<code>ORDER BY preis</code> (aufsteigend ist Standard, absteigend: <code>DESC</code>)" },
    { t: "Top 3 mit LIMIT", d: "Name und Preis der <b>3 teuersten</b> Produkte, teuerstes zuerst.", sol: "SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 3;", ordered: true, tip: "<code>ORDER BY … DESC LIMIT 3</code>" },
    { t: "Textsuche mit LIKE", d: "Alle Produktnamen, die <b>„Kabel“</b> enthalten.", sol: "SELECT name FROM produkte WHERE name LIKE '%Kabel%';", tip: "<code>%</code> steht für beliebige Zeichen: <code>LIKE '%Kabel%'</code>" },
    { t: "Zählen", d: "Wie viele Kunden gibt es? (eine Zahl)", sol: "SELECT COUNT(*) FROM kunden;", tip: "<code>SELECT COUNT(*) FROM …</code>" },
    { t: "Gruppieren", d: "Pro <code>kategorie</code>: Anzahl Produkte und Durchschnittspreis (auf 2 Stellen gerundet), sortiert nach Kategorie.", sol: "SELECT kategorie, COUNT(*), ROUND(AVG(preis), 2) FROM produkte GROUP BY kategorie ORDER BY kategorie;", ordered: true, tip: "<code>GROUP BY kategorie</code> mit <code>COUNT(*)</code> und <code>ROUND(AVG(preis), 2)</code>" },
    { t: "Gruppen filtern mit HAVING", d: "Nur Kategorien mit <b>mehr als 2</b> Produkten: Kategorie und Anzahl.", sol: "SELECT kategorie, COUNT(*) FROM produkte GROUP BY kategorie HAVING COUNT(*) > 2;", tip: "WHERE filtert Zeilen, HAVING filtert Gruppen." },
    { t: "JOIN: Bestellungen mit Kundennamen", d: "Bestell-ID, Datum und <b>Name des Kunden</b> für alle Bestellungen.", sol: "SELECT b.id, b.datum, k.name FROM bestellungen b JOIN kunden k ON k.id = b.kunde_id;", tip: "<code>FROM bestellungen b JOIN kunden k ON k.id = b.kunde_id</code>. b und k sind Kurznamen (Aliase)." },
    { t: "LEFT JOIN: Kunden ohne Bestellung", d: "Namen aller Kunden, die <b>noch nie</b> bestellt haben.", sol: "SELECT k.name FROM kunden k LEFT JOIN bestellungen b ON b.kunde_id = k.id WHERE b.id IS NULL;", tip: "LEFT JOIN behält auch Kunden ohne Partner; dort ist <code>b.id IS NULL</code>." },
    { t: "Umsatz pro Bestellung", d: "Bestell-ID und Umsatz (Summe aus menge × preis) jeder Bestellung.", sol: "SELECT p.bestellung_id, SUM(p.menge * pr.preis) FROM positionen p JOIN produkte pr ON pr.id = p.produkt_id GROUP BY p.bestellung_id;", tip: "positionen mit produkte verbinden, dann <code>SUM(p.menge * pr.preis)</code> mit GROUP BY." },
    { t: "Beste Kundin / bester Kunde", d: "Name und Gesamtumsatz des Kunden mit dem höchsten Umsatz (nur Bestellungen, die <b>nicht storniert</b> sind). Eine Zeile.", sol: "SELECT k.name, SUM(p.menge * pr.preis) AS umsatz FROM kunden k JOIN bestellungen b ON b.kunde_id = k.id JOIN positionen p ON p.bestellung_id = b.id JOIN produkte pr ON pr.id = p.produkt_id WHERE b.status <> 'storniert' GROUP BY k.id ORDER BY umsatz DESC LIMIT 1;", ordered: true, tip: "Vier Tabellen verbinden, stornierte ausschließen, gruppieren, absteigend sortieren, <code>LIMIT 1</code>." },
    { t: "Unterabfrage: nie bestellt", d: "Namen der Produkte, die in <b>keiner</b> Bestellposition vorkommen.", sol: "SELECT name FROM produkte WHERE id NOT IN (SELECT produkt_id FROM positionen);", tip: "<code>WHERE id NOT IN (SELECT produkt_id FROM positionen)</code>" },
    { t: "Über dem Durchschnitt", d: "Name und Preis aller Produkte, die <b>teurer als der Durchschnittspreis</b> sind.", sol: "SELECT name, preis FROM produkte WHERE preis > (SELECT AVG(preis) FROM produkte);", tip: "Eine Unterabfrage liefert den Durchschnitt als einzelnen Wert." },
    { t: "INSERT: neuer Kunde", d: "Füge die Kundin <b>Mia Klein</b> aus <b>Leipzig</b> mit E-Mail <code>mia@example.de</code> und Datum <code>2026-03-01</code> hinzu (id automatisch).", sol: "INSERT INTO kunden (name, stadt, email, seit) VALUES ('Mia Klein', 'Leipzig', 'mia@example.de', '2026-03-01');", verify: "SELECT name, stadt, email, seit FROM kunden ORDER BY id;", tip: "<code>INSERT INTO kunden (name, stadt, email, seit) VALUES (…);</code>. Spalten immer explizit nennen." },
    { t: "UPDATE: Preise anpassen", d: "Erhöhe die Preise aller Produkte der Kategorie <b>Zubehör</b> um <b>10 %</b>.", sol: "UPDATE produkte SET preis = preis * 1.1 WHERE kategorie = 'Zubehör';", verify: "SELECT id, ROUND(preis, 2) FROM produkte ORDER BY id;", tip: "<code>UPDATE … SET preis = preis * 1.1 WHERE …</code>. <b>Nie</b> das WHERE vergessen!" },
    { t: "DELETE: Stornos entfernen", d: "Lösche alle Bestellungen mit Status <b>storniert</b> <i>und</i> ihre Positionen (erst Positionen, dann Bestellungen).", sol: "DELETE FROM positionen WHERE bestellung_id IN (SELECT id FROM bestellungen WHERE status = 'storniert');\nDELETE FROM bestellungen WHERE status = 'storniert';", verify: "SELECT (SELECT COUNT(*) FROM bestellungen), (SELECT COUNT(*) FROM positionen);", tip: "Zwei Anweisungen, getrennt durch Semikolon. Sonst bleiben verwaiste Positionen übrig." },
    { t: "CREATE TABLE: Bewertungen", d: "Lege eine Tabelle <code>bewertungen</code> an: <code>id</code> (Primärschlüssel), <code>produkt_id</code> (Pflicht, Verweis auf produkte), <code>sterne</code> (nur 1 bis 5 erlaubt), <code>text</code>.", sol: "CREATE TABLE bewertungen (id INTEGER PRIMARY KEY, produkt_id INTEGER NOT NULL REFERENCES produkte(id), sterne INTEGER CHECK (sterne BETWEEN 1 AND 5), text TEXT);", verify: "SELECT name, pk, \"notnull\" FROM pragma_table_info('bewertungen') ORDER BY cid;", extra: "INSERT INTO bewertungen (produkt_id, sterne) VALUES (1, 6);", extraFail: true, tip: "<code>CHECK (sterne BETWEEN 1 AND 5)</code> lässt die Datenbank ungültige Werte ablehnen." },
    { t: "Index & Transaktion", d: "Lege einen Index auf <code>bestellungen(kunde_id)</code> an. Buche dann in einer <b>Transaktion</b> eine neue Bestellung (id 11) für Kunde 8 mit Datum <code>2026-03-02</code>, Status <code>offen</code>, mit 1× Produkt 4 und verringere dessen <code>lager</code> um 1.", sol: "CREATE INDEX idx_bestellungen_kunde ON bestellungen(kunde_id);\nBEGIN;\nINSERT INTO bestellungen VALUES (11, 8, '2026-03-02', 'offen');\nINSERT INTO positionen VALUES (11, 4, 1);\nUPDATE produkte SET lager = lager - 1 WHERE id = 4;\nCOMMIT;", verify: "SELECT (SELECT COUNT(*) FROM sqlite_master WHERE type = 'index' AND tbl_name = 'bestellungen' AND sql LIKE '%kunde_id%'), (SELECT kunde_id || '/' || status FROM bestellungen WHERE id = 11), (SELECT COUNT(*) FROM positionen WHERE bestellung_id = 11), (SELECT lager FROM produkte WHERE id = 4);", needs: /BEGIN/i, tip: "<code>CREATE INDEX name ON tabelle(spalte);</code> und <code>BEGIN; … COMMIT;</code>" }
  ];

  var sec = $("#sql");
  sec.innerHTML = "<div class=\"intro\"><h2>SQL-Labor</h2><p>Eine echte SQLite-Datenbank läuft hier in deinem Browser: ein kleiner Shop mit Kunden, Produkten, Bestellungen und Positionen. 20 Aufgaben vom ersten SELECT bis zu Transaktionen. Nichts kann kaputtgehen; jede Prüfung startet mit frischen Daten.</p></div>" +
    "<div class=\"lab\"><aside class=\"lessons\" id=\"sqlTasks\"></aside><div class=\"lab-main\"><div class=\"lesson-head\" id=\"sqlHead\"></div>" +
    "<textarea id=\"sqlCode\" class=\"sqlcode\" spellcheck=\"false\"></textarea>" +
    "<div class=\"ed-actions\"><button id=\"sqlRun\">▶ Ausführen</button><button id=\"sqlCheck\">✔ Prüfen</button><button id=\"sqlTip\" class=\"ghost\">💡 Tipp</button><button id=\"sqlSol\" class=\"ghost\">Lösung</button><button id=\"sqlSchema\" class=\"ghost\">🗂 Datenmodell</button><span class=\"meta\">Strg+Enter = Ausführen</span></div>" +
    "<div id=\"sqlMsg\" class=\"checks\"></div><div id=\"sqlOut\" class=\"table-wrap sqlout\"></div></div></div>";

  var SQL = null, cur = 0, codes = S.sqlCode || (S.sqlCode = {});
  function fresh() { var db = new SQL.Database(); db.run(SEED); return db; }
  function runAll(db, sql) { var res = db.exec(sql); return res.length ? res[res.length - 1] : { columns: [], values: [] }; }
  function norm(r, ordered) {
    var rows = r.values.map(function (row) { return row.map(function (v) { return typeof v === "number" ? (Math.round(v * 100) / 100).toString() : v === null ? "NULL" : String(v); }).join("|"); });
    if (!ordered) rows.sort();
    return r.columns.length + "#" + rows.join("\n");
  }
  function tableHtml(r) {
    if (!r.columns.length) return "<p class=\"note\" style=\"padding:.6rem\">Ausgeführt, keine Ergebniszeilen.</p>";
    return "<table class=\"cmp\"><thead><tr>" + r.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      r.values.slice(0, 200).map(function (row) { return "<tr>" + row.map(function (v) { return "<td>" + (v === null ? "<i>NULL</i>" : esc(v)) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>" +
      "<p class=\"meta\" style=\"padding:0 .6rem\">" + r.values.length + " Zeile(n)</p>";
  }
  function renderTasks() {
    $("#sqlTasks").innerHTML = "<h4>Abfragen</h4>";
    TASKS.forEach(function (t, i) {
      if (i === 15) $("#sqlTasks").appendChild(el("h4", "", "Daten ändern & Struktur"));
      var b = el("button", (S.sql.indexOf(i) >= 0 ? "ok " : "") + (i === cur ? "cur" : ""), (i + 1) + ". " + t.t);
      b.addEventListener("click", function () { open(i); });
      $("#sqlTasks").appendChild(b);
    });
  }
  function open(i) {
    cur = i; var t = TASKS[i];
    $("#sqlHead").innerHTML = "<h3>Aufgabe " + (i + 1) + ": " + t.t + "</h3><div class=\"task\">" + t.d + "</div>";
    $("#sqlCode").value = codes[i] !== undefined ? codes[i] : "-- Schreibe deine SQL-Abfrage\n";
    $("#sqlMsg").innerHTML = ""; $("#sqlOut").innerHTML = "";
    renderTasks();
  }
  function run() {
    var sql = $("#sqlCode").value, db = fresh();
    try { $("#sqlOut").innerHTML = tableHtml(runAll(db, sql)); $("#sqlMsg").innerHTML = ""; }
    catch (e) { $("#sqlMsg").innerHTML = "<div class=\"c n\">✖ SQL-Fehler: " + esc(e.message) + "</div>"; $("#sqlOut").innerHTML = ""; }
    db.close();
  }
  function check() {
    var t = TASKS[cur], sql = $("#sqlCode").value, a = fresh(), b = fresh(), ok = false, msg = "";
    try {
      if (t.needs && !t.needs.test(sql)) throw new Error("Die Aufgabe verlangt eine Transaktion (BEGIN … COMMIT).");
      var ra = runAll(a, sql), rb = runAll(b, t.sol);
      if (t.verify) { ra = runAll(a, t.verify); rb = runAll(b, t.verify); }
      ok = norm(ra, t.ordered) === norm(rb, t.ordered);
      if (ok && t.extra) { try { a.run(t.extra); ok = !t.extraFail; if (!ok) msg = "Die Datenbank akzeptiert noch ungültige Werte (z. B. 6 Sterne). Fehlt die CHECK-Regel?"; } catch (e) { ok = !!t.extraFail; } }
      $("#sqlOut").innerHTML = tableHtml(t.verify ? ra : ra);
      if (!ok && !msg) msg = ra.columns.length !== rb.columns.length ? "Anzahl der Spalten stimmt nicht (erwartet: " + rb.columns.length + ")." : "Das Ergebnis weicht von der erwarteten Lösung ab (" + rb.values.length + " Zeilen erwartet" + (t.ordered ? ", Reihenfolge zählt" : "") + ").";
    } catch (e) { msg = "SQL-Fehler: " + e.message; }
    a.close(); b.close();
    if (ok) {
      $("#sqlMsg").innerHTML = "<div class=\"win\">🎉 <b>Richtig!</b>" + (cur + 1 < TASKS.length ? " <button class=\"small\" id=\"sqlNext\">Weiter →</button>" : " Alle SQL-Aufgaben geschafft!") + "</div>";
      if (cur + 1 < TASKS.length) $("#sqlNext").addEventListener("click", function () { open(cur + 1); });
      if (S.sql.indexOf(cur) < 0) { S.sql.push(cur); W.save(); W.progress(); renderTasks(); }
    } else $("#sqlMsg").innerHTML = "<div class=\"c n\">✖ " + esc(msg) + "</div>";
  }
  function schema() {
    var db = fresh(), html = "";
    ["kunden", "produkte", "bestellungen", "positionen"].forEach(function (tn) {
      var cols = runAll(db, "SELECT name, type, pk FROM pragma_table_info('" + tn + "')");
      var n = runAll(db, "SELECT COUNT(*) FROM " + tn).values[0][0];
      html += "<div class=\"card\"><h3>" + tn + " <small class=\"meta\">(" + n + " Zeilen)</small></h3><ul>" + cols.values.map(function (c) { return "<li><code>" + c[0] + "</code> " + c[1] + (c[2] ? " 🔑" : "") + "</li>"; }).join("") + "</ul></div>";
    });
    db.close();
    $("#sqlOut").innerHTML = "<div class=\"cards four\" style=\"padding:.6rem\">" + html + "</div><p class=\"meta\" style=\"padding:0 .6rem .6rem\">Beziehungen: bestellungen.kunde_id → kunden.id · positionen.bestellung_id → bestellungen.id · positionen.produkt_id → produkte.id</p>";
  }
  $("#sqlCode").addEventListener("input", function () { codes[cur] = $("#sqlCode").value; W.save(); });
  $("#sqlCode").addEventListener("keydown", function (e) { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } });
  $("#sqlRun").addEventListener("click", run);
  $("#sqlCheck").addEventListener("click", check);
  $("#sqlTip").addEventListener("click", function () { $("#sqlMsg").innerHTML = "<div class=\"hint\">💡 " + TASKS[cur].tip + "</div>"; });
  $("#sqlSol").addEventListener("click", function () { if (confirm("Lösung anzeigen? Erst selbst versuchen lohnt sich!")) { $("#sqlCode").value = TASKS[cur].sol; codes[cur] = TASKS[cur].sol; W.save(); } });
  $("#sqlSchema").addEventListener("click", schema);

  $("#sqlHead").innerHTML = "<p>Datenbank wird geladen …</p>";
  if (typeof initSqlJs !== "function") { $("#sqlHead").innerHTML = "<p>Die SQL-Bibliothek konnte nicht geladen werden (vendor/sqljs/sql-asm.js fehlt).</p>"; return; }
  initSqlJs().then(function (lib) { SQL = lib; open(0); window.WW.sqlReady = true; window.WW.sqlTasks = TASKS; window.WW.sqlCheckSolution = function (i) { open(i); $("#sqlCode").value = TASKS[i].sol; check(); return S.sql.indexOf(i) >= 0; }; })
    .catch(function (e) { $("#sqlHead").innerHTML = "<p>Fehler beim Laden der Datenbank: " + esc(e.message) + "</p>"; });
})();
