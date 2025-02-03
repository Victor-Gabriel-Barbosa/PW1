// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();

  // Controle de visibilidade dos painéis baseado em permissões
  const adminPanel = document.getElementById("admin-panel");
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

function initThemeSystem() {
  const themeDropdownBtn = document.getElementById('theme-dropdown-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOptions = document.querySelectorAll('.theme-option');
  const body = document.body;

  // Se os elementos do tema não existirem, retorne sem fazer nada
  if (!themeDropdownBtn || !themeMenu) {
    return;
  }

  // Ícones para cada tema
  const themeIcons = {
    system: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
    </svg>`,
    light: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
    </svg>`,
    dark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
    </svg>`
  };

  // Detecta preferência do sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Função para atualizar o ícone do botão
  function updateThemeIcon(theme) {
    if (!themeDropdownBtn) return;
    const icon = themeIcons[theme] || themeIcons.system;
    themeDropdownBtn.innerHTML = icon;
    themeDropdownBtn.querySelector('svg').style.height = '24px';
  }

  // Carrega tema salvo ou usa preferência do sistema
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);
  if (themeOptions.length > 0) {
    updateActiveTheme(savedTheme);
  }
  updateThemeIcon(savedTheme);

  // Toggle do menu dropdown com animação
  themeDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('hidden');
    
    // Nova animação do ícone
    const icon = themeDropdownBtn.querySelector('svg');
    themeDropdownBtn.classList.toggle('active');
    
    if (themeMenu.classList.contains('hidden')) {
      icon.style.transform = 'scale(1)';
      icon.style.filter = 'none';
    }
  });

  // Fecha o menu ao clicar fora com animação suave
  document.addEventListener('click', () => {
    if (!themeMenu.classList.contains('hidden')) {
      themeMenu.classList.add('hidden');
      const icon = themeDropdownBtn.querySelector('svg');
      themeDropdownBtn.classList.remove('active');
      icon.style.transform = 'scale(1)';
      icon.style.filter = 'none';
    }
  });

  // Previne que cliques dentro do menu o fechem
  themeMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Gerencia seleção de tema com feedback visual
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      applyTheme(theme);
      updateActiveTheme(theme);
      updateThemeIcon(theme);
      localStorage.setItem('theme', theme);
      
      // Adiciona efeito de ripple ao clicar
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      option.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);

      setTimeout(() => {
        themeMenu.classList.add('hidden');
        const icon = themeDropdownBtn.querySelector('svg');
        icon.style.transform = 'rotate(0deg)';
      }, 300);
    });
  });

  // Atualiza tema quando muda preferência do sistema
  prefersDark.addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system');
    }
  });

  function applyTheme(theme) {
    if (theme === 'system') {
      if (prefersDark.matches) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
    } else if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  function updateActiveTheme(theme) {
    themeOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.theme === theme);
    });
  }
}

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
function getFeaturedAnimes(limit = 16) {
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

// Função para contar favoritos de um anime
function countAnimeFavorites(animeTitle) {
  try {
    const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
    return users.reduce((count, user) => {
      if (user.favoriteAnimes && user.favoriteAnimes.includes(animeTitle)) {
        return count + 1;
      }
      return count;
    }, 0);
  } catch (e) {
    console.error('Erro ao contar favoritos:', e);
    return 0;
  }
}

// Sistema de favoritos
function isAnimeFavorited(animeTitle) {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) return false;

  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = users.find(user => user.id === sessionData.userId);

  return currentUser?.favoriteAnimes?.includes(animeTitle) || false;
}

// Alterna estado de favorito do anime
function toggleFavorite(animeTitle) {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) {
    window.location.href = 'signin.html';
    return;
  }

  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const userIndex = users.findIndex(user => user.id === sessionData.userId);

  if (userIndex === -1) return;

  // Inicializa o array de favoritos se não existir
  if (!users[userIndex].favoriteAnimes) {
    users[userIndex].favoriteAnimes = [];
  }

  const isFavorited = users[userIndex].favoriteAnimes.includes(animeTitle);

  if (isFavorited) {
    // Remove dos favoritos
    users[userIndex].favoriteAnimes = users[userIndex].favoriteAnimes.filter(
      title => title !== animeTitle
    );
  } else {
    // Adiciona aos favoritos
    users[userIndex].favoriteAnimes.push(animeTitle);
  }

  // Atualiza o localStorage
  localStorage.setItem('animuUsers', JSON.stringify(users));
}

// Renderiza seção de animes em destaque com carrossel
function renderFeaturedAnimes() {
  const carouselTrack = document.querySelector('.carousel-track');
  if (!carouselTrack) return;

  const featuredAnimes = getFeaturedAnimes();
  const currentUser = JSON.parse(localStorage.getItem('userSession'));

  if (featuredAnimes.length === 0) {
    carouselTrack.innerHTML = '<p class="text-center">Nenhum anime em destaque disponível.</p>';
    return;
  }

  // Duplicar os animes para criar efeito infinito
  const duplicatedAnimes = [...featuredAnimes, ...featuredAnimes, ...featuredAnimes];
  
  carouselTrack.innerHTML = duplicatedAnimes.map(anime => `
    <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" class="anime-card">
      <div class="image-wrapper">
        <img 
          src="${anime.coverImage}" 
          alt="${anime.primaryTitle}" 
          class="anime-image"
          onerror="this.src='https://ui-avatars.com/api/?name=Anime&background=8B5CF6&color=fff'">
        
        <div class="quick-info">
          <span class="info-pill">⭐ ${Number(anime.score).toFixed(1)}</span>
          <span class="info-pill">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z"/>
            </svg>
            ${anime.episodes > 0 ? anime.episodes : '?'}
          </span>
        </div>

        <div class="anime-overlay">
          <div class="overlay-content">
            <div class="anime-genres">
              ${anime.genres.slice(0, 3).map(genre => 
                `<span class="genre-tag">${genre}</span>`
              ).join('')}
            </div>
            <p class="text-sm mt-2 line-clamp-3">${anime.synopsis || 'Sinopse não disponível.'}</p>
          </div>
        </div>
      </div>

      <div class="anime-info">
        <h3 class="anime-title line-clamp-2">${anime.primaryTitle}</h3>
        <div class="anime-meta">
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
            </svg>
            ${(JSON.parse(localStorage.getItem('animeComments')) || {})[anime.primaryTitle]?.length || 0}
          </span>
          <button 
            class="meta-item favorite-count ${isAnimeFavorited(anime.primaryTitle) ? 'is-favorited' : ''}"
            onclick="event.preventDefault(); toggleFavoriteFromCard('${anime.primaryTitle}')"
            ${!currentUser ? 'title="Faça login para favoritar"' : ''}
          >
            <svg class="meta-icon heart-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="favorite-number">${countAnimeFavorites(anime.primaryTitle)}</span>
          </button>
        </div>
      </div>
    </a>
  `).join('');

  // Configuração do carrossel
  let currentIndex = featuredAnimes.length; // Começar do conjunto do meio
  const slideWidth = carouselTrack.querySelector('.anime-card').offsetWidth + 20; // 20 é o margin total
  
  // Posicionar no conjunto do meio
  carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  // Botões de navegação
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');
  let isTransitioning = false;

  function slide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex += direction;
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Verificar se precisa resetar a posição
    setTimeout(() => {
      if (currentIndex >= featuredAnimes.length * 2) {
        currentIndex = featuredAnimes.length;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      } else if (currentIndex <= 0) {
        currentIndex = featuredAnimes.length;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }
      isTransitioning = false;
    }, 500);
  }

  prevButton.addEventListener('click', () => slide(-1));
  nextButton.addEventListener('click', () => slide(1));

  // Auto-play do carrossel
  let autoplayInterval = setInterval(() => slide(1), 1500);

  // Pausar auto-play quando o mouse estiver sobre o carrossel
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carouselContainer.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => slide(1), 1500);
  });
}

// Nova função para gerenciar favoritos a partir do card
function toggleFavoriteFromCard(animeTitle) {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) {
    window.location.href = 'signin.html';
    return;
  }

  toggleFavorite(animeTitle);
  
  // Atualiza todos os botões do mesmo anime no carrossel
  const favoriteBtns = document.querySelectorAll(`[onclick*="${animeTitle}"]`);
  const isFavorited = isAnimeFavorited(animeTitle);
  const newFavoriteCount = countAnimeFavorites(animeTitle);
  
  favoriteBtns.forEach(btn => {
    btn.classList.toggle('is-favorited', isFavorited);
    const countElement = btn.querySelector('.favorite-number');
    if (countElement) {
      countElement.textContent = newFavoriteCount;
    }
  });
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

// Função para renderizar notícias na página inicial
function renderIndexNews() {
  const newsGrid = document.querySelector('.news-grid');
  if (!newsGrid) return;

  const newsData = JSON.parse(localStorage.getItem('news') || '[]');
  
  // Ordena as notícias por data, mais recentes primeiro
  const sortedNews = [...newsData].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  // Mostra apenas as 4 notícias mais recentes
  const recentNews = sortedNews.slice(0, 4);

  newsGrid.innerHTML = recentNews.map(news => `
    <a href="news.html?id=${news.id}" class="news-card block hover:transform hover:scale-[1.02] transition-transform">
      <div class="news-image-container">
        <img src="${news.image}" alt="${news.title}" class="news-image">
        <span class="news-category">${news.category}</span>
      </div>
      <div class="news-content">
        <div class="news-metadata">
          <span class="news-date">${formatDate(news.date)}</span>
          <div class="news-tags">
            ${news.tags.map(tag => `<span class="news-tag">#${tag}</span>`).join('')}
          </div>
        </div>
        <h3 class="news-title">${news.title}</h3>
        <p class="news-summary">${news.summary}</p>
      </div>
    </a>
  `).join('');
}

// Formata data para o formato brasileiro
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Seleciona animes da temporada atual
function getSeasonalAnimes(limit = 12) {
  try {
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    const currentSeason = getCurrentSeason();
    
    // Filtra animes da temporada atual
    const seasonalAnimes = animes.filter(anime => {
      // Verifica se tem a propriedade season e se os valores correspondem
      return anime.season?.period?.toLowerCase() === currentSeason.season.toLowerCase() && 
             parseInt(anime.season?.year) === currentSeason.year;
    });

    // Ordena por pontuação antes de retornar
    return seasonalAnimes
      .sort((a, b) => (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0))
      .slice(0, limit);
  } catch (e) {
    console.error('Erro ao obter animes da temporada:', e);
    return [];
  }
}

// Determina a temporada atual
function getCurrentSeason() {
  const date = new Date();
  const month = date.getMonth();
  
  let season;
  if (month >= 0 && month < 3) season = 'Inverno';
  else if (month >= 3 && month < 6) season = 'Primavera';
  else if (month >= 6 && month < 9) season = 'Verão';
  else season = 'Outono';

  return {
    season,
    year: date.getFullYear()
  };
}

// Renderiza seção de animes da temporada
function renderSeasonalAnimes() {
  const carouselTrack = document.querySelector('.seasonal-carousel .carousel-track');
  if (!carouselTrack) return;

  const seasonalAnimes = getSeasonalAnimes();
  const currentUser = JSON.parse(localStorage.getItem('userSession'));

  if (seasonalAnimes.length === 0) {
    carouselTrack.innerHTML = '<p class="text-center">Nenhum anime da temporada disponível.</p>';
    return;
  }

  // Duplica os animes para criar efeito infinito
  const duplicatedAnimes = [...seasonalAnimes, ...seasonalAnimes, ...seasonalAnimes];
  
  carouselTrack.innerHTML = duplicatedAnimes.map(anime => `
    <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" class="anime-card">
      <div class="image-wrapper">
        <img 
          src="${anime.coverImage}" 
          alt="${anime.primaryTitle}" 
          class="anime-image"
          onerror="this.src='https://ui-avatars.com/api/?name=Anime&background=8B5CF6&color=fff'">
        
        <div class="quick-info">
          <span class="info-pill">⭐ ${Number(anime.score).toFixed(1)}</span>
          <span class="info-pill">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z"/>
            </svg>
            ${anime.episodes > 0 ? anime.episodes : '?'}
          </span>
        </div>
      </div>

      <div class="anime-info">
        <h3 class="anime-title line-clamp-2">${anime.primaryTitle}</h3>
        <div class="anime-meta">
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
            </svg>
            ${(JSON.parse(localStorage.getItem('animeComments')) || {})[anime.primaryTitle]?.length || 0}
          </span>
          <button 
            class="meta-item favorite-count ${isAnimeFavorited(anime.primaryTitle) ? 'is-favorited' : ''}"
            onclick="event.preventDefault(); toggleFavoriteFromCard('${anime.primaryTitle}')"
            ${!currentUser ? 'title="Faça login para favoritar"' : ''}
          >
            <svg class="meta-icon heart-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="favorite-number">${countAnimeFavorites(anime.primaryTitle)}</span>
          </button>
        </div>
      </div>
    </a>
  `).join('');

  // Configuração do carrossel
  let currentIndex = seasonalAnimes.length;
  const slideWidth = carouselTrack.querySelector('.anime-card').offsetWidth + 20;
  
  carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  // Botões de navegação
  const prevButton = document.querySelector('.seasonal-carousel .carousel-button.prev');
  const nextButton = document.querySelector('.seasonal-carousel .carousel-button.next');
  let isTransitioning = false;

  function slide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex += direction;
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    setTimeout(() => {
      if (currentIndex >= seasonalAnimes.length * 2) {
        currentIndex = seasonalAnimes.length;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      } else if (currentIndex <= 0) {
        currentIndex = seasonalAnimes.length;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }
      isTransitioning = false;
    }, 500);
  }

  prevButton.addEventListener('click', () => slide(-1));
  nextButton.addEventListener('click', () => slide(1));

  // Auto-play do carrossel
  let autoplayInterval = setInterval(() => slide(1), 3000);

  // Pausar auto-play no hover
  const carouselContainer = document.querySelector('.seasonal-carousel');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carouselContainer.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => slide(1), 3000);
  });
}

// Atualiza o link da temporada atual no card de Novidades
function updateCurrentSeasonLink() {
  const currentSeason = getCurrentSeason();
  const seasonLink = document.getElementById('current-season-link');
  const seasonText = document.getElementById('current-season-text');
  
  if (seasonLink && seasonText) {
    const seasonName = currentSeason.season.toLowerCase();
    const year = currentSeason.year;
    
    // Atualiza o href com a temporada atual
    seasonLink.href = `animes.html?season=${seasonName}&year=${year}`;
    
    // Atualiza o texto com a temporada atual
    seasonText.textContent = `Top animes de ${currentSeason.season} ${year}`;
  }
}

// Inicialização da página
window.addEventListener('DOMContentLoaded', () => {
  updateUserInterface();
  updateCurrentSeasonLink(); 
  renderFeaturedAnimes(); 
  renderSeasonalAnimes();
  loadLatestReviews();
  renderPopularCategories(); 
  renderIndexNews();
});