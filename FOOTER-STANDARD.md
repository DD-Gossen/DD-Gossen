# Footer-Standard (DD-Gossen Website)

Neue Seiten sollen den Footer **immer** wie die Startseite aufbauen, damit Layout, Links und **Mobile-Akkordeon** identisch sind.

## Referenz (Copy-Paste-Vorlage)

| Sprache | Vorlage im Repo |
|--------|------------------|
| Deutsch | `index.html` – Block ab `<footer class="footer">` bis `</footer>` |
| Englisch | `en/index.html` – derselbe Block |

Die optische Ausgestaltung kommt aus `styles.css` (Klasse `.footer`). Ab ca. Viewportbreite 600px kollabieren die Spalten mit `footer-col-toggle` zu klickbaren Bereichen (Chevron an der Überschrift).

## Pflicht-Struktur

1. **Root:** `<footer class="footer">`
2. **Grid:** `<div class="footer-grid">` mit **genau vier** Spalten:
   - **Spalte 1 – Brand:** `class="footer-col footer-col-brand"`  
     Enthält: `footer-brand-name`, `footer-contact-label`, Mail- und Telefon-Link (`footer-contact-email`, `footer-contact-phone`), **`footer-social`** mit den drei SVG-Links (E-Mail, YouTube, LinkedIn) – wie in der Startseite, nicht weglassen.
   - **Spalten 2–4 – Navigation:** Jede mit **`class="footer-col footer-col-toggle"`** (beide Klassen).  
     Nur die **Brand-Spalte** hat kein `footer-col-toggle`.
3. **Überschriften der drei Link-Spalten:**
   - DE: `Menü`, `Content`, `Schnellzugriff`
   - EN: `Menu`, `Content`, `Quick Links` (nicht „Quick Access“)
4. **Unter dem Grid:** `<div class="footer-bottom">` mit rechtlichen Links, Cookie-Zugang, Copyright – **sprachspezifisch** (siehe unten).

## Kritisch: `footer-col-toggle`

Ohne `footer-col-toggle` auf den **drei** Link-Spalten gibt es **kein** einheitliches Mobile-Verhalten (kein Aufklappen pro Sektion wie auf der Homepage).

## Rechtliche Zeile (`footer-bottom`)

**Deutsch** (wie `index.html`):

- Links: `impressum.html`, `datenschutz.html`, `agb.html` (absolute URLs `https://dd-gossen.com/...` wie in der Vorlage).
- Cookie: `<a href="#" id="openCookieSettings">Cookie-Einstellungen</a>`  
  (funktioniert zusammen mit Cookie-Banner-Skript auf Seiten, die `#cookieBanner` einbinden.)

**Englisch** (wie `en/index.html`):

- Links: `https://dd-gossen.com/en/legal-notice.html`, `.../en/privacy-policy.html`, `.../en/terms.html`
- Cookie: `<button type="button" id="openCookieSettings" class="footer-cookie-btn">Cookie Settings</button>`  
  Zusätzlich das kurze Inline-Skript nach `script.js`, das `#openCookieSettings` an `#cookieBanner` koppelt (siehe Ende von `en/index.html`), **oder** dieselbe Logik, falls die Seite den Banner anders lädt.

Keine EN-Unterseiten mit deutschen Pfaden (`impressum.html` nur für DE) in der Footer-Zeile verwenden, wenn die Seite zur englischen Site gehört.

## JavaScript

- **`script.js` einbinden** (relativer Pfad von der HTML-Datei zum Repo-Root, z. B. `../script.js`, `../../script.js`, `../../../script.js`).  
  Darin ist die **Klick-Logik für `.footer-col-toggle`** (Akkordeon).
- Seiten **ohne** `script.js` haben auf dem Handy kein ausklappbares Footer-Verhalten wie die Homepage.

## Linkliste in den drei Spalten

- **Nicht** pro Unterseite eine eigene Mini-Navigation erfinden (z. B. nur „Legal“ als vierte Spalte oder weniger als drei Link-Spalten).
- Inhalt der drei Spalten an die **jeweilige Startseite** anlehnen (Menü / Content / Schnellzugriff bzw. Menu / Content / Quick Links).  
  Bei thematischen Landingpages dürfen einzelne Links in **Content** sinnvoll ergänzt werden (z. B. aktueller Artikel), die **Struktur** (4 Spalten, 3× Toggle) bleibt gleich.

## Checkliste vor Publish

- [ ] `footer-col-toggle` auf allen drei Link-Spalten
- [ ] `footer-social` in der Brand-Spalte vollständig
- [ ] `footer-bottom` sprachlich und URL-mäßig korrekt (DE vs. EN)
- [ ] `styles.css` eingebunden
- [ ] `script.js` mit korrektem relativem Pfad eingebunden
- [ ] Bei EN mit Cookie-Button: Klick-Handler wie auf `en/index.html`, falls Banner vorhanden
