class NewsManager {
  constructor() {
    // Carrega dados do localStorage e configura listeners globais
    this.newsData = JSON.parse(localStorage.getItem('news') || '[]');
    
    // Listeners para sincronização de dados entre abas
    window.addEventListener('newsUpdated', () => this.refreshData());
    window.addEventListener('storage', (e) => {
      if (e.key === 'news') this.refreshData();
    });

    // Identifica contexto da página atual
    this.currentPage = this.getCurrentPage();
    this.gridView = document.getElementById('news-grid-view');
    this.detailView = document.getElementById('news-detail-view');

    // Inicializa grid com base no contexto da página
    const newsGrid = document.querySelector('.news-grid');
    if (newsGrid) {
      this.currentPage === 'news' 
        ? this.initializeFilters()
        : this.currentPage === 'index' && this.renderNewsGrid(newsGrid, 4);
    }

    // Inicializa visualização detalhada na página de notícias
    this.currentPage === 'news' && this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    if (newsId && this.detailView) {
      this.showDetailView(newsId);
    } else if (this.gridView) {
      this.showGridView();
    } else {
      // Se não houver view específica, apenas renderizar o grid
      const newsGrid = document.querySelector('.news-grid');
      if (newsGrid) {
        this.renderNewsGrid(newsGrid);
      }
    }

    // Atualizar o histórico quando navegar
    window.addEventListener('popstate', (event) => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id && this.detailView) {
        this.showDetailView(id, false);
      } else if (this.gridView) {
        this.showGridView(false);
      }
    });
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('news.html')) return 'news';
    if (path.includes('index.html')) return 'index';
    return '';
  }

  initNewsGrid() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    // Se estiver na página de notícias, inicializar filtros
    if (this.currentPage === 'news') {
      this.initializeFilters();
    } else {
      // Na página inicial, mostrar apenas 4 notícias
      this.renderNewsGrid(newsGrid, 4);
    }
  }

  initSingleNews() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    if (!newsId) {
      window.location.href = 'news.html';
      return;
    }

    this.loadNoticia(newsId);
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
          <a href="news.html?id=${noticia.id}" class="news-read-more">
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
    if (!container) return;
    
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
      const limit = window.location.pathname.includes('index.html') ? 4 : null;
      this.renderNewsGrid(newsGrid, limit);
    }
  }

  // Adicionar novos métodos para gerenciar filtros e paginação
  initializeFilters() {
    // Configuração inicial dos filtros e paginação
    this.currentPage = 1;
    this.itemsPerPage = 12;

    // Cache dos elementos DOM para filtros
    this.searchInput = document.getElementById('search-news');
    this.categoryFilter = document.getElementById('category-filter');
    this.sortSelect = document.getElementById('sort-news');
    this.newsGrid = document.querySelector('.news-grid');
    this.prevButton = document.getElementById('prev-page');
    this.nextButton = document.getElementById('next-page');
    this.pageInfo = document.getElementById('page-info');

    // Inicializa listeners dos filtros se existirem
    this.searchInput && this.setupEventListeners();
    this.updateNews();
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

    // Aplica filtros de busca e categoria
    let filteredNews = this.newsData.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchTerm) ||
        news.summary.toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategory || news.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Ordena por data (crescente/decrescente)
    return filteredNews.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });
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

  loadNoticia(noticia) {
    // Redireciona para grid se notícia não existir
    if (!noticia) {
      this.showGridView();
      return;
    }

    // Atualiza metadata da página
    document.title = `${noticia.title} | Animu`;
    this.updateMetaTags(noticia);

    // Cache dos elementos DOM da notícia
    const elements = {
      date: document.getElementById('news-date'),
      category: document.getElementById('news-category'),
      title: document.getElementById('news-title'),
      image: document.getElementById('news-image'),
      summary: document.getElementById('news-summary'),
      content: document.getElementById('news-content'),
      tags: document.getElementById('news-tags')
    };

    // Preenche conteúdo nos elementos existentes
    elements.date && (elements.date.textContent = this.formatDate(noticia.date));
    elements.category && (elements.category.textContent = noticia.category);
    elements.title && (elements.title.textContent = noticia.title);
    if (elements.image) {
      elements.image.src = noticia.image;
      elements.image.alt = noticia.title;
    }
    elements.summary && (elements.summary.textContent = noticia.summary);
    elements.content && (elements.content.innerHTML = this.formatContent(noticia.content));
    elements.tags && (elements.tags.innerHTML = noticia.tags
      .map(tag => `<span class="news-tag">#${tag}</span>`)
      .join(''));

    // Configura compartilhamento e notícias relacionadas
    this.setupShareButtons();
    this.loadRelatedNews(noticia);
    
    // Alterna para visualização detalhada
    this.gridView.style.display = 'none';
    this.detailView.style.display = 'block';
  }

  showDetailView(id, updateHistory = true) {
    const noticia = this.newsData.find(item => item.id.toString() === id.toString());
    if (!noticia) {
      this.showGridView();
      return;
    }

    if (updateHistory) {
      history.pushState({}, '', `news.html?id=${id}`);
    }

    this.loadNoticia(noticia);
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
            <a href="news.html?id=${noticia.id}" class="related-news-card">
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
    // Dados para compartilhamento
    const shareData = {
      url: window.location.href,
      title: document.title,
      text: document.getElementById('news-summary')?.textContent
    };

    // Configura handlers para cada rede social
    const shareHandlers = {
      twitter: () => {
        const text = encodeURIComponent(shareData.title);
        const url = encodeURIComponent(shareData.url);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      },
      facebook: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
      },
      whatsapp: () => {
        const text = encodeURIComponent(`${shareData.title}\n\n${shareData.url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    };

    // Adiciona listeners aos botões
    Object.entries(shareHandlers).forEach(([network, handler]) => {
      document.querySelector(`.share-btn.${network}`).addEventListener('click', handler);
    });
  }

  showGridView(updateHistory = true) {
    if (!this.gridView || !this.detailView) return;

    this.gridView.style.display = 'block';
    this.detailView.style.display = 'none';
    document.title = 'Notícias | Animu';
    
    if (this.currentPage === 'news') {
      this.initializeFilters();
    }
    
    if (updateHistory) {
      history.pushState({}, '', 'news.html');
      this.updateMetaTags({
        title: 'Notícias | Animu',
        description: 'Notícias sobre anime e mangá',
        image: '', // imagem padrão
        url: window.location.href
      });
    }
  }
}

// Inicializa gerenciador de notícias
const newsManager = new NewsManager();