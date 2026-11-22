/* So funktioniert das Web + Glossar */
C.reqSteps = [
  { on: ["browser"], l: [], lbl: "https://shop.example.de/produkte", t: "1 · Du tippst eine URL ein", d: "Die URL besteht aus <b>Protokoll</b> (<code>https</code>), <b>Domain</b> (<code>shop.example.de</code>) und <b>Pfad</b> (<code>/produkte</code>). Der Browser schaut zuerst in seinem Cache, ob er die Seite oder die IP-Adresse schon kennt." },
  { on: ["browser", "dns"], l: ["b-dns"], lbl: "Wo wohnt shop.example.de?", t: "2 · DNS-Abfrage", d: "Computer reden mit IP-Adressen (z. B. <code>93.184.216.34</code>), nicht mit Namen. Das <b>DNS</b> ist das Telefonbuch des Internets: Ein Resolver (meist vom Internetanbieter) fragt sich durch Root-, <code>.de</code>- und den zuständigen Nameserver und liefert den <b>A-Eintrag</b> (IPv4) oder <b>AAAA-Eintrag</b> (IPv6) zurück." },
  { on: ["browser", "cdn"], l: ["b-cdn"], lbl: "Verbindung + TLS-Handshake", t: "3 · Verbindung & Verschlüsselung", d: "Der Browser baut eine Verbindung zur IP auf (TCP bzw. bei HTTP/3 QUIC). Bei <b>HTTPS</b> folgt der TLS-Handshake: Der Server zeigt sein Zertifikat, der Browser prüft es, beide vereinbaren einen Schlüssel. Ab jetzt ist alles verschlüsselt. Oft antwortet hier zuerst ein <b>CDN</b>, ein Netz von Servern weltweit, das Kopien deiner Seite nahe beim Nutzer bereithält." },
  { on: ["cdn", "server"], l: ["b-cdn", "cdn-srv"], lbl: "GET /produkte HTTP/2", t: "4 · HTTP-Anfrage", d: "Der Browser schickt eine Anfrage: Methode <code>GET</code>, Pfad <code>/produkte</code>, Header wie <code>Accept-Language: de</code> und Cookies. Hat das CDN eine frische Kopie, antwortet es direkt; sonst leitet es zum eigentlichen <b>Server</b> (Origin) weiter." },
  { on: ["server", "db"], l: ["srv-db"], lbl: "SELECT * FROM produkte", t: "5 · Der Server arbeitet", d: "Bei einer <b>statischen</b> Seite liefert der Server einfach eine fertige HTML-Datei. Bei einer <b>dynamischen</b> Seite läuft Code (z. B. Node.js, PHP, Python), der die <b>Datenbank</b> abfragt und daraus HTML oder JSON erzeugt." },
  { on: ["server", "browser"], l: ["b-srv"], lbl: "200 OK + HTML", t: "6 · HTTP-Antwort", d: "Der Server antwortet mit einem <b>Statuscode</b> (<code>200 OK</code>, <code>404 Not Found</code>, <code>500</code> …), Headern (z. B. <code>Content-Type: text/html</code>, Cache-Regeln) und dem Inhalt." },
  { on: ["browser"], l: [], lbl: "DOM + CSSOM → Pixel", t: "7 · Der Browser rendert", d: "Der Browser liest das HTML und baut den <b>DOM</b>-Baum. Für jedes verlinkte CSS, Bild oder Skript schickt er weitere Anfragen. Dann berechnet er Layout und Stile und zeichnet die Seite. JavaScript kann den DOM danach jederzeit ändern. Genau das macht Seiten interaktiv. Mit <b>F12 → Netzwerk</b> siehst du alle Anfragen live." }
];

C.webConcepts = [
  { t: "🏷️ Domain", d: "Der Name deiner Seite, z. B. <code>meinshop.de</code>. Du mietest ihn jährlich bei einem Registrar (ca. 1–20 €/Jahr). Er zeigt per DNS auf dein Hosting." },
  { t: "🏠 Hosting", d: "Der Rechner bzw. Dienst, auf dem deine Dateien und Programme liegen und rund um die Uhr erreichbar sind. Von kostenlos (statisch) bis mehrere 100 €/Monat." },
  { t: "📄 Webseite vs. Web-App", d: "Eine <b>Webseite</b> zeigt vor allem Inhalte (Firma, Blog, Portfolio). Eine <b>Web-App</b> ist Software im Browser (Banking, Planer, Shop-Backend) mit Login und Daten." },
  { t: "🎨 Frontend", d: "Alles, was im Browser läuft: HTML (Struktur), CSS (Aussehen), JavaScript (Verhalten)." },
  { t: "⚙️ Backend", d: "Alles auf dem Server: Geschäftslogik, Datenbank, Logins, E-Mails, Bezahlung. Sprachen z. B. JavaScript (Node.js), Python, PHP, Java, C#, Go." },
  { t: "🔁 Full-Stack", d: "Wer Frontend und Backend beherrscht und eine Anwendung komplett bauen und veröffentlichen kann." },
  { t: "📦 Statisch", d: "Fertige Dateien werden 1:1 ausgeliefert. Schnell, sicher, oft kostenlos zu hosten (GitHub Pages, Netlify). Ideal für Portfolio, Doku, Landingpages." },
  { t: "🔄 Dynamisch", d: "Inhalt wird pro Anfrage auf dem Server erzeugt, z. B. mit Nutzerdaten. Nötig für Logins, Shops, Kommentare und Dashboards." },
  { t: "🧱 CMS", d: "Content-Management-System wie WordPress: Inhalte pflegen ohne Programmieren. Ca. 40 % aller Webseiten nutzen WordPress. Braucht aber regelmäßige Updates." }
];

C.renderTable = {
  h: ["Art", "Wie funktioniert es?", "Gut für", "Beispiele"],
  r: [
    ["Statisch (SSG)", "HTML wird einmal beim Bauen erzeugt und als Dateien ausgeliefert", "Blogs, Doku, Portfolios, Firmenseiten", "Reines HTML, Astro, Hugo, Eleventy"],
    ["Server-Rendering (SSR)", "Server erzeugt HTML bei jeder Anfrage", "Shops, personalisierte Seiten, SEO-wichtige Apps", "Next.js, Nuxt, SvelteKit, PHP/WordPress, Django"],
    ["Single-Page-App (SPA)", "Browser lädt eine leere Hülle + JavaScript, das alles rendert und Daten per API holt", "Dashboards, Tools hinter Login", "React, Vue, Svelte (mit Vite)"],
    ["Hybrid", "Pro Seite wählbar: statisch, SSR oder Client; nur nötige Teile interaktiv („Islands“)", "Die meisten modernen Projekte", "Next.js, Nuxt, Astro, SvelteKit"]
  ]
};

C.glossary = [
  ["API", "Schnittstelle, über die Programme miteinander reden, im Web meist HTTP + JSON."],
  ["Accessibility (a11y)", "Barrierefreiheit: Nutzbarkeit für alle, z. B. mit Screenreader oder nur Tastatur."],
  ["Backend", "Serverseitiger Teil einer Anwendung (Logik, Daten, Authentifizierung)."],
  ["Bundler / Build-Tool", "Fasst Quellcode, Module und Assets zu optimierten Dateien zusammen (z. B. Vite)."],
  ["Cache", "Zwischenspeicher, damit Daten nicht erneut geladen oder berechnet werden müssen."],
  ["CDN", "Content Delivery Network: weltweit verteilte Server, die Inhalte nahe beim Nutzer ausliefern."],
  ["CI/CD", "Continuous Integration/Deployment: Code wird bei jedem Push automatisch getestet und veröffentlicht."],
  ["CMS", "Content-Management-System zum Pflegen von Inhalten ohne Code (WordPress, Strapi …)."],
  ["CORS", "Browser-Regel, welche fremden Domains per JavaScript auf eine API zugreifen dürfen."],
  ["CSS", "Cascading Style Sheets: Sprache für das Aussehen von Webseiten."],
  ["Core Web Vitals", "Googles Kennzahlen für Nutzererlebnis: LCP (Laden), INP (Reaktion), CLS (Layout-Sprünge)."],
  ["Cookie", "Kleine Datei, die eine Seite im Browser speichert (Login, Einstellungen, Tracking)."],
  ["CSRF", "Angriff, bei dem eine fremde Seite eine Aktion im Namen eines eingeloggten Nutzers auslöst."],
  ["DNS", "Domain Name System: übersetzt Domainnamen in IP-Adressen."],
  ["DOM", "Document Object Model: Baumstruktur der Seite, die JavaScript lesen und ändern kann."],
  ["Deployment", "Das Veröffentlichen einer neuen Version auf dem Server."],
  ["Docker", "Verpackt eine Anwendung samt Umgebung in einen Container, der überall gleich läuft."],
  ["Domain", "Für Menschen lesbarer Name einer Website, z. B. example.de."],
  ["DSGVO", "Datenschutz-Grundverordnung der EU, regelt den Umgang mit personenbezogenen Daten."],
  ["Framework", "Grundgerüst mit Regeln und Bausteinen, auf dem man eine Anwendung baut (React, Django …)."],
  ["Frontend", "Alles, was im Browser des Nutzers läuft."],
  ["Git", "Versionsverwaltung für Code, siehe Git-Werkstatt."],
  ["Headless CMS", "CMS ohne eigenes Frontend, liefert Inhalte per API an beliebige Seiten/Apps."],
  ["HTML", "HyperText Markup Language: Struktur und Inhalt von Webseiten."],
  ["HTTP / HTTPS", "Protokoll für Anfragen und Antworten im Web; HTTPS ist die verschlüsselte Variante (TLS)."],
  ["IP-Adresse", "Numerische Adresse eines Rechners im Netz (IPv4 z. B. 93.184.216.34, IPv6 länger)."],
  ["JSON", "Textformat für Daten, z. B. {\"name\": \"Lea\"}; Standard bei APIs."],
  ["JWT", "JSON Web Token: signierter Ausweis, mit dem ein Client sich bei einer API ausweist."],
  ["Lighthouse", "In Chrome/Edge eingebautes Prüfwerkzeug für Performance, SEO, Barrierefreiheit."],
  ["localStorage", "Speicher im Browser für kleine Datenmengen, bleibt nach dem Schließen erhalten."],
  ["Media Query", "CSS-Regel, die nur unter Bedingungen gilt, z. B. bei schmalen Bildschirmen."],
  ["Node.js", "JavaScript-Laufzeit außerhalb des Browsers, z. B. für Server und Werkzeuge."],
  ["npm", "Paketmanager für JavaScript; installiert Bibliotheken aus der npm-Registry."],
  ["ORM", "Bibliothek, die Datenbanktabellen als Objekte im Code abbildet (Prisma, SQLAlchemy …)."],
  ["PaaS", "Platform as a Service: Du lädst Code hoch, der Anbieter kümmert sich um Server (Render, Railway …)."],
  ["Responsive Design", "Seite passt sich an jede Bildschirmgröße an."],
  ["REST", "Stil für APIs: Ressourcen unter URLs, bearbeitet mit HTTP-Methoden (GET, POST, PUT, DELETE)."],
  ["SEO", "Suchmaschinenoptimierung: Seite so bauen, dass sie in Google & Co. gut gefunden wird."],
  ["SPA", "Single-Page-Application: eine Seite, deren Inhalte JavaScript dynamisch austauscht."],
  ["SQL", "Abfragesprache für relationale Datenbanken (PostgreSQL, MySQL, SQLite)."],
  ["SQL-Injection", "Angriff, bei dem eingeschleuster SQL-Code die Datenbank manipuliert. Schutz: vorbereitete Abfragen."],
  ["SSR / SSG", "Server-Side Rendering (pro Anfrage) bzw. Static Site Generation (beim Bauen)."],
  ["TLS / SSL-Zertifikat", "Grundlage von HTTPS: beweist die Identität der Seite und verschlüsselt die Verbindung."],
  ["TypeScript", "JavaScript mit Typen; Fehler fallen schon beim Schreiben auf."],
  ["URL", "Vollständige Adresse einer Ressource: Protokoll, Domain, Pfad, ggf. Parameter."],
  ["VPS", "Virtual Private Server: eigener virtueller Server, volle Kontrolle, volle Verantwortung."],
  ["WCAG", "Internationale Richtlinien für barrierefreie Webinhalte."],
  ["XSS", "Cross-Site-Scripting: eingeschleustes JavaScript läuft im Browser anderer Nutzer."]
];
