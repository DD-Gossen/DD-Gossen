// blog/blog.js

// Hilfsfunktionen
function fetchMarkdownList() {
  // Liest alle .md-Dateien im blog/posts/-Ordner (statisch gepflegte Liste)
  return [
    '2024-06-01-shopify-tipps.md',
    '2024-06-02-seo-grundlagen.md',
    '2024-06-03-apps-empfehlung.md',
    '2024-06-04-design-trends.md',
    '2024-06-05-rechtliches.md',
    '2024-06-06-shopify-vs-woocommerce.md',
  ];
}

function fetchMarkdown(filename) {
  return fetch('posts/' + filename).then(r => r.text());
}

function parseFrontmatter(md) {
  const match = md.match(/^---([\s\S]*?)---/);
  if (!match) return { attributes: {}, body: md };
  const attrs = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      let value = rest.join(':').trim();
      // Entferne Anführungszeichen am Anfang/Ende
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      attrs[key.trim()] = value;
    }
  });
  return { attributes: attrs, body: md.slice(match[0].length).trim() };
}

function markdownToHtml(md) {
  let html = md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/^\s*\n/gim, '<br>')
    .replace(/^\s*\* (.*)$/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  return html;
}

// Übersicht rendern
async function renderBlogOverview() {
  const mainArticleDiv = document.getElementById('main-article');
  const gridDiv = document.getElementById('blog-grid');
  if (!mainArticleDiv || !gridDiv) return;

  const files = fetchMarkdownList();
  const posts = await Promise.all(files.map(async (f) => {
    const raw = await fetchMarkdown(f);
    const { attributes, body } = parseFrontmatter(raw);
    // Debug: Logge die Attribute
    console.log('PARSED ATTRIBUTES', attributes);
    return {
      ...attributes,
      body,
      slug: f.replace(/\.md$/, ''),
      filename: f,
      date: attributes.date || f.slice(0, 10),
    };
  }));
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // Main Article
  if (posts[0]) {
    const p = posts[0];
    mainArticleDiv.innerHTML = `
      <div class="main-article-card">
        <img src="${p.image}" alt="${p.title}">
        <div class="blog-date">${p.date}</div>
        <h2>${p.title}</h2>
        <div class="blog-summary">${p.summary || ''}</div>
        <a class="blog-readmore" href="article.html?slug=${p.slug}">Jetzt Weiterlesen.</a>
      </div>
    `;
  }

  // Grid
  gridDiv.innerHTML = posts.slice(1, 7).map((p) => {
    return `
      <div class="blog-card">
        <img src="${p.image}" alt="${p.title}">
        <div class="blog-date">${p.date}</div>
        <h3>${p.title}</h3>
        <div class="blog-summary">${p.summary || ''}</div>
        <a class="blog-readmore" href="article.html?slug=${p.slug}">Jetzt Weiterlesen.</a>
      </div>
    `;
  }).join('');
}

// Artikelseite rendern
async function renderBlogArticle() {
  const card = document.getElementById('article-card');
  if (!card) return;
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if (!slug) {
    card.innerHTML = '<p>Artikel nicht gefunden.</p>';
    return;
  }
  const files = fetchMarkdownList();
  const file = files.find(f => f.replace(/\.md$/, '') === slug);
  if (!file) {
    card.innerHTML = '<p>Artikel nicht gefunden.</p>';
    return;
  }
  const raw = await fetchMarkdown(file);
  const { attributes, body } = parseFrontmatter(raw);
  card.innerHTML = `
    <img src="${attributes.image}" alt="${attributes.title}">
    <div class="blog-date">${attributes.date || ''}</div>
    <h1>${attributes.title || ''}</h1>
    <div class="article-content">${markdownToHtml(body)}</div>
  `;
}

if (document.getElementById('main-article')) renderBlogOverview();
if (document.getElementById('article-card')) renderBlogArticle();
