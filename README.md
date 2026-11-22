# Web-Werkstatt 3.0

**Der interaktive Lernpfad zur professionellen Webentwicklung.** Webseiten bauen, veröffentlichen, betreiben und verkaufen: von 0 bis zur Bewerbung als Webentwicklerin.

Konzept, Inhalte & Umsetzung: **Ibtissam Hommada** · © 2026

Läuft komplett im Browser (`index.html` doppelklicken), ohne Installation, Server oder Anmeldung. Der Fortschritt bleibt lokal; beim ersten Start wird ein vorhandener Fortschritt aus Version 2.0 automatisch übernommen.

## Neu in Version 3.0

| Bereich | Was ist neu |
|---|---|
| Seitenaufbau | App-Layout mit gruppierter Seitenleiste (Start · Verstehen · Üben · Veröffentlichen & Beruf · Festigen · Nachschlagen), Seitenköpfe mit Brotkrumen und Metadaten, Vor/Zurück-Navigation auf jeder Seite |
| Startseite | Hero mit „Weiterlernen“, 8 Fortschritts-Kennzahlen, visuelle 9-Stufen-Roadmap, persönliche Empfehlungen, Begriff des Tages, Übersicht aller Bereiche |
| Design-System | Neue Typografie, Abstände, Karten, Fortschrittsring, vollständiger **Dunkelmodus**, mobiles Menü (Off-Canvas), Druckansicht |
| Globale Suche | `Strg+K`: durchsucht Lektionen, Glossar, Spickzettel, Backend, Recht, Profi-Wissen, Werkzeuge, SQL-Aufgaben, Git-Missionen; Tastatursteuerung, Treffer-Hervorhebung |
| 🌿 Git-Labor | Simuliertes Git mit **12 Missionen** (init → push → .env schützen → pull → Branch & Merge) und Live-Ansicht von Arbeitsordner, Staging, Repo und GitHub |
| 🃏 Lernkarten | **168 Karten** (Glossar + Fragenpool) mit **Leitner-System** (5 Fächer, 1/3/7/16 Tage), Stapel nach Themen, Tastatur (Leertaste, 1, 2) |
| Datensicherung | Fortschritt als Datei sichern und auf einem anderen Gerät laden (Über & Daten) |
| Barrierefreiheit | Skip-Link, `aria-current` in der Navigation, sichtbarer Fokus, Tastaturbedienung überall |

## Gesamtumfang

72 Lektionen (56 + 16 Projekt-Etappen) · 20 SQL-Aufgaben · 12 Git-Missionen · 12 Server-Missionen · 8 API-Aufgaben · 4 DNS-Szenarien + 7 DNS-Übungen · 168 Lernkarten · 120 Quizfragen · Prüfung mit Zertifikat · 48 Glossarbegriffe · 8 Spickzettel · Karriere-Bereich · 2 Business-Rechner

## Qualitätssicherung

Automatisierter Gesamttest in Edge (headless): 72/72 Lektionen, 20/20 SQL, 12/12 Server, 12/12 Git, 4/4 DNS, Prüfung, Zertifikat, Suche, Lernkarten, Migration aus Version 2.0, keine JavaScript-Fehler.

## Struktur

| Datei | Inhalt |
|---|---|
| `js/config.js` | Signatur, Titel, Version |
| `js/content-*.js` | Inhalte |
| `js/app.js` | Kern (Navigation, Labor, Rechner, Quiz, Fortschritt; Schnittstelle `window.WW`, Ereignis `ww:show`) |
| `js/mod-*.js` | Module: SQL, Server, DNS, Prüfung, Spickzettel/Karriere/Über, **Git, Lernkarten, Shell** (Startseite, Suche, Dunkelmodus, Datensicherung) |
| `js/vendor-gitsim.js` | Git-Simulator (aus der Git-Werkstatt) |
| `vendor/sqljs/` | sql.js (MIT-Lizenz) |
| `style.css`, `style-v2.css`, `css/v3.css` | Gestaltung; `v3.css` enthält das Design-System und das Dunkel-Thema |

**Hinweis:** Rechtliche/steuerliche Inhalte sind Orientierung (Stand 2025/26), keine Rechtsberatung. Das Zertifikat ist ein Lernnachweis ohne staatliche Anerkennung.
