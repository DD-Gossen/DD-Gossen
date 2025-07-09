// blog/blog.js

// Cache für geladene Posts
let postsCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten

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

// Lade alle Posts aus JSON
async function loadAllPosts() {
  // Prüfe Cache
  const now = Date.now();
  if (postsCache && (now - lastCacheTime) < CACHE_DURATION) {
    return postsCache;
  }

  try {
    const jsonResponse = await fetch('posts.json');
    if (!jsonResponse.ok) {
      throw new Error(`HTTP error! status: ${jsonResponse.status}`);
    }
    const jsonData = await jsonResponse.json();
    postsCache = jsonData;
    lastCacheTime = now;
    return jsonData;
  } catch (error) {
    console.error('Failed to load posts.json:', error);
    return [];
  }
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
    const posts = await loadAllPosts();
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      card.innerHTML = '<p>Artikel nicht gefunden.</p>';
      return;
    }
    
    card.innerHTML = `
      <img src="${post.image}" alt="${post.title}">
      <div class="blog-date">Artikel vom ${formatGermanDate(post.date)}</div>
      <h1>${post.title}</h1>
      <div class="article-content">${post.body}</div>
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
