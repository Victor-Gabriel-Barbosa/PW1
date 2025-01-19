// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  // Elementos do tema
  const themeToggle = document.querySelector('.toggle-theme');
  const body = document.body;

  // Restaura tema salvo ou usa padrão somente se o toggle existir
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      themeToggle.classList.add('dark');
    }

    // Gerencia alternância de tema e persiste escolha
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      themeToggle.classList.toggle('dark');
      
      const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
  }

  // Controle de visibilidade dos painéis baseado em permissões
  const adminPanel = document.getElementById("admin-panel");
  const userPanel = document.getElementById("user-panel");
  const sessionData = JSON.parse(localStorage.getItem('userSession'));

  if (sessionData?.isAdmin && adminPanel) {
    adminPanel.classList.remove("hidden");
  }

  // Gerenciamento do menu administrativo
  const adminButton = document.getElementById('admin-menu-button');
  const adminMenu = document.getElementById('admin-menu-items');

  if (adminButton && adminMenu) {
    // Controle do menu admin e animação do ícone
    adminButton.addEventListener('click', (e) => {
      e.stopPropagation();
      adminMenu.classList.toggle('hidden');

      const gearIcon = adminButton.querySelector('svg');
      gearIcon.classList.add('gear-spin');
      setTimeout(() => gearIcon.classList.remove('gear-spin'), 600);
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!adminMenu.contains(e.target) && !adminButton.contains(e.target)) {
        adminMenu.classList.add('hidden');
      }
    });
  }
});

// Função para obter o avatar do usuário
function getUserAvatar(username) {
  const users = JSON.parse(localStorage.getItem('animuUsers') || '[]');
  const user = users.find(u => u.username === username);
  return user ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8B5CF6&color=ffffff&size=100`;
}

// Atualiza interface do usuário na navbar
function updateUserInterface() {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (sessionData) {
    const userPanel = document.getElementById('user-panel');
    const userNameSpan = document.getElementById('user-name');
    const userAvatar = userPanel?.querySelector('img');
    const logoutLink = document.getElementById('logout-link');

    if (userPanel && userNameSpan) {
      userNameSpan.innerHTML = `<a href="profile.html" class="hover:text-purple-600 transition-colors">${sessionData.username}</a>`;
      if (userAvatar) {
        userAvatar.src = getUserAvatar(sessionData.username);
        userAvatar.style.cursor = 'pointer';
        userAvatar.onclick = () => window.location.href = 'profile.html';
        userAvatar.title = 'Ver perfil';
      }
      if (logoutLink) {
        logoutLink.classList.remove('hidden');
      }
    }
  }
}

// Calcula pontuação para destaque do anime
function calculateHighlightScore(anime, comments) {
  const commentCount = comments[anime.primaryTitle]?.length || 0;
  const score = parseFloat(anime.score) || 0;
  // Fórmula: (nota * 0.7) + (número de comentários * 0.3)
  return (score * 0.7) + (commentCount * 0.3);
}

// Seleciona animes em destaque baseado em popularidade
function getFeaturedAnimes(limit = 8) {
  try {
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};

    // Calcula a pontuação de destaque para cada anime
    const scoredAnimes = animes.map(anime => ({
      ...anime,
      highlightScore: calculateHighlightScore(anime, comments)
    }));

    // Ordena os animes pela pontuação de destaque
    return scoredAnimes
      .sort((a, b) => b.highlightScore - a.highlightScore)
      .slice(0, limit);
  } catch (e) {
    console.error('Erro ao obter animes em destaque:', e);
    return [];
  }
}

// Renderiza seção de animes em destaque
function renderFeaturedAnimes() {
  const featuredContainer = document.querySelector('.featured-animes');
  if (!featuredContainer) return;

  const featuredAnimes = getFeaturedAnimes();

  if (featuredAnimes.length === 0) {
    featuredContainer.innerHTML = '<p class="text-center">Nenhum anime em destaque disponível.</p>';
    return;
  }

  featuredContainer.innerHTML = featuredAnimes.map(anime => `
    <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" class="anime-card">
      <div class="rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
        <div class="relative w-full aspect-[3/4]">
          <img 
            src="${anime.coverImage}" 
            alt="${anime.primaryTitle}" 
            class="absolute w-full h-full object-cover"
            onerror="this.src='https://ui-avatars.com/api/?name=User&background=random'">
        </div>
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-lg font-semibold mb-auto line-clamp-2">${anime.primaryTitle}</h3>
          <div class="flex items-center gap-2 mt-2">
            <span class="rating-tag">⭐ ${anime.score || 'N/A'}</span>
            <span class="rating-tag">💬 ${(JSON.parse(localStorage.getItem('animeComments')) || {})[anime.primaryTitle]?.length || 0}</span>
          </div>
        </div>
      </div>
    </a>
  `).join('');
}

// Função para carregar os últimos reviews
function loadLatestReviews() {
  const reviewsList = document.getElementById('latest-reviews');
  if (!reviewsList) return;

  // Recupera todos os comentários dos animes
  const allComments = JSON.parse(localStorage.getItem('animeComments')) || {};
  
  // Cria um array com todos os comentários e suas informações
  const reviews = Object.entries(allComments).flatMap(([animeTitle, comments]) =>
    comments.map(comment => ({
      animeTitle,
      comment,
      timestamp: new Date(comment.timestamp)
    }))
  );

  // Ordena por data, mais recentes primeiro
  reviews.sort((a, b) => b.timestamp - a.timestamp);

  // Pega os 3 reviews mais recentes
  const latestReviews = reviews.slice(0, 3);

  // Renderiza os reviews
  reviewsList.innerHTML = latestReviews.map(review => `
    <li class="inicio-card-item">
      <a href="animes.html?anime=${encodeURIComponent(review.animeTitle)}" class="inicio-card-link">
        <span class="inicio-card-link-title">${review.animeTitle}</span>
        <p class="inicio-card-link-subtitle">
          ${review.comment.text.length > 50 
            ? review.comment.text.substring(0, 50) + '...' 
            : review.comment.text}
        </p>
      </a>
    </li>
  `).join('') || '<li class="inicio-card-item">Nenhum review disponível</li>';
}

// Obtém as categorias mais populares baseado no número de animes
function getPopularCategories(limit = 3) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const categoryCount = {};

  // Conta animes por categoria
  animes.forEach(anime => {
    anime.genres.forEach(genre => {
      categoryCount[genre] = (categoryCount[genre] || 0) + 1;
    });
  });

  // Converte para array e ordena por contagem
  return Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([category, count]) => ({
      category,
      count,
      description: getCategoryDescription(category)
    }));
}

// Descrições para categorias populares
function getCategoryDescription(category) {
  const descriptions = {
    'Shounen': 'Ação e aventura',
    'Slice of Life': 'Histórias cotidianas',
    'Mecha': 'Robôs e tecnologia',
    'Romance': 'Histórias de amor',
    'Action': 'Lutas e confrontos',
    'Comedy': 'Diversão e humor',
    'Drama': 'Histórias emocionantes',
    'Fantasy': 'Mundos mágicos',
    // Adicione mais categorias conforme necessário
  };
  return descriptions[category] || 'Explore mais desta categoria';
}

// Renderiza as categorias populares
function renderPopularCategories() {
  const popularCategoriesList = document.querySelector('.inicio-card:nth-child(2) .inicio-card-list');
  if (!popularCategoriesList) return;

  const popularCategories = getPopularCategories();
  
  popularCategoriesList.innerHTML = popularCategories.map(({ category, description }) => `
    <li class="inicio-card-item">
      <a href="animes.html?category=${encodeURIComponent(category)}" class="inicio-card-link">
        <span class="inicio-card-link-title">${category}</span>
        <p class="inicio-card-link-subtitle">${description}</p>
      </a>
    </li>
  `).join('');
}

// Inicialização da página
window.addEventListener('DOMContentLoaded', () => {
  updateUserInterface();
  renderFeaturedAnimes(); 
  loadLatestReviews(); // Adiciona esta linha
  renderPopularCategories(); // Adiciona esta linha
});