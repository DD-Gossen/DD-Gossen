#!/usr/bin/env node
/**
 * Google Indexing API – URLs aus Sitemap an Google melden
 * Benötigt: Service-Account-JSON (nicht API-Key!)
 * Service-Account muss in Search Console als Eigentümer hinzugefügt sein.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
const BASE_URL = 'https://dd-gossen.com';

async function getUrlsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urlMatches = xml.matchAll(/<loc>(https:\/\/dd-gossen\.com[^<]*)<\/loc>/g);
  return [...urlMatches].map(m => m[1]);
}

async function submitToIndexingApi(urls) {
  const credentials = process.env.GOOGLE_INDEXING_CREDENTIALS;
  if (!credentials) {
    console.error('FEHLER: GOOGLE_INDEXING_CREDENTIALS Umgebungsvariable nicht gesetzt.');
    console.error('Erwartet: JSON-Inhalt der Service-Account-Datei (als String).');
    process.exit(1);
  }

  let key;
  try {
    key = JSON.parse(credentials);
  } catch (e) {
    console.error('FEHLER: GOOGLE_INDEXING_CREDENTIALS ist kein gültiges JSON.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({ version: 'v3', auth });

  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: 'URL_UPDATED',
        },
      });
      console.log('✓ Indexiert:', url);
    } catch (err) {
      if (err.code === 403) {
        console.error('✗ 403 für', url, '– Service-Account in Search Console als Eigentümer hinzufügen!');
      } else {
        console.error('✗ Fehler für', url, ':', err.message);
      }
    }
    await new Promise(r => setTimeout(r, 500));
  }
}

async function main() {
  const urls = await getUrlsFromSitemap();
  console.log('Sende', urls.length, 'URLs an Google Indexing API...\n');
  await submitToIndexingApi(urls);
  console.log('\nFertig.');
}

main().catch(console.error);
