const fs = require('fs');
const path = require('path');

// Markdown zu HTML konvertieren (einfache Implementierung)
function markdownToHtml(markdown) {
  return markdown
    // Überschriften
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Listen
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // Absätze
    .replace(/\n\n/g, '</p>\n<p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    // Listen-Container
    .replace(/<li>(.*)<\/li>/g, '<ul><li>$1</li></ul>')
    // Doppelte p-Tags entfernen
    .replace(/<p><\/p>/g, '')
    .replace(/<p><p>/g, '<p>')
    .replace(/<\/p><\/p>/g, '</p>')
    // Zeilenumbrüche
    .replace(/\n/g, '');
}

// YAML Frontmatter parsen
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error('Kein gültiges Frontmatter gefunden');
  }

  const frontmatter = frontmatterMatch[1];
  const markdown = frontmatterMatch[2];

  // YAML zu Objekt konvertieren (einfache Implementierung)
  const metadata = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Anführungszeichen entfernen
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      metadata[key] = value;
    }
  });

  return { metadata, markdown };
}

// Alle Markdown-Dateien verarbeiten
function buildPosts() {
  const articlesDir = path.join(__dirname, 'articles');
  const posts = [];

  try {
    const files = fs.readdirSync(articlesDir);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(articlesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        try {
          const { metadata, markdown } = parseFrontmatter(content);
          const html = markdownToHtml(markdown);
          
          posts.push({
            ...metadata,
            body: html
          });
        } catch (error) {
          console.error(`Fehler beim Verarbeiten von ${file}:`, error.message);
        }
      }
    });

    // Nach Datum sortieren (neueste zuerst)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // JSON-Datei schreiben
    const jsonPath = path.join(__dirname, 'posts.json');
    fs.writeFileSync(jsonPath, JSON.stringify(posts, null, 2));
    
    console.log(`✅ ${posts.length} Artikel erfolgreich zu posts.json konvertiert`);
    
  } catch (error) {
    console.error('Fehler beim Build-Prozess:', error.message);
  }
}

// Script ausführen
if (require.main === module) {
  buildPosts();
}

module.exports = { buildPosts }; 