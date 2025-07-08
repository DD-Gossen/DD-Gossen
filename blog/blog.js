// blog/blog.js

// Cache für geladene Posts
let postsCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten

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
  // Optimierte Pfad-Strategie: Versuche zuerst den wahrscheinlichsten Pfad
  const paths = [
    'posts/' + filename,  // Wahrscheinlichster Pfad
    '/blog/posts/' + filename,
    '../posts/' + filename,
    './posts/' + filename
  ];
  
  return new Promise((resolve, reject) => {
    const tryPath = (index) => {
      if (index >= paths.length) {
        reject(new Error(`Could not load ${filename} from any path`));
        return;
      }
      
      fetch(paths[index])
        .then(r => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.text();
        })
        .then(text => {
          console.log(`Successfully loaded ${filename} from ${paths[index]}`);
          resolve(text);
        })
        .catch(error => {
          console.log(`Failed to load ${filename} from ${paths[index]}:`, error);
          tryPath(index + 1);
        });
    };
    
    tryPath(0);
  });
}

// Optimierte Funktion zum Laden aller Posts parallel
async function loadAllPosts() {
  // Prüfe Cache
  const now = Date.now();
  if (postsCache && (now - lastCacheTime) < CACHE_DURATION) {
    return postsCache;
  }

  const files = fetchMarkdownList();
  const posts = [];
  
  // Lade alle Posts parallel statt sequentiell
  const loadPromises = files.map(async (f) => {
    try {
      const raw = await fetchMarkdown(f);
      const { attributes, body } = parseFrontmatter(raw);
      
      return {
        ...attributes,
        body,
        slug: f.replace(/\.md$/, ''),
        filename: f,
        date: attributes.date || f.slice(0, 10),
      };
    } catch (error) {
      console.error('Failed to load post:', f, error);
      return null;
    }
  });

  // Warte auf alle parallelen Requests
  const results = await Promise.all(loadPromises);
  
  // Filtere erfolgreich geladene Posts
  const validPosts = results.filter(post => post !== null);
  
  // Wenn keine Posts geladen wurden, versuche JSON-Fallback
  if (validPosts.length === 0) {
    try {
      const jsonResponse = await fetch('posts.json');
      if (jsonResponse.ok) {
        const jsonData = await jsonResponse.json();
        postsCache = jsonData;
        lastCacheTime = now;
        return jsonData;
      }
    } catch (jsonError) {
      console.error('JSON fallback also failed:', jsonError);
    }
  }
  
  // Cache die Ergebnisse
  postsCache = validPosts;
  lastCacheTime = now;
  return validPosts;
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

// Deutsche Datumsformatierung
function formatGermanDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('de-DE', options);
}

function markdownToHtml(md) {
  // Tabellen-Support
  md = md.replace(/\|([^\n]*)\|\n\|([\s\S]*?)\|\n((\|.*\|\n)+)/g, function(match, header, align, rows) {
    const headers = header.split('|').map(h => h.trim()).filter(Boolean);
    const aligns = align.split('|').map(a => a.trim());
    const bodyRows = rows.trim().split('\n').map(r => r.split('|').map(c => c.trim()).filter(Boolean));
    let html = '<table><thead><tr>';
    headers.forEach(h => html += '<th>' + h + '</th>');
    html += '</tr></thead><tbody>';
    bodyRows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => html += '<td>' + cell + '</td>');
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  });

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

  try {
    const posts = await loadAllPosts();
    
    if (posts.length === 0) {
      mainArticleDiv.innerHTML = '<p>Keine Artikel gefunden.</p>';
      gridDiv.innerHTML = '';
      return;
    }
    
    posts.sort((a, b) => b.date.localeCompare(a.date));

    // Main Article
    if (posts[0]) {
      const p = posts[0];
      mainArticleDiv.innerHTML = `
        <div class="main-article-card">
          <img src="${p.image}" alt="${p.title}">
          <div class="blog-date">Artikel vom ${formatGermanDate(p.date)}</div>
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
          <div class="blog-date">Artikel vom ${formatGermanDate(p.date)}</div>
          <h3>${p.title}</h3>
          <div class="blog-summary">${p.summary || ''}</div>
          <a class="blog-readmore" href="article.html?slug=${p.slug}">Jetzt Weiterlesen.</a>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to render blog overview:', error);
    mainArticleDiv.innerHTML = '<p>Fehler beim Laden der Artikel.</p>';
    gridDiv.innerHTML = '';
  }
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
  
  try {
    // Versuche zuerst aus dem Cache
    let posts = postsCache;
    if (!posts) {
      posts = await loadAllPosts();
    }
    
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      card.innerHTML = '<p>Artikel nicht gefunden.</p>';
      return;
    }
    
    card.innerHTML = `
      <img src="${post.image}" alt="${post.title}">
      <div class="blog-date">Artikel vom ${formatGermanDate(post.date)}</div>
      <h1>${post.title}</h1>
      <div class="article-content">${markdownToHtml(post.body)}</div>
    `;
  } catch (error) {
    console.error('Failed to load article:', error);
    card.innerHTML = `
      <p>Artikel konnte nicht geladen werden.</p>
      <p>Fehler: ${error.message}</p>
    `;
  }
}

if (document.getElementById('main-article')) renderBlogOverview();
if (document.getElementById('article-card')) renderBlogArticle();

// Header hide/show on scroll (wie auf der Homepage)
(function() {
  var header = document.querySelector('.header');
  if (header) {
    let lastScrollTop = 0;
    let scrollThreshold = 100;

    window.addEventListener('scroll', function() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Change background based on scroll position
      if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.45)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.15)';
      }
      // Hide/show header based on scroll direction
      if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down - hide header
          header.classList.add('hidden');
        } else {
          // Scrolling up - show header
          header.classList.remove('hidden');
        }
      } else {
        // Always show header at the top
        header.classList.remove('hidden');
      }
      lastScrollTop = scrollTop;
    });
  }
})();
