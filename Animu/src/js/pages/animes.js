// Função para obter parâmetros da URL
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Função para encontrar o anime pelo título
function findAnimeByTitle(title) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  return animes.find(anime =>
    anime.primaryTitle.toLowerCase() === title.toLowerCase() ||
    anime.alternativeTitles.some(alt =>
      alt.title.toLowerCase() === title.toLowerCase()
    )
  );
}

// Função para converter URL do YouTube para formato embed
function getYouTubeEmbedUrl(url) {
  if (!url) return '';

  // Padrões possíveis de URL do YouTube
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/
  ];

  // Tenta encontrar o ID do vídeo usando os padrões
  let videoId = '';
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      videoId = match[1];
      break;
    }
  }

  // Retorna a URL de embed se encontrou um ID, ou string vazia se não encontrou
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

// Função para renderizar os detalhes do anime
function renderAnimeDetails(anime) {
  const container = document.getElementById('anime-content');
  const commentsSection = document.getElementById('comments-section');

  // Verifica se os elementos necessários existem
  if (!container || !commentsSection) {
    console.warn('Elementos necessários não encontrados no DOM');
    return;
  }

  if (!anime) {
    container.innerHTML = `
      <div class="no-anime-found">
        <h2>Anime não encontrado</h2>
        <p>O anime solicitado não está disponível em nossa base de dados.</p>
      </div>
    `;
    commentsSection.style.display = 'none';
    return;
  }

  const alternativeTitlesHtml = anime.alternativeTitles
    .map(t => `<span class="alt-title">${t.title} (${t.type})</span>`)
    .join('');

  const genresHtml = anime.genres
    .map(genre => `<span class="genre-tag">${genre}</span>`)
    .join('');

  const embedUrl = getYouTubeEmbedUrl(anime.trailerUrl);

  container.innerHTML = `
    <div class="anime-header flex flex-col md:flex-row gap-4">
      <img src="${anime.coverImage}" alt="${anime.primaryTitle}" class="cover-image w-full md:w-1/3 rounded-lg shadow-md">
      <div class="anime-info flex-grow">
        <div class="flex justify-between items-start">
          <h1 class="title text-3xl font-bold mb-2">${anime.primaryTitle}</h1>
          <button id="favorite-button" 
                  onclick="toggleFavorite('${anime.primaryTitle}')"
                  class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">
          </button>
        </div>
        <div class="alternative-titles text-sm text-gray-500 mb-2">
          ${alternativeTitlesHtml}
        </div>
        <div class="genres flex flex-wrap gap-2 mb-4">
          ${genresHtml}
        </div>
        <div class="anime-details grid grid-cols-2 gap-4 text-sm">
          <div class="detail-item">
            <span class="detail-label font-semibold">Episódios:</span>
            <span>${anime.episodes}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Ano de Lançamento:</span>
            <span>${anime.releaseYear}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Estúdio:</span>
            <span>${anime.studio}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Status:</span>
            <span>${anime.status || 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Classificação Etária:</span>
            <span>${anime.ageRating || 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Temporada:</span>
            <span>${anime.season ? `${anime.season.period} ${anime.season.year}` : 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Duração por Episódio:</span>
            <span>${anime.episodeDuration ? `${anime.episodeDuration} min` : 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Produtores:</span>
            <span>${anime.producers ? anime.producers.join(', ') : 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Licenciadores:</span>
            <span>${anime.licensors ? anime.licensors.join(', ') : 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Fonte:</span>
            <span>${anime.source || 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Pontuação:</span>
            <span>${anime.score ? `${anime.score}/10` : 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label font-semibold">Popularidade:</span>
            <span>${anime.popularity ? `#${anime.popularity}` : 'Não informado'}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="synopsis mt-4">
      <h2 class="text-2xl font-semibold mb-2">Sinopse</h2>
      <p>${anime.synopsis}</p>
    </div>
    ${embedUrl ? `
      <div class="trailer-container mt-4">
        <iframe 
          src="${embedUrl}"
          allowfullscreen
          class="w-full aspect-video rounded-lg shadow-md">
        </iframe>
      </div>
    ` : ''}
  `;

  // Mostra a seção de comentários apenas para detalhes de um anime específico
  commentsSection.style.display = 'block';

  // Atualiza o título da página
  document.title = `${anime.primaryTitle} - Detalhes do Anime`;

  // Atualiza o estado inicial do botão de favorito
  updateFavoriteButton(anime.primaryTitle);
}

// Nova função para normalizar categorias
function normalizeCategory(category) {
  const normalizations = {
    'action': ['ação', 'action', 'acao'],
    'drama': ['drama'],
    'comedy': ['comédia', 'comedy', 'comedia'],
    'fantasy': ['fantasia', 'fantasy'],
    'sci-fi': ['ficção científica', 'sci-fi', 'sci fi', 'ficcao cientifica'],
    'romance': ['romance', 'romântico', 'romantico'],
    'supernatural': ['sobrenatural', 'supernatural'],
    'game': ['game', 'games', 'jogos']
  };

  if (!category) return '';

  category = category.toLowerCase().trim();

  for (const [key, variants] of Object.entries(normalizations)) {
    if (variants.includes(category)) {
      return key;
    }
  }

  return category;
}

// Modificar a função renderAllAnimes para usar a normalização
function renderAllAnimes() {
  const container = document.getElementById('anime-content');
  const commentsSection = document.getElementById('comments-section');
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category');

  // Esconde a seção de comentários ao mostrar todos os animes
  if (commentsSection) {
    commentsSection.style.display = 'none';
  }

  if (!container) return;

  // Filtra os animes se houver uma categoria selecionada
  const filteredAnimes = categoryFilter
    ? animes.filter(anime =>
      anime.genres.some(genre =>
        normalizeCategory(genre) === normalizeCategory(categoryFilter)
      )
    )
    : animes;

  if (filteredAnimes.length === 0) {
    container.innerHTML = `
          <div class="no-anime-found">
              <h2>Nenhum anime encontrado</h2>
              <p>Não encontramos animes na categoria: ${categoryFilter}</p>
          </div>
      `;
    return;
  }

  container.innerHTML = `
      <h1 class="text-3xl font-bold mb-6">
          ${categoryFilter ? `Animes da categoria: ${categoryFilter}` : 'Todos os Animes'}
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filteredAnimes.map(anime => `
              <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
                 class="anime-card rounded-lg shadow-md overflow-hidden block hover:shadow-lg transition-shadow">
                  <img src="${anime.coverImage}" alt="${anime.primaryTitle}" class="w-full h-64 object-cover">
                  <div class="p-4">
                      <h2 class="text-xl font-semibold mb-2">${anime.primaryTitle}</h2>
                      <div class="genres mb-2">
                          ${anime.genres.map(genre =>
    `<span class="genre-tag">${genre}</span>`
  ).join('')}
                      </div>
                  </div>
              </a>
          `).join('')}
      </div>
  `;

  // Atualiza o título da página
  document.title = categoryFilter
    ? `${categoryFilter} - Animes por Categoria`
    : 'Lista de Todos os Animes';
}

// Função para carregar comentários do localStorage
function loadComments(animeTitle) {
  try {
    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    return comments[animeTitle] || [];
  } catch (e) {
    console.warn('Erro ao carregar comentários:', e);
    return [];
  }
}

// Nova função para verificar se usuário já comentou
function hasUserAlreadyCommented(animeTitle, username) {
  try {
    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    const animeComments = comments[animeTitle] || [];
    return animeComments.some(comment => comment.username === username);
  } catch (e) {
    console.error('Erro ao verificar comentário existente:', e);
    return false;
  }
}

// Função saveComment modificada para usar o sistema de moderação
function saveComment(animeTitle, comment, rating) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('userSession'));
    if (!currentUser) {
      alert('Você precisa estar logado para comentar!');
      return null;
    }

    // Verifica se o usuário é admin
    const isAdmin = currentUser.isAdmin || false;

    // Se não for admin, verifica se já comentou
    if (!isAdmin && hasUserAlreadyCommented(animeTitle, currentUser.username)) {
      alert('Você já fez um comentário neste anime. Apenas administradores podem fazer múltiplos comentários.');
      return null;
    }

    // Validação do conteúdo usando o ForumModerator
    try {
      ForumModerator.validateContent(comment, 'comentário');
    } catch (error) {
      alert(error.message);
      return null;
    }

    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    if (!comments[animeTitle]) {
      comments[animeTitle] = [];
    }

    const sliderRating = document.getElementById('rating-slider').value / 10;

    const newComment = {
      id: Date.now(),
      text: TextFormatter.format(comment), // Usa o TextFormatter para formatar o texto
      rating: sliderRating,
      username: currentUser.username,
      timestamp: new Date().toISOString()
    };

    comments[animeTitle].unshift(newComment);
    localStorage.setItem('animeComments', JSON.stringify(comments));

    // Atualizar a média de avaliações do anime
    updateAnimeRating(animeTitle);
    return newComment;
  } catch (e) {
    console.error('Erro ao salvar comentário:', e);
    return null;
  }
}

// Função para calcular e atualizar a média de avaliações do anime
function updateAnimeRating(animeTitle) {
  try {
    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    const animeComments = comments[animeTitle] || [];

    if (animeComments.length === 0) return;

    const totalRating = animeComments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    const averageRating = totalRating / animeComments.length;

    // Atualizar a avaliação no objeto do anime
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    const animeIndex = animes.findIndex(a => a.primaryTitle === animeTitle);

    if (animeIndex !== -1) {
      animes[animeIndex].score = averageRating.toFixed(1);
      localStorage.setItem('animeData', JSON.stringify(animes));
    }
  } catch (e) {
    console.error('Erro ao atualizar avaliação:', e);
  }
}

// Função para formatar data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Função para renderizar estrelas (incluindo meias estrelas)
function renderStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Adiciona estrelas cheias
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star">★</span>';
  }

  // Adiciona meia estrela se necessário
  if (hasHalfStar) {
    stars += '<span class="half-star">★</span>';
  }

  // Adiciona estrelas vazias para completar 10
  const emptyStars = 10 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star" style="color: #ddd !important;">☆</span>';
  }

  return stars;
}

// Função para deletar comentário
function deleteComment(animeTitle, commentId) {
  try {
    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    if (!comments[animeTitle]) return false;

    // Filtra o comentário a ser removido
    comments[animeTitle] = comments[animeTitle].filter(comment => comment.id !== commentId);
    localStorage.setItem('animeComments', JSON.stringify(comments));

    // Atualiza a média de avaliações do anime
    updateAnimeRating(animeTitle);
    return true;
  } catch (e) {
    console.error('Erro ao deletar comentário:', e);
    return false;
  }
}

// Função para votar em um comentário
function voteComment(animeTitle, commentId, voteType) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('userSession'))?.username;
    if (!currentUser) {
      alert('Você precisa estar logado para votar!');
      return false;
    }

    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    const comment = comments[animeTitle].find(c => c.id === commentId);

    if (!comment) return false;

    // Inicializar arrays de votos se não existirem
    comment.likes = comment.likes || [];
    comment.dislikes = comment.dislikes || [];

    // Remover voto existente do usuário
    comment.likes = comment.likes.filter(user => user !== currentUser);
    comment.dislikes = comment.dislikes.filter(user => user !== currentUser);

    // Adicionar novo voto
    if (voteType === 'like') {
      comment.likes.push(currentUser);
    } else if (voteType === 'dislike') {
      comment.dislikes.push(currentUser);
    }

    localStorage.setItem('animeComments', JSON.stringify(comments));
    return true;
  } catch (e) {
    console.error('Erro ao votar:', e);
    return false;
  }
}

// Função para verificar se o usuário já votou
function getUserVote(likes = [], dislikes = []) {
  const currentUser = JSON.parse(localStorage.getItem('userSession'))?.username;
  if (!currentUser) return null;

  if (likes.includes(currentUser)) return 'like';
  if (dislikes.includes(currentUser)) return 'dislike';
  return null;
}

// Função para verificar se o usuário atual é admin
function isUserAdmin() {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  return sessionData?.isAdmin || false;
}

// Função para editar comentário (modificada para usar o sistema de moderação)
function editComment(animeTitle, commentId, newText, newRating) {
  try {
    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    if (!comments[animeTitle]) return false;

    const comment = comments[animeTitle].find(c => c.id === commentId);
    if (!comment) return false;

    // Verifica se o usuário atual é o dono do comentário
    const currentUser = JSON.parse(localStorage.getItem('userSession'))?.username;
    if (currentUser !== comment.username) return false;

    // Validação do conteúdo usando o ForumModerator
    try {
      ForumModerator.validateContent(newText, 'comentário');
    } catch (error) {
      alert(error.message);
      return false;
    }

    comment.text = TextFormatter.format(newText); // Usa o TextFormatter para formatar o texto
    comment.rating = newRating;
    comment.edited = true;
    comment.editedAt = new Date().toISOString();

    localStorage.setItem('animeComments', JSON.stringify(comments));

    // Atualiza a média de avaliações do anime
    updateAnimeRating(animeTitle);
    return true;
  } catch (e) {
    console.error('Erro ao editar comentário:', e);
    return false;
  }
}

// Função para alternar modo de edição (modificada)
function toggleEditMode(commentId) {
  const commentDiv = document.querySelector(`[data-comment-id="${commentId}"]`);
  const commentText = commentDiv.querySelector('.comment-text');
  const commentRating = commentDiv.querySelector('.comment-rating');
  const editForm = commentDiv.querySelector('.edit-form');

  if (editForm) {
    commentText.style.display = 'block';
    commentRating.style.display = 'block';
    editForm.remove();
  } else {
    const currentText = commentText.textContent;
    const currentRating = parseFloat(commentDiv.getAttribute('data-rating')) * 10; // Converte para escala 0-100

    commentText.style.display = 'none';
    commentRating.style.display = 'none';

    const form = document.createElement('form');
    form.className = 'edit-form mt-2';
    form.innerHTML = `
      <div class="rating-container mb-4">
        <p class="mb-2 font-semibold">Sua avaliação: <span id="edit-rating-display">${(currentRating / 10).toFixed(1)}</span></p>
        <div class="rating-slider-container">
          <input type="range" 
                 id="edit-rating-slider" 
                 min="0" 
                 max="100" 
                 value="${currentRating}"
                 class="rating-slider"
                 step="5">
          <div class="rating-emoji-container">
            <span id="edit-rating-emoji" class="rating-emoji">😊</span>
          </div>
        </div>
      </div>
      <textarea class="w-full p-2 border rounded resize-none dark:bg-gray-800">${currentText}</textarea>
      <div class="flex gap-2 mt-2">
        <button type="submit" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Salvar</button>
        <button type="button" onclick="toggleEditMode(${commentId})" class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
      </div>
    `;

    commentText.insertAdjacentElement('afterend', form);

    // Inicializa o slider de avaliação na edição
    const editSlider = form.querySelector('#edit-rating-slider');
    editSlider.addEventListener('input', function () {
      updateEditRatingDisplay(this.value);
    });
    updateEditRatingDisplay(currentRating);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newText = form.querySelector('textarea').value.trim();
      const newRating = parseFloat(form.querySelector('#edit-rating-slider').value) / 10;

      if (newText) {
        const animeTitle = new URLSearchParams(window.location.search).get('anime');
        if (editComment(decodeURIComponent(animeTitle), commentId, newText, newRating)) {
          updateCommentsList(decodeURIComponent(animeTitle));
        }
      }
    });
  }
}

// Nova função para atualizar o display de avaliação na edição
function updateEditRatingDisplay(value) {
  const emoji = document.getElementById('edit-rating-emoji');
  const display = document.getElementById('edit-rating-display');
  const rating = value / 10;

  // Adiciona classe de animação
  emoji.classList.remove('animate');
  void emoji.offsetWidth;
  emoji.classList.add('animate');

  // Define o emoji baseado no valor
  if (value === 0) {
    emoji.textContent = '😶';
  } else if (value <= 20) {
    emoji.textContent = '😭';
  } else if (value <= 40) {
    emoji.textContent = '☹️';
  } else if (value <= 60) {
    emoji.textContent = '😐';
  } else if (value <= 80) {
    emoji.textContent = '😊';
  } else {
    emoji.textContent = '🤩';
  }

  // Atualiza o display numérico
  if (display) {
    display.textContent = rating.toFixed(1);
  }
}

// Atualiza a função renderComment para incluir o rating como atributo data
function renderComment(comment, animeTitle) {
  const currentUser = JSON.parse(localStorage.getItem('userSession'))?.username;
  const isCommentOwner = currentUser === comment.username;
  const userVote = getUserVote(comment.likes, comment.dislikes);
  const isAdmin = isUserAdmin();
  const canDelete = isCommentOwner || isAdmin;

  return `
    <div class="comment p-4 rounded-lg" data-comment-id="${comment.id}" data-rating="${comment.rating}">
      <div class="flex items-center gap-2 mb-2">
        <strong class="text-purple-600">${comment.username}</strong>
        <span class="comment-rating">${renderStars(comment.rating)}</span>
        <span class="text-sm">${formatDate(comment.timestamp)}</span>
        <div class="ml-auto flex gap-2">
          ${isCommentOwner ? `
            <button 
              class="edit-btn px-2 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
              onclick="toggleEditMode(${comment.id})"
            >
              Editar
            </button>
          ` : ''}
          ${canDelete ? `
            <button 
              class="delete-btn px-2 py-1 rounded text-sm"
              onclick="if(confirm('Deseja realmente excluir este comentário?')) { 
                deleteComment('${animeTitle}', ${comment.id}); 
                updateCommentsList('${animeTitle}');
              }"
            >
              ${isAdmin && !isCommentOwner ? '🛡️ Excluir' : 'Excluir'}
            </button>
          ` : ''}
        </div>
      </div>
      <p class="comment-text">${comment.text}</p>
      ${comment.edited ? `
        <small class="text-gray-500 italic">
          (editado em ${formatDate(comment.editedAt)})
        </small>
      ` : ''}
      <div class="vote-buttons">
        <button 
          class="vote-btn ${userVote === 'like' ? 'active' : ''}"
          onclick="voteComment('${animeTitle}', ${comment.id}, 'like') && updateCommentsList('${animeTitle}')"
        >
          👍 <span class="vote-count">${comment.likes?.length || 0}</span>
        </button>
        <button 
          class="vote-btn ${userVote === 'dislike' ? 'active' : ''}"
          onclick="voteComment('${animeTitle}', ${comment.id}, 'dislike') && updateCommentsList('${animeTitle}')"
        >
          👎 <span class="vote-count">${comment.dislikes?.length || 0}</span>
        </button>
      </div>
    </div>
  `;
}

// Função para atualizar a lista de comentários (atualizada)
function updateCommentsList(animeTitle) {
  const commentsList = document.getElementById('comments-list');
  const comments = loadComments(animeTitle);

  if (comments.length === 0) {
    commentsList.innerHTML = `
      <p class="text-center">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
    `;
    return;
  }

  commentsList.innerHTML = comments.map(comment => renderComment(comment, animeTitle)).join('');
}

// Funções para gerenciar a exibição da nota
function updateRatingDisplay(value) {
  const display = document.getElementById('rating-display');
  if (display) {
    display.textContent = parseFloat(value).toFixed(1);
  }
}

function showTemporaryRating(value) {
  const display = document.getElementById('rating-display');
  if (display) {
    display.textContent = parseFloat(value).toFixed(1);
    display.style.opacity = '0.7';
  }
}

function showSelectedRating() {
  const display = document.getElementById('rating-display');
  const selectedRating = document.querySelector('input[name="rating"]:checked');
  if (display) {
    display.style.opacity = '1';
    display.textContent = selectedRating ? parseFloat(selectedRating.value).toFixed(1) : '0.0';
  }
}

// Função para calcular a pontuação de destaque de um anime
function calculateHighlightScore(anime, comments) {
  const commentCount = comments[anime.primaryTitle]?.length || 0;
  const score = parseFloat(anime.score) || 0;
  // Fórmula: (nota * 0.7) + (número de comentários * 0.3)
  return (score * 0.7) + (commentCount * 0.3);
}

// Função para obter os animes em destaque
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

// Função para renderizar os animes em destaque
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
            onerror="this.src='https://via.placeholder.com/480x720?text=Sem+Imagem'">
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

// Modifique a função renderSearchResults para não limpar os resultados
function renderSearchResults(query) {
  const container = document.getElementById('anime-content');
  const results = JSON.parse(localStorage.getItem('searchResults')) || [];

  if (!container) return;

  // Atualiza o título da página
  document.title = `Resultados da busca: ${query}`;

  container.innerHTML = `
    <h1 class="text-3xl font-bold mb-6">
      Resultados da busca: "${query}"
    </h1>
    ${results.length === 0 ? `
      <div class="no-results">
        <p>Nenhum anime encontrado para sua busca.</p>
      </div>
    ` : `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${results.map(anime => `
          <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
             class="anime-card rounded-lg shadow-md overflow-hidden block hover:shadow-lg transition-shadow">
            <img src="${anime.coverImage}" alt="${anime.primaryTitle}" class="w-full h-64 object-cover">
            <div class="p-4">
              <h2 class="text-xl font-semibold mb-2">${anime.primaryTitle}</h2>
              <div class="genres mb-2">
                ${anime.genres.map(genre =>
                  `<span class="genre-tag">${genre}</span>`
                ).join('')}
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    `}
  `;
}

// Modifique o evento DOMContentLoaded para manter os resultados
window.addEventListener('DOMContentLoaded', () => {
  const animeTitle = getUrlParameter('anime');
  const searchQuery = getUrlParameter('search');

  if (searchQuery) {
    // Se houver uma query de busca, renderiza os resultados
    renderSearchResults(decodeURIComponent(searchQuery));
  } else if (!animeTitle) {
    renderAnimeDetails(null);
  } else if (animeTitle.toLowerCase() === 'all') {
    renderAllAnimes();
  } else {
    const anime = findAnimeByTitle(decodeURIComponent(animeTitle));
    renderAnimeDetails(anime);

    // Adiciona handler para o formulário de comentários
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Verifica se usuário está logado
        const session = localStorage.getItem('userSession');
        if (!session) {
          alert('Você precisa estar logado para comentar!');
          window.location.href = './login/signin.html';
          return;
        }

        const commentText = document.getElementById('comment-text').value.trim();
        const ratingValue = document.getElementById('rating-slider').value;

        if (!commentText) {
          alert('Por favor, escreva um comentário.');
          return;
        }

        if (ratingValue === '0') {
          alert('Por favor, dê uma avaliação usando o slider.');
          return;
        }

        saveComment(decodeURIComponent(animeTitle), commentText);
        document.getElementById('comment-text').value = '';
        document.getElementById('rating-slider').value = '0';
        updateRatingEmoji(0); // Reseta o emoji
        updateCommentsList(decodeURIComponent(animeTitle));
      });
    }

    // Carrega comentários existentes
    updateCommentsList(decodeURIComponent(animeTitle));
  }

  // Renderiza animes em destaque
  renderFeaturedAnimes();
});

// Função para atualizar o emoji baseado no valor do slider
function updateRatingEmoji(value) {
  const emoji = document.getElementById('rating-emoji');
  const display = document.getElementById('rating-display');
  const rating = value / 10;

  // Adiciona classe de animação
  emoji.classList.remove('animate');
  void emoji.offsetWidth; // Força reflow
  emoji.classList.add('animate');

  // Define o emoji baseado no valor
  if (value === 0) {
    emoji.textContent = '😶';
  } else if (value <= 20) {
    emoji.textContent = '😭';
  } else if (value <= 40) {
    emoji.textContent = '☹️';
  } else if (value <= 60) {
    emoji.textContent = '😐';
  } else if (value <= 80) {
    emoji.textContent = '😊';
  } else {
    emoji.textContent = '🤩';
  }

  // Atualiza o display numérico
  display.textContent = (rating).toFixed(1);
}

// Evento para inicializar o slider de avaliação
document.addEventListener('DOMContentLoaded', function () {
  const slider = document.getElementById('rating-slider');
  if (slider) {
    slider.addEventListener('input', function () {
      updateRatingEmoji(this.value);
    });
  }
});

// Função para verificar se um anime está favoritado
function isAnimeFavorited(animeTitle) {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) return false;

  const users = JSON.parse(localStorage.getItem('animuUsers')) || [];
  const currentUser = users.find(user => user.id === sessionData.userId);

  return currentUser?.favoriteAnimes?.includes(animeTitle) || false;
}

// Função para alternar favorito
function toggleFavorite(animeTitle) {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (!sessionData) {
    alert('Você precisa estar logado para favoritar animes!');
    window.location.href = './login/signin.html';
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

  // Atualiza o botão
  updateFavoriteButton(animeTitle);
}

// Função para atualizar o botão de favorito
function updateFavoriteButton(animeTitle) {
  const favoriteButton = document.getElementById('favorite-button');
  const isFavorited = isAnimeFavorited(animeTitle);

  if (favoriteButton) {
    favoriteButton.innerHTML = isFavorited ?
      '❤️ Remover dos Favoritos' :
      '🤍 Adicionar aos Favoritos';
    favoriteButton.classList.toggle('favorited', isFavorited);
  }
}