// Função para criar o HTML de um cartão de anime
// Recebe um objeto "anime" e retorna uma string de HTML com os detalhes do anime
function createAnimeCardHTML(anime) {
  return `
      <div class="anime-card${anime.listView ? ' list' : ''}">
          <div class="anime-details">
              <!-- Imagem de capa do anime com fallback para uma imagem padrão -->
              <img src="${anime.coverImage}" alt="Capa do Anime" 
                  onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Imagem'">
              
              <div class="anime-info">
                  <!-- Título principal do anime -->
                  <h2 style="color: blueviolet"><strong>${anime.primaryTitle}</strong></h2>
                  
                  <!-- Sinopse do anime -->
                  <p><strong>Sinopse:</strong> ${anime.synopsis}</p>
                  
                  <!-- Estúdio responsável pelo anime -->
                  <p><strong>Estúdio:</strong> ${anime.studio}</p>
                  
                  <!-- Ano de lançamento do anime -->
                  <p><strong>Ano de Lançamento:</strong> ${anime.releaseYear}</p>
                  
                  <!-- Número de episódios do anime -->
                  <p><strong>Número de Episódios:</strong> ${anime.episodes}</p>
                  
                  <!-- Link para assistir ao trailer, se disponível -->
                  ${anime.trailerUrl ? `<p><a href="${anime.trailerUrl}" target="_blank">🎬 Assistir Trailer</a></p>` : ''}
                  
                  <!-- Exibição dos títulos alternativos do anime -->
                  <div>
                      <strong>Títulos Alternativos:</strong>
                      ${anime.alternativeTitles && anime.alternativeTitles.length > 0
      ? anime.alternativeTitles.map(t => `<span class="tag">${t.title} (${t.type})</span>`).join('')
      : 'Nenhum título alternativo'}
                  </div>
                  
                  <!-- Exibição dos gêneros do anime -->
                  <div>
                      <strong>Gêneros:</strong>
                      ${anime.genres && anime.genres.length > 0
      ? anime.genres.map(g => `<span class="tag">${g}</span>`).join('')
      : 'Nenhum gênero'}
                  </div>
              </div>
          </div>
      </div>
  `;
}

// Função para exibir a lista de animes salvos no Local Storage
function displayAnimes() {
  const animeList = document.getElementById('anime-list'); // Elemento onde os animes serão exibidos
  const savedData = localStorage.getItem('animeData'); // Recupera os dados do Local Storage

  // Se não houver dados salvos, exibe uma mensagem padrão
  if (!savedData) {
    animeList.innerHTML = `
      <div class="no-anime">
        <p>Nenhum anime salvo ainda.</p>
      </div>
    `;
    return;
  }

  const animes = JSON.parse(savedData); // Converte os dados do Local Storage de JSON para um array de objetos

  // Caso o array esteja vazio, exibe uma mensagem padrão
  if (animes.length === 0) {
    animeList.innerHTML = `
      <div class="no-anime">
        <p>Nenhum anime salvo ainda.</p>
      </div>
    `;
    return;
  }

  // Mapeia os animes adicionando a propriedade "listView" para diferenciar visualizações
  const animesToDisplay = animes.map(anime => ({ ...anime, listView: true }));

  // Renderiza os animes chamando a função de criação do HTML
  animeList.innerHTML = animesToDisplay.map(createAnimeCardHTML).join('');
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

  let savedData = [];
  try {
    // Recupera os dados salvos no Local Storage
    savedData = JSON.parse(localStorage.getItem('animeData')) || [];
  } catch (e) {
    console.error('Erro ao recuperar dados do Local Storage:', e); // Loga o erro no console
    animeResultContainer.innerHTML = `<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>`;
    return;
  }

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
    animeResultContainer.innerHTML = `
          <div class="no-result">
              <p>Nenhum anime encontrado para "${searchInput}".</p>
          </div>`;
  }
}

// Adiciona um evento ao carregar a página para exibir a lista de animes salvos automaticamente
window.addEventListener('DOMContentLoaded', displayAnimes);