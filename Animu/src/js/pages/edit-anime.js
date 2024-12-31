// Inicializa a página carregando animes e configurando busca
document.addEventListener('DOMContentLoaded', function () {
  loadAnimes();
  setupSearch();
});

// Renderiza lista de animes do localStorage
function loadAnimes() {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const container = document.getElementById('anime-list');

  if (animes.length === 0) {
    container.innerHTML = '<p class="text-center col-span-full">Nenhum anime cadastrado.</p>';
    return;
  }

  container.innerHTML = animes.map((anime, index) => `
      <div class="anime-card rounded-lg shadow-lg overflow-hidden">
        <img src="${anime.coverImage}" alt="${anime.primaryTitle}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">${anime.primaryTitle}</h3>
          <p class="text-sm line-clamp-2 mb-4">
            ${anime.synopsis}
          </p>
          <div class="flex gap-2">
              <button onclick="editAnime(${index})" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Editar
              </button>
              <button onclick="deleteAnime(${index})" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Excluir
              </button>
          </div>
        </div>
      </div>
  `).join('');
}

// Implementa busca em tempo real por título e sinopse
function setupSearch() {
  const searchInput = document.getElementById('search-anime');
  searchInput.addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];

    const filtered = animes.filter(anime =>
      anime.primaryTitle.toLowerCase().includes(searchTerm) ||
      anime.synopsis.toLowerCase().includes(searchTerm)
    );

    renderFilteredAnimes(filtered);
  });
}

// Renderiza animes filtrados na interface
function renderFilteredAnimes(animes) {
  const container = document.getElementById('anime-list');

  if (animes.length === 0) {
    container.innerHTML = '<p class="text-center col-span-full">Nenhum anime encontrado.</p>';
    return;
  }

  container.innerHTML = animes.map((anime, index) => `
      <div class="anime-card rounded-lg shadow-lg overflow-hidden">
          <img src="${anime.coverImage}" alt="${anime.primaryTitle}" 
               class="w-full h-48 object-cover">
          <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">${anime.primaryTitle}</h3>
              <p class="text-sm line-clamp-2 mb-4">
                  ${anime.synopsis}
              </p>
              <div class="flex gap-2">
                  <button onclick="editAnime(${index})" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                      Editar
                  </button>
                  <button onclick="deleteAnime(${index})" 
                          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Excluir
                  </button>
              </div>
          </div>
      </div>
  `).join('');
}

// Arrays para gerenciar dados temporários durante edição
let currentTitles = [];
let currentGenres = [];
let currentProducers = [];
let currentLicensors = [];

// Configura formulário de edição e preenche dados do anime selecionado
function editAnime(index) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const anime = animes[index];
  const modal = document.getElementById('edit-modal');
  const formContainer = document.getElementById('edit-form-container');

  // Atualizar as variáveis globais com os dados do anime
  currentTitles = anime.alternativeTitles || [];
  currentGenres = anime.genres || [];
  currentProducers = anime.producers || [];
  currentLicensors = anime.licensors || [];

  // Template do formulário de edição atualizado
  formContainer.innerHTML = `
    <form class="space-y-4" onsubmit="event.preventDefault(); saveChanges(${index})">
      <!-- Seção de Mídia com Preview -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="form-group">
          <label for="coverImage">Imagem de Capa</label>
          <div class="flex gap-2 mb-2">
            <input type="url" id="coverImage" required>
            <button type="button" class="btn-preview" onclick="previewImage()">Visualizar</button>
          </div>
          <div id="image-preview" class="preview-container">
            <img src="${anime.coverImage}" alt="Preview da capa" class="max-w-full h-auto rounded-lg shadow-lg">
          </div>
        </div>
        
        <div class="form-group">
          <label for="trailerUrl">Trailer (YouTube/Vimeo)</label>
          <div class="flex gap-2 mb-2">
            <input type="url" id="trailerUrl" placeholder="Cole a URL do vídeo">
            <button type="button" class="btn-preview" onclick="previewTrailer()">Visualizar</button>
          </div>
          <div id="trailer-preview" class="preview-container ${anime.trailerUrl ? '' : 'hidden'}">
            <iframe width="100%" height="200" frameborder="0" allowfullscreen src="${anime.trailerUrl || ''}"></iframe>
          </div>
        </div>
      </div>

      <!-- Abas de navegação -->
      <div class="tabs-container mb-6">
        <div class="progress-bar">
          <div class="progress-fill" id="form-progress"></div>
        </div>
        <div class="tabs-header flex gap-2 mb-4">
          <button type="button" class="tab-btn active" data-tab="basic" data-section="basic">
            1. Informações Básicas
            <div class="section-status" id="basic-status"></div>
          </button>
          <button type="button" class="tab-btn" data-tab="details" data-section="details">
            2. Detalhes
            <div class="section-status" id="details-status"></div>
          </button>
          <button type="button" class="tab-btn" data-tab="production" data-section="production">
            3. Produção
            <div class="section-status" id="production-status"></div>
          </button>
        </div>

        <!-- Conteúdo das abas -->
        <div id="basic" class="tab-content active">
          <!-- Informações Básicas e Títulos -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label for="primaryTitle">Título Principal</label>
              <input type="text" id="primaryTitle" required>
            </div>

            <!-- Títulos Alternativos -->
            <div class="form-group">
              <label>Títulos Alternativos</label>
              <div class="flex gap-2">
                <input type="text" id="alternative-title" class="flex-grow">
                <select id="title-type" class="w-24">
                  <option value="Japonês">Japonês</option>
                  <option value="Inglês">Inglês</option>
                  <option value="Romaji">Romaji</option>
                </select>
                <button type="button" class="btn-add px-2" onclick="addEditTitle()">+</button>
              </div>
              <div id="edit-titles-container" class="tag-container mt-2"></div>
            </div>
          </div>
          
          <!-- Sinopse -->
          <div class="form-group mt-4">
            <label for="synopsis">Sinopse</label>
            <textarea id="synopsis" rows="4" required></textarea>
            <div class="text-right text-sm text-gray-500">
              <span id="synopsis-count">0</span>/500 caracteres
            </div>
          </div>
        </div>

        <div id="details" class="tab-content hidden">
          <!-- Gêneros e Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label>Gêneros</label>
              <div class="flex gap-2">
                <input type="text" id="edit-genre-input" class="flex-grow">
                <button type="button" class="btn-add px-2" onclick="addEditGenre()">+</button>
              </div>
              <div id="edit-genres-container" class="tag-container mt-2"></div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" class="w-full">
                  <option value="Em andamento">Em Andamento</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Anunciado">Anunciado</option>
                </select>
              </div>
              <div class="form-group">
                <label for="ageRating">Classificação</label>
                <select id="ageRating" class="w-full">
                  <option value="livre">Livre</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="18">18</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Score e Popularidade -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="form-group">
              <label for="score">Score (0-10)</label>
              <input type="number" id="score" min="0" max="10" step="0.1" required>
            </div>
            <div class="form-group">
              <label for="popularity">Popularidade</label>
              <input type="number" id="popularity" min="1" required>
            </div>
          </div>
        </div>

        <div id="production" class="tab-content hidden">
          <!-- Informações de Produção -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-group">
              <label for="studio">Estúdio</label>
              <input type="text" id="studio" required>
            </div>
            <div class="form-group">
              <label for="episodes">Episódios</label>
              <input type="number" id="episodes" min="1" required>
            </div>
            <div class="form-group">
              <label for="episodeDuration">Duração (min)</label>
              <input type="number" id="episodeDuration" required>
            </div>
          </div>

          <!-- Temporada e Fonte -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-group">
              <label for="seasonPeriod">Temporada</label>
              <select id="seasonPeriod" class="w-full">
                <option value="Inverno">Inverno</option>
                <option value="Primavera">Primavera</option>
                <option value="Verão">Verão</option>
                <option value="Outono">Outono</option>
              </select>
            </div>
            <div class="form-group">
              <label for="seasonYear">Ano</label>
              <input type="number" id="seasonYear" required>
            </div>
            <div class="form-group">
              <label for="source">Fonte</label>
              <select id="source" class="w-full">
                <option value="Mangá">Mangá</option>
                <option value="Light Novel">Light Novel</option>
                <option value="Original">Original</option>
                <option value="Game">Game</option>
                <option value="Visual Novel">Visual Novel</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <!-- Produtores e Licenciadores -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label>Produtores</label>
              <div class="flex gap-2">
                <input type="text" id="edit-producer-input" class="flex-grow">
                <button type="button" class="btn-add px-2" onclick="addEditProducer()">+</button>
              </div>
              <div id="edit-producers-container" class="tag-container mt-2"></div>
            </div>
            <div class="form-group">
              <label>Licenciadores</label>
              <div class="flex gap-2">
                <input type="text" id="edit-licensor-input" class="flex-grow">
                <button type="button" class="btn-add px-2" onclick="addEditLicensor()">+</button>
              </div>
              <div id="edit-licensors-container" class="tag-container mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões -->
      <div class="grid grid-cols-2 gap-4">
        <button type="submit" class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Salvar Alterações
        </button>
        <button type="button" 
                onclick="document.getElementById('edit-modal').classList.add('hidden')" 
                class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Cancelar
        </button>
      </div>
    </form>
  `;

  // Adicionar configuração das abas
  setupTabs();
  setupSynopsisCounter();

  // Preencher os campos com os dados do anime
  const fields = {
    primaryTitle: anime.primaryTitle,
    synopsis: anime.synopsis,
    episodes: anime.episodes,
    seasonYear: anime.season?.year || anime.releaseYear,
    studio: anime.studio,
    coverImage: anime.coverImage,
    trailerUrl: anime.trailerUrl || '',
    status: anime.status,
    ageRating: anime.ageRating,
    seasonPeriod: anime.season?.period,
    episodeDuration: anime.episodeDuration,
    source: anime.source,
    score: anime.score,
    popularity: anime.popularity
  };

  // Preencher cada campo do formulário usando getElementById
  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      // Para campos select, primeiro verificamos se a opção existe
      if (element.tagName === 'SELECT') {
        const option = Array.from(element.options).find(opt => opt.value === value);
        if (option) {
          element.value = value;
        }
      } else {
        element.value = value || '';
      }
    }
  });

  // Configurar preview do trailer se existir
  if (anime.trailerUrl) {
    const trailerUrl = anime.trailerUrl;
    let embedUrl = '';
    
    if (trailerUrl.includes('youtube.com') || trailerUrl.includes('youtu.be')) {
      const videoId = trailerUrl.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})/)?.[1];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (trailerUrl.includes('vimeo.com')) {
      const videoId = trailerUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
    }

    if (embedUrl) {
      const previewFrame = document.querySelector('#trailer-preview iframe');
      previewFrame.src = embedUrl;
      previewFrame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      previewFrame.setAttribute('allowfullscreen', 'true');
      document.getElementById('trailer-preview').classList.remove('hidden');
    }
  }

  // Renderizar as listas
  renderEditTitles();
  renderEditGenres();
  renderEditProducers();
  renderEditLicensors();

  // Mostrar modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Gerenciamento de títulos alternativos
function addEditTitle() {
  const titleInput = document.getElementById('alternative-title');
  const titleTypeSelect = document.getElementById('title-type');

  if (titleInput.value.trim() === '') {
    alert('Por favor, insira um título válido.');
    return;
  }

  currentTitles.push({
    title: escapeHTML(titleInput.value),
    type: escapeHTML(titleTypeSelect.value),
  });

  renderEditTitles();
  titleInput.value = '';
}

// Atualiza visualização dos títulos alternativos
function renderEditTitles() {
  const container = document.getElementById('edit-titles-container');
  container.innerHTML = currentTitles
    .map(
      (t, index) => `
        <div class="tag">
          ${t.title} (${t.type})
          <span class="tag-remove" onclick="removeEditTitle(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

// Remove título alternativo pelo índice
function removeEditTitle(index) {
  currentTitles.splice(index, 1);
  renderEditTitles();
}

// Funções CRUD para gêneros, produtores e licenciadores
// Seguem o mesmo padrão das funções de título
function addEditGenre() {
  const genreInput = document.getElementById('edit-genre-input');

  if (genreInput.value.trim() === '') {
    alert('Por favor, insira um gênero válido.');
    return;
  }

  currentGenres.push(escapeHTML(genreInput.value));
  renderEditGenres();
  genreInput.value = '';
}

function renderEditGenres() {
  const container = document.getElementById('edit-genres-container');
  container.innerHTML = currentGenres
    .map(
      (genre, index) => `
        <div class="tag">
          ${genre}
          <span class="tag-remove" onclick="removeEditGenre(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

function removeEditGenre(index) {
  currentGenres.splice(index, 1);
  renderEditGenres();
}

function addEditProducer() {
  const producerInput = document.getElementById('edit-producer-input');

  if (producerInput.value.trim() === '') {
    alert('Por favor, insira um produtor válido.');
    return;
  }

  currentProducers.push(escapeHTML(producerInput.value));
  renderEditProducers();
  producerInput.value = '';
}

function renderEditProducers() {
  const container = document.getElementById('edit-producers-container');
  container.innerHTML = currentProducers
    .map(
      (producer, index) => `
        <div class="tag">
          ${producer}
          <span class="tag-remove" onclick="removeEditProducer(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

function removeEditProducer(index) {
  currentProducers.splice(index, 1);
  renderEditProducers();
}

function addEditLicensor() {
  const licensorInput = document.getElementById('edit-licensor-input');

  if (licensorInput.value.trim() === '') {
    alert('Por favor, insira um licenciador válido.');
    return;
  }

  currentLicensors.push(escapeHTML(licensorInput.value));
  renderEditLicensors();
  licensorInput.value = '';
}

function renderEditLicensors() {
  const container = document.getElementById('edit-licensors-container');
  container.innerHTML = currentLicensors
    .map(
      (licensor, index) => `
        <div class="tag">
            ${licensor}
            <span class="tag-remove" onclick="removeEditLicensor(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

function removeEditLicensor(index) {
  currentLicensors.splice(index, 1);
  renderEditLicensors();
}

// Valida e salva alterações do anime
function saveChanges(index) {
  // Primeiro, validar todos os campos obrigatórios
  const sections = ['basic', 'details', 'production'];
  const incompleteFields = [];

  sections.forEach(section => {
    const { isComplete, missingFields } = checkSectionProgress(section);
    if (!isComplete) {
      incompleteFields.push(...missingFields);
    }
  });

  if (incompleteFields.length > 0) {
    alert('Por favor, preencha todos os campos obrigatórios:\n' + incompleteFields.join('\n'));
    return;
  }

  // Se passou pela validação, pegar os valores dos campos individualmente
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  
  const updatedAnime = {
    ...animes[index], // Mantém os dados existentes
    primaryTitle: document.getElementById('primaryTitle').value,
    alternativeTitles: currentTitles,
    genres: currentGenres,
    producers: currentProducers,
    licensors: currentLicensors,
    synopsis: document.getElementById('synopsis').value,
    episodes: parseInt(document.getElementById('episodes').value),
    studio: document.getElementById('studio').value,
    coverImage: document.getElementById('coverImage').value,
    trailerUrl: document.getElementById('trailerUrl').value,
    status: document.getElementById('status').value,
    ageRating: document.getElementById('ageRating').value,
    season: {
      period: document.getElementById('seasonPeriod').value,
      year: parseInt(document.getElementById('seasonYear').value)
    },
    episodeDuration: parseInt(document.getElementById('episodeDuration').value),
    source: document.getElementById('source').value,
    score: parseFloat(document.getElementById('score').value),
    popularity: parseInt(document.getElementById('popularity').value)
  };

  // Atualizar o anime no array
  animes[index] = updatedAnime;

  // Salvar no localStorage
  localStorage.setItem('animeData', JSON.stringify(animes));

  // Fechar modal e recarregar lista
  document.getElementById('edit-modal').classList.add('hidden');
  alert('Anime atualizado com sucesso!');
  loadAnimes();
}

// Remove anime e seus comentários associados
function deleteAnime(index) {
  if (!confirm('Tem certeza que deseja excluir este anime?')) return;

  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const animeTitle = animes[index].primaryTitle;

  // Remove o anime do array de animes
  animes.splice(index, 1);
  localStorage.setItem('animeData', JSON.stringify(animes));

  // Remove os comentários relacionados ao anime
  const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
  if (comments[animeTitle]) {
    delete comments[animeTitle];
    localStorage.setItem('animeComments', JSON.stringify(comments));
  }

  loadAnimes();
}

// Sanitiza strings para prevenir XSS
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Configura navegação entre abas do formulário
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// Implementa contador de caracteres para sinopse
function setupSynopsisCounter() {
  const synopsis = document.getElementById('synopsis');
  const counter = document.getElementById('synopsis-count');
  const maxLength = 500;

  synopsis.addEventListener('input', () => {
    const length = synopsis.value.length;
    counter.textContent = length;

    if (length > maxLength) {
      synopsis.value = synopsis.value.substring(0, maxLength);
      counter.textContent = maxLength;
    }
  });
}

// Funções de preview de mídia
// Valida e exibe preview de imagem de capa
function previewImage() {
  const imageUrl = document.getElementById('coverImage').value;
  const previewContainer = document.getElementById('image-preview');
  const previewImg = previewContainer.querySelector('img');

  if (!imageUrl) {
    alert('Por favor, insira uma URL de imagem válida.');
    return;
  }

  previewImg.onerror = () => {
    alert('Não foi possível carregar a imagem. Verifique a URL.');
    previewContainer.classList.add('hidden');
  };

  previewImg.onload = () => {
    previewContainer.classList.remove('hidden');
  };

  previewImg.src = imageUrl;
}

// Valida e incorpora preview de trailer (YouTube/Vimeo)
function previewTrailer() {
  const trailerUrl = document.getElementById('trailerUrl').value;
  const previewContainer = document.getElementById('trailer-preview');
  const previewFrame = previewContainer.querySelector('iframe');

  if (!trailerUrl) {
    alert('Por favor, insira uma URL de vídeo válida.');
    return;
  }

  let embedUrl = '';
  
  // Modificado para usar youtube.com em vez de youtube-nocookie.com
  if (trailerUrl.includes('youtube.com') || trailerUrl.includes('youtu.be')) {
    const videoId = trailerUrl.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})/)?.[1];
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (trailerUrl.includes('vimeo.com')) {
    const videoId = trailerUrl.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
  }

  if (!embedUrl) {
    alert('URL de vídeo inválida. Use URLs do YouTube ou Vimeo.');
    return;
  }

  previewFrame.src = embedUrl;
  previewContainer.classList.remove('hidden');
}

// Sistema de validação e progresso do formulário
function checkSectionProgress(section, updateProgress = true) {
  const requiredFields = {
    basic: {
      'primaryTitle': 'Título Principal',
      'synopsis': 'Sinopse',
      'coverImage': 'Imagem de Capa',
      'titles': 'Pelo menos um título alternativo'
    },
    details: {
      'score': 'Score',
      'popularity': 'Popularidade',
      'genres': 'Pelo menos um gênero'
    },
    production: {
      'studio': 'Estúdio',
      'episodes': 'Número de Episódios',
      'episodeDuration': 'Duração dos Episódios',
      'seasonYear': 'Ano',
      'producers': 'Pelo menos um produtor'
    }
  };

  const missingFields = [];
  const fields = Object.keys(requiredFields[section]);
  
  fields.forEach(field => {
    if (field === 'titles' && currentTitles.length === 0) {
      missingFields.push(requiredFields[section][field]);
    } else if (field === 'genres' && currentGenres.length === 0) {
      missingFields.push(requiredFields[section][field]);
    } else if (field === 'producers' && currentProducers.length === 0) {
      missingFields.push(requiredFields[section][field]);
    } else if (field !== 'titles' && field !== 'genres' && field !== 'producers') {
      const element = document.getElementById(field);
      if (!element || !element.value.trim()) {
        missingFields.push(requiredFields[section][field]);
      }
    }
  });

  const progress = Math.round(((fields.length - missingFields.length) / fields.length) * 100);
  const isComplete = missingFields.length === 0;

  // Só atualiza o status visual se updateProgress for true
  if (updateProgress) {
    updateSectionStatus(section, isComplete, progress, missingFields);
  }

  return { isComplete, progress, missingFields };
}

// Atualiza indicadores visuais de progresso da seção
function updateSectionStatus(section, isComplete, progress, missingFields) {
  const tab = document.querySelector(`[data-section="${section}"]`);
  const status = document.getElementById(`${section}-status`);
  
  if (!tab || !status) return;

  tab.classList.remove('completed', 'incomplete', 'error');
  tab.classList.add(isComplete ? 'completed' : 'incomplete');

  if (missingFields.length > 0) {
    const tooltip = document.createElement('div');
    tooltip.className = 'status-tooltip';
    tooltip.innerHTML = `
      <strong>Campos pendentes:</strong>
      <ul>
        ${missingFields.map(field => `<li>• ${field}</li>`).join('')}
      </ul>
    `;
    
    status.innerHTML = `
      <span class="status-text">${progress}% completo</span>
      <div class="status-icon ${isComplete ? 'complete' : 'incomplete'}"></div>
      ${tooltip.outerHTML}
    `;
  } else {
    status.innerHTML = `
      <span class="status-text">Completo!</span>
      <div class="status-icon complete"></div>
    `;
  }
}

// Calcula e atualiza barra de progresso geral
function updateFormProgress() {
  const sections = ['basic', 'details', 'production'];
  let totalProgress = 0;
  
  sections.forEach(section => {
    const { progress } = checkSectionProgress(section, false); // Adiciona flag para evitar recursão
    totalProgress += progress;
  });

  const averageProgress = totalProgress / sections.length;
  const progressBar = document.getElementById('form-progress');
  if (progressBar) {
    progressBar.style.width = `${averageProgress}%`;
  }
}

// Monitora mudanças nos campos e atualiza progresso
document.querySelector('#edit-form-container').addEventListener('input', (e) => {
  const section = e.target.closest('.tab-content')?.id;
  if (section) {
    checkSectionProgress(section);
  }
});