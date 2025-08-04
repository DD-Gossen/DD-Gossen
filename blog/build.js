const fs = require('fs');
const path = require('path');

// Markdown zu HTML konvertieren (verbesserte Implementierung)
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Überschriften mit IDs für Inhaltsverzeichnis
  html = html.replace(/^### (.*$)/gim, (match, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9äöüß]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return `<h3 id="${id}">${title}</h3>`;
  });
  
  html = html.replace(/^## (.*$)/gim, (match, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9äöüß]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return `<h2 id="${id}">${title}</h2>`;
  });
  
  html = html.replace(/^# (.*$)/gim, (match, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9äöüß]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return `<h1 id="${id}">${title}</h1>`;
  });
  
  // Listen
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  
  // Listen-Container (verbessert)
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  // Absätze mit besserer Formatierung
  html = html.replace(/\n\n/g, '</p>\n<p>');
  html = html.replace(/^(.+)$/gm, '<p>$1</p>');
  
  // Doppelte p-Tags entfernen
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><p>/g, '<p>');
  html = html.replace(/<\/p><\/p>/g, '</p>');
  
  // Zeilenumbrüche entfernen
  html = html.replace(/\n/g, '');
  
  // Listen-Formatierung korrigieren
  html = html.replace(/<ul><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/ul>/g, '</ul>');
  
  return html;
}

// Inhaltsverzeichnis generieren
function generateTableOfContents(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  
  lines.forEach(line => {
    const h2Match = line.match(/^## (.*$)/);
    if (h2Match) {
      const title = h2Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9äöüß]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      headings.push({ title, id });
    }
  });
  
  if (headings.length === 0) return '';
  
  const tocHtml = headings.map(heading => 
    `<li><a href="#${heading.id}">${heading.title}</a></li>`
  ).join('');
  
  return `<div class="table-of-contents">
    <h3>Inhaltsverzeichnis</h3>
    <ul>${tocHtml}</ul>
  </div>`;
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
          const toc = generateTableOfContents(markdown);
          const html = markdownToHtml(markdown);
          
          posts.push({
            ...metadata,
            body: toc + html
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