class CategoryDisplay {
  constructor() {
    this.mainContainer = document.getElementById('main-categories');
    this.subContainer = document.getElementById('subcategories');
    this.initialize();
    
    // Adiciona listener para atualização de categorias
    window.addEventListener('categoriesUpdated', () => {
      this.renderCategories();
    });
  }

  initialize() {
    this.renderCategories();
    this.setupEventListeners();
  }

  getCategories() {
    const savedCategories = JSON.parse(localStorage.getItem('animuCategories')) || [];
    
    // Se não houver categorias salvas, retorna as categorias padrão
    if (savedCategories.length === 0) {
      const defaultCategories = [
        {
          id: 1,
          name: 'Ação',
          icon: '⚔️',
          description: 'Combates épicos e adrenalina pura',
          isSubcategory: false,
          gradient: {
            start: '#FF6B6B',
            end: '#FF8E8E'
          }
        },
        {
          id: 2,
          name: 'Drama',
          icon: '🎭',
          description: 'Histórias emocionantes e profundas',
          isSubcategory: false,
          gradient: {
            start: '#4ECDC4',
            end: '#45B7AF'
          }
        }
        // ... outras categorias padrão se necessário
      ];
      
      // Salva as categorias padrão no localStorage
      localStorage.setItem('animuCategories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    
    return savedCategories;
  }

  renderCategories() {
    const categories = this.getCategories();
    
    if (this.mainContainer && categories.length > 0) {
      this.mainContainer.innerHTML = categories
        .filter(cat => !cat.isSubcategory) // Filtra apenas categorias principais
        .map(category => this.createCategoryCard(category))
        .join('');
    }

    if (this.subContainer && categories.length > 0) {
      this.subContainer.innerHTML = categories
        .filter(cat => cat.isSubcategory) // Filtra apenas subcategorias
        .map(category => this.createSubcategoryTag(category))
        .join('');
    }

    // Se não houver categorias, mostra mensagem
    if (categories.length === 0) {
      this.mainContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-xl text-gray-500">Nenhuma categoria encontrada.</p>
        </div>
      `;
    }
  }

  createCategoryCard(category) {
    const animeCount = this.countAnimesByCategory(category.name);
    return `
      <div class="category-card" 
           data-category="${category.name.toLowerCase()}" 
           style="background: linear-gradient(45deg, ${category.gradient.start}, ${category.gradient.end})">
        <div class="category-icon">${category.icon}</div>
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <span class="anime-count">${animeCount} ${animeCount === 1 ? 'anime' : 'animes'}</span>
      </div>
    `;
  }

  createSubcategoryTag(category) {
    const animeCount = this.countAnimesByCategory(category.name);
    return `
      <span class="subcategory-tag" 
            data-subcategory="${category.name.toLowerCase()}"
            title="${animeCount} ${animeCount === 1 ? 'anime' : 'animes'}"
            style="background: linear-gradient(45deg, ${category.gradient.start}, ${category.gradient.end})">
        ${category.icon} ${category.name}
      </span>
    `;
  }

  countAnimesByCategory(category) {
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    return animes.filter(anime =>
      anime.genres.some(genre =>
        this.normalizeCategory(genre) === this.normalizeCategory(category)
      )
    ).length;
  }

  normalizeCategory(category) {
    return category.toLowerCase().trim();
  }

  setupEventListeners() {
    // Delegação de eventos para categorias e subcategorias
    document.addEventListener('click', (e) => {
      const categoryCard = e.target.closest('.category-card');
      const subcategoryTag = e.target.closest('.subcategory-tag');

      if (categoryCard) {
        const category = categoryCard.dataset.category;
        this.filterByCategory(category);
      } else if (subcategoryTag) {
        const category = subcategoryTag.dataset.subcategory;
        this.filterByCategory(category);
      }
    });
  }

  filterByCategory(category) {
    window.location.href = `animes.html?anime=all&category=${encodeURIComponent(category)}`;
  }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new CategoryDisplay();
});