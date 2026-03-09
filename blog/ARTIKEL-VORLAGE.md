# Blog-Artikel Vorlage – Anleitung

Diese Vorlage beschreibt, wie du neue Artikel erstellst und was du mir schicken kannst. Die **Template-Datei** `blog/_template/index.html` ist die unveränderliche Master-Vorlage. Neue Artikel werden daraus kopiert – nie die Template-Datei direkt bearbeiten.

---

## So funktioniert es

1. **Du schickst mir den Artikel-Inhalt** (siehe Format unten)
2. **Ich erstelle die neue Artikelseite** durch Kopieren von `blog/_template/index.html`
3. **Ich frage nach**, was fehlt oder unklar ist

---

## Format: Artikel-Inhalt schicken

Kopiere diese Struktur und fülle sie aus. Du kannst Abschnitte weglassen, die du nicht brauchst.

```markdown
## Artikel-Metadaten
- **Titel:** [Vollständiger Artikel-Titel]
- **URL-Slug:** [z.B. shopify-migration-tipps]
- **Datum:** [TT.MM.JJ]
- **Lesezeit:** [X Min.]
- **Tags:** [Tag1, Tag2, Tag3]

## Meta-Description (SEO)
[1–2 Sätze, max. ~155 Zeichen]

## Artikel in Kürze (optional)
- **[Punkt 1]** Kurze Antwort
- **[Punkt 2]** Kurze Antwort
- ...

## Hero-Bild
- **Bildpfad/URL:** [z.B. blog/images/mein-bild.jpg]
- **Alt-Text:** [Beschreibung für SEO]

## Haupttext
[Dein Artikeltext in Markdown oder reinem Text. Überschriften mit ## für H2, ### für H3]

## Inline-CTAs (optional)
- **Position 1:** [Text] | [Link]
- **Position 2:** [Text] | [Link]

## FAQ (optional)
- **Frage 1:** [Frage]
  **Antwort:** [Antwort]
- **Frage 2:** ...

## Autor
- **Name:** [Name]
- **Rolle:** [z.B. Shopify Freelancer & Entwickler]
- **Bio:** [Kurzer Text]
- **Bild:** [Pfad oder Standard]
- **Link:** [z.B. /shopify-freelancer/]
```

---

## Was ich nachfrage, wenn etwas fehlt

| Fehlt | Ich frage nach |
|-------|-----------------|
| Titel | Vollständiger Artikel-Titel |
| URL-Slug | Gewünschter Pfad (z.B. `blog/mein-artikel/`) |
| Datum | Veröffentlichungsdatum |
| Meta-Description | Kurzbeschreibung für Google |
| Hero-Bild | Bilddatei oder Pfad + Alt-Text |
| H2-Überschriften | Für Inhaltsverzeichnis (IDs werden automatisch generiert) |
| FAQ | Fragen + Antworten für FAQ-Section |
| Artikel in Kürze | Bullet-Points für die Zusammenfassung |
| Autor-Infos | Name, Rolle, Bio, Bild (wenn abweichend von Standard) |

---

## Standard-Werte (falls nicht angegeben)

- **Autor:** Maik Gossen, Shopify Freelancer & Entwickler
- **Autor-Bild:** `Maik-Gossen-ShopifyFreelancer.png`
- **Autor-Link:** `/shopify-freelancer/`
- **CTA-Link:** Cal.com (Erstgespräch) oder `/shopify-freelancer/#contact`
- **Strukturierte Daten:** Werden aus Metadaten + FAQ automatisch erzeugt

---

## Dateistruktur neuer Artikel

```
blog/
  _template/           ← MASTER (nicht bearbeiten!)
    index.html
  [artikel-slug]/      ← Neue Artikel = Kopie aus _template
    index.html
```

Beispiel: `blog/shopify-migration-tipps/index.html` (Kopie von `_template/index.html`)

---

## Checkliste vor Veröffentlichung

- [ ] Canonical-URL gesetzt
- [ ] Meta-Description vorhanden
- [ ] Open-Graph-Tags (og:title, og:description, og:image)
- [ ] Strukturierte Daten (Article, Author, FAQ)
- [ ] Alle Bilder mit Alt-Text
- [ ] Interne Links korrekt
- [ ] Cal-Link bei CTA-Button (falls gewünscht)

---

*Erstellt für DD-Gossen Blog | Master-Template: blog/_template/*
