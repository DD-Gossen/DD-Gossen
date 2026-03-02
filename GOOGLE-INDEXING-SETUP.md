# Google Indexing API – Einrichtung

Damit neue Seiten schnell bei Google indexiert werden, nutzt diese Seite die **Google Indexing API**.

**Wichtig:** Du brauchst einen **Service-Account** (JSON-Datei mit `type: "service_account"`), keinen einfachen API-Key. Ein API-Key funktioniert bei der Indexing API nicht.

---

## 1. Google Cloud Console

1. Gehe zu [console.cloud.google.com](https://console.cloud.google.com)
2. Erstelle ein neues Projekt oder wähle ein bestehendes
3. **APIs & Services** → **Library** → suche „Indexing API“ → **Enable**

---

## 2. Service Account erstellen

1. **APIs & Services** → **Credentials** → **Create Credentials** → **Service Account**
2. Name z.B. „indexing-api“
3. **Create and Continue** → Rolle „Editor“ oder „Owner“ (oder keine Rolle)
4. **Done**
5. Klicke auf den erstellten Service Account → **Keys** → **Add Key** → **Create new key** → **JSON**
6. Die JSON-Datei wird heruntergeladen – **bewahre sie sicher auf**

---

## 3. Search Console verknüpfen

**Wichtig:** Ohne diesen Schritt funktioniert die API nicht (403-Fehler).

1. Öffne die JSON-Datei und kopiere die E-Mail-Adresse (z.B. `indexing-api@projekt-id.iam.gserviceaccount.com`)
2. Gehe zu [search.google.com/search-console](https://search.google.com/search-console)
3. Wähle die Property **dd-gossen.com**
4. **Einstellungen** (Zahnrad) → **Benutzer und Berechtigungen**
5. **Benutzer hinzufügen** → E-Mail des Service Accounts einfügen
6. Rolle: **Eigentümer** (Owner)
7. **Hinzufügen**

---

## 4. GitHub Secret anlegen

1. Gehe zu deinem Repo: **DD-Gossen/DD-Gossen**
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
4. Name: `GOOGLE_INDEXING_CREDENTIALS`
5. Value: **Gesamten Inhalt** der JSON-Datei einfügen (von `{` bis `}`)

---

## 5. Fertig

- Bei jedem Push auf `main` (mit Änderungen an Sitemap, Blog, etc.) werden die URLs automatisch an Google gemeldet
- Manuell auslösen: **Actions** → **Google Indexing API** → **Run workflow**

---

## Lokal testen

```bash
# 1. googleapis installieren
npm install googleapis

# 2. JSON-Inhalt als Umgebungsvariable setzen
export GOOGLE_INDEXING_CREDENTIALS='{"type":"service_account",...}'

# 3. Script ausführen
npm run index:google
```

---

## Limits

- Ca. 200 URLs pro Tag pro Property
- 600 Requests pro Minute
- Bei 403: Service-Account in Search Console prüfen
