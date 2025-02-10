// Inicializa a página de perfil após carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {
  // Redireciona para login se não houver sessão ativa
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) {
    window.location.href = 'signin.html';
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

/**
 * Exibe informações básicas do perfil do usuário
 * @param {Object} user - Dados do usuário
 */
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

/**
 * Calcula e exibe métricas de engajamento do usuário
 * @param {Object} user - Dados do usuário
 */
function loadStatistics(user) {
  // Obtém dados de interações do usuário
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  const forumTopics = JSON.parse(localStorage.getItem('forumTopics')) || [];
  const userComments = Object.values(comments).flat().filter(c => c.username === user.username);

  // Contagem de tópicos e respostas do fórum
  const userTopics = forumTopics.filter(t => t.author === user.username);
  const userReplies = forumTopics.flatMap(t => t.replies).filter(r => r.author === user.username);

  // Total de likes recebidos em tópicos e respostas do fórum
  const forumLikes = userTopics.reduce((sum, topic) => sum + (topic.likes || 0), 0) +
    userReplies.reduce((sum, reply) => sum + (reply.likes || 0), 0);

  document.getElementById('stats-animes').textContent = user.watchedAnimes?.length || 0;
  document.getElementById('stats-reviews').textContent = userComments.length + userTopics.length;
  document.getElementById('stats-likes').textContent =
    userComments.reduce((sum, comment) => sum + (comment.likes?.length || 0), 0) + forumLikes;
  document.getElementById('stats-favorites').textContent = user.favoriteAnimes?.length || 0;
}

/**
 * Gerencia sistema de conquistas baseado nas atividades do usuário
 * @param {Object} user - Dados do usuário
 */
function loadAchievements(user) {
  // Coleta métricas para cálculo de conquistas
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  const forumTopics = JSON.parse(localStorage.getItem('forumTopics')) || [];
  const userComments = Object.values(comments).flat().filter(c => c.username === user.username);
  const userTopics = forumTopics.filter(t => t.author === user.username);
  const userReplies = forumTopics.flatMap(t => t.replies).filter(r => r.author === user.username);

  // Total de likes em comentários, tópicos e respostas
  const totalLikes = userComments.reduce((sum, comment) => sum + (comment.likes?.length || 0), 0) +
    userTopics.reduce((sum, topic) => sum + (topic.likes || 0), 0) +
    userReplies.reduce((sum, reply) => sum + (reply.likes || 0), 0);

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
      unlocked: userComments.length >= 5
    },
    {
      title: 'Popular',
      description: 'Recebeu 10 likes',
      icon: '❤️',
      unlocked: totalLikes >= 10
    },
    {
      title: 'Otaku',
      description: 'Assistiu 20 animes',
      icon: '🏆',
      unlocked: user.watchedAnimes?.length >= 20
    },
    {
      title: 'Influencer',
      description: 'Criou 5 tópicos no fórum',
      icon: '💭',
      unlocked: userTopics.length >= 5
    },
    {
      title: 'Comunicativo',
      description: 'Fez 10 respostas no fórum',
      icon: '💬',
      unlocked: userReplies.length >= 10
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

/**
 * Exibe lista de animes favoritos com informações resumidas
 * @param {Object} user - Dados do usuário
 */
function loadFavoriteAnimes(user) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const favoriteAnimes = user.favoriteAnimes || [];
  const container = document.getElementById('favorite-animes');

  if (favoriteAnimes.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">Nenhum anime favorito ainda</p>';
    return;
  }

  container.innerHTML = favoriteAnimes.map(animeTitle => {
    const anime = animes.find(a => a.primaryTitle === animeTitle);
    if (!anime) return '';

    return `
      <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
       class="flex items-center gap-4 p-4 rounded-lg 
              hover:bg-purple-50 dark:hover:bg-purple-800/30
              hover:shadow-lg dark:hover:shadow-purple-900/30
              hover:scale-102 transform
              transition-all duration-200 ease-in-out">
        <img src="${anime.coverImage}" alt="${anime.primaryTitle}" 
             class="w-16 h-16 object-cover rounded-lg 
             hover:shadow-md transition-shadow duration-200">
        <div>
          <h3 class="font-semibold">${anime.primaryTitle}</h3>
          <div class="flex gap-2 mt-1">
            <span class="text-sm bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded text-white">
              ⭐ ${anime.score || 'N/A'}
            </span>
            <span class="text-sm">${anime.status}</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

/**
 * Gera linha do tempo com atividades recentes do usuário
 * @param {Object} user - Dados do usuário
 */
function loadActivityTimeline(user) {
  // Agrupa diferentes tipos de atividades
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  const forumTopics = JSON.parse(localStorage.getItem('forumTopics')) || [];
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

  // Adiciona tópicos do fórum ao histórico
  forumTopics.forEach(topic => {
    if (topic.author === user.username) {
      activities.push({
        type: 'forum_topic',
        title: topic.title,
        timestamp: topic.date,
        content: topic.content.substring(0, 100) + '...'
      });
    }
  });

  // Adiciona respostas do fórum ao histórico
  forumTopics.forEach(topic => {
    topic.replies.forEach(reply => {
      if (reply.author === user.username) {
        activities.push({
          type: 'forum_reply',
          topicTitle: topic.title,
          timestamp: reply.date,
          content: reply.content.substring(0, 100) + '...'
        });
      }
    });
  });

  // Adiciona animes favoritados ao histórico
  user.favoriteAnimes?.forEach(favoriteAnime => {
    activities.push({
      type: 'favorite',
      animeTitle: favoriteAnime,
      timestamp: new Date().toISOString()
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
        ${getActivityContent(activity)}
      </div>
    </div>
  `).join('');
}

/**
 * Formata o texto da atividade baseado no seu tipo
 * @param {Object} activity - Dados da atividade
 * @returns {string} HTML formatado da atividade
 */
function getActivityContent(activity) {
  switch (activity.type) {
    case 'comment':
      return `Comentou em <a href="animes.html?anime=${encodeURIComponent(activity.animeTitle)}" 
              class="text-purple-600 hover:underline">${activity.animeTitle}</a>: 
              <span class="text-gray-600 dark:text-gray-300">${activity.content}</span>`;

    case 'forum_topic':
      return `Criou um tópico no fórum: <span class="font-semibold">${activity.title}</span>
              <span class="text-gray-600 dark:text-gray-300">${activity.content}</span>`;

    case 'forum_reply':
      return `Respondeu ao tópico <span class="font-semibold">${activity.topicTitle}</span>: 
              <span class="text-gray-600 dark:text-gray-300">${activity.content}</span>`;

    case 'favorite':
      return `Adicionou <a href="animes.html?anime=${encodeURIComponent(activity.animeTitle)}" 
              class="text-purple-600 hover:underline">${activity.animeTitle}</a> aos favoritos`;

    default:
      return '';
  }
}

/**
 * Atualiza avatar do usuário em todas as camadas de armazenamento
 * @param {string} avatar - URL/Base64 da imagem
 * @param {string} userId - ID do usuário
 */
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

/**
 * Inicializa seletor de gêneros para edição do perfil
 */
function setupGenreSelection() {
  // Obtém todas as categorias do CategoryDisplay
  const categoryDisplay = new CategoryDisplay();
  const categories = categoryDisplay.getCategories();
  
  // Extrai os nomes das categorias
  const genres = categories.map(category => category.name);

  const genreContainer = document.getElementById('edit-genres');
  genreContainer.innerHTML = genres.map(genre => `
    <label class="inline-flex items-center p-2.5 border border-gray-200 dark:border-gray-600 
                rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer
                transition-colors duration-200">
      <input type="checkbox" name="genres" value="${genre}" 
             class="w-4 h-4 text-purple-600 dark:text-purple-400 
                    border-gray-300 dark:border-gray-600 
                    rounded focus:ring-purple-500 dark:focus:ring-purple-400
                    bg-white dark:bg-gray-700">
      <span class="ml-2 text-sm text-gray-700 dark:text-gray-200">${genre}</span>
    </label>
  `).join('');
}

/**
 * Configura interações do usuário com elementos da página
 * @param {Object} user - Dados do usuário
 */
function setupEventListeners(user) {
  // Referências elementos UI
  const editButton = document.getElementById('edit-profile');
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-profile-form');
  const cancelButton = document.getElementById('cancel-edit');
  const closeButton = document.getElementById('close-modal'); // Nova referência

  // Botão de editar perfil
  editButton.addEventListener('click', () => {
    editModal.classList.remove('hidden');
    editModal.classList.add('flex');

    // Preenche o formulário com dados atuais
    document.getElementById('edit-display-name').value = user.displayName || user.username;
    document.getElementById('edit-email').value = user.email;

    // Configura e marca os gêneros favoritos
    setupGenreSelection();
    const checkboxes = document.querySelectorAll('input[name="genres"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = user.favoriteGenres?.includes(checkbox.value) || false;
    });
  });

  // Botão de cancelar edição
  cancelButton.addEventListener('click', () => {
    editModal.classList.remove('flex');
    editModal.classList.add('hidden');
  });

  // Botão de fechar modal (X)
  closeButton.addEventListener('click', () => {
    editModal.classList.remove('flex');
    editModal.classList.add('hidden');
  });

  // Fechar modal ao clicar fora
  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.classList.remove('flex');
      editModal.classList.add('hidden');
    }
  });

  // Fechar modal com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
      editModal.classList.remove('flex');
      editModal.classList.add('hidden');
    }
  });

  // Adicionar manipulação de upload de avatar no modal
  const avatarUploadBtn = document.getElementById('avatar-upload-btn');
  const avatarInput = document.getElementById('edit-avatar');
  const previewAvatar = document.getElementById('preview-avatar');

  // Inicializar preview com avatar atual
  previewAvatar.src = user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.username);

  avatarUploadBtn.addEventListener('click', () => {
    avatarInput.click();
  });

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewAvatar.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Formulário de edição
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const displayName = document.getElementById('edit-display-name').value;
    const email = document.getElementById('edit-email').value;
    const selectedGenres = Array.from(document.querySelectorAll('input[name="genres"]:checked'))
      .map(checkbox => checkbox.value);
    const newAvatar = previewAvatar.src;

    // Atualiza dados do usuário
    const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        displayName,
        email,
        favoriteGenres: selectedGenres,
        avatar: newAvatar
      };

      localStorage.setItem('animuUsers', JSON.stringify(users));

      // Atualizar a sessão com o novo avatar
      const sessionData = JSON.parse(localStorage.getItem('userSession'));
      sessionData.avatar = newAvatar;
      localStorage.setItem('userSession', JSON.stringify(sessionData));

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

  // Adicionar handler para o botão de logout
  const logoutButton = document.getElementById('logout-button');
  logoutButton?.addEventListener('click', () => {
    localStorage.removeItem('userSession');
    window.location.href = './signin.html';
  });

  // Inicializar sistema de amizades
  initializeFriendSystem(user);
}

/**
 * Sistema de Amizades
 */

function initializeFriendSystem(currentUser) {
  // Removemos a criação do botão via JavaScript
  loadFriends(currentUser);
  loadFriendRequests(currentUser);
  setupFriendSearchListener();
  
  // Adiciona o evento de click ao botão existente no HTML
  const addFriendBtn = document.getElementById('add-friend-btn');
  if (addFriendBtn) {
    addFriendBtn.addEventListener('click', showAddFriendModal);
  }
}

function loadFriends(user) {
  const friendsList = document.getElementById('friends-list');
  const friends = user.friends || [];
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];

  if (friends.length === 0) {
    friendsList.innerHTML = `
      <div class="text-center py-8">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <p class="text-gray-500 mt-4">Nenhum amigo adicionado</p>
        <button onclick="showAddFriendModal()" 
                class="mt-4 text-purple-600 hover:text-purple-700 font-medium">
          Começar a adicionar amigos
        </button>
      </div>
    `;
    return;
  }

  friendsList.innerHTML = friends.map(friendId => {
    const friend = users.find(u => u.id === friendId);
    if (!friend) return '';

    return `
      <div class="friend-card group">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img src="${friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.username)}`}" 
                 alt="${friend.username}" 
                 class="w-12 h-12 rounded-full object-cover transition-transform duration-300">
            <div class="status-indicator ${friend.online ? 'status-online' : 'status-offline'}"></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="font-medium truncate">
              ${friend.displayName || friend.username}
            </h4>
            <p class="text-xs text-gray-500">
              ${friend.online ? 'Online' : 'Offline'}
            </p>
          </div>
          
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick="openChat('${friend.id}')" 
                    class="action-btn text-purple-600 hover:text-purple-700"
                    title="Iniciar chat">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </button>
            
            <button onclick="removeFriend('${friend.id}')" 
                    class="action-btn text-red-600 hover:text-red-700"
                    title="Remover amigo">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function loadFriendRequests(user) {
  const requestsContainer = document.getElementById('friend-requests');
  const requests = user.friendRequests || [];
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];

  if (requests.length === 0) {
    requestsContainer.style.display = 'none';
    return;
  }

  requestsContainer.style.display = 'block';
  const requestsList = requestsContainer.querySelector('div');
  requestsList.innerHTML = requests.map(requestId => {
    const requester = users.find(u => u.id === requestId);
    if (!requester) return '';

    return `
      <div class="friend-request-card">
        <div class="flex items-center gap-3">
          <img src="${requester.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(requester.username)}`}" 
               alt="${requester.username}" 
               class="w-10 h-10 rounded-full">
          <div>
            <h4 class="font-medium">${requester.displayName || requester.username}</h4>
            <p class="text-xs text-gray-500">Quer ser seu amigo</p>
          </div>
        </div>
        <div class="request-actions flex justify-end">
          <button onclick="acceptFriendRequest('${requester.id}')" 
                  class="accept-btn">
            Aceitar
          </button>
          <button onclick="rejectFriendRequest('${requester.id}')" 
                  class="reject-btn">
            Recusar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function showAddFriendModal() {
  const modal = document.getElementById('add-friend-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('friend-search').value = '';
  document.getElementById('friend-search-results').innerHTML = '';
}

function setupFriendSearchListener() {
  const searchInput = document.getElementById('friend-search');
  const resultsContainer = document.getElementById('friend-search-results');
  const closeModal = document.getElementById('close-friend-modal');
  const modal = document.getElementById('add-friend-modal');

  searchInput.addEventListener('input', debounce(async (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 3) {
      resultsContainer.innerHTML = '<p class="text-gray-500 p-2">Digite pelo menos 3 caracteres...</p>';
      return;
    }

    const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
    const currentUser = JSON.parse(localStorage.getItem('userSession'));
    const filteredUsers = users.filter(user => 
      user.id !== currentUser.userId &&
      (user.username.toLowerCase().includes(query) || 
       (user.displayName && user.displayName.toLowerCase().includes(query)))
    );

    resultsContainer.innerHTML = filteredUsers.length ? 
      filteredUsers.map(user => `
        <div class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div class="flex items-center gap-2">
            <img src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`}" 
                 alt="${user.username}" 
                 class="w-8 h-8 rounded-full">
            <span>${user.displayName || user.username}</span>
          </div>
          <button onclick="sendFriendRequest('${user.id}')" 
                  class="btn btn-primary py-1 px-3">
            Adicionar
          </button>
        </div>
      `).join('') : 
      '<p class="text-gray-500 p-2">Nenhum usuário encontrado</p>';
  }, 300));

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
}

function sendFriendRequest(targetUserId) {
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = JSON.parse(localStorage.getItem('userSession'));
  const targetUserIndex = users.findIndex(u => u.id === targetUserId);

  if (targetUserIndex === -1) return;

  // Adiciona a solicitação para o usuário alvo
  users[targetUserIndex].friendRequests = users[targetUserIndex].friendRequests || [];
  if (!users[targetUserIndex].friendRequests.includes(currentUser.userId)) {
    users[targetUserIndex].friendRequests.push(currentUser.userId);
    localStorage.setItem('animuUsers', JSON.stringify(users));
    
    // Fecha o modal e mostra mensagem de sucesso
    document.getElementById('add-friend-modal').classList.add('hidden');
    alert('Solicitação de amizade enviada!');
  }
}

function acceptFriendRequest(requesterId) {
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = JSON.parse(localStorage.getItem('userSession'));
  const currentUserIndex = users.findIndex(u => u.id === currentUser.userId);
  const requesterIndex = users.findIndex(u => u.id === requesterId);

  if (currentUserIndex === -1 || requesterIndex === -1) return;

  // Remove a solicitação e adiciona à lista de amigos de ambos
  users[currentUserIndex].friendRequests = users[currentUserIndex].friendRequests.filter(id => id !== requesterId);
  users[currentUserIndex].friends = users[currentUserIndex].friends || [];
  users[requesterIndex].friends = users[requesterIndex].friends || [];

  users[currentUserIndex].friends.push(requesterId);
  users[requesterIndex].friends.push(currentUser.userId);

  localStorage.setItem('animuUsers', JSON.stringify(users));
  window.location.reload();
}

function rejectFriendRequest(requesterId) {
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = JSON.parse(localStorage.getItem('userSession'));
  const currentUserIndex = users.findIndex(u => u.id === currentUser.userId);

  if (currentUserIndex === -1) return;

  // Remove a solicitação
  users[currentUserIndex].friendRequests = users[currentUserIndex].friendRequests.filter(id => id !== requesterId);
  localStorage.setItem('animuUsers', JSON.stringify(users));
  loadFriendRequests(users[currentUserIndex]);
}

function removeFriend(friendId) {
  if (!confirm('Tem certeza que deseja remover este amigo?')) return;

  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = JSON.parse(localStorage.getItem('userSession'));
  const currentUserIndex = users.findIndex(u => u.id === currentUser.userId);
  const friendIndex = users.findIndex(u => u.id === friendId);

  if (currentUserIndex === -1 || friendIndex === -1) return;

  // Remove da lista de amigos de ambos os usuários
  users[currentUserIndex].friends = users[currentUserIndex].friends.filter(id => id !== friendId);
  users[friendIndex].friends = users[friendIndex].friends.filter(id => id !== currentUser.userId);

  localStorage.setItem('animuUsers', JSON.stringify(users));
  window.location.reload();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function openChat(friendId) {
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = JSON.parse(localStorage.getItem('userSession'));
  const friend = users.find(u => u.id === friendId);

  if (!friend) return;

  // Verifica se já existe uma janela de chat aberta
  const existingChat = document.querySelector(`#chat-${friendId}`);
  if (existingChat) {
    existingChat.querySelector('input').focus();
    return;
  }

  const chatWindow = document.createElement('div');
  chatWindow.id = `chat-${friendId}`;
  chatWindow.className = 'w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden';
  chatWindow.innerHTML = `
    <div class="flex items-center justify-between p-3 bg-purple-500 text-white">
      <div class="flex items-center gap-2">
        <img src="${friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.username)}`}" 
             alt="${friend.username}" 
             class="w-8 h-8 rounded-full">
        <span class="font-medium">${friend.displayName || friend.username}</span>
      </div>
      <button onclick="closeChat('${friendId}')" class="text-white hover:text-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="h-80 overflow-y-auto p-4 space-y-3" id="chat-messages-${friendId}">
      <!-- Mensagens serão inseridas aqui -->
    </div>
    <div class="p-3 border-t dark:border-gray-700">
      <form onsubmit="sendMessage(event, '${currentUser.userId}', '${friendId}')" class="flex gap-2">
        <input type="text" placeholder="Digite sua mensagem..." 
               class="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <button type="submit" 
                class="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  `;

  document.getElementById('chat-windows').appendChild(chatWindow);
  loadChatMessages(currentUser.userId, friendId);
}

function closeChat(friendId) {
  const chatWindow = document.getElementById(`chat-${friendId}`);
  if (chatWindow) {
    chatWindow.remove();
  }
}

function loadChatMessages(senderId, receiverId) {
  const chat = new Chat();
  const messages = chat.getMessages(senderId, receiverId);
  const container = document.getElementById(`chat-messages-${receiverId}`);
  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];

  container.innerHTML = messages.map(msg => {
    const isMine = msg.senderId === senderId;
    const messageClasses = isMine ? 
      'ml-auto bg-purple-500 text-white' : 
      'mr-auto bg-gray-100 dark:bg-gray-700';

    return `
      <div class="flex ${isMine ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[70%] ${messageClasses} rounded-lg p-2 break-words">
          <p class="text-sm">${msg.message}</p>
          <span class="text-xs ${isMine ? 'text-purple-100' : 'text-gray-500'} block mt-1">
            ${new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function sendMessage(event, senderId, receiverId) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  const message = input.value.trim();

  if (!message) return;

  const chat = new Chat();
  chat.sendMessage(senderId, receiverId, message);
  
  loadChatMessages(senderId, receiverId);
  input.value = '';
}