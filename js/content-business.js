/* Verkaufen & Recht. Orientierung, keine Rechtsberatung (Stand 2025/26) */
C.bizModels = [
  { i: "🧑‍💻", t: "Websites für Kunden (Freelance/Agentur)", d: "Du baust Seiten im Auftrag, Festpreis oder nach Stunden.", ex: "Typisch: kleine Firmenseite 1.500–5.000 €, Shop 4.000–20.000 €+. Erfolgsfaktoren: klare Leistungsbeschreibung, Anzahlung (30–50 %), Abnahme, Portfolio mit echten Referenzen, Nische (z. B. „Websites für Physiotherapie-Praxen“)." },
  { i: "🔧", t: "Wartung & Hosting als Abo", d: "Monatliche Pauschale für Updates, Backups, Monitoring, kleine Änderungen.", ex: "Z. B. 30–150 €/Monat pro Kunde. Planbares Einkommen; 20 Kunden × 60 € = 1.200 €/Monat. Leistungen und Reaktionszeiten schriftlich festhalten." },
  { i: "🎨", t: "Templates, Themes & Plugins", d: "Einmal bauen, oft verkaufen (WordPress-Themes, Webflow/Framer-Templates, UI-Kits).", ex: "Vertrieb über ThemeForest, eigene Seite oder Marktplätze. Braucht Support und Updates, sonst schlechte Bewertungen." },
  { i: "☁️", t: "SaaS (Software als Abo)", d: "Eigene Web-App, die Kunden monatlich bezahlen.", ex: "Höchstes Potenzial, höchstes Risiko: Marketing, Support, Datenschutz, Verfügbarkeit. Start mit kleinem, echtem Problem einer Zielgruppe; Bezahlung per Stripe/Paddle." },
  { i: "📚", t: "Wissen verkaufen", d: "Kurse, E-Books, Workshops, Coaching.", ex: "Plattformen: eigene Seite + Digistore24/Lemon Squeezy/Gumroad, oder Udemy. Bei Kursen mit Lernerfolgskontrolle kann das Fernunterrichtsschutzgesetz (FernUSG) greifen. Prüfen!" },
  { i: "📣", t: "Content & Affiliate", d: "Reichweite (Blog, YouTube) finanziert sich über Werbung oder Provisionen.", ex: "Dauert lange, braucht Konstanz. Werbung kennzeichnen; Tracking nur mit Einwilligung." },
  { i: "🛒", t: "Eigener Online-Shop", d: "Physische oder digitale Produkte direkt verkaufen.", ex: "Technik ist der kleinere Teil. Rechtstexte, Zahlungsarten, Versand, Retouren und Marketing entscheiden. Digitale Produkte: Merchant-of-Record-Dienste übernehmen die EU-Umsatzsteuer." },
  { i: "🏢", t: "Festanstellung", d: "Frontend-, Backend- oder Full-Stack-Entwicklerin im Team.", ex: "Junior-Einstieg in DE grob 40.000–55.000 € brutto/Jahr, Senior deutlich mehr (stark abhängig von Region/Branche). Portfolio + GitHub + ein echtes Projekt schlagen Zertifikate." }
];

C.rateFields = [
  ["netto", "Gewünschtes Netto-Einkommen pro Monat (€)", 2500],
  ["kv", "Kranken- & Pflegeversicherung pro Monat (€)", 550, "Selbstständige zahlen den vollen Beitrag selbst"],
  ["rente", "Altersvorsorge pro Monat (€)", 400],
  ["kosten", "Betriebskosten pro Monat (€)", 300, "Software, Hardware, Büro, Haftpflicht, Steuerberatung …"],
  ["steuer", "Steuern auf den Gewinn (pauschal, %)", 25, "Grobe Annahme für Einkommensteuer + Soli; Steuerberatung fragen"],
  ["urlaub", "Urlaubstage pro Jahr", 30],
  ["krank", "Krankheits- & Feiertage pro Jahr", 20],
  ["weiter", "Weiterbildungstage pro Jahr", 10],
  ["std", "Arbeitsstunden pro Tag", 8],
  ["quote", "Davon abrechenbar (%)", 60, "Akquise, Buchhaltung, E-Mails sind nicht abrechenbar"]
];
C.quoteFeatures = [
  ["kontakt", "Kontaktformular mit Spam-Schutz", 3],
  ["cms", "Inhalte selbst pflegbar (CMS-Einrichtung + Einweisung)", 10],
  ["blog", "Blog/News-Bereich", 6],
  ["shop", "Shop-Grundfunktionen (bis 20 Produkte)", 30],
  ["mehrspr", "Zweite Sprache", 8],
  ["seo", "SEO-Grundlagen (Meta, Sitemap, Search Console)", 4],
  ["a11y", "Barrierefreiheits-Prüfung & Korrekturen", 6],
  ["recht", "Einbindung Rechtstexte & Cookie-Lösung", 2],
  ["texte", "Texterstellung (pro Seite 2 h)", 0]
];

C.legal = [
  { t: "Impressum", tag: "pflicht", b: "Pflicht für geschäftsmäßige Online-Angebote nach <b>§ 5 Digitale-Dienste-Gesetz (DDG)</b>, das seit Mai 2024 das TMG ersetzt. Geschäftsmäßig ist schnell erreicht (schon ein Portfolio zur Kundengewinnung). Inhalt u. a.: Name, ladungsfähige Anschrift (kein Postfach), schnelle Kontaktmöglichkeit (E-Mail + weiterer Weg), ggf. USt-IdNr., Registereintrag. Von jeder Seite mit max. 2 Klicks erreichbar. Bei journalistisch-redaktionellen Inhalten zusätzlich § 18 MStV (Verantwortliche Person)." },
  { t: "Datenschutzerklärung (DSGVO)", tag: "pflicht", b: "Praktisch immer nötig, da schon der Server IP-Adressen verarbeitet (Art. 13 DSGVO). Beschreibt: Verantwortliche, welche Daten, Zweck, Rechtsgrundlage, Speicherdauer, Empfänger (Hoster, Mail-Dienst …), Drittlandübermittlung, Rechte der Betroffenen. Muss zu den <b>tatsächlich eingesetzten</b> Diensten passen. Generatoren (z. B. eRecht24, Datenschutz-Generator.de) helfen." },
  { t: "Cookies & Einwilligung (TDDDG)", tag: "pflicht", b: "Nach <b>§ 25 TDDDG</b> (bis 2024: TTDSG) braucht das Speichern/Auslesen von Informationen auf dem Gerät eine <b>Einwilligung</b>, außer es ist unbedingt erforderlich (Warenkorb, Login, Sicherheit). Tracking, Marketing, eingebettete YouTube-Videos/Karten → Einwilligung vorher. „Ablehnen“ muss so einfach sein wie „Akzeptieren“. Bester Weg: möglichst ohne einwilligungspflichtige Dienste auskommen. Dann braucht man gar keinen Banner." },
  { t: "Auftragsverarbeitung (AVV)", tag: "pflicht", b: "Verarbeitet ein Dienstleister personenbezogene Daten in deinem Auftrag (Hoster, Newsletter-Tool, Analyse), brauchst du einen Vertrag nach <b>Art. 28 DSGVO</b>. Seriöse Anbieter stellen ihn im Kundenkonto bereit. Hostest du selbst für Kunden, bist <i>du</i> deren Auftragsverarbeiter." },
  { t: "US-Dienste & Google Fonts", tag: "oft", b: "Datenübermittlung in die USA ist seit 2023 über das <b>EU-US Data Privacy Framework</b> bei zertifizierten Firmen möglich, muss aber in der Datenschutzerklärung stehen. Klassische Abmahnfalle: Google Fonts dynamisch von Google-Servern laden (LG München, 2022). Schriften daher <b>lokal einbinden</b>." },
  { t: "Barrierefreiheit (BFSG)", tag: "oft", b: "Seit <b>28.06.2025</b> gilt das Barrierefreiheitsstärkungsgesetz u. a. für Dienstleistungen im elektronischen Geschäftsverkehr mit Verbrauchern, also z. B. Online-Shops und Buchungsstrecken. Ausgenommen sind Kleinstunternehmen als Dienstleister (unter 10 Beschäftigte <b>und</b> max. 2 Mio. € Umsatz/Bilanzsumme). Maßstab sind praktisch die WCAG 2.1 AA. Für Kundenprojekte ein Verkaufsargument und Haftungsthema." },
  { t: "Pflichten im Online-Shop", tag: "pflicht", b: "<ul><li>Widerrufsbelehrung + Muster-Widerrufsformular (Verbraucher, 14 Tage)</li><li>Bestellbutton eindeutig, z. B. „zahlungspflichtig bestellen“ (§ 312j BGB)</li><li>Preise inkl. USt, Versandkosten, ggf. Grundpreis (Preisangabenverordnung)</li><li>Physische Waren mit Verpackung: Registrierung im Verpackungsregister LUCID</li><li>AGB nicht Pflicht, aber üblich</li><li>Link zur EU-Streitschlichtungsplattform (OS) ist seit deren Einstellung am 20.07.2025 nicht mehr nötig; alte Hinweise entfernen</li></ul>Rechtstexte am besten von spezialisierten Anbietern mit Update-Service (z. B. IT-Recht Kanzlei, Händlerbund, Trusted Shops)." },
  { t: "Gewerbe oder freier Beruf?", tag: "info", b: "Webdesign wird meist als <b>Gewerbe</b> eingestuft → Gewerbeanmeldung beim Gewerbeamt (ca. 20–60 €), danach meldet sich das Finanzamt. Reine Softwareentwicklung kann je nach Tätigkeit und Qualifikation als <b>freiberuflich</b> gelten (keine Gewerbesteuer). Die Einordnung entscheidet das Finanzamt anhand des „Fragebogens zur steuerlichen Erfassung“ (über ELSTER). Bei Unsicherheit: Steuerberatung." },
  { t: "Umsatzsteuer & Kleinunternehmerregelung", tag: "info", b: "Nach <b>§ 19 UStG</b> (Stand 2025) kannst du auf Umsatzsteuer verzichten, wenn der Umsatz im <b>Vorjahr ≤ 25.000 €</b> war und im <b>laufenden Jahr 100.000 €</b> nicht überschreitet. Dann kein Umsatzsteuerausweis auf Rechnungen (mit Hinweis auf § 19 UStG), aber auch kein Vorsteuerabzug. Gegenüber Firmenkunden ist Regelbesteuerung oft kein Nachteil. Gewerbesteuer fällt für Personenunternehmen erst über 24.500 € Gewinn an (Freibetrag)." },
  { t: "Verträge mit Kunden", tag: "oft", b: "<ul><li><b>Leistungsbeschreibung</b>: Seitenanzahl, Funktionen, Korrekturschleifen, was <i>nicht</i> enthalten ist</li><li>Meist <b>Werkvertrag</b> (Erfolg geschuldet, Abnahme) vs. <b>Dienstvertrag</b> (Tätigkeit nach Stunden)</li><li><b>Nutzungsrechte</b> am Code/Design klar regeln (Urheberrecht bleibt bei dir)</li><li>Zahlungsplan (Anzahlung), Mitwirkungspflichten (Texte, Bilder bis Datum X)</li><li>Haftung begrenzen; Rechtstexte liefert der Kunde bzw. sein Anwalt</li></ul>" },
  { t: "Versicherung & Risiken", tag: "info", b: "Eine <b>IT-/Vermögensschadenhaftpflicht</b> deckt z. B. Schäden durch Fehler in deinem Code oder Datenverlust beim Kunden. Bei nur einem Hauptauftraggeber droht <b>Scheinselbstständigkeit</b> → mehrere Kunden, eigene Arbeitsmittel, unternehmerisches Auftreten." }
];

C.shopTable = {
  h: ["Lösung", "Für", "Kosten (ca.)", "Vorteile", "Nachteile"],
  r: [
    ["Shopify", "Physische & digitale Produkte, schneller Start", "ab ~30 €/Monat + Gebühren", "Sehr einfach, stabil, viele Apps", "Laufende Kosten, Abhängigkeit, US-Anbieter"],
    ["WooCommerce (WordPress)", "Wer WordPress kennt", "Hosting + Plugins", "Kostenlos im Kern, riesiges Ökosystem, DE-Plugins (Germanized/German Market)", "Pflegeaufwand, Performance braucht Know-how"],
    ["Shopware", "Mittelstand, DE-Markt", "Community Edition kostenlos, Hosting", "Aus Deutschland, B2B-stark, rechtliche Anforderungen im Blick", "Komplexer, Entwickler nötig"],
    ["Stripe Payment Links / Checkout", "Einzelne Produkte, Dienstleistungen, Abos", "nur Gebühren pro Zahlung", "In Minuten startklar, kein Shop nötig", "Keine Shop-Funktionen, Rechnungen/Steuern selbst"],
    ["Digistore24 / Lemon Squeezy / Paddle", "Digitale Produkte, Software, Kurse", "% vom Umsatz", "Merchant of Record: übernimmt Umsatzsteuer weltweit & Rechnungen", "Höhere Gebühren"],
    ["Marktplätze (Etsy, Amazon, eBay)", "Reichweite ohne eigene Besucher", "Gebühren + Provision", "Kunden sind schon da", "Wenig Kontrolle, starker Preiskampf"],
    ["Eigenentwicklung + Stripe", "Besondere Anforderungen, SaaS", "Entwicklungszeit", "Volle Freiheit", "Teuer, Sicherheit & Recht komplett selbst"]
  ]
};
