/* Backend, Werkzeuge, Hosting & Betrieb */

/* ---------- Backend ---------- */
C.apiTasks = [
  { t: "Alle Produkte abrufen", ok: function (r) { return r.m === "GET" && r.p === "/api/produkte" && r.s === 200; } },
  { t: "Ein einzelnes Produkt abrufen (z. B. ID 2)", ok: function (r) { return r.m === "GET" && /^\/api\/produkte\/\d+$/.test(r.p) && r.s === 200; } },
  { t: "Einen 404 erzeugen (Produkt, das es nicht gibt)", ok: function (r) { return r.s === 404; } },
  { t: "POST ohne Token versuchen → 401", ok: function (r) { return r.m === "POST" && r.s === 401; } },
  { t: "Mit Token ein Produkt anlegen → 201", ok: function (r) { return r.m === "POST" && r.s === 201; } },
  { t: "Ungültiges JSON oder fehlenden Preis senden → 400", ok: function (r) { return r.s === 400; } },
  { t: "Ein Produkt per PUT ändern", ok: function (r) { return r.m === "PUT" && r.s === 200; } },
  { t: "Ein Produkt löschen → 204", ok: function (r) { return r.m === "DELETE" && r.s === 204; } }
];
C.apiPresets = [["GET", "/api/produkte"], ["GET", "/api/produkte/2"], ["GET", "/api/produkte/99"], ["POST", "/api/produkte"], ["PUT", "/api/produkte/1"], ["DELETE", "/api/produkte/3"], ["GET", "/api/produkte?maxPreis=100"]];

C.statusCodes = [
  ["200", "OK", "Alles gut, hier sind die Daten.", 2], ["201", "Created", "Neu angelegt (nach POST).", 2], ["204", "No Content", "Erfolgreich, aber ohne Inhalt (z. B. nach DELETE).", 2],
  ["301", "Moved Permanently", "Dauerhaft umgezogen, z. B. http → https. Wichtig für SEO.", 3], ["304", "Not Modified", "Deine Kopie im Cache ist noch aktuell.", 3],
  ["400", "Bad Request", "Anfrage fehlerhaft (falsches JSON, Pflichtfeld fehlt).", 4], ["401", "Unauthorized", "Nicht angemeldet / Token fehlt.", 4], ["403", "Forbidden", "Angemeldet, aber keine Berechtigung.", 4], ["404", "Not Found", "Gibt es nicht.", 4], ["429", "Too Many Requests", "Zu viele Anfragen (Rate Limit).", 4],
  ["500", "Internal Server Error", "Fehler im Servercode. Logs ansehen!", 5], ["503", "Service Unavailable", "Server überlastet oder in Wartung.", 5]
];

C.beParts = [
  { ico: "🖥️", n: "Laufzeit & Framework", s: "Node, Python, PHP …", d: "Code, der auf dem Server läuft und Anfragen beantwortet. Beliebt: <b>Node.js</b> mit Express/Fastify/Hono, <b>Python</b> mit FastAPI/Django, <b>PHP</b> mit Laravel, <b>Java</b> mit Spring, <b>C#</b> mit ASP.NET.", c: "// Node.js + Express\nimport express from \"express\";\nconst app = express();\napp.use(express.json());\napp.get(\"/api/produkte\", async (req, res) => {\n  res.json(await db.produkte.findMany());\n});\napp.listen(3000);" },
  { ico: "🧭", n: "Routing", s: "URL → Funktion", d: "Legt fest, welche Funktion bei welcher Methode + URL läuft. REST-Konvention: Ressourcen im Plural, Methoden als Verben.", c: "GET    /api/produkte      → Liste\nGET    /api/produkte/7    → eins\nPOST   /api/produkte      → anlegen\nPUT    /api/produkte/7    → ersetzen\nPATCH  /api/produkte/7    → teilweise ändern\nDELETE /api/produkte/7    → löschen" },
  { ico: "🗄️", n: "Datenbank", s: "SQL & NoSQL", d: "<b>Relationale</b> Datenbanken (PostgreSQL, MySQL, SQLite) speichern Tabellen mit Beziehungen, ideal für die meisten Projekte. <b>NoSQL</b> (MongoDB, Redis, Firestore) speichert Dokumente oder Schlüssel-Werte, flexibel, aber ohne feste Beziehungen.", c: "SELECT p.name, k.name AS kategorie\nFROM produkte p\nJOIN kategorien k ON k.id = p.kategorie_id\nWHERE p.preis < 100\nORDER BY p.preis;" },
  { ico: "🔗", n: "ORM", s: "Tabellen als Objekte", d: "Bibliotheken wie Prisma, Drizzle (JS) oder SQLAlchemy (Python) bilden Tabellen als Objekte ab, erzeugen Migrationen und schützen vor SQL-Injection.", c: "const guenstig = await prisma.produkt.findMany({\n  where: { preis: { lt: 100 } },\n  orderBy: { preis: \"asc\" }\n});" },
  { ico: "🔐", n: "Authentifizierung", s: "Wer bist du?", d: "Login prüfen. Passwörter <b>nie im Klartext</b>, sondern gehasht (argon2/bcrypt). Danach Sitzung per <b>Session-Cookie</b> (httpOnly, secure, sameSite) oder <b>Token</b> (JWT). Einfacher und sicherer: fertige Lösungen (Auth.js, Lucia-Muster, Supabase Auth, Keycloak) oder „Login mit Google/GitHub“ (OAuth).", c: "const hash = await argon2.hash(passwort);   // beim Registrieren\nconst ok = await argon2.verify(hash, eingabe); // beim Login" },
  { ico: "🛂", n: "Autorisierung", s: "Was darfst du?", d: "Nach dem Login: Darf diese Person <i>diese</i> Aktion auf <i>diesen</i> Daten? Rollen (admin, kunde) und Besitz prüfen, <b>immer auf dem Server</b>, nie nur im Frontend verstecken.", c: "if (bestellung.kundeId !== req.user.id && req.user.rolle !== \"admin\")\n  return res.status(403).json({ fehler: \"Keine Berechtigung\" });" },
  { ico: "✅", n: "Validierung", s: "Eingaben prüfen", d: "Jede Eingabe von außen ist verdächtig. Typen, Längen, Formate auf dem Server prüfen, z. B. mit Zod (JS) oder Pydantic (Python). Frontend-Prüfung ist nur Komfort.", c: "const Produkt = z.object({\n  name: z.string().min(1).max(100),\n  preis: z.number().positive()\n});\nconst daten = Produkt.parse(req.body); // wirft 400 bei Fehler" },
  { ico: "🔑", n: "Konfiguration & Geheimnisse", s: ".env", d: "Datenbank-Passwort, API-Schlüssel usw. stehen in Umgebungsvariablen (<code>.env</code> lokal, im Hosting-Dashboard online), <b>nie</b> im Code oder Git.", c: "# .env (in .gitignore!)\nDATABASE_URL=postgres://user:pw@host/db\nSTRIPE_SECRET_KEY=sk_live_…\n\n// im Code\nconst url = process.env.DATABASE_URL;" },
  { ico: "⚡", n: "Caching", s: "schneller & günstiger", d: "Ergebnisse zwischenspeichern: im Browser (Cache-Header), im CDN, im Server (Redis). Größter Hebel für Geschwindigkeit, aber: Wann wird der Cache ungültig?", c: "Cache-Control: public, max-age=31536000, immutable  // Bilder, JS mit Hash im Namen\nCache-Control: no-cache                              // HTML" },
  { ico: "📬", n: "Hintergrundjobs & E-Mail", s: "Queues", d: "Langsame Aufgaben (E-Mails, PDF, Bildbearbeitung) nicht in der Anfrage erledigen, sondern in eine Warteschlange legen. E-Mails über Dienste wie Postmark, Brevo oder Amazon SES senden, sonst landen sie im Spam.", c: "await queue.add(\"bestellbestaetigung\", { bestellungId: 42 });" },
  { ico: "🗂️", n: "Dateispeicher", s: "Uploads", d: "Hochgeladene Dateien nicht auf die Server-Festplatte, sondern in Objektspeicher (S3-kompatibel: AWS, Cloudflare R2, Hetzner Object Storage). Dateityp und Größe prüfen!", c: "" },
  { ico: "🧱", n: "Backend as a Service", s: "Supabase, Firebase …", d: "Fertiges Backend mit Datenbank, Auth, Speicher und API per Klick. Schneller Start, weniger Wartung; dafür Abhängigkeit vom Anbieter. <b>Supabase</b> basiert auf PostgreSQL und ist auch selbst hostbar.", c: "const { data } = await supabase.from(\"produkte\").select(\"*\").lt(\"preis\", 100);" }
];

/* ---------- Werkzeuge ---------- */
C.tools = [
  { t: "📝 VS Code", m: "ab Tag 1", d: "Kostenloser Editor. Sinnvolle Erweiterungen: Prettier (Formatierung), ESLint, Live Server, GitLens, Error Lens. Tastenkürzel lernen: <code>Strg+P</code> Datei öffnen, <code>Strg+Umschalt+P</code> Befehle, <code>Alt+↑/↓</code> Zeile verschieben." },
  { t: "🔍 Browser-DevTools (F12)", m: "ab Tag 1", d: "<b>Elemente</b>: HTML/CSS live ändern. <b>Konsole</b>: Fehler & Ausgaben. <b>Netzwerk</b>: alle Anfragen. <b>Application</b>: Cookies, Speicher. <b>Lighthouse</b>: Qualität messen. Geräte-Modus (<code>Strg+Umschalt+M</code>) für Handy-Ansicht." },
  { t: "⌨️ Terminal", m: "ab Stufe 2", d: "Befehle statt Klicks: <code>cd</code>, <code>ls</code>/<code>dir</code>, <code>mkdir</code>, Programme starten. Unter Windows: Terminal mit PowerShell oder Git Bash. Viele Werkzeuge gibt es nur hier." },
  { t: "🌿 Git & GitHub", m: "ab Stufe 2", d: "Versionsverwaltung und Zusammenarbeit. Siehe die <a href=\"../Git_Werkstatt/index.html\">Git-Werkstatt</a>." },
  { t: "📦 Node.js & npm", m: "ab Stufe 3/4", d: "Node führt JavaScript außerhalb des Browsers aus; npm installiert Pakete. <code>package.json</code> listet Abhängigkeiten und Skripte (<code>npm run dev</code>). Alternativen: pnpm, Bun." },
  { t: "⚡ Vite", m: "ab Stufe 4", d: "Startet Projekte in Sekunden mit Live-Reload und baut optimierte Dateien für die Veröffentlichung: <code>npm create vite@latest</code>." },
  { t: "🧹 Prettier & ESLint", m: "ab Stufe 3", d: "Prettier formatiert automatisch einheitlich; ESLint findet Fehler und schlechte Muster, bevor sie Probleme machen." },
  { t: "🟦 TypeScript", m: "ab Stufe 4", d: "JavaScript mit Typen. Im Job heute Standard. Fehler wie „undefined is not a function“ fallen schon im Editor auf." },
  { t: "🎨 Figma", m: "ab Stufe 2", d: "Design-Werkzeug. Entwürfe lesen (Abstände, Farben, Schriften) gehört zum Job; Grundlagen von Layout, Typografie und Farbe helfen enorm." },
  { t: "🐳 Docker", m: "ab Stufe 5/6", d: "Verpackt App + Umgebung in Container. „Läuft bei mir“ gilt dann überall: lokal, im Team, auf dem Server." },
  { t: "📮 API-Clients", m: "ab Stufe 5", d: "Bruno, Insomnia oder Postman zum Testen von APIs, oder die REST-Client-Erweiterung in VS Code." },
  { t: "🤖 KI-Assistenten", m: "mit Bedacht", d: "Beschleunigen Routinearbeit enorm. Aber: Du musst den Code verstehen und prüfen können. Gerade beim Lernen erst selbst versuchen, dann vergleichen. Keine Geheimnisse oder Kundendaten hineinkopieren." }
];
C.fwTable = {
  h: ["Name", "Art", "Lernkurve", "Stärken", "Typisch für"],
  r: [
    ["React", "UI-Bibliothek", "mittel", "Größtes Ökosystem, die meisten Jobs", "Web-Apps, mit Next.js auch Websites"],
    ["Vue", "UI-Framework", "flach", "Einsteigerfreundlich, gute Doku (auch DE-Community)", "Web-Apps, Dashboards"],
    ["Svelte", "UI-Compiler", "flach", "Wenig Code, sehr schnell", "Apps & interaktive Seiten"],
    ["Angular", "Komplett-Framework", "steil", "Struktur für große Teams, TypeScript-first", "Enterprise-Anwendungen"],
    ["Next.js / Nuxt / SvelteKit", "Meta-Framework", "mittel", "Routing, SSR/SSG, API-Routen inklusive", "Full-Stack-Websites & Apps"],
    ["Astro", "Content-Framework", "flach", "Standardmäßig null JavaScript, super für SEO", "Blogs, Firmenseiten, Doku"],
    ["WordPress", "CMS (PHP)", "flach (Nutzung) / mittel (Entwicklung)", "Kunden pflegen selbst, riesige Plugin-Auswahl", "Firmen-, Vereins- und Blogseiten"],
    ["Laravel / Django", "Backend-Framework", "mittel", "Alles dabei: ORM, Auth, Admin, Mails", "Klassische Web-Anwendungen"]
  ]
};
C.stacks = {
  "Eigenes Portfolio": "<b>HTML/CSS/JS</b> oder <b>Astro</b> → Hosting kostenlos auf <b>GitHub Pages</b>, Netlify oder Cloudflare Pages, eigene Domain ca. 10 €/Jahr. Warum: schnell, sicher, keine Serverwartung, zeigt dein Können direkt im Code.",
  "Firmenseite für Kunden ohne Technik": "<b>WordPress</b> (mit schlankem Theme, z. B. Block-Theme) bei einem deutschen Hoster, <b>oder</b> Astro + Headless-CMS (z. B. Decap, Storyblok), wenn du Performance willst. Wichtig: Kunde muss Texte selbst ändern können; Wartungsvertrag anbieten.",
  "Blog / Magazin": "<b>Astro</b> oder <b>Hugo</b> mit Markdown-Dateien (kostenlos hostbar) oder <b>WordPress</b>/<b>Ghost</b>, wenn mehrere Autoren im Browser schreiben sollen.",
  "Online-Shop": "Bis ~ mittlere Größe: <b>Shopify</b> (schnellster Start) oder <b>WooCommerce</b>/<b>Shopware</b> (mehr Kontrolle, DE-Rechtstexte-Plugins). Nur digitale Produkte: Stripe Payment Links, Lemon Squeezy, Digistore24. Eigenentwicklung erst, wenn diese nicht reichen.",
  "SaaS / Web-App mit Login": "<b>Next.js</b> oder <b>SvelteKit</b> + <b>PostgreSQL</b> (z. B. via Supabase/Neon) + Auth-Lösung + Stripe für Abos. Hosting: Vercel/Netlify (Achtung: Hobby-Pläne oft nicht kommerziell) oder Docker auf einem EU-VPS/PaaS.",
  "Internes Dashboard": "<b>React/Vue + Vite</b> als SPA, Backend mit FastAPI/Express oder direkt <b>Supabase</b>. Login über Firmen-Account (OAuth/Entra ID). Hosting intern oder EU-PaaS."
};

/* ---------- Hosting ---------- */
C.hostTable = {
  h: ["Art", "Was ist das?", "Kosten (ca.)", "Aufwand", "Gut für"],
  r: [
    ["Statisches Hosting", "Lädt fertige Dateien aus; CDN und HTTPS inklusive. GitHub Pages, Netlify, Cloudflare Pages", "0 € (Freikontingent)", "sehr gering", "Portfolio, Landingpage, Doku, Astro/Hugo-Seiten"],
    ["Website-Baukasten", "Seiten per Drag & Drop, Hosting inklusive. Wix, Squarespace, Jimdo, Webflow", "10–40 €/Monat", "sehr gering, aber wenig Kontrolle", "Kleine Firmen ohne Entwickler"],
    ["Webhosting (Shared)", "Speicherplatz mit PHP + MySQL bei einem Hoster, z. B. all-inkl, IONOS, Strato, netcup, Hostinger", "2–15 €/Monat", "gering", "WordPress, klassische PHP-Seiten"],
    ["Managed WordPress / Shop", "Hoster kümmert sich um Updates, Backups, Caching. Z. B. Raidboxes; Shopify für Shops", "15–80 €/Monat", "gering", "Kundenprojekte mit WordPress, Shops"],
    ["PaaS / Serverless", "Code hochladen, Plattform betreibt ihn: Vercel, Netlify Functions, Render, Railway, Fly.io; EU: Scalingo, Clever Cloud", "0–25 €/Monat Start", "mittel", "Web-Apps, APIs, Next.js"],
    ["Backend as a Service", "Datenbank + Auth + Speicher als Dienst: Supabase, Firebase, Appwrite", "0–25 €/Monat Start", "gering bis mittel", "Apps ohne eigenes Backend"],
    ["VPS / Root-Server", "Eigener (virtueller) Linux-Server, z. B. Hetzner, netcup, Contabo", "4–20 €/Monat", "hoch (du bist Admin: Updates, Firewall, Backups)", "Volle Kontrolle, mehrere Projekte, Docker"],
    ["Cloud (AWS, Azure, GCP)", "Baukasten aus hunderten Diensten, beliebig skalierbar", "variabel, Kostenfallen möglich", "hoch", "Große Systeme, Firmen mit Cloud-Strategie"]
  ]
};
C.wizardQ = [
  { k: "art", q: "Was willst du veröffentlichen?", o: [["static", "Portfolio / Firmenseite / Doku (ohne Login)"], ["cms", "Seite, die andere ohne Code pflegen (Blog, Verein, Kunde)"], ["shop", "Online-Shop"], ["app", "Web-App mit Login und Datenbank"]] },
  { k: "skill", q: "Wie technisch bist du (bzw. wer betreut es)?", o: [["none", "Keine Programmierkenntnisse"], ["mid", "Git, HTML/CSS/JS sicher"], ["pro", "Linux, Docker, Server-Admin"]] },
  { k: "budget", q: "Budget pro Monat?", o: [["0", "0 €"], ["10", "bis 10 €"], ["50", "bis 50 €"], ["more", "mehr"]] },
  { k: "eu", q: "Muss das Hosting in der EU sein (DSGVO, Kundenwunsch)?", o: [["yes", "Ja, wichtig"], ["no", "Nicht entscheidend"]] }
];
C.hostOptions = [
  { n: "GitHub Pages", for: ["static"], skill: ["mid", "pro"], cost: 0, eu: false, c: "kostenlos", pro: "Direkt aus dem Git-Repo, HTTPS inklusive, eigene Domain möglich", con: "Nur statisch; Repo muss im Free-Plan öffentlich sein; US-Anbieter" },
  { n: "Cloudflare Pages / Netlify", for: ["static", "app"], skill: ["mid", "pro"], cost: 0, eu: false, c: "kostenlos bis Freikontingent", pro: "Automatisches Deployment bei git push, Vorschau-Links, Serverless-Funktionen", con: "US-Anbieter (EU-Datenverarbeitung vertraglich möglich, AVV prüfen)" },
  { n: "Webhosting bei deutschem Anbieter (z. B. all-inkl, netcup, IONOS)", for: ["static", "cms"], skill: ["none", "mid", "pro"], cost: 5, eu: true, c: "ca. 3–10 €/Monat inkl. Domain", pro: "Rechenzentrum in DE, WordPress per Klick, E-Mail-Postfächer inklusive", con: "Updates & Sicherheit von WordPress bleiben deine Aufgabe" },
  { n: "Managed WordPress (z. B. Raidboxes)", for: ["cms", "shop"], skill: ["none", "mid"], cost: 25, eu: true, c: "ca. 15–40 €/Monat", pro: "Automatische Updates, Backups, schnelles Caching, DE-Support", con: "Teurer als einfaches Webhosting" },
  { n: "Website-Baukasten (z. B. Jimdo, Wix, Squarespace)", for: ["static", "cms", "shop"], skill: ["none"], cost: 15, eu: false, c: "ca. 10–40 €/Monat", pro: "Ohne Code, alles aus einer Hand (Jimdo: Server in DE/EU)", con: "Wenig Gestaltungsfreiheit, Umzug später schwierig" },
  { n: "Shopify", for: ["shop"], skill: ["none", "mid"], cost: 35, eu: false, c: "ab ca. 30 €/Monat + Transaktionsgebühren", pro: "Schnellster Weg zum professionellen Shop, Zahlungen, Apps", con: "Laufende Kosten, US-Anbieter, Rechtstexte selbst sicherstellen" },
  { n: "WooCommerce / Shopware auf Managed Hosting", for: ["shop"], skill: ["mid", "pro"], cost: 30, eu: true, c: "ca. 20–60 €/Monat Hosting + Plugins", pro: "Volle Kontrolle, Hosting in DE, Plugins für deutsche Rechtstexte", con: "Mehr Pflegeaufwand, Plugin-Kosten" },
  { n: "Vercel", for: ["static", "app"], skill: ["mid", "pro"], cost: 0, eu: false, c: "Hobby kostenlos (nur nicht-kommerziell), Pro ca. 20 $/Monat", pro: "Ideal für Next.js, Vorschau pro Branch, extrem einfach", con: "Hobby-Plan nicht für kommerzielle Projekte; Kosten können bei viel Traffic steigen" },
  { n: "Supabase (+ statisches Frontend)", for: ["app"], skill: ["mid", "pro"], cost: 0, eu: true, c: "kostenlos zum Start, Pro ca. 25 $/Monat", pro: "PostgreSQL, Auth, Speicher, Region Frankfurt wählbar", con: "Free-Projekte pausieren bei Inaktivität" },
  { n: "EU-PaaS (z. B. Scalingo, Clever Cloud)", for: ["app"], skill: ["mid", "pro"], cost: 15, eu: true, c: "ca. 10–30 €/Monat", pro: "Wie Heroku, aber Rechenzentren in der EU; Datenbanken dazubuchbar", con: "Weniger bekannt, kleinere Community" },
  { n: "VPS bei Hetzner / netcup + Docker", for: ["static", "cms", "shop", "app"], skill: ["pro"], cost: 6, eu: true, c: "ca. 4–15 €/Monat", pro: "Sehr günstig, volle Kontrolle, beliebig viele Projekte", con: "Du bist für Sicherheit, Updates, Backups und Monitoring verantwortlich" }
];
C.dnsQuiz = [
  { q: "Deine Domain <code>example.de</code> soll auf deinen Server mit der IPv4-Adresse <code>85.13.140.12</code> zeigen.", a: "A", e: "Der <b>A</b>-Eintrag verknüpft einen Namen mit einer IPv4-Adresse." },
  { q: "<code>www.example.de</code> soll auf deine GitHub-Pages-Seite <code>meinname.github.io</code> zeigen.", a: "CNAME", e: "<b>CNAME</b> = Alias auf einen anderen <i>Namen</i>. Ändert GitHub seine IPs, musst du nichts tun." },
  { q: "E-Mails an <code>info@example.de</code> sollen beim Mail-Anbieter ankommen.", a: "MX", e: "<b>MX</b> (Mail Exchanger) sagt, welcher Server E-Mails für die Domain annimmt." },
  { q: "Die Google Search Console will, dass du den Besitz der Domain mit einem Code nachweist.", a: "TXT", e: "<b>TXT</b>-Einträge enthalten beliebigen Text, z. B. Bestätigungscodes, SPF, DKIM, DMARC." },
  { q: "Du willst festlegen, welche Server E-Mails im Namen deiner Domain senden dürfen (SPF, gegen Spam/Fälschung).", a: "TXT", e: "SPF steht als <b>TXT</b>-Eintrag: <code>v=spf1 include:_spf.anbieter.de ~all</code>." },
  { q: "Dein Server hat zusätzlich eine IPv6-Adresse <code>2a01:4f8::1</code>.", a: "AAAA", e: "<b>AAAA</b> ist das IPv6-Gegenstück zum A-Eintrag." },
  { q: "Du willst die komplette DNS-Verwaltung deiner Domain zu Cloudflare umziehen.", a: "NS", e: "Beim Registrar trägst du die <b>NS</b>-Einträge (Nameserver) von Cloudflare ein; danach verwaltest du alle anderen Einträge dort." }
];
C.dnsTypes = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"];
C.deploySteps = [
  ["Lokal entwickeln", "mit <code>npm run dev</code> und Live-Vorschau"],
  ["Commit & Push", "auf einen Feature-Branch"],
  ["CI prüft automatisch", "Tests, Linting, Build (z. B. GitHub Actions)"],
  ["Vorschau-Deployment", "eigene URL pro Branch zum Testen & Zeigen"],
  ["Review & Merge", "Pull Request in main"],
  ["Produktion", "main wird automatisch live geschaltet"],
  ["Überwachen", "Fehler-Tracking, Uptime; bei Problemen Rollback auf die vorige Version"]
];
C.launch = [
  { g: "Inhalt & Recht", i: ["Impressum vorhanden und von jeder Seite erreichbar", "Datenschutzerklärung passend zu den tatsächlich genutzten Diensten", "Cookie-Einwilligung nur, wenn nicht notwendige Cookies/Tracker genutzt werden (sonst weglassen)", "Bildrechte und Schriftlizenzen geklärt", "Keine Platzhaltertexte (Lorem ipsum) mehr"] },
  { g: "Technik", i: ["HTTPS aktiv, http leitet auf https um (301)", "www und ohne www leiten auf eine Variante um", "Eigene 404-Seite", "Formulare getestet (kommen E-Mails an? Spam-Schutz?)", "Auf Handy, Tablet, Desktop und in mehreren Browsern geprüft", "Favicon und Seitentitel gesetzt"] },
  { g: "SEO", i: ["Jede Seite: eigener <title> und meta description", "Eine h1 pro Seite, sinnvolle Überschriften-Hierarchie", "sitemap.xml und robots.txt", "Open-Graph-Bild/Texte für Social Media", "Seite in der Google Search Console angemeldet"] },
  { g: "Performance", i: ["Bilder komprimiert, modernes Format (WebP/AVIF), passende Größe", "Lighthouse Performance ≥ 90 (mobil)", "Schriften lokal eingebunden (nicht von Google-Servern, DSGVO!)", "Caching-Header gesetzt"] },
  { g: "Sicherheit", i: ["Alle Passwörter stark, 2FA bei Hoster, Registrar, GitHub", "Software/Plugins aktuell, nicht genutzte entfernt", "Sicherheits-Header (CSP, HSTS, X-Content-Type-Options)", "Keine Geheimnisse im Frontend-Code oder Git"] },
  { g: "Barrierefreiheit", i: ["Alle Bilder mit alt-Text", "Komplett per Tastatur bedienbar, Fokus sichtbar", "Farbkontrast ausreichend (WCAG AA)", "Formularfelder mit Labels"] },
  { g: "Betrieb", i: ["Automatische Backups eingerichtet und Wiederherstellung getestet", "Uptime-Monitoring mit Benachrichtigung", "Domain auf automatische Verlängerung", "Zugangsdaten sicher dokumentiert (Passwortmanager)", "Datenschutzfreundliche Statistik (z. B. Plausible, Matomo) statt unnötigem Tracking"] }
];
C.ops = [
  { t: "🔄 Updates", d: "CMS, Plugins, Pakete (<code>npm outdated</code>), Server-Betriebssystem. Sicherheitsupdates zeitnah, große Updates zuerst auf einer Testkopie (Staging). Tools wie Dependabot erstellen automatisch Update-PRs." },
  { t: "💾 Backups (3-2-1-Regel)", d: "3 Kopien, 2 verschiedene Medien, 1 außer Haus. Datenbank <b>und</b> Dateien sichern. Ein Backup, dessen Wiederherstellung nie getestet wurde, ist keins." },
  { t: "📈 Monitoring", d: "Uptime-Prüfung (z. B. UptimeRobot, Better Stack), Fehler-Tracking (z. B. Sentry), Server-Last. Benachrichtigung per Mail/App, bevor Kunden anrufen." },
  { t: "🧾 Logs", d: "Zugriffs- und Fehlerprotokolle helfen bei der Fehlersuche. Personenbezogene Daten (IP) nur so lange wie nötig speichern (DSGVO)." },
  { t: "🛡️ Sicherheit", d: "2FA überall, minimale Rechte, Firewall (VPS), Brute-Force-Schutz, regelmäßige Prüfung mit Tools wie Mozilla Observatory oder securityheaders.com." },
  { t: "💶 Kosten", d: "Alle Abos und Verlängerungsdaten in einer Liste. Budget-Warnungen bei Cloud-Anbietern einschalten. Testphasen enden automatisch kostenpflichtig!" }
];
