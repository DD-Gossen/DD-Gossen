# Blog-Verwaltung - Markdown-basierte Lösung

## 🎉 Neue Lösung: Einzelne Markdown-Dateien

Jetzt haben Sie **individuelle Dateien** für jeden Artikel - viel einfacher zu bearbeiten!

### 📁 Neue Struktur:
```
blog/
├── articles/                           # Hier sind Ihre Artikel
│   ├── 2025-08-04-adressen.md         # Einfach zu bearbeiten
│   └── 2024-06-06-shopify-vs-woocommerce.md
├── posts.json                          # ⚠️ Automatisch generiert (nicht im Git)
├── build.js                            # Konvertierung Markdown → JSON
└── README.md                           # Diese Anleitung
```

**Wichtig:** `posts.json` wird automatisch generiert und ist **nicht mehr im Git-Repository** gespeichert!

---

## 📝 Wie Sie Artikel bearbeiten

### 1. Neuen Artikel erstellen

1. **Erstellen Sie** eine neue `.md` Datei in `blog/articles/`
2. **Benennen Sie** sie nach dem Schema: `YYYY-MM-DD-titel.md`
3. **Kopieren Sie** die Vorlage von einem bestehenden Artikel
4. **Bearbeiten Sie** den Inhalt
5. **Führen Sie** `node build.js` aus

### 2. Artikel bearbeiten

1. **Öffnen Sie** die gewünschte `.md` Datei in `blog/articles/`
2. **Bearbeiten Sie** den Inhalt (Markdown-Format)
3. **Speichern Sie** die Datei
4. **Führen Sie** `node build.js` aus

### 3. Artikel löschen

1. **Löschen Sie** die `.md` Datei aus `blog/articles/`
2. **Führen Sie** `node build.js` aus
3. **Fertig!** Der Artikel ist aus der JSON entfernt

---

## 🔧 Artikel-Struktur (Markdown)

Jede `.md` Datei hat folgende Struktur:

```markdown
---
title: "Ihr Artikel-Titel"
date: "2025-01-27"
filename: "2025-01-27-artikel-titel"
slug: "2025-01-27-artikel-titel"
summary: "Kurze Zusammenfassung..."
image: "images/bild.jpg"
meta_description: "SEO-Beschreibung (max. 160 Zeichen)"
keywords: "Keyword1, Keyword2, Keyword3"
og_title: "Social Media Titel"
og_description: "Social Media Beschreibung"
og_image: "images/social-bild.jpg"
---

# Hauptüberschrift

Ihr Artikel-Inhalt in Markdown-Format.

## Unterüberschrift

Weiterer Inhalt...

### Noch kleinere Überschrift

- Listenpunkt 1
- Listenpunkt 2
- Listenpunkt 3
```

---

## 🚀 Automatische Konvertierung

### Build-Script ausführen:
```bash
cd blog
node build.js
```

### Was passiert:
1. **Liest** alle `.md` Dateien aus `articles/`
2. **Konvertiert** Markdown zu HTML
3. **Generiert** `posts.json` automatisch
4. **Sortiert** Artikel nach Datum

**⚠️ Wichtig:** `posts.json` wird bei jedem Build neu erstellt!

---

## ✨ Vorteile der neuen Lösung

### ✅ **Einfache Bearbeitung**
- Jeder Artikel ist eine **eigene Datei**
- **Markdown-Format** - einfach zu schreiben
- **Keine JSON-Kenntnisse** erforderlich
- **WYSIWYG-Editor** möglich

### ✅ **Individuelle Anpassungen**
- **Einzelne Dateien** für jeden Artikel
- **Flexible Struktur** pro Artikel
- **Einfache Versionierung** mit Git
- **Schnelle Bearbeitung**

### ✅ **Automatische SEO**
- **Meta-Daten** im Frontmatter
- **Automatische JSON-Generierung**
- **Konsistente Struktur**
- **Dynamische Meta-Tags**

### ✅ **Saubere Git-Historie**
- **Nur Markdown-Dateien** im Repository
- **Keine generierten Dateien** im Git
- **Kleine Commits** - nur echte Änderungen
- **Klare Trennung** zwischen Quellcode und generierten Dateien

---

## 📋 Schritt-für-Schritt: Neuen Artikel erstellen

### 1. Datei erstellen
```bash
# In blog/articles/ eine neue .md Datei erstellen
touch blog/articles/2025-01-27-neuer-artikel.md
```

### 2. Vorlage kopieren
Kopieren Sie die Struktur eines bestehenden Artikels und passen Sie an.

### 3. Inhalt schreiben
Schreiben Sie Ihren Artikel in Markdown-Format.

### 4. Build ausführen
```bash
cd blog
node build.js
```

### 5. Testen
Öffnen Sie `blog/index.html` und prüfen Sie, ob der Artikel angezeigt wird.

### 6. Committen
```bash
# Nur die Markdown-Datei committen
git add blog/articles/2025-01-27-neuer-artikel.md
git commit -m "Neuer Artikel: Titel"
git push
```

---

## 🎯 Markdown-Syntax

### Überschriften
```markdown
# Hauptüberschrift (H1)
## Unterüberschrift (H2)
### Kleine Überschrift (H3)
```

### Text-Formatierung
```markdown
**Fett** oder __fett__
*Kursiv* oder _kursiv_
`Code`
```

### Listen
```markdown
- Listenpunkt 1
- Listenpunkt 2
- Listenpunkt 3

1. Nummerierte Liste
2. Zweiter Punkt
3. Dritter Punkt
```

### Links
```markdown
[Link-Text](https://example.com)
```

### Bilder
```markdown
![Alt-Text](images/bild.jpg)
```

---

## ⚠️ Wichtige Hinweise

1. **Dateinamen:** Verwenden Sie das Format `YYYY-MM-DD-titel.md`
2. **Frontmatter:** Muss zwischen `---` stehen
3. **Bilder:** Laden Sie Bilder in `blog/images/` hoch
4. **Build:** Führen Sie `node build.js` nach jeder Änderung aus
5. **Git:** Committen Sie nur die `.md` Dateien, nicht `posts.json`
6. **posts.json:** Wird automatisch generiert und ist nicht im Repository

---

## 🔄 Workflow

1. **Artikel bearbeiten** → `.md` Datei ändern
2. **Build ausführen** → `node build.js`
3. **Testen** → Lokal prüfen
4. **Commit** → Nur `.md` Dateien zu Git hinzufügen
5. **Push** → Zu GitHub hochladen

---

## 🎉 Fertig!

Sie haben jetzt eine **professionelle Blog-Lösung** mit:
- ✅ **Einfache Bearbeitung** in Markdown
- ✅ **Individuelle Dateien** für jeden Artikel
- ✅ **Automatische SEO-Optimierung**
- ✅ **Flexible Anpassungen** pro Artikel
- ✅ **Saubere Git-Historie** ohne generierte Dateien

**Viel Spaß beim Schreiben!** 🚀 