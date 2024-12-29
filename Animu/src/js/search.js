class AnimeSearchBar {
  constructor(options = {}) {
    this.options = {
      containerId: 'search-area',
      inputId: 'search-input',
      resultsId: 'search-results',
      debounceTime: 300,
      minChars: 1,
      maxResults: 10,
      filters: {
        genre: {
          label: 'Gênero',
          options: [
            { value: '', label: 'Todos' },
            { value: 'action', label: 'Ação' },
            { value: 'adventure', label: 'Aventura' },
            { value: 'comedy', label: 'Comédia' },
            { value: 'drama', label: 'Drama' },
            { value: 'fantasy', label: 'Fantasia' },
            { value: 'horror', label: 'Terror' },
            { value: 'mecha', label: 'Mecha' },
            { value: 'music', label: 'Música' },
            { value: 'mystery', label: 'Mistério' },
            { value: 'psychological', label: 'Psicológico' },
            { value: 'romance', label: 'Romance' },
            { value: 'sci-fi', label: 'Ficção Científica' },
            { value: 'slice-of-life', label: 'Slice of Life' },
            { value: 'sports', label: 'Esportes' },
            { value: 'supernatural', label: 'Sobrenatural' },
            { value: 'thriller', label: 'Thriller' }
          ]
        },
        year: {
          label: 'Ano',
          options: [
            { value: '', label: 'Todos' },
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' },
            { value: '2021', label: '2021' },
            { value: '2020', label: '2020' },
            { value: '2019', label: '2019' },
            { value: '2018', label: '2018' },
            { value: 'older', label: '2017 ou anterior' }
          ]
        },
        status: {
          label: 'Status',
          options: [
            { value: '', label: 'Todos' },
            { value: 'airing', label: 'Em exibição' },
            { value: 'completed', label: 'Completo' },
            { value: 'upcoming', label: 'Próximos' }
          ]
        },
        season: {
          label: 'Temporada',
          options: [
            { value: '', label: 'Todas' },
            { value: 'winter', label: 'Inverno' },
            { value: 'spring', label: 'Primavera' },
            { value: 'summer', label: 'Verão' },
            { value: 'fall', label: 'Outono' }
          ]
        },
        rating: {
          label: 'Classificação',
          options: [
            { value: '', label: 'Todas' },
            { value: '9', label: '9+ ⭐' },
            { value: '8', label: '8+ ⭐' },
            { value: '7', label: '7+ ⭐' },
            { value: '6', label: '6+ ⭐' },
            { value: '5', label: '5+ ⭐' }
          ]
        },
        source: {
          label: 'Fonte',
          options: [
            { value: '', label: 'Todas' },
            { value: 'manga', label: 'Mangá' },
            { value: 'light_novel', label: 'Light Novel' },
            { value: 'original', label: 'Original' },
            { value: 'game', label: 'Jogo' },
            { value: 'visual_novel', label: 'Visual Novel' }
          ]
        }
      },
      ...options
    };

    this.filters = {
      genre: '',
      year: '',
      rating: ''
    };

    this.container = document.getElementById(this.options.containerId);
    this.setupSearchBar();
    this.setupEventListeners();
  }

  createFilterSelect(filterKey) {
    const filter = this.options.filters[filterKey];
    return `
      <div class="filter-group">
        <label>${filter.label}</label>
        <select id="${filterKey}-filter">
          ${filter.options.map(option =>
      `<option value="${option.value}">${option.label}</option>`
    ).join('')}
        </select>
      </div>
    `;
  }

  setupSearchBar() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="search-container">
        <div class="search-input-wrapper">
          <input type="text" 
                 id="${this.options.inputId}" 
                 class="search-input" 
                 placeholder="Pesquisar anime...">
          <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </div>

        <div class="filter-dropdown">
          <button class="filter-btn" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
          </button>
          <div class="filter-menu">
            ${Object.keys(this.options.filters)
        .map(filterKey => this.createFilterSelect(filterKey))
        .join('')}
            <button class="apply-filters-btn">Aplicar Filtros</button>
          </div>
        </div>

        <button class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
        <div id="${this.options.resultsId}" class="search-results"></div>
      </div>
    `;

    this.input = document.getElementById(this.options.inputId);
    this.results = document.getElementById(this.options.resultsId);
    this.searchButton = this.container.querySelector('.search-button');
    this.filterBtn = this.container.querySelector('.filter-btn');
    this.filterMenu = this.container.querySelector('.filter-menu');
    this.applyFiltersBtn = this.container.querySelector('.apply-filters-btn');

    // Configurar eventos dos filtros
    this.setupFilterEvents();
  }

  setupEventListeners() {
    if (!this.input || !this.results) return;

    // Debounce function
    let timeout = null;
    this.input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.handleSearch(), this.options.debounceTime);
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });

    this.searchButton.addEventListener('click', () => this.handleSearch());

    // Fechar resultados ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.hideResults();
      }
    });
  }

  setupFilterEvents() {
    // Toggle do menu de filtros
    this.filterBtn.addEventListener('click', () => {
      this.filterMenu.classList.toggle('show');
    });

    // Fechar filtros ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.filterMenu.classList.remove('show');
      }
    });

    // Aplicar filtros
    this.applyFiltersBtn.addEventListener('click', () => {
      this.filters = {
        genre: this.container.querySelector('#genre-filter').value,
        year: this.container.querySelector('#year-filter').value,
        rating: this.container.querySelector('#rating-filter').value
      };
      this.handleSearch();
      this.filterMenu.classList.remove('show');
    });
  }

  async handleSearch() {
    const query = this.input.value.trim();

    if (query.length < this.options.minChars) {
      this.hideResults();
      return;
    }

    try {
      const results = await this.searchAnimes(query);
      this.displayResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      this.displayError();
    }
  }

  async searchAnimes(query) {
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 1);

    const scoredResults = animes
      .map(anime => {
        // Calcula pontuação de relevância para cada anime
        let score = 0;
        const normalizedTitle = this.normalizeText(anime.primaryTitle);

        // Pontuação para título principal
        if (normalizedTitle === normalizedQuery) score += 100;
        if (normalizedTitle.startsWith(normalizedQuery)) score += 50;
        if (normalizedTitle.includes(normalizedQuery)) score += 30;

        // Pontuação para palavras individuais no título
        queryWords.forEach(word => {
          if (normalizedTitle.includes(word)) score += 15;
        });

        // Pontuação para títulos alternativos
        anime.alternativeTitles.forEach(alt => {
          const normalizedAlt = this.normalizeText(alt.title);
          if (normalizedAlt.includes(normalizedQuery)) score += 20;
          queryWords.forEach(word => {
            if (normalizedAlt.includes(word)) score += 10;
          });
        });

        // Pontuação para gêneros
        if (anime.genres.some(genre =>
          this.normalizeText(genre).includes(normalizedQuery)
        )) {
          score += 5;
        }

        // Aplicar filtros
        const passesFilters = this.applyFilters(anime);

        return {
          anime,
          score: passesFilters ? score : 0
        };
      })
      .filter(result => result.score > 0) // Remove resultados sem relevância
      .sort((a, b) => b.score - a.score) // Ordena por relevância
      .slice(0, this.options.maxResults)
      .map(result => result.anime);

    return scoredResults;
  }

  normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, ''); // Remove caracteres especiais
  }

  applyFilters(anime) {
    const genreMatch = !this.filters.genre ||
      anime.genres.some(g => this.normalizeText(g) === this.normalizeText(this.filters.genre));

    const yearMatch = !this.filters.year || (
      this.filters.year === 'older' ?
        parseInt(anime.releaseYear) <= 2017 :
        anime.releaseYear.toString() === this.filters.year
    );

    const statusMatch = !this.filters.status ||
      this.normalizeText(anime.status) === this.normalizeText(this.filters.status);

    const seasonMatch = !this.filters.season ||
      (anime.season && this.normalizeText(anime.season.period) === this.normalizeText(this.filters.season));

    const ratingMatch = !this.filters.rating ||
      (anime.score && parseFloat(anime.score) >= parseFloat(this.filters.rating));

    const sourceMatch = !this.filters.source ||
      (anime.source && this.normalizeText(anime.source) === this.normalizeText(this.filters.source));

    return genreMatch && yearMatch && statusMatch &&
      seasonMatch && ratingMatch && sourceMatch;
  }

  displayResults(results) {
    if (!this.results) return;

    if (results.length === 0) {
      this.results.innerHTML = `
        <div class="no-results">
          Nenhum anime encontrado
        </div>
      `;
    } else {
      this.results.innerHTML = results
        .map(anime => this.createResultItem(anime))
        .join('');
    }

    this.showResults();
  }

  createResultItem(anime) {
    return `
      <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
         class="search-result-item">
        <img src="${anime.coverImage}" 
             alt="${anime.primaryTitle}" 
             class="search-result-image">
        <div class="search-result-info">
          <div class="search-result-title">${anime.primaryTitle}</div>
          <div class="search-result-metadata">
            ${anime.releaseYear} • ⭐ ${anime.score || 'N/A'}
          </div>
        </div>
      </a>
    `;
  }

  displayError() {
    if (!this.results) return;

    this.results.innerHTML = `
      <div class="no-results">
        Ocorreu um erro na busca
      </div>
    `;
    this.showResults();
  }

  showResults() {
    if (this.results) {
      this.results.style.display = 'block';
    }
  }

  hideResults() {
    if (this.results) {
      this.results.style.display = 'none';
    }
  }
}

// Inicialização da barra de busca
document.addEventListener('DOMContentLoaded', () => {
  new AnimeSearchBar({
    debounceTime: 400,
    maxResults: 8
  });
});