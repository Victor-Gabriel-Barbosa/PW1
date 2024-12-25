// Arrays globais para armazenar títulos alternativos e gêneros
let titles = [];
let genres = [];
let producers = [];
let licensors = [];

/**
 * Adiciona um título alternativo à lista `titles`.
 * Valida o campo de entrada, impede valores vazios e escapa caracteres perigosos.
 */
function addTitle() {
  const titleInput = document.getElementById('alternative-title'); // Campo de entrada para título alternativo
  const titleTypeSelect = document.getElementById('title-type'); // Campo de seleção do tipo de título

  // Verifica se o campo de título está vazio
  if (titleInput.value.trim() === '') {
    alert('Por favor, insira um título válido.');
    return;
  }

  // Adiciona o título e seu tipo à lista de títulos
  titles.push({
    title: escapeHTML(titleInput.value), // Escapa caracteres perigosos
    type: escapeHTML(titleTypeSelect.value), // Escapa caracteres perigosos
  });

  renderTitles(); // Atualiza a interface com os títulos
  titleInput.value = ''; // Limpa o campo de entrada
  saveFormState(); // Adicionar esta linha
}

/**
 * Atualiza a interface exibindo todos os títulos alternativos.
 */
function renderTitles() {
  const container = document.getElementById('titles-container'); // Container onde os títulos são exibidos
  // Gera o HTML para cada título e exibe na interface
  container.innerHTML = titles
    .map(
      (t, index) => `
        <div class="tag">
            ${t.title} (${t.type}) 
            <span class="tag-remove" onclick="removeTitle(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

/**
 * Remove um título alternativo da lista `titles` pelo índice.
 * Atualiza a interface após a remoção.
 * @param {number} index - Índice do título a ser removido.
 */
function removeTitle(index) {
  titles.splice(index, 1); // Remove o título da lista
  renderTitles(); // Atualiza a interface
  saveFormState(); // Adicionar esta linha
}

/**
 * Adiciona um gênero à lista `genres`.
 * Valida o campo de entrada, impede valores duplicados e escapa caracteres perigosos.
 */
function addGenre() {
  const genreInput = document.getElementById('genre-input'); // Campo de entrada para gênero

  // Verifica se o campo de gênero está vazio
  if (genreInput.value.trim() === '') {
    alert('Por favor, insira um gênero válido.');
    return;
  }

  const genre = escapeHTML(genreInput.value); // Escapa caracteres perigosos
  // Adiciona o gênero apenas se não for duplicado
  if (!genres.includes(genre)) {
    genres.push(genre);
  } else {
    alert('Este gênero já foi adicionado.');
  }

  renderGenres(); // Atualiza a interface com os gêneros
  genreInput.value = ''; // Limpa o campo de entrada
  saveFormState(); // Adicionar esta linha
}

/**
 * Atualiza a interface exibindo todos os gêneros adicionados.
 */
function renderGenres() {
  const container = document.getElementById('genres-container'); // Container onde os gêneros são exibidos
  // Gera o HTML para cada gênero e exibe na interface
  container.innerHTML = genres
    .map(
      (genre, index) => `
        <div class="tag">
            ${genre} 
            <span class="tag-remove" onclick="removeGenre(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

/**
 * Remove um gênero da lista `genres` pelo índice.
 * Atualiza a interface após a remoção.
 * @param {number} index - Índice do gênero a ser removido.
 */
function removeGenre(index) {
  genres.splice(index, 1); // Remove o gênero da lista
  renderGenres(); // Atualiza a interface
  saveFormState(); // Adicionar esta linha
}

/**
 * Adiciona um produtor à lista `producers`.
 * Valida o campo de entrada, impede valores vazios e escapa caracteres perigosos.
 */
function addProducer() {
  const producerInput = document.getElementById('producer-input'); // Campo de entrada para produtor

  // Verifica se o campo de produtor está vazio
  if (producerInput.value.trim() === '') {
    alert('Por favor, insira um produtor válido.');
    return;
  }

  const producer = escapeHTML(producerInput.value); // Escapa caracteres perigosos
  producers.push(producer);

  renderProducers(); // Atualiza a interface com os produtores
  producerInput.value = ''; // Limpa o campo de entrada
  saveFormState(); // Adicionar esta linha
}

/**
 * Atualiza a interface exibindo todos os produtores adicionados.
 */
function renderProducers() {
  const container = document.getElementById('producers-container'); // Container onde os produtores são exibidos
  // Gera o HTML para cada produtor e exibe na interface
  container.innerHTML = producers
    .map(
      (producer, index) => `
        <div class="tag">
            ${producer} 
            <span class="tag-remove" onclick="removeProducer(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

/**
 * Remove um produtor da lista `producers` pelo índice.
 * Atualiza a interface após a remoção.
 * @param {number} index - Índice do produtor a ser removido.
 */
function removeProducer(index) {
  producers.splice(index, 1); // Remove o produtor da lista
  renderProducers(); // Atualiza a interface
  saveFormState(); // Adicionar esta linha
}

/**
 * Adiciona um licenciador à lista `licensors`.
 * Valida o campo de entrada, impede valores vazios e escapa caracteres perigosos.
 */
function addLicensor() {
  const licensorInput = document.getElementById('licensor-input'); // Campo de entrada para licenciador

  // Verifica se o campo de licenciador está vazio
  if (licensorInput.value.trim() === '') {
    alert('Por favor, insira um licenciador válido.');
    return;
  }

  const licensor = escapeHTML(licensorInput.value); // Escapa caracteres perigosos
  licensors.push(licensor);

  renderLicensors(); // Atualiza a interface com os licenciadores
  licensorInput.value = ''; // Limpa o campo de entrada
  saveFormState(); // Adicionar esta linha
}

/**
 * Atualiza a interface exibindo todos os licenciadores adicionados.
 */
function renderLicensors() {
  const container = document.getElementById('licensors-container'); // Container onde os licenciadores são exibidos
  // Gera o HTML para cada licenciador e exibe na interface
  container.innerHTML = licensors
    .map(
      (licensor, index) => `
        <div class="tag">
            ${licensor} 
            <span class="tag-remove" onclick="removeLicensor(${index})">✖</span>
        </div>
    `
    )
    .join('');
}

/**
 * Remove um licenciador da lista `licensors` pelo índice.
 * Atualiza a interface após a remoção.
 * @param {number} index - Índice do licenciador a ser removido.
 */
function removeLicensor(index) {
  licensors.splice(index, 1); // Remove o licenciador da lista
  renderLicensors(); // Atualiza a interface
  saveFormState(); // Adicionar esta linha
}

/**
 * Escapa caracteres HTML perigosos para evitar ataques de XSS.
 * @param {string} str - Texto a ser escapado.
 * @returns {string} - Texto seguro para exibição em HTML.
 */
function escapeHTML(str) {
  const div = document.createElement('div'); // Cria um elemento div temporário
  div.appendChild(document.createTextNode(str)); // Adiciona o texto como nó
  return div.innerHTML; // Retorna o HTML seguro
}

/**
 * Salva os dados do formulário no Local Storage.
 * Adiciona o novo anime ao array de animes existente ou cria um novo array.
 * @param {object} formData - Dados do formulário a serem salvos.
 */
function saveToLocalStorage(formData) {
  const existingAnimes = JSON.parse(localStorage.getItem('animeData')) || [];
  existingAnimes.push(formData);
  localStorage.setItem('animeData', JSON.stringify(existingAnimes));
  alert('Anime salvo com sucesso!');
  localStorage.removeItem('animeFormState');
}

/**
 * Carrega os dados salvos no Local Storage e atualiza os campos do formulário e a interface.
 * Antes de carregar, solicita a confirmação do usuário.
 */
function loadDataFromLocalStorage() {
  const savedState = localStorage.getItem('animeFormState');
  if (!savedState) {
    console.log('Nenhum dado temporário encontrado');
    return;
  }

  try {
    const formState = JSON.parse(savedState);

    // Limpa os arrays globais antes de carregar os dados
    titles = [];
    genres = [];
    producers = [];
    licensors = [];

    // Carrega os dados básicos
    const fields = {
      'primary-title': formState.primaryTitle || '',
      'synopsis': formState.synopsis || '',
      'episodes': formState.episodes || '',
      'season-year': formState.seasonYear || '',
      'studio': formState.studio || '',
      'image-url': formState.coverImage || '',
      'trailer-url': formState.trailerUrl || '',
      'status': formState.status || 'Em andamento',
      'age-rating': formState.ageRating || 'livre',
      'season-period': formState.seasonPeriod || 'Inverno',
      'episode-duration': formState.episodeDuration || '',
      'source': formState.source || 'Original',
      'score': formState.score || '0',
      'popularity': formState.popularity || '0'
    };

    // Preenche cada campo do formulário
    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.value = value;
      }
    });

    // Carrega as listas
    if (Array.isArray(formState.alternativeTitles)) {
      titles = formState.alternativeTitles;
      renderTitles();
    }

    if (Array.isArray(formState.genres)) {
      genres = formState.genres;
      renderGenres();
    }

    if (Array.isArray(formState.producers)) {
      producers = formState.producers;
      renderProducers();
    }

    if (Array.isArray(formState.licensors)) {
      licensors = formState.licensors;
      renderLicensors();
    }

    console.log('Estado do formulário restaurado com sucesso!');
  } catch (error) {
    console.error('Erro ao carregar dados do formulário:', error);
    localStorage.removeItem('animeFormState');
  }
}

/**
 * Manipula o evento de envio do formulário.
 * Valida os dados do formulário, salva-os no Local Storage e reseta o formulário.
 */
document.getElementById('anime-admin-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário

  // Obtém os valores dos campos do formulário
  const primaryTitle = document.getElementById('primary-title').value.trim();
  const synopsis = document.getElementById('synopsis').value.trim();
  const episodes = document.getElementById('episodes').value.trim();
  const seasonYear = document.getElementById('season-year').value.trim(); // Atualizado
  const studio = document.getElementById('studio').value.trim();
  const coverImage = document.getElementById('image-url').value.trim();
  const trailerUrl = document.getElementById('trailer-url').value.trim();

  // Valida os campos obrigatórios
  if (!primaryTitle || !synopsis || !episodes || !seasonYear || !studio || !coverImage) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Valida se o número de episódios é positivo
  if (isNaN(episodes) || episodes <= 0) {
    alert('O número de episódios deve ser um número positivo.');
    return;
  }

  // Valida se o ano tem 4 dígitos
  if (isNaN(seasonYear) || seasonYear.length !== 4) {
    alert('O ano deve ser um número válido de 4 dígitos.');
    return;
  }

  // Cria o objeto com os dados do formulário
  const formData = {
    primaryTitle: escapeHTML(primaryTitle),
    alternativeTitles: titles,
    genres: genres,
    synopsis: escapeHTML(synopsis),
    episodes: parseInt(episodes, 10),
    releaseYear: parseInt(seasonYear, 10), // Atualizado
    studio: escapeHTML(studio),
    coverImage: coverImage,
    trailerUrl: trailerUrl,
    status: document.getElementById('status').value,
    ageRating: document.getElementById('age-rating').value,
    season: {
      period: document.getElementById('season-period').value,
      year: parseInt(seasonYear)
    },
    episodeDuration: parseInt(document.getElementById('episode-duration').value),
    producers: producers,
    licensors: licensors,
    source: document.getElementById('source').value,
    score: parseFloat(document.getElementById('score').value),
    popularity: parseInt(document.getElementById('popularity').value)
  };

  console.log('Dados do Anime:', formData); // Exibe os dados no console

  saveToLocalStorage(formData); // Salva os dados no Local Storage
  resetForm(); // Reseta o formulário
});

/**
 * Reseta o formulário e limpa as listas `titles`, `genres`, `producers` e `licensors`.
 * Solicita confirmação do usuário antes de limpar.
 */
function resetForm() {
  if (confirm('Tem certeza que deseja limpar todos os campos do formulário?')) {
    document.getElementById('anime-admin-form').reset(); // Reseta os campos do formulário
    titles = []; // Limpa a lista de títulos
    genres = []; // Limpa a lista de gêneros
    producers = []; // Limpa a lista de produtores
    licensors = []; // Limpa a lista de licenciadores
    renderTitles(); // Atualiza a interface com os títulos
    renderGenres(); // Atualiza a interface com os gêneros
    renderProducers(); // Atualiza a interface com os produtores
    renderLicensors(); // Atualiza a interface com os licenciadores
    localStorage.removeItem('animeFormState'); // Remove os dados salvos temporariamente
  }
}

// Adicione esta função após as outras funções existentes
function saveFormState() {
  const formState = {
    primaryTitle: document.getElementById('primary-title').value,
    synopsis: document.getElementById('synopsis').value,
    episodes: document.getElementById('episodes').value,
    seasonYear: document.getElementById('season-year').value,
    studio: document.getElementById('studio').value,
    coverImage: document.getElementById('image-url').value,
    trailerUrl: document.getElementById('trailer-url').value,
    status: document.getElementById('status').value,
    ageRating: document.getElementById('age-rating').value,
    seasonPeriod: document.getElementById('season-period').value,
    episodeDuration: document.getElementById('episode-duration').value,
    source: document.getElementById('source').value,
    score: document.getElementById('score').value,
    popularity: document.getElementById('popularity').value,
    alternativeTitles: titles,
    genres: genres,
    producers: producers,
    licensors: licensors
  };
  
  localStorage.setItem('animeFormState', JSON.stringify(formState));
  console.log('Estado do formulário salvo');
}

// Adicione um event listener para salvar o estado do formulário quando houver mudanças
document.getElementById('anime-admin-form').addEventListener('input', saveFormState);