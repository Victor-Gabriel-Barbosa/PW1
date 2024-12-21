// Função para recuperar os dados do Local Storage com tratamento de erros
function getSavedData() {
  try {
    return JSON.parse(localStorage.getItem('animeData')) || []; // Retorna os dados salvos ou um array vazio
  } catch (e) {
    console.warn('Local Storage não disponível ou corrompido:', e); // Loga um aviso caso haja erro
    return []; // Retorna um array vazio em caso de falha
  }
}

// Função para exibir mensagens padrão, como "Nenhum anime salvo ainda"
function showNoAnimeMessage(container, message) {
  container.innerHTML = `
    <div class="no-anime">
      <p>${message}</p>
    </div>
  `;
}

// Função para criar o HTML de um cartão de anime
// Recebe um objeto "anime" e retorna uma string de HTML com os detalhes do anime
function createAnimeCardHTML(anime) {
  return `
    <div class="anime-card rounded-lg shadow-md overflow-hidden">
      <div class="relative h-[320px]">
        <img src="${anime.coverImage}" 
             alt="${anime.primaryTitle}" 
             class="w-full h-full object-cover"
             onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Imagem'">
      </div>
      
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-2" style="color: blueviolet">${anime.primaryTitle}</h2>
        
        <div class="flex flex-wrap gap-1 mb-3">
          ${anime.genres && anime.genres.length > 0
      ? anime.genres.slice(0, 3).map(g => `<span class="genre-tag text-sm">${g}</span>`).join('')
      : '<span class="genre-tag text-sm">Sem gêneros</span>'}
        </div>

        <div class="flex items-center justify-between text-sm mb-3">
          <span>${anime.releaseYear || 'Ano: N/A'}</span>
          <span>${anime.episodes ? `${anime.episodes} eps` : 'Eps: N/A'}</span>
        </div>

        <div class="flex justify-between items-center">
          ${anime.score ? `
            <span class="text-sm bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
              ⭐ ${anime.score}/10
            </span>
          ` : ''}
          <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
             class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            Ver detalhes →
          </a>
        </div>
      </div>
    </div>
  `;
}

// Função para exibir a lista de animes salvos no Local Storage
function displayAnimes() {
  const animeList = document.getElementById('anime-list'); // Elemento onde os animes serão exibidos
  const savedData = getSavedData(); // Recupera os dados do Local Storage

  // Caso o array esteja vazio, exibe uma mensagem padrão
  if (savedData.length === 0) {
    showNoAnimeMessage(animeList, 'Nenhum anime salvo ainda.');
    return;
  }

  // Renderiza os animes chamando a função de criação do HTML
  animeList.innerHTML = savedData.map(anime => createAnimeCardHTML({ ...anime, listView: true })).join('');
}

// Função para buscar um anime pelo título
function searchAnime() {
  const searchInput = document.getElementById('search-title').value.trim(); // Obtém o termo de busca digitado
  const animeResultContainer = document.getElementById('anime-result'); // Elemento onde os resultados da busca serão exibidos

  // Valida se o termo de busca é válido
  if (!searchInput) {
    alert('Por favor, digite um nome válido.');
    return;
  }

  // Exibe mensagem de busca em andamento
  animeResultContainer.innerHTML = `<p>Buscando...</p>`;
  toggleAnimeResults(true); // Garante que os resultados estejam visíveis

  const savedData = getSavedData(); // Recupera os dados do Local Storage

  // Filtra os animes que contém o termo buscado no título principal (ignora maiúsculas e minúsculas)
  const results = savedData.filter((item) =>
    item.primaryTitle.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Caso existam resultados, renderiza os animes encontrados
  if (results.length > 0) {
    const resultsWithListView = results.map(anime => ({ ...anime, listView: true }));
    animeResultContainer.innerHTML = resultsWithListView.map(createAnimeCardHTML).join('');
  } else {
    // Se nenhum resultado for encontrado, exibe uma mensagem informando o usuário
    showNoAnimeMessage(animeResultContainer, `Nenhum anime encontrado para "${searchInput}".`);
  }
}

// Adiciona um evento ao carregar a página para exibir a lista de animes salvos automaticamente
window.addEventListener('DOMContentLoaded', displayAnimes);

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

  if (!anime) {
    container.innerHTML = `
                <div class="no-anime-found">
                    <h2>Anime não encontrado</h2>
                    <p>O anime solicitado não está disponível em nossa base de dados.</p>
                </div>
            `;
    return;
  }

  const alternativeTitlesHtml = anime.alternativeTitles
    .map(t => `<span>${t.title} (${t.type})</span>`)
    .join(', ');

  const genresHtml = anime.genres
    .map(genre => `<span class="genre-tag">${genre}</span>`)
    .join('');

  const embedUrl = getYouTubeEmbedUrl(anime.trailerUrl);

  container.innerHTML = `
            <div class="anime-header">
                <img src="${anime.coverImage}" alt="${anime.primaryTitle}" class="cover-image">
                <div class="anime-info">
                    <h1 class="title">${anime.primaryTitle}</h1>
                    <div class="alternative-titles">
                        ${alternativeTitlesHtml}
                    </div>
                    <div class="genres">
                        ${genresHtml}
                    </div>
                </div>
            </div>

            <div class="synopsis">
                ${anime.synopsis}
            </div>

            <div class="anime-details">
                <div class="detail-item">
                    <span class="detail-label">Episódios</span>
                    <span>${anime.episodes}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Ano de Lançamento</span>
                    <span>${anime.releaseYear}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Estúdio</span>
                    <span>${anime.studio}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span>${anime.status || 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Classificação Etária</span>
                    <span>${anime.ageRating || 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Temporada</span>
                    <span>${anime.season ? `${anime.season.period} ${anime.season.year}` : 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duração por Episódio</span>
                    <span>${anime.episodeDuration ? `${anime.episodeDuration} min` : 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Produtores</span>
                    <span>${anime.producers ? anime.producers.join(', ') : 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Licenciadores</span>
                    <span>${anime.licensors ? anime.licensors.join(', ') : 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Fonte</span>
                    <span>${anime.source || 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pontuação</span>
                    <span>${anime.score ? `${anime.score}/10` : 'Não informado'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Popularidade</span>
                    <span>${anime.popularity ? `#${anime.popularity}` : 'Não informado'}</span>
                </div>
            </div>

            ${embedUrl ? `
                <div class="trailer-container">
                    <iframe 
                        src="${embedUrl}"
                        allowfullscreen>
                    </iframe>
                </div>
            ` : ''}
        `;

  // Atualiza o título da página
  document.title = `${anime.primaryTitle} - Detalhes do Anime`;
}

// Nova função para renderizar todos os animes
function renderAllAnimes() {
  const container = document.getElementById('anime-content');
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];

  container.innerHTML = `
        <h1 class="text-3xl font-bold mb-6">Todos os Animes</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${animes.map(anime => `
                <div class="anime-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <img src="${anime.coverImage}" alt="${anime.primaryTitle}" class="w-full h-64 object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-semibold mb-2">${anime.primaryTitle}</h2>
                        <div class="genres mb-2">
                            ${anime.genres.map(genre =>
    `<span class="genre-tag">${genre}</span>`
  ).join('')}
                        </div>
                        <a href="animes.html?anime=${encodeURIComponent(anime.primaryTitle)}" 
                           class="text-blue-600 dark:text-blue-400 hover:underline">
                            Ver detalhes
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

  // Atualiza o título da página
  document.title = 'Lista de Todos os Animes';
}

// Modifica o evento DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const animeTitle = getUrlParameter('anime');
  if (!animeTitle) {
    renderAnimeDetails(null);
  } else if (animeTitle.toLowerCase() === 'all') {
    renderAllAnimes();
  } else {
    const anime = findAnimeByTitle(decodeURIComponent(animeTitle));
    renderAnimeDetails(anime);
  }
});

// Adicionar listener para fechar resultados quando clicar fora
document.addEventListener('click', function(event) {
    const searchArea = document.getElementById('search-area');
    
    // Verifica se o clique foi fora da área de busca
    if (!searchArea.contains(event.target)) {
        toggleAnimeResults(false); // Apenas esconde os resultados
    }
});

// Quando exibir resultados, garanta que o container esteja visível
function showAnimeResults(results) {
    const animeResult = document.getElementById('anime-result');
    // ... seu código existente de exibição de resultados ...
    animeResult.style.display = 'block'; // Garante que o container está visível
}

// Função para mostrar/esconder resultados
function toggleAnimeResults(show) {
    const animeResult = document.getElementById('anime-result');
    animeResult.style.display = show ? 'flex' : 'none';
}