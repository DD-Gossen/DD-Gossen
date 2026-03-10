# Formular-Markup – DD-Gossen

Schnellreferenz für das Erstellen von Formularen. Design, Funktionen und gelernte Lektionen.

---

## 1. Formspree-Setup

**Endpoint:** `https://formspree.io/f/xrbkaojw`

**Hidden Fields für Formspree:**
```html
<input type="hidden" name="_subject" value="Betreff der E-Mail">
<input type="hidden" name="_language" value="de">
<input type="hidden" name="_next" value="https://dd-gossen.com/SEITE/?submitted=1">
```

**Wichtig:** Für jedes neue Formular kann ein eigener Formspree-Endpoint angelegt werden (formspree.io), um E-Mails zu trennen.

---

## 2. Formular-Klassen (aus styles.css)

| Klasse | Verwendung |
|--------|------------|
| `contact-form` | Hauptformular-Container (Glasmorphismus) |
| `onboarding-form` | Zusätzliche Klasse für Formulare mit eigener Validierung – **wichtig:** verhindert, dass script.js den fetch-Handler anwendet |
| `form-group` | Wrapper für Label + Input |
| `form-row` | 2-spaltiges Grid für nebeneinander liegende Felder |
| `form-section` | Abschnitt mit Titel |
| `form-section-title` | Überschrift eines Abschnitts |
| `form-section-hint` | Hinweistext (grau, kleiner) |
| `submit-button` | Absenden-Button |
| `form-error` | Fehlermeldung unter dem Feld |
| `form-group.has-error` | Roter Rahmen bei Fehler |
| `checkbox-group` | Flex-Container für Checkboxen |

---

## 3. script.js – Wichtige Regel

**Formulare mit eigener Validierung/Formspree-POST müssen von script.js ausgenommen werden:**

```javascript
// script.js – Contact form handling
const form = document.querySelector('.contact-form:not(.onboarding-form):not(.projektstart-form)');
```

**Grund:** script.js fängt alle `.contact-form` ab und sendet per `fetch` – ohne Validierung. Formulare mit `onboarding-form` (oder eigener Klasse) werden ausgenommen und machen normalen POST.

---

## 4. HTML-Struktur (Basis)

```html
<form class="contact-form MEINE-FORM-KLASSE" action="https://formspree.io/f/xrbkaojw" method="POST" novalidate>
    <input type="hidden" name="_subject" value="Betreff">
    <input type="hidden" name="_language" value="de">
    <input type="hidden" name="_next" value="https://dd-gossen.com/SEITE/?submitted=1">

    <div class="form-section">
        <h2 class="form-section-title">Abschnitt 1</h2>
        <div class="form-group">
            <label for="feld1">Feldname *</label>
            <input type="text" id="feld1" name="Feldname" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="feld2">Feld 2</label>
                <input type="text" id="feld2" name="Feld2">
            </div>
            <div class="form-group">
                <label for="feld3">Feld 3</label>
                <input type="text" id="feld3" name="Feld3">
            </div>
        </div>
    </div>

    <button type="submit" class="submit-button">Absenden</button>
</form>
```

---

## 5. Feldtypen

| Typ | Beispiel | Hinweis |
|-----|----------|---------|
| `type="text"` | Name, Adresse | Standard |
| `type="email"` | E-Mail | Validierung empfohlen |
| `type="tel"` | Telefon | Kein Format-Check |
| `type="url"` | Logo-Link | Validierung empfohlen |
| `type="number"` | MWSt, Mengen | `step`, `min`, `max` möglich |
| `textarea` | Kommentare | `rows="4"` |
| `checkbox` | Zahlungsarten | `name` + `value` für Formspree |

---

## 6. Validierung (deutsche Fehlermeldungen)

**Voraussetzung:** `novalidate` am Formular, damit eigene Validierung greift.

**E-Mail-Felder:** `data-errormsg="Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.de)"`
**URL-Felder:** `data-errormsg="Bitte gib eine gültige URL ein (z.B. https://...)"`

**Fehlermeldungen:** `<span class="form-error" id="FELD-ID-error"></span>`

**Validierungs-Script (Kern):**
- `validateEmail()` – Pflichtfeld + Format
- `validateUrl()` – nur Format (optional)
- `showError()` / `clearError()` – Anzeige/Entfernung
- Bei Submit: `e.preventDefault()` wenn Fehler, sonst normaler POST

**Referenz:** Siehe `onboarding/index.html` – vollständiges Validierungs-Script.

---

## 7. Checkboxen (Formspree)

```html
<label><input type="checkbox" name="Zahlung PayPal" value="Ja"> PayPal</label>
```

Nur angehakte Checkboxen werden gesendet. `name` erscheint in der E-Mail.

---

## 8. Erfolgs-Seite nach Absenden

```html
<div id="mein-success" style="display: none;">
    <h2>Vielen Dank!</h2>
    <p>Deine Angaben wurden übermittelt.</p>
</div>
```

```javascript
if (params.get('submitted') === '1') {
    document.querySelector('.mein-form').style.display = 'none';
    document.getElementById('mein-success').style.display = 'block';
}
```

---

## 9. Gelernte Lektionen

1. **script.js:** Formulare mit `.contact-form` werden per fetch gesendet – ohne Validierung. Eigene Formulare mit `:not(.onboarding-form)` oder eigener Klasse ausnehmen.
2. **novalidate:** Browser-Validierung deaktivieren, damit eigene deutsche Meldungen angezeigt werden.
3. **Formspree:** `_subject` für Betreff, `_next` für Weiterleitung nach Erfolg.
4. **Pflichtfelder:** `required` + `*` im Label. Validierung prüft alle `[required]`.
5. **Optionale E-Mail/URL:** Wenn ausgefüllt, Format prüfen; wenn leer, OK.
6. **form-row:** 2 Spalten auf Desktop, 1 Spalte auf Mobile (bereits in styles.css).

---

## 10. Inline-Styles für Formulare (optional)

```css
.form-section-title { 
    font-family: 'Barlow Condensed', sans-serif; 
    font-size: 1.3rem; 
    font-weight: 600; 
    color: #0f172a; 
    margin-bottom: 1rem; 
    padding-bottom: 0.5rem; 
    border-bottom: 2px solid rgba(0, 123, 255, 0.3); 
}
.form-section-hint { font-size: 0.85rem; color: #334155; margin-bottom: 1rem; }
.form-section-hint a { color: #007bff; }
.form-error { font-size: 0.8rem; color: #dc2626; margin-top: 0.35rem; display: none; }
.form-group.has-error .form-error { display: block; }
.form-group.has-error input { border-color: #dc2626; }
.checkbox-group { display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; }
.checkbox-group label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
```
