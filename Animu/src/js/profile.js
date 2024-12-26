document.addEventListener('DOMContentLoaded', function () {
  // Verificar se o usuário está logado
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) {
    window.location.href = 'login/signin.html';
    return;
  }

  // Carregar dados do usuário
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = users.find(user => user.id === sessionData.userId);

  if (!currentUser) {
    console.error('Usuário não encontrado');
    return;
  }

  // Inicializar dados do perfil
  initializeProfile(currentUser);
  loadStatistics(currentUser);
  loadAchievements(currentUser);
  loadFavoriteAnimes(currentUser);
  loadActivityTimeline(currentUser);
  setupEventListeners(currentUser);
});

// Função para inicializar o perfil
function initializeProfile(user) {
  // Atualizar informações básicas
  document.getElementById('profile-username').textContent = user.username;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('display-name').textContent = user.displayName || user.username;
  document.getElementById('profile-joined').textContent = `Membro desde: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}`;

  // Usar o avatar da sessão do usuário
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (sessionData && sessionData.avatar) {
    document.getElementById('profile-avatar').src = sessionData.avatar;
  }

  // Atualizar gêneros favoritos
  const favoriteGenres = document.getElementById('favorite-genres');
  favoriteGenres.innerHTML = user.favoriteGenres?.map(genre => `<span class="genre">${genre}</span>`).join('') || 'Nenhum gênero favorito';
}

// Função para carregar estatísticas
function loadStatistics(user) {
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  const userComments = Object.values(comments).flat().filter(c => c.username === user.username);

  document.getElementById('stats-animes').textContent = user.watchedAnimes?.length || 0;
  document.getElementById('stats-reviews').textContent = userComments.length;
  document.getElementById('stats-likes').textContent = userComments.reduce((sum, comment) => sum + (comment.likes?.length || 0), 0);
  document.getElementById('stats-favorites').textContent = user.favoriteAnimes?.length || 0;
}

// Função para carregar conquistas
function loadAchievements(user) {
  const achievements = [
    {
      title: 'Iniciante',
      description: 'Assistiu seu primeiro anime',
      icon: '🌟',
      unlocked: user.watchedAnimes?.length > 0
    },
    {
      title: 'Crítico',
      description: 'Fez 5 reviews',
      icon: '📝',
      unlocked: user.reviews?.length >= 5
    },
    {
      title: 'Popular',
      description: 'Recebeu 10 likes',
      icon: '❤️',
      unlocked: user.totalLikes >= 10
    },
    {
      title: 'Otaku',
      description: 'Assistiu 20 animes',
      icon: '🏆',
      unlocked: user.watchedAnimes?.length >= 20
    }
  ];

  const achievementsContainer = document.getElementById('achievements');
  achievementsContainer.innerHTML = achievements.map(achievement => `
        <div class="achievement p-3 rounded-lg ${achievement.unlocked ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-700 opacity-50'}">
            <div class="text-2xl mb-2">${achievement.icon}</div>
            <h3 class="font-semibold">${achievement.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${achievement.description}</p>
        </div>
    `).join('');
}

// Função para carregar animes favoritos
function loadFavoriteAnimes(user) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const favoriteAnimes = user.favoriteAnimes || [];
  const container = document.getElementById('favorite-animes');

  if (favoriteAnimes.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">Nenhum anime favorito ainda</p>';
    return;
  }

  container.innerHTML = favoriteAnimes.map(animeId => {
    const anime = animes.find(a => a.id === animeId);
    if (!anime) return '';

    return `
            <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
               class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <img src="${anime.coverImage}" alt="${anime.primaryTitle}" 
                     class="w-16 h-16 object-cover rounded-lg">
                <div>
                    <h3 class="font-semibold">${anime.primaryTitle}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${anime.status}</p>
                </div>
            </a>
        `;
  }).join('');
}

// Função para carregar histórico de atividades
function loadActivityTimeline(user) {
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  const activities = [];

  // Adiciona comentários ao histórico
  Object.entries(comments).forEach(([animeTitle, animeComments]) => {
    animeComments.forEach(comment => {
      if (comment.username === user.username) {
        activities.push({
          type: 'comment',
          animeTitle,
          timestamp: comment.timestamp,
          content: comment.text
        });
      }
    });
  });

  // Adiciona animes favoritados
  user.favoriteAnimes?.forEach(favoriteAnime => {
    activities.push({
      type: 'favorite',
      animeTitle: favoriteAnime,
      timestamp: new Date().toISOString() // Idealmente, armazenar timestamp real
    });
  });

  // Ordena atividades por data
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const container = document.getElementById('activity-timeline');
  container.innerHTML = activities.map(activity => `
        <div class="activity-item border-l-2 border-purple-500 pl-4 pb-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">
                ${new Date(activity.timestamp).toLocaleDateString('pt-BR')}
            </div>
            <div class="mt-1">
                ${activity.type === 'comment'
      ? `Comentou em <a href="animes.html?anime=${encodeURIComponent(activity.animeTitle)}" 
                         class="text-purple-600 hover:underline">${activity.animeTitle}</a>: 
                         <span class="text-gray-600 dark:text-gray-300">${activity.content}</span>`
      : `Adicionou <a href="animes.html?anime=${encodeURIComponent(activity.animeTitle)}" 
                         class="text-purple-600 hover:underline">${activity.animeTitle}</a> aos favoritos`
    }
            </div>
        </div>
    `).join('');
}

// Função para mudar o avatar
function changeAvatar(avatar, userId) {
  // Atualizar no localStorage
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].avatar = avatar;
    localStorage.setItem('animuUsers', JSON.stringify(users));
  }

  // Atualizar na sessão atual
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  sessionData.avatar = avatar;
  localStorage.setItem('userSession', JSON.stringify(sessionData));

  // Atualizar a imagem na interface
  document.getElementById('profile-avatar').src = avatar;
}

// Configurar event listeners
function setupEventListeners(user) {
  const editButton = document.getElementById('edit-profile');
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-profile-form');
  const cancelButton = document.getElementById('cancel-edit');

  // Botão de editar perfil
  editButton.addEventListener('click', () => {
    editModal.classList.remove('hidden');
    editModal.classList.add('flex');

    // Preenche o formulário com dados atuais
    document.getElementById('edit-display-name').value = user.displayName || user.username;
    document.getElementById('edit-email').value = user.email;
  });

  // Botão de cancelar edição
  cancelButton.addEventListener('click', () => {
    editModal.classList.remove('flex');
    editModal.classList.add('hidden');
  });

  // Formulário de edição
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const displayName = document.getElementById('edit-display-name').value;
    const email = document.getElementById('edit-email').value;

    // Atualiza dados do usuário
    const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        displayName,
        email
      };

      localStorage.setItem('animuUsers', JSON.stringify(users));

      // Atualiza a página
      window.location.reload();
    }
  });

  // Botão de mudar avatar
  const changeAvatarButton = document.getElementById('change-avatar');
  changeAvatarButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const avatar = event.target.result;
          changeAvatar(avatar, user.id);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  });
}