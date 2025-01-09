class NoticiasManager {
  constructor() {
    this.newsData = JSON.parse(localStorage.getItem('news') || '[]');
    // Adicionar listeners para atualizações
    window.addEventListener('newsUpdated', () => this.refreshData());
    window.addEventListener('storage', (e) => {
      if (e.key === 'news') this.refreshData();
    });

    // Identificar página atual
    this.currentPage = this.getCurrentPage();

    // Inicializar baseado na página
    if (this.currentPage === 'noticia') {
      this.initSingleNews();
    } else {
      this.initNewsGrid();
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('noticia.html')) return 'noticia';
    if (path.includes('noticias.html')) return 'noticias';
    if (path.includes('inicio.html')) return 'inicio';
    return '';
  }

  initNewsGrid() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    // Se estiver na página de notícias, inicializar filtros
    if (this.currentPage === 'noticias') {
      this.initializeFilters();
    } else {
      // Na página inicial, mostrar apenas 4 notícias
      this.renderNewsGrid(newsGrid, 4);
    }
  }

  initSingleNews() {
    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');

    if (!noticiaId) {
      window.location.href = 'noticias.html';
      return;
    }

    this.loadNoticia(noticiaId);
    this.setupShareButtons();
  }

  createNewsCard(noticia) {
    return `
            <article class="news-card">
                <div class="news-image-container">
                    <img src="${noticia.image}" alt="${noticia.title}" class="news-image">
                    <span class="news-category">${noticia.category}</span>
                </div>
                <div class="news-content">
                    <div class="news-metadata">
                        <span class="news-date">${this.formatDate(noticia.date)}</span>
                        <div class="news-tags">
                            ${noticia.tags.map(tag => `<span class="news-tag">#${tag}</span>`).join('')}
                        </div>
                    </div>
                    <h3 class="news-title">${noticia.title}</h3>
                    <p class="news-summary">${noticia.summary}</p>
                    <a href="noticia.html?id=${noticia.id}" class="news-read-more">
                        Ler mais
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </div>
            </article>
        `;
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  renderNewsGrid(container, limit = null, newsData = null) {
    // Ordena as notícias por data, mais recentes primeiro
    const sortedNews = newsData || [...this.newsData].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    const newsToShow = limit ? sortedNews.slice(0, limit) : sortedNews;
    container.innerHTML = newsToShow.map(noticia => this.createNewsCard(noticia)).join('');
  }

  // Método para atualizar os dados quando houver mudanças
  refreshData() {
    this.newsData = JSON.parse(localStorage.getItem('news') || '[]');
    const newsGrid = document.querySelector('.news-grid');
    if (newsGrid) {
      // Se estiver na página inicial, mostrar apenas 4 notícias
      // Se estiver na página de notícias, mostrar todas
      const limit = window.location.pathname.includes('inicio.html') ? 4 : null;
      this.renderNewsGrid(newsGrid, limit);
    }
  }

  // Adicionar novos métodos para gerenciar filtros e paginação
  initializeFilters() {
    this.currentPage = 1;
    this.itemsPerPage = 12;

    // Elementos do DOM
    this.searchInput = document.getElementById('search-news');
    this.categoryFilter = document.getElementById('category-filter');
    this.sortSelect = document.getElementById('sort-news');
    this.newsGrid = document.querySelector('.news-grid');
    this.prevButton = document.getElementById('prev-page');
    this.nextButton = document.getElementById('next-page');
    this.pageInfo = document.getElementById('page-info');

    if (this.searchInput) {
      this.setupEventListeners();
      this.updateNews();
    }
  }

  setupEventListeners() {
    this.searchInput.addEventListener('input', () => this.updateNews());
    this.categoryFilter.addEventListener('change', () => this.updateNews());
    this.sortSelect.addEventListener('change', () => this.updateNews());
    this.prevButton.addEventListener('click', () => this.changePage('prev'));
    this.nextButton.addEventListener('click', () => this.changePage('next'));
  }

  changePage(direction) {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next') {
      this.currentPage++;
    }
    this.updateNews();
  }

  filterAndSortNews() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const selectedCategory = this.categoryFilter.value;
    const sortOrder = this.sortSelect.value;

    // Filtrar
    let filteredNews = this.newsData.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchTerm) ||
        news.summary.toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategory || news.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Ordenar
    filteredNews.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

    return filteredNews;
  }

  updateNews() {
    const filteredNews = this.filterAndSortNews();
    const totalPages = Math.ceil(filteredNews.length / this.itemsPerPage);

    // Ajustar página atual se necessário
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages || 1;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedNews = filteredNews.slice(start, start + this.itemsPerPage);

    // Renderizar notícias e atualizar controles
    this.renderNewsGrid(this.newsGrid, null, paginatedNews);
    this.updatePaginationControls(totalPages);
  }

  updatePaginationControls(totalPages) {
    this.prevButton.disabled = this.currentPage === 1;
    this.nextButton.disabled = this.currentPage === totalPages;
    this.pageInfo.textContent = `Página ${this.currentPage} de ${totalPages || 1}`;
  }

  loadNoticia(id) {
    const noticia = this.newsData.find(item => item.id.toString() === id.toString());
    if (!noticia) {
      window.location.href = 'noticias.html';
      return;
    }

    // Atualizar página
    document.title = `${noticia.title} | Animu`;
    this.updateMetaTags(noticia);

    // Preencher conteúdo
    const elements = {
      date: document.getElementById('news-date'),
      category: document.getElementById('news-category'),
      title: document.getElementById('news-title'),
      image: document.getElementById('news-image'),
      summary: document.getElementById('news-summary'),
      content: document.getElementById('news-content'),
      tags: document.getElementById('news-tags')
    };

    if (elements.date) elements.date.textContent = this.formatDate(noticia.date);
    if (elements.category) elements.category.textContent = noticia.category;
    if (elements.title) elements.title.textContent = noticia.title;
    if (elements.image) {
      elements.image.src = noticia.image;
      elements.image.alt = noticia.title;
    }
    if (elements.summary) elements.summary.textContent = noticia.summary;
    if (elements.content) elements.content.innerHTML = this.formatContent(noticia.content);
    if (elements.tags) {
      elements.tags.innerHTML = noticia.tags
        .map(tag => `<span class="news-tag">#${tag}</span>`)
        .join('');
    }

    // Carregar notícias relacionadas
    this.loadRelatedNews(noticia);
  }

  formatContent(content) {
    // Converter quebras de linha em parágrafos
    return content.split('\n')
      .filter(paragraph => paragraph.trim())
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  }

  loadRelatedNews(currentNoticia) {
    const relatedNews = this.newsData
      .filter(item =>
        item.id !== currentNoticia.id &&
        (item.category === currentNoticia.category ||
          item.tags.some(tag => currentNoticia.tags.includes(tag)))
      )
      .slice(0, 2);

    const relatedGrid = document.getElementById('related-news-grid');
    relatedGrid.innerHTML = relatedNews
      .map(noticia => this.createRelatedNewsCard(noticia))
      .join('');
  }

  createRelatedNewsCard(noticia) {
    return `
            <a href="noticia.html?id=${noticia.id}" class="related-news-card">
                <div class="news-image-container">
                    <img src="${noticia.image}" alt="${noticia.title}" class="news-image">
                    <span class="news-category">${noticia.category}</span>
                </div>
                <div class="news-content">
                    <h4 class="text-lg font-semibold mb-2">${noticia.title}</h4>
                    <p class="text-sm opacity-75 line-clamp-2">${noticia.summary}</p>
                </div>
            </a>
        `;
  }

  updateMetaTags(noticia) {
    // Atualizar meta tags para SEO e compartilhamento
    const meta = {
      description: noticia.summary,
      image: noticia.image,
      url: window.location.href
    };

    // Meta tags básicas
    this.updateMetaTag('description', meta.description);

    // Open Graph
    this.updateMetaTag('og:title', noticia.title);
    this.updateMetaTag('og:description', meta.description);
    this.updateMetaTag('og:image', meta.image);
    this.updateMetaTag('og:url', meta.url);

    // Twitter Card
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', noticia.title);
    this.updateMetaTag('twitter:description', meta.description);
    this.updateMetaTag('twitter:image', meta.image);
  }

  updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`) ||
      document.querySelector(`meta[property="${name}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(name.includes('og:') ? 'property' : 'name', name);
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  }

  setupShareButtons() {
    const shareData = {
      url: window.location.href,
      title: document.title,
      text: document.getElementById('news-summary')?.textContent
    };

    // Twitter
    document.querySelector('.share-btn.twitter').addEventListener('click', () => {
      const text = encodeURIComponent(shareData.title);
      const url = encodeURIComponent(shareData.url);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    });

    // Facebook
    document.querySelector('.share-btn.facebook').addEventListener('click', () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
    });

    // WhatsApp
    document.querySelector('.share-btn.whatsapp').addEventListener('click', () => {
      const text = encodeURIComponent(`${shareData.title}\n\n${shareData.url}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }
}

// Inicializar apenas uma vez
const noticiasManager = new NoticiasManager();