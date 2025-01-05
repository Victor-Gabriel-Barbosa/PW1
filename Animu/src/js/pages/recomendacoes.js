// Redireciona para login se não houver sessão ativa
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se o usuário está logado
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) {
    window.location.href = 'signin.html';
    return;
  }

  // Inicializar recomendações
  initializeRecommendations();

  // Atualizar avatar e nome do usuário
  updateUserInfo();
});

// Inicializa sistema de recomendações e configurações da página
function initializeRecommendations() {
  const user = getCurrentUser();
  if (!user) {
    console.error('Usuário não encontrado');
    return;
  }

  const animes = JSON.parse(localStorage.getItem('animeData'));
  if (!animes || animes.length === 0) {
    console.error('Nenhum anime encontrado no localStorage');
    return;
  }

  // Debug
  console.log('Usuário:', user);
  console.log('Total de animes:', animes.length);

  // Atualiza estatísticas
  updateStats(user);

  // Carrega as recomendações
  loadGenreBasedRecommendations(user);
  loadSimilarAnimeRecommendations(user);
  loadTrendingRecommendations();

  // Configura os filtros
  setupFilters();
}

// Retorna dados do usuário atual baseado na sessão
function getCurrentUser() {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  return users.find(user => user.id === sessionData.userId);
}

// Gera recomendações baseadas nos gêneros favoritos do usuário
function loadGenreBasedRecommendations(user) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const favoriteGenres = user.favoriteGenres || [];
  
  // Calcular pontuação de correspondência para cada anime
  const recommendations = animes
    .map(anime => {
      const matchScore = calculateGenreMatchScore(anime.genres, favoriteGenres);
      return { ...anime, matchScore };
    })
    .filter(anime => !user.watchedAnimes?.includes(anime.primaryTitle))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);

  renderRecommendations(recommendations, 'genres-recommendations');
}

// Recomenda animes similares aos já assistidos pelo usuário
function loadSimilarAnimeRecommendations(user) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const watchedAnimes = user.watchedAnimes || [];
  
  // Encontrar animes similares baseado nos já assistidos
  const recommendations = animes
    .filter(anime => !watchedAnimes.includes(anime.primaryTitle))
    .map(anime => {
      const similarityScore = calculateSimilarityScore(anime, watchedAnimes, animes);
      return { ...anime, matchScore: similarityScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);

  renderRecommendations(recommendations, 'similar-recommendations');
}

// Lista animes em tendência baseado em comentários e avaliações
function loadTrendingRecommendations() {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  
  if (animes.length === 0) {
    console.warn('Nenhum anime encontrado no localStorage');
    return;
  }

  const recommendations = animes
    .map(anime => ({
      ...anime,
      matchScore: calculatePopularityScore(anime, comments)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);

  renderRecommendations(recommendations, 'trending-recommendations');
}

// Calcula porcentagem de compatibilidade entre gêneros do anime e preferências do usuário
function calculateGenreMatchScore(animeGenres, userGenres) {
  if (!userGenres?.length || !animeGenres?.length) return 0;
  
  const matchingGenres = animeGenres.filter(genre => 
    userGenres.includes(genre)
  );
  
  const matchScore = (matchingGenres.length / userGenres.length) * 100;
  return Math.min(matchScore, 100); // Limita o score a 100%
}

// Determina similaridade entre um anime e histórico do usuário
function calculateSimilarityScore(anime, watchedAnimes, allAnimes) {
  if (!watchedAnimes.length) return 0;

  const watchedAnimeObjects = allAnimes.filter(a => 
    watchedAnimes.includes(a.primaryTitle)
  );

  let totalScore = 0;
  watchedAnimeObjects.forEach(watched => {
    const genreMatch = calculateGenreMatchScore(anime.genres, watched.genres);
    const studioMatch = anime.studio === watched.studio ? 20 : 0;
    totalScore += genreMatch + studioMatch;
  });

  return totalScore / watchedAnimes.length;
}

// Calcula score de popularidade baseado em comentários, notas e visualizações
function calculatePopularityScore(anime, comments) {
  const animeComments = comments[anime.primaryTitle] || [];
  const commentScore = animeComments.length * 10;
  const ratingScore = (anime.score || 0) * 10;
  const watchCount = animeComments.length * 5; // Adiciona peso para quantidade de visualizações
  
  return commentScore + ratingScore + watchCount;
}

// Renderiza cards de recomendação com lazy loading de imagens
function renderRecommendations(recommendations, containerId) {
  const container = document.querySelector(`#${containerId} .grid-recommendations`);
  if (!container) {
    console.error(`Container não encontrado: ${containerId}`);
    return;
  }

  // Adiciona classe de carregamento
  container.classList.add('loading');

  if (recommendations.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center p-8">
        <p class="text-gray-500 dark:text-gray-400">Nenhuma recomendação encontrada.</p>
      </div>`;
    container.classList.remove('loading');
    return;
  }

  // Debug
  console.log(`Renderizando ${recommendations.length} recomendações para ${containerId}`);

  const recommendationsHTML = recommendations.map(anime => {
    // Debug
    console.log('Anime:', anime);

    // Garante que o score seja um número válido ou use 'N/A'
    const formattedScore = typeof anime.score === 'number' ? anime.score.toFixed(1) : 'N/A';

    return `
      <div class="recommendation-card group">
        <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
           class="block h-full relative overflow-hidden rounded-lg">
          <div class="relative h-full aspect-[3/4]">
            <img src="${anime.coverImage}" 
                 alt="${anime.primaryTitle}" 
                 class="recommendation-image w-full h-full object-cover"
                 onerror="this.src='../src/img/no-image.png'"
                 loading="lazy">
            <div class="recommendation-info absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              <h3 class="recommendation-title text-lg font-semibold mb-2 text-white line-clamp-2">
                ${anime.primaryTitle}
              </h3>
              <div class="flex justify-between items-center">
                <span class="recommendation-match bg-purple-600 text-white px-2 py-1 rounded-full text-sm">
                  ${Math.round(anime.matchScore)}% Match
                </span>
                <span class="text-sm bg-black/50 px-2 py-1 rounded text-white">
                  ⭐ ${formattedScore}
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
  }).join('');

  container.innerHTML = recommendationsHTML;
  container.classList.remove('loading');

  // Adiciona lazy loading para as imagens
  container.querySelectorAll('.recommendation-image').forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
      // Debug
      console.log('Imagem carregada:', img.alt);
    });
  });
}

// Configura filtros de visualização das recomendações
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-tab');
  const sections = document.querySelectorAll('.recommendation-section');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active de todos os botões
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      // Atualiza visibilidade das seções
      sections.forEach(section => {
        if (filter === 'all') {
          section.style.display = 'block';
          section.classList.add('active');
        } else {
          if (section.id.includes(filter)) {
            section.style.display = 'block';
            section.classList.add('active');
          } else {
            section.style.display = 'none';
            section.classList.remove('active');
          }
        }
      });

      // Recarrega as recomendações da seção ativa
      const user = getCurrentUser();
      if (user) {
        if (filter === 'all' || filter === 'genres') {
          loadGenreBasedRecommendations(user);
        }
        if (filter === 'all' || filter === 'similar') {
          loadSimilarAnimeRecommendations(user);
        }
        if (filter === 'all' || filter === 'trending') {
          loadTrendingRecommendations();
        }
      }
    });
  });
}

// Atualiza recomendações quando o tema é alterado
document.addEventListener('themeChanged', function() {
  const user = getCurrentUser();
  if (user) {
    loadGenreBasedRecommendations(user);
    loadSimilarAnimeRecommendations(user);
    loadTrendingRecommendations();
  }
});

// Atualiza recomendações em tendência a cada 5 minutos
function setupAutoRefresh() {
  setInterval(() => {
    const user = getCurrentUser();
    if (user) {
      loadTrendingRecommendations(); // Atualiza apenas as tendências
    }
  }, 300000); // Atualiza a cada 5 minutos
}

// Inicia atualização automática
setupAutoRefresh();

// Captura erros globais da página
window.addEventListener('error', function(e) {
  console.error('Erro na página de recomendações:', e.error);
});

// Atualiza métricas de uso: precisão das recomendações, animes assistidos e média de avaliações
function updateStats(user) {
  const watchedCount = user.watchedAnimes?.length || 0;
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  
  // Calcula precisão média das recomendações
  let totalMatchScore = 0;
  let matchCount = 0;
  
  animes.forEach(anime => {
    if (user.favoriteGenres?.some(genre => anime.genres.includes(genre))) {
      totalMatchScore += calculateGenreMatchScore(anime.genres, user.favoriteGenres);
      matchCount++;
    }
  });

  const averageMatch = matchCount > 0 ? Math.round(totalMatchScore / matchCount) : 0;
  
  // Calcula média de avaliações
  let totalRating = 0;
  let ratingCount = 0;
  
  Object.values(comments).flat().forEach(comment => {
    if (comment.rating) {
      totalRating += comment.rating;
      ratingCount++;
    }
  });

  const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A';

  // Atualiza os elementos na página
  document.getElementById('match-accuracy').textContent = `${averageMatch}%`;
  document.getElementById('watched-count').textContent = watchedCount;
  document.getElementById('avg-rating').textContent = averageRating;

  // Atualizar barras de gêneros favoritos
  const genres = user.favoriteGenres || [];
  const genrePreferences = document.querySelector('.insight-content');
  
  if (genrePreferences && genres.length > 0) {
    const genreHTML = genres.slice(0, 3).map((genre, index) => {
      const percent = 100 - (index * 15); // Diminui 15% para cada posição
      return `
        <div class="genre-preference">
          <span class="genre-label">${genre}</span>
          <div class="genre-bar" style="--percent: ${percent}%"></div>
        </div>
      `;
    }).join('');
    
    genrePreferences.innerHTML = `<div class="insight-stat">${genreHTML}</div>`;
  }
}

// Função para atualizar informações do usuário na interface
function updateUserInfo() {
  const user = getCurrentUser();
  if (!user) return;

  const avatarImg = document.querySelector('#user-panel img');
  const userName = document.getElementById('user-name');
  const logoutLink = document.getElementById('logout-link');

  if (avatarImg && userName) {
    avatarImg.src = user.avatar || 'https://via.placeholder.com/100';
    userName.textContent = user.username;
    logoutLink.classList.remove('hidden');
  }

  // Verificar se é admin
  if (user.isAdmin) {
    document.getElementById('admin-panel')?.classList.remove('hidden');
  }
}