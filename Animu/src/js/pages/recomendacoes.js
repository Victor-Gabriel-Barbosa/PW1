document.addEventListener('DOMContentLoaded', function() {
  // Verificar se o usuário está logado
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) {
    window.location.href = 'signin.html';
    return;
  }

  // Inicializar recomendações
  initializeRecommendations();
});

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

function getCurrentUser() {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  return users.find(user => user.id === sessionData.userId);
}

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

function calculateGenreMatchScore(animeGenres, userGenres) {
  if (!userGenres?.length || !animeGenres?.length) return 0;
  
  const matchingGenres = animeGenres.filter(genre => 
    userGenres.includes(genre)
  );
  
  const matchScore = (matchingGenres.length / userGenres.length) * 100;
  return Math.min(matchScore, 100); // Limita o score a 100%
}

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

function calculatePopularityScore(anime, comments) {
  const animeComments = comments[anime.primaryTitle] || [];
  const commentScore = animeComments.length * 10;
  const ratingScore = (anime.score || 0) * 10;
  const watchCount = animeComments.length * 5; // Adiciona peso para quantidade de visualizações
  
  return commentScore + ratingScore + watchCount;
}

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
                  ⭐ ${anime.score ? anime.score.toFixed(1) : 'N/A'}
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

function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sections = document.querySelectorAll('.recommendation-section');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove classe ativa de todos os botões
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      // Mostra/esconde seções baseado no filtro
      sections.forEach(section => {
        if (filter === 'all') {
          section.style.display = 'block';
        } else {
          if (section.id.includes(filter)) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        }
      });
    });
  });
}

// Adicionar evento para atualizar recomendações quando mudar o tema
document.addEventListener('themeChanged', function() {
  const user = getCurrentUser();
  if (user) {
    loadGenreBasedRecommendations(user);
    loadSimilarAnimeRecommendations(user);
    loadTrendingRecommendations();
  }
});

// Função para recarregar recomendações periodicamente
function setupAutoRefresh() {
  setInterval(() => {
    const user = getCurrentUser();
    if (user) {
      loadTrendingRecommendations(); // Atualiza apenas as tendências
    }
  }, 300000); // Atualiza a cada 5 minutos
}

// Iniciar auto-refresh
setupAutoRefresh();

// Adiciona tratamento de erros global
window.addEventListener('error', function(e) {
  console.error('Erro na página de recomendações:', e.error);
});

// Função para atualizar estatísticas
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
}
