// Função para normalizar strings de categoria
function normalizeCategory(category) {
  const normalizations = {
    'action': ['ação', 'action', 'acao'],
    'drama': ['drama'],
    'comedy': ['comédia', 'comedy', 'comedia'],
    'fantasy': ['fantasia', 'fantasy'],
    'sci-fi': ['ficção científica', 'sci-fi', 'sci fi', 'ficcao cientifica'],
    'romance': ['romance', 'romântico', 'romantico'],
    'supernatural': ['sobrenatural', 'supernatural'],
    'game': ['game', 'games', 'jogos'],
    'isekai': ['isekai'],
    'shounen': ['shounen', 'shonen'],
    'slice of life': ['slice of life', 'slice-of-life'],
    'mecha': ['mecha', 'robot', 'robô'],
    'horror': ['horror', 'terror'],
    'sports': ['sports', 'esporte', 'esportes'],
    'music': ['music', 'música', 'musica'],
    'historical': ['historical', 'histórico', 'historico'],
    'psychological': ['psychological', 'psicológico', 'psicologico'],
    'adventure': ['adventure', 'aventura']
  };

  category = category.toLowerCase().trim();

  for (const [key, variants] of Object.entries(normalizations)) {
    if (variants.includes(category)) {
      return key;
    }
  }

  return category;
}

// Função para obter todos os animes do localStorage
function getAnimes() {
  try {
    return JSON.parse(localStorage.getItem('animeData')) || [];
  } catch (e) {
    console.error('Erro ao carregar animes:', e);
    return [];
  }
}

// Função para contar animes por categoria
function countAnimesByCategory(category) {
  const animes = getAnimes();
  return animes.filter(anime =>
    anime.genres.some(genre =>
      normalizeCategory(genre) === normalizeCategory(category)
    )
  ).length;
}

// Função para atualizar os contadores de anime
function updateAnimeCounts() {
  const categories = {
    'Ação': 'action',
    'Drama': 'drama',
    'Comédia': 'comedy',
    'Fantasia': 'fantasy',
    'Sci-Fi': 'sci-fi',
    'Romance': 'romance',
    'Sobrenatural': 'supernatural',
    'Games': 'game'
  };

  for (const [ptCategory, enCategory] of Object.entries(categories)) {
    const count = countAnimesByCategory(enCategory);
    const countElement = document.querySelector(`[data-category="${enCategory}"] .anime-count`);
    if (countElement) {
      countElement.textContent = `${count} ${count === 1 ? 'anime' : 'animes'}`;

      // Adiciona uma classe visual se a categoria estiver vazia
      const categoryCard = document.querySelector(`[data-category="${enCategory}"]`);
      if (categoryCard) {
        categoryCard.classList.toggle('empty-category', count === 0);
      }
    }
  }
}

// Função para filtrar animes por categoria
function filterByCategory(category) {
  const animes = getAnimes();
  const normalized = normalizeCategory(category);

  const filtered = animes.filter(anime =>
    anime.genres.some(genre => normalizeCategory(genre) === normalized)
  );

  if (filtered.length > 0) {
    // Modificado para usar 'all' como parâmetro e adicionar category como query param
    window.location.href = `animes.html?anime=all&category=${encodeURIComponent(category)}`;
  } else {
    alert('Nenhum anime encontrado nesta categoria.');
  }
}

// Função para inicializar os event listeners
function initializeCategories() {
  // Handler para todas as categorias (principais e subcategorias)
  const categoryCards = document.querySelectorAll('.category-card');
  const subcategoryTags = document.querySelectorAll('.subcategory-tag');

  // Adiciona handlers para todas as categorias
  [...categoryCards, ...subcategoryTags].forEach(element => {
    element.addEventListener('click', () => {
      const category = element.dataset.category || element.dataset.subcategory;
      filterByCategory(category);
    });

    // Adiciona o contador de animes como tooltip
    const category = element.dataset.category || element.dataset.subcategory;
    if (category) {
      const count = countAnimesByCategory(category);
      element.title = `${count} ${count === 1 ? 'anime' : 'animes'}`;
    }
  });

  // Atualiza os contadores iniciais
  updateAnimeCounts();

  // Log para debug
  console.log('Categorias inicializadas');
  console.log('Animes encontrados:', getAnimes().length);
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeCategories);