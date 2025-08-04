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

// Meta-Tags dynamisch setzen
function setMetaTags(post) {
  const baseUrl = window.location.origin + window.location.pathname;
  
  // Fallback-Werte für fehlende Meta-Daten
  const metaDescription = post.meta_description || post.summary || 'Blogartikel zu Shopify, Webdesign und E-Commerce von Maik Gossen.';
  const keywords = post.keywords || 'Shopify, Webdesign, E-Commerce, Blog';
  const ogTitle = post.og_title || post.title + ' | DD-Gossen';
  const ogDescription = post.og_description || metaDescription;
  const ogImage = post.og_image ? `https://dd-gossen.com/blog/${post.og_image}` : 'https://dd-gossen.com/blog/images/Testbild.webp';
  const canonicalUrl = `${baseUrl}?slug=${post.slug}`;
  
  // Meta-Tags setzen
  document.getElementById('dynamic-title').textContent = post.title + ' | DD-Gossen';
  document.getElementById('dynamic-description').setAttribute('content', metaDescription);
  document.getElementById('dynamic-keywords').setAttribute('content', keywords);
  
  // Open Graph Tags
  document.getElementById('og-title').setAttribute('content', ogTitle);
  document.getElementById('og-description').setAttribute('content', ogDescription);
  document.getElementById('og-image').setAttribute('content', ogImage);
  document.getElementById('og-url').setAttribute('content', canonicalUrl);
  
  // Twitter Card Tags
  document.getElementById('twitter-title').setAttribute('content', ogTitle);
  document.getElementById('twitter-description').setAttribute('content', ogDescription);
  document.getElementById('twitter-image').setAttribute('content', ogImage);
  
  // Canonical URL
  document.getElementById('canonical-url').setAttribute('href', canonicalUrl);
  
  // Schema Markup aktualisieren
  updateSchemaMarkup(post, canonicalUrl);
}

// Schema Markup dynamisch aktualisieren
function updateSchemaMarkup(post, canonicalUrl) {
  // Breadcrumb Schema aktualisieren
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dd-gossen.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://dd-gossen.com/blog/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": canonicalUrl
      }
    ]
  };
  
  // Article Schema aktualisieren
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta_description || post.summary,
    "image": post.og_image ? `https://dd-gossen.com/blog/${post.og_image}` : 'https://dd-gossen.com/blog/images/Testbild.webp',
    "author": {
      "@type": "Person",
      "name": "Maik Gossen",
      "jobTitle": "Shopify Developer & Web Designer"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DD-Gossen",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dd-gossen.com/favicon.png"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "inLanguage": "de",
    "keywords": post.keywords || 'Shopify, Webdesign, E-Commerce, Blog'
  };
  
  // Schema Scripts aktualisieren
  const breadcrumbScript = document.getElementById('breadcrumb-schema');
  const articleScript = document.getElementById('article-schema');
  
  if (breadcrumbScript) {
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema, null, 2);
  }
  
  if (articleScript) {
    articleScript.textContent = JSON.stringify(articleSchema, null, 2);
  }
}

// Lade Posts aus JSON
async function loadPosts() {
  try {
    console.log('Lade posts.json...');
    const response = await fetch('posts.json');
    console.log('Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log('Geladene Posts:', posts.length, posts);
    return posts;
  } catch (error) {
    console.error('Fehler beim Laden der Posts:', error);
    console.error('URL:', window.location.href);
    console.error('Aktueller Pfad:', window.location.pathname);
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
      <div class="blog-date">Artikel vom ${formatGermanDate(newestPost.date)}</div>
      <img src="${newestPost.image}" alt="${newestPost.title}">
      <h2>${newestPost.title}</h2>
      <div class="blog-summary">${newestPost.summary}</div>
      <a class="blog-readmore" href="${newestPost.slug}">Jetzt Weiterlesen.</a>
    </div>
  `;

  // Weitere Artikel im Grid
  const otherPosts = posts.slice(1);
  blogGrid.innerHTML = otherPosts.map(post => `
    <div class="blog-card">
      <div class="blog-date">Artikel vom ${formatGermanDate(post.date)}</div>
      <img src="${post.image}" alt="${post.title}">
      <h3>${post.title}</h3>
      <div class="blog-summary">${post.summary}</div>
      <a class="blog-readmore" href="${post.slug}">Jetzt Weiterlesen.</a>
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

  // Meta-Tags setzen
  setMetaTags(post);

  articleCard.innerHTML = `
    <h1 class="article-title">${post.title}</h1>
    <div class="blog-date">Artikel vom ${formatGermanDate(post.date)}</div>
    <img src="${post.image}" alt="${post.title}">
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
