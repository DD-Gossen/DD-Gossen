# Design-Markup – DD-Gossen (Shopify Freelancer)

Schnellreferenz für Farben, Typografie, Karten, Links und Accounts. Orientierung an der Shopify-Freelancer-Seite.

---

## 1. Farben

| Name | Hex | Verwendung |
|------|-----|------------|
| **Primär (Dunkelblau)** | `#0f172a` | Überschriften, CTA-Buttons, Nav-Links, Submit-Button |
| **Primär Hover** | `#1e293b` | Hover-Zustände |
| **Akzent (Blau)** | `#007bff` | Links, Hover, Akzente |
| **Akzent dunkler** | `#0056b3` / `#004c9e` | Verläufe, Hover |
| **Hintergrund Blau** | `#237eb5` | Body-Fallback, Ladezustand |
| **Text dunkel** | `#0f172a` | Haupttext |
| **Text grau** | `#334155` | Hinweise, sekundärer Text |
| **Text heller** | `#64748b` | Noch dezenter |
| **Fehler** | `#dc2626` | Validierungsfehler |

---

## 2. Verläufe

```css
/* Hero / CTA Gradient */
background-image: linear-gradient(135deg, #007bff 0%, #004c9e 100%);

/* Hellblauer Button */
background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);

/* Dunkler Button */
background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
```

---

## 3. Typografie

**Schriftarten:**
- **Überschriften:** `font-family: 'Barlow Condensed', sans-serif;`
- **Fließtext:** `font-family: 'Inter', sans-serif;` oder `Arial`

**Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

**Größen:**
| Element | Größe | Gewicht |
|---------|-------|---------|
| `.section-title` | 2.5rem (2rem mobile) | 600 |
| `.section-subtitle` | 1rem | 400 |
| `.form-section-title` | 1.3rem | 600 |
| `.form-group label` | 1rem | 500 |
| `.form-section-hint` | 0.85rem | – |
| `.header-cta-button` | 0.95rem | 600 |
| `.submit-button` | 1.1rem | 600 |

---

## 4. Karten & Glasmorphismus

**Standard-Karte:**
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
padding: 3rem;
```

**Karte Hover:**
```css
background: rgba(255, 255, 255, 0.25);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
```

**Header:**
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 30px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

---

## 5. Buttons

**Header CTA / Dunkler Button:**
```html
<a href="#" class="header-cta-button" data-cal-link="maik-gossen-hmpi7t/erstgespraech" data-cal-namespace="erstgespraech" data-cal-config='{"layout":"month_view"}'>Jetzt anfragen</a>
```
- Hintergrund: `#0f172a`
- Hover: `#1e293b`

**Submit-Button:**
```html
<button type="submit" class="submit-button">Absenden</button>
```
- Hintergrund: `#0f172a`
- Hover: `#1e293b`, `translateY(-2px)`

**Hellblauer CTA (z.B. Kostenrechner):**
```html
<a href="#" class="calc-cta-booking" data-cal-link="maik-gossen-hmpi7t/erstgespraech" ...>Termin buchen</a>
```
- Gradient: `#007bff` → `#0056b3`

---

## 6. Cal.com / Termin buchen

**Cal-Link (Erstgespräch):**
```html
<a href="#" class="header-cta-button" data-cal-link="maik-gossen-hmpi7t/erstgespraech" data-cal-namespace="erstgespraech" data-cal-config='{"layout":"month_view"}'>Jetzt anfragen</a>
```

**Cal-Script (am Ende von body):**
```html
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", "erstgespraech", {origin:"https://app.cal.com"});
  function initCalUI() { if (window.Cal && window.Cal.ns && window.Cal.ns.erstgespraech) { Cal.ns.erstgespraech("ui", {"hideEventTypeDetails":false,"layout":"month_view"}); } else { setTimeout(initCalUI, 100); } }
  document.addEventListener('click', function(e) { if (e.target.closest('[data-cal-link]')) e.preventDefault(); }, false);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCalUI); else initCalUI();
</script>
```

---

## 7. Links & Accounts

| Zweck | URL |
|-------|-----|
| **E-Mail** | `mailto:info@dd-gossen.com` |
| **Telefon** | `tel:+4915168487847` |
| **YouTube** | `https://www.youtube.com/@dd-gossen` |
| **LinkedIn** | `https://www.linkedin.com/in/maik-gossen` |
| **Shopexperts** | `https://shopexperts.com/freelancers/maik-gossen` |
| **Website** | `https://dd-gossen.com` |

---

## 8. Footer-Struktur

**Kontakt:**
- E-Mail: `info@dd-gossen.com`
- Telefon: `+49 151 68487847`

**Social Icons:** E-Mail, YouTube, LinkedIn (SVG-Icons)

**Menü-Links:**
- `/shopify-freelancer/` – Übersicht (Hub)
- `/` – Meine Services (lange Service-Landing)
- `/shopify-kostenrechner/` – Kostenrechner
- `/blog/` – Blog
- `/#contact` – Kontakt

**Schnellzugriff:**
- `/#contact` – Kostenloses Erstgespräch
- `/#about-me` – Über mich
- Shopexperts (extern)

**Legal:**
- `/impressum.html` – Impressum
- `/datenschutz.html` – Datenschutz
- `/agb.html` – AGB
- Cookie-Einstellungen (`#openCookieSettings`)

---

## 9. Formspree

**Kontaktformular:** `https://formspree.io/f/xrbkaojw`

---

## 10. Section-Struktur

```html
<section class="section">
    <div class="container">
        <h1 class="section-title">Überschrift</h1>
        <p class="section-subtitle">Untertitel</p>
        <!-- Inhalt -->
    </div>
</section>
```

**Container:** `max-width: 1200px`, `padding: 0 20px`

---

## 11. CTA-Section (z.B. Kostenrechner)

```html
<div class="calc-cta-section">
    <div class="container calc-cta-container">
        <a href="#" class="calc-cta-booking" data-cal-link="maik-gossen-hmpi7t/erstgespraech" ...>
            Termin buchen
        </a>
    </div>
</div>
```

---

## 12. FAQ-Section

**HTML-Struktur (Accordion, script.js übernimmt die Logik):**
```html
<section id="faq" class="section faq-section">
    <div class="container">
        <h2 class="section-title">Häufige Fragen</h2>
        <div class="faq-card">
            <div class="faq-accordion">
                <div class="faq-item">
                    <button class="faq-question" aria-expanded="false">
                        <span>Frage hier?</span>
                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <p>Antwort hier.</p>
                    </div>
                </div>
                <!-- weitere faq-item -->
            </div>
        </div>
    </div>
</section>
```

**Klassen:**
- `faq-section` – Section-Wrapper (padding 5rem 0)
- `faq-card` – Karte (heller Glaseffekt: rgba 0.4, border 0.4)
- `faq-accordion` – Flex-Container für Items
- `faq-item` – Einzelne Frage/Antwort
- `faq-question` – Button mit `aria-expanded`
- `faq-icon` – Chevron (dreht bei open)
- `faq-answer` – Antwort-Bereich (max-height-Animation)

**Wichtig:** script.js enthält bereits die FAQ-Accordion-Logik für `.faq-question`. Kein zusätzliches Script nötig.

**Alternative (Blog):** `<details class="faq-item">` mit `<summary>` – für Schema.org/SEO, andere Styling-Logik.

**SEO / JSON-LD FAQPage-Schema:** Für bessere Suchergebnisse (Rich Snippets) JSON-LD im `<head>` einbinden – siehe `shopify-kostenrechner/index.html` oder `shopify-freelancer/index.html` für Beispiel.

---

## 13. Hintergrund

**Body:**
```css
background-image: url('DD-background.webp');
background-color: #237eb5;
background-size: cover;
background-position: top;
```

**Pfad für Unterseiten:** `../DD-background.webp`
