// Carregar animes quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
  loadAnimes();
  setupSearch();
});

// Carregar animes do localStorage
function loadAnimes() {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const container = document.getElementById('anime-list');

  if (animes.length === 0) {
    container.innerHTML = '<p class="text-center col-span-full">Nenhum anime cadastrado.</p>';
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
                  <button onclick="editAnime(${index})" 
                          class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
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

// Configurar busca
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

// Renderizar animes filtrados
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
                  <button onclick="editAnime(${index})" 
                          class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
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

// Variáveis globais para armazenar os dados das listas
let currentTitles = [];
let currentGenres = [];
let currentProducers = [];
let currentLicensors = [];

// Editar anime
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

  // Template do formulário de edição atualizado com as listas
  formContainer.innerHTML = `
    <form class="space-y-4" onsubmit="event.preventDefault(); saveChanges(${index})">
      <!-- Informações Básicas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="primaryTitle">Título Principal*</label>
          <input type="text" id="primaryTitle" name="primaryTitle" required class="form-input w-full">
        </div>

        <!-- Títulos Alternativos -->
        <div class="form-group">
          <label>Títulos Alternativos</label>
          <div class="flex gap-2">
            <input type="text" id="alternative-title" class="form-input flex-grow">
            <select id="title-type" class="form-select w-24">
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
      <div class="form-group">
        <label for="synopsis">Sinopse*</label>
        <textarea id="synopsis" name="synopsis" required class="form-input w-full h-24"></textarea>
      </div>

      <!-- Gêneros -->
      <div class="form-group">
        <label>Gêneros</label>
        <div class="flex gap-2">
          <input type="text" id="edit-genre-input" class="form-input flex-grow">
          <button type="button" class="btn-add px-2" onclick="addEditGenre()">+</button>
        </div>
        <div id="edit-genres-container" class="tag-container mt-2"></div>
      </div>

      <!-- Status e Classificação -->
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" name="status" class="form-select w-full">
            <option value="Em andamento">Em Andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Anunciado">Anunciado</option>
          </select>
        </div>
        <div class="form-group">
          <label for="ageRating">Classificação</label>
          <select id="ageRating" name="ageRating" class="form-select w-full">
            <option value="livre">Livre</option>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="16">16</option>
            <option value="18">18</option>
          </select>
        </div>
      </div>

      <!-- Informações de Produção -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="form-group">
          <label for="studio">Estúdio*</label>
          <input type="text" id="studio" name="studio" required class="form-input w-full">
        </div>
        <div class="form-group">
          <label for="episodes">Episódios*</label>
          <input type="number" id="episodes" name="episodes" min="1" required class="form-input w-full">
        </div>
        <div class="form-group">
          <label for="episodeDuration">Duração (min)*</label>
          <input type="number" id="episodeDuration" name="episodeDuration" required class="form-input w-full">
        </div>
      </div>

      <!-- Temporada e Fonte -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="form-group">
          <label for="seasonPeriod">Temporada</label>
          <select id="seasonPeriod" name="seasonPeriod" class="form-select w-full">
            <option value="Inverno">Inverno</option>
            <option value="Primavera">Primavera</option>
            <option value="Verão">Verão</option>
            <option value="Outono">Outono</option>
          </select>
        </div>
        <div class="form-group">
          <label for="seasonYear">Ano*</label>
          <input type="number" id="seasonYear" name="seasonYear" required class="form-input w-full">
        </div>
        <div class="form-group">
          <label for="source">Fonte</label>
          <select id="source" name="source" class="form-select w-full">
            <option value="Mangá">Mangá</option>
            <option value="Light Novel">Light Novel</option>
            <option value="Original">Original</option>
            <option value="Game">Game</option>
            <option value="Visual Novel">Visual Novel</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      <!-- URLs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="coverImage">URL da Imagem*</label>
          <input type="url" id="coverImage" name="coverImage" required class="form-input w-full">
        </div>
        <div class="form-group">
          <label for="trailerUrl">URL do Trailer</label>
          <input type="url" id="trailerUrl" name="trailerUrl" class="form-input w-full">
        </div>
      </div>

      <!-- Score e Popularidade -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="score">Score (0-10)</label>
          <input type="number" id="score" name="score" min="0" max="10" step="0.1" required class="form-input w-full">
        </div>
        <div class="form-group">
          <label for="popularity">Popularidade</label>
          <input type="number" id="popularity" name="popularity" min="1" required class="form-input w-full">
        </div>
      </div>

      <!-- Produtores -->
      <div class="form-group">
        <label>Produtores</label>
        <div class="flex gap-2">
          <input type="text" id="edit-producer-input" class="form-input flex-grow">
          <button type="button" class="btn-add px-2" onclick="addEditProducer()">+</button>
        </div>
        <div id="edit-producers-container" class="tag-container mt-2"></div>
      </div>

      <!-- Licenciadores -->
      <div class="form-group">
        <label>Licenciadores</label>
        <div class="flex gap-2">
          <input type="text" id="edit-licensor-input" class="form-input flex-grow">
          <button type="button" class="btn-add px-2" onclick="addEditLicensor()">+</button>
        </div>
        <div id="edit-licensors-container" class="tag-container mt-2"></div>
      </div>

      <!-- Botões -->
      <div class="flex gap-4">
        <button type="submit" class="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 flex-1">
          Salvar Alterações
        </button>
        <button type="button" onclick="document.getElementById('edit-modal').classList.add('hidden')" 
                class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex-1">
          Cancelar
        </button>
      </div>
    </form>
  `;

  // Preencher os campos com os dados do anime
  const fields = {
    primaryTitle: anime.primaryTitle,
    synopsis: anime.synopsis,
    episodes: anime.episodes,
    seasonYear: anime.season?.year || anime.releaseYear,
    studio: anime.studio,
    coverImage: anime.coverImage,
    trailerUrl: anime.trailerUrl,
    status: anime.status,
    ageRating: anime.ageRating,
    seasonPeriod: anime.season?.period,
    episodeDuration: anime.episodeDuration,
    source: anime.source,
    score: anime.score,
    popularity: anime.popularity
  };

  // Preencher cada campo do formulário
  Object.entries(fields).forEach(([id, value]) => {
    const element = formContainer.querySelector(`[name="${id}"]`);
    if (element) {
      element.value = value;
    }
  });

  // Renderizar as listas
  renderEditTitles();
  renderEditGenres();
  renderEditProducers();
  renderEditLicensors();

  // Mostrar modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Funções auxiliares para gerenciar as listas no modo de edição
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

function removeEditTitle(index) {
  currentTitles.splice(index, 1);
  renderEditTitles();
}

// Funções similares para gêneros, produtores e licenciadores
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

// Salvar alterações
function saveChanges(index) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const form = document.querySelector('#edit-form-container form');
  const formData = new FormData(form);

  const updatedAnime = {
    ...animes[index], // Mantém os dados existentes que não estão no formulário
    primaryTitle: formData.get('primaryTitle'),
    alternativeTitles: currentTitles,
    genres: currentGenres,
    producers: currentProducers,
    licensors: currentLicensors,
    synopsis: formData.get('synopsis'),
    episodes: parseInt(formData.get('episodes')),
    studio: formData.get('studio'),
    coverImage: formData.get('coverImage'),
    trailerUrl: formData.get('trailerUrl'),
    status: formData.get('status'),
    ageRating: formData.get('ageRating'),
    season: {
      period: formData.get('seasonPeriod'),
      year: parseInt(formData.get('seasonYear'))
    },
    episodeDuration: parseInt(formData.get('episodeDuration')),
    source: formData.get('source'),
    score: parseFloat(formData.get('score')),
    popularity: parseInt(formData.get('popularity'))
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

// Excluir anime
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

// Função auxiliar para escapar HTML
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}