# AS Reinigungsservice – Website

Website für **AS Reinigungsservice Daniel Bongartz**, Bottrop.
Gebaut mit [Vite](https://vitejs.dev) und Vanilla JavaScript, ohne Framework und ohne externe Dienste.

## Starten

```bash
npm install
npm run dev       # Entwicklungsserver auf http://localhost:5173
npm run build     # Produktions-Build nach dist/
npm run preview   # Build lokal ansehen
```

Für die Veröffentlichung den Inhalt von `dist/` auf einen beliebigen Webspace hochladen
(z. B. Netlify, Vercel, IONOS, Strato).

## Struktur

```
index.html            Startseite
impressum.html        Impressum (Vorlage)
datenschutz.html      Datenschutzerklärung (Vorlage)
public/logo.png       Logo (Navigation, Footer, Favicon)
src/main.js           Einstieg Startseite
src/legal.js          Einstieg Rechtsseiten
src/js/config.js      Unternehmensdaten, Öffnungszeiten, Bewertungen  ← hier pflegen
src/js/sections.js    Navigation, Öffnungszeiten, Bewertungs-Laufband, Formular
src/js/effects.js     Parallax, Scroll-Animationen, Fenster-Wisch-Effekt
src/js/scroll.js      Gemeinsamer Scroll-Loop (requestAnimationFrame)
src/styles/main.css   Alle Styles (Farben als CSS-Variablen in :root)
```

## Inhalte pflegen

Alles in **`src/js/config.js`**:

- **Öffnungszeiten:** Der aktuelle Wochentag wird automatisch hervorgehoben (Zeitzone Europe/Berlin).
- **Bewertungen:** Einfach Einträge ergänzen. Das Laufband dupliziert sie automatisch, sodass kein Anfang und kein Ende zu sehen ist.
- **Telefon / WhatsApp / Adresse:** Werden überall auf der Seite eingesetzt.

Bei geänderten Öffnungszeiten auch den JSON-LD-Block in `index.html` (`openingHoursSpecification`) anpassen, er ist für Google.

## Vor dem Livegang

- [ ] Impressum: E-Mail-Adresse und USt-IdNr. bzw. Hinweis auf Kleinunternehmerregelung ergänzen (gelb markiert)
- [ ] Datenschutz: Hosting-Anbieter und E-Mail ergänzen
- [ ] Prüfen, ob die Nummer 0155 62644577 WhatsApp nutzt (das Anfrageformular sendet per WhatsApp)
- [ ] Logo in höherer Auflösung (mind. 512 × 512 px oder SVG) unter `public/logo.png` ablegen; das aktuelle hat nur 72 × 72 px
- [ ] Rechtstexte prüfen lassen

## Farben

| Token        | Wert      |
| ------------ | --------- |
| `--blue`     | `#2596be` |
| `--green`    | `#7ed23f` |
| `--blue-ink` | `#17739a` (Text auf Weiß, besserer Kontrast) |
| `--green-ink`| `#3d7f17` (Text auf Weiß, besserer Kontrast) |
