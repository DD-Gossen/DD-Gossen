// Einfacher Blog ohne Cache - funktioniert garantiert

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

// Lade Posts aus JSON
async function loadPosts() {
  try {
    const response = await fetch('posts.json');
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    return [];
  }
}

// Blog-Übersicht rendern
async function renderBlogOverview() {
  const mainArticle = document.getElementById('main-article');
  const blogGrid = document.getElementById('blog-grid');
  
  if (!mainArticle || !blogGrid) return;

  const posts = await loadPosts();
  
  if (posts.length === 0) {
    mainArticle.innerHTML = '<p>Keine Artikel gefunden.</p>';
    blogGrid.innerHTML = '';
    return;
  }

  // Sortiere nach Datum
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // Hauptartikel (neuester)
  const newestPost = posts[0];
  mainArticle.innerHTML = `
    <div class="main-article-card">
      <img src="${newestPost.image}" alt="${newestPost.title}">
      <div class="blog-date">Artikel vom ${formatGermanDate(newestPost.date)}</div>
      <h2>${newestPost.title}</h2>
      <div class="blog-summary">${newestPost.summary}</div>
      <a class="blog-readmore" href="article.html?slug=${newestPost.slug}">Jetzt Weiterlesen.</a>
    </div>
  `;

  // Weitere Artikel im Grid
  const otherPosts = posts.slice(1);
  blogGrid.innerHTML = otherPosts.map(post => `
    <div class="blog-card">
      <img src="${post.image}" alt="${post.title}">
      <div class="blog-date">Artikel vom ${formatGermanDate(post.date)}</div>
      <h3>${post.title}</h3>
      <div class="blog-summary">${post.summary}</div>
      <a class="blog-readmore" href="article.html?slug=${post.slug}">Jetzt Weiterlesen.</a>
    </div>
  `).join('');
}

// Einzelartikel rendern
async function renderBlogArticle() {
  const articleCard = document.getElementById('article-card');
  if (!articleCard) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  if (!slug) {
    articleCard.innerHTML = '<p>Artikel nicht gefunden.</p>';
    return;
  }

  const posts = await loadPosts();
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    articleCard.innerHTML = '<p>Artikel nicht gefunden.</p>';
    return;
  }

  articleCard.innerHTML = `
    <img src="${post.image}" alt="${post.title}">
    <div class="blog-date">Artikel vom ${formatGermanDate(post.date)}</div>
    <h1>${post.title}</h1>
    <div class="article-content">${post.body}</div>
  `;
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('main-article')) {
    renderBlogOverview();
  }
  if (document.getElementById('article-card')) {
    renderBlogArticle();
  }
});

// Header hide/show on scroll
(function() {
  var header = document.querySelector('.header');
  if (header) {
    let lastScrollTop = 0;
    let scrollThreshold = 100;

    window.addEventListener('scroll', function() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.45)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.15)';
      }
      
      if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
          header.classList.add('hidden');
        } else {
          header.classList.remove('hidden');
        }
      } else {
        header.classList.remove('hidden');
      }
      lastScrollTop = scrollTop;
    });
  }
})();
