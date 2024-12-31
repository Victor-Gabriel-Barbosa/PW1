// Arrays para armazenar dados do anime
let titles = [];
let genres = [];
let producers = [];
let licensors = [];

// Funções de gerenciamento de títulos alternativos
function addTitle() {
  const titleInput = document.getElementById('alternative-title');
  const titleTypeSelect = document.getElementById('title-type');

  if (titleInput.value.trim() === '') {
    alert('Por favor, insira um título válido.');
    return;
  }

  titles.push({
    title: escapeHTML(titleInput.value),
    type: escapeHTML(titleTypeSelect.value),
  });

  renderTitles();
  titleInput.value = '';
  saveFormState();
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

// Sanitiza strings para prevenir XSS
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Persiste dados do formulário no localStorage
function saveToLocalStorage(formData) {
  const existingAnimes = JSON.parse(localStorage.getItem('animeData')) || [];
  existingAnimes.push(formData);
  localStorage.setItem('animeData', JSON.stringify(existingAnimes));
  alert('Anime salvo com sucesso!');
  localStorage.removeItem('animeFormState');
}

// Restaura estado do formulário do localStorage
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

// Preview e validação de mídia
function previewImage() {
  const imageUrl = document.getElementById('image-url').value;
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

function previewTrailer() {
  const trailerUrl = document.getElementById('trailer-url').value;
  const previewContainer = document.getElementById('trailer-preview');
  const previewFrame = previewContainer.querySelector('iframe');

  if (!trailerUrl) {
    alert('Por favor, insira uma URL de vídeo válida.');
    return;
  }

  // Extrai o ID do vídeo do YouTube ou Vimeo
  let videoId = '';

  if (trailerUrl.includes('youtube.com') || trailerUrl.includes('youtu.be')) {
    videoId = trailerUrl.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})/)?.[1];
    if (videoId) {
      previewFrame.src = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (trailerUrl.includes('vimeo.com')) {
    videoId = trailerUrl.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) {
      previewFrame.src = `https://player.vimeo.com/video/${videoId}`;
    }
  }

  if (!videoId) {
    alert('URL de vídeo inválida. Use URLs do YouTube ou Vimeo.');
    return;
  }

  previewContainer.classList.remove('hidden');
}

// Monitoramento de progresso do formulário
function checkSectionProgress(section) {
  const requiredFields = {
    basic: {
      'primary-title': 'Título Principal',
      'synopsis': 'Sinopse',
      'image-url': 'Imagem de Capa',
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
      'episode-duration': 'Duração dos Episódios',
      'season-year': 'Ano',
      'producers': 'Pelo menos um produtor'
    }
  };

  const missingFields = [];
  const fields = Object.keys(requiredFields[section]);

  fields.forEach(field => {
    if (field === 'titles' && titles.length === 0) {
      missingFields.push(requiredFields[section][field]);
    } else if (field === 'genres' && genres.length === 0) {
      missingFields.push(requiredFields[section][field]);
    } else if (field === 'producers' && producers.length === 0) {
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

  return { isComplete, progress, missingFields };
}

function updateSectionStatus(section, isComplete, progress, missingFields) {
  const tab = document.querySelector(`[data-section="${section}"]`);
  const status = document.getElementById(`${section}-status`);

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

function updateFormProgress() {
  const sections = ['basic', 'details', 'production'];
  let totalProgress = 0;

  sections.forEach(section => {
    const { progress } = checkSectionProgress(section);
    totalProgress += progress;
  });

  const averageProgress = totalProgress / sections.length;
  const progressBar = document.getElementById('form-progress');
  if (progressBar) {
    progressBar.style.width = `${averageProgress}%`;
  }
}

function validateSection(section) {
  const result = checkSectionProgress(section);
  updateSectionStatus(section, result.isComplete, result.progress, result.missingFields);
  updateFormProgress();
}

// Validação e UI
function highlightRequiredFields(section) {
  const form = document.getElementById('anime-admin-form');
  const currentTab = document.getElementById(section);
  const requiredFields = currentTab.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    const formGroup = field.closest('.form-group');
    if (!field.value.trim()) {
      formGroup.classList.add('error');
      field.addEventListener('input', () => {
        formGroup.classList.remove('error');
        if (field.value.trim()) {
          formGroup.classList.add('success');
        }
      }, { once: true });
    } else {
      formGroup.classList.add('success');
    }
  });
}

// Modifique a função setupTabs existente
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const currentSection = document.querySelector('.tab-content.active').id;
      highlightRequiredFields(currentSection);

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// Inicialização e event listeners
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupSynopsisCounter();
  loadDataFromLocalStorage();

  // Verificação inicial do progresso
  ['basic', 'details', 'production'].forEach(section => {
    validateSection(section);
  });
});

// Contador de caracteres da sinopse
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

// Manipulação do formulário
document.getElementById('anime-admin-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Previne submissão duplicada
  const submitBtn = this.querySelector('#submit-btn');
  if (submitBtn.disabled) return;
  submitBtn.disabled = true;

  try {
    // Validações básicas
    const requiredFields = {
      'primary-title': 'Título Principal',
      'synopsis': 'Sinopse',
      'episodes': 'Número de Episódios',
      'season-year': 'Ano',
      'studio': 'Estúdio',
      'image-url': 'URL da Imagem',
      'episode-duration': 'Duração dos Episódios',
      'score': 'Score',
      'popularity': 'Popularidade'
    };

    const errors = [];

    // Verifica campos obrigatórios
    Object.entries(requiredFields).forEach(([id, label]) => {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        errors.push(`${label} é obrigatório`);
        field.closest('.form-group').classList.add('error');
      }
    });

    // Validações específicas
    const imageUrl = document.getElementById('image-url').value;
    const trailerUrl = document.getElementById('trailer-url').value;
    const episodes = parseInt(document.getElementById('episodes').value);
    const seasonYear = document.getElementById('season-year').value;
    const score = parseFloat(document.getElementById('score').value);

    if (!isValidUrl(imageUrl, 'image')) {
      errors.push('URL da imagem inválida');
    }

    if (trailerUrl && !isValidUrl(trailerUrl, 'video')) {
      errors.push('URL do trailer inválida');
    }

    if (isNaN(episodes) || episodes <= 0) {
      errors.push('Número de episódios deve ser positivo');
    }

    if (seasonYear.length !== 4 || seasonYear < 1900 || seasonYear > new Date().getFullYear() + 1) {
      errors.push('Ano inválido');
    }

    if (score < 0 || score > 10) {
      errors.push('Score deve estar entre 0 e 10');
    }

    // Validações das listas
    if (titles.length === 0) errors.push('Adicione pelo menos um título alternativo');
    if (genres.length === 0) errors.push('Adicione pelo menos um gênero');
    if (producers.length === 0) errors.push('Adicione pelo menos um produtor');

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    // Cria o objeto com os dados do formulário
    const formData = {
      primaryTitle: escapeHTML(document.getElementById('primary-title').value),
      alternativeTitles: titles,
      genres: genres,
      synopsis: escapeHTML(document.getElementById('synopsis').value),
      episodes: episodes,
      releaseYear: parseInt(seasonYear),
      studio: escapeHTML(document.getElementById('studio').value),
      coverImage: imageUrl,
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
      score: score,
      popularity: parseInt(document.getElementById('popularity').value)
    };

    // Salva no localStorage
    saveToLocalStorage(formData);

    // Reseta o formulário após sucesso
    resetForm();

    // Mostra mensagem de sucesso
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Anime cadastrado com sucesso!';
    document.querySelector('.admin-form').insertAdjacentElement('afterbegin', successMessage);

    // Remove a mensagem após 3 segundos
    setTimeout(() => successMessage.remove(), 3000);

  } catch (error) {
    // Mostra erros
    alert(error.message);
  } finally {
    // Reabilita o botão
    submitBtn.disabled = false;
  }
});

// Reset do formulário com confirmação
function resetForm() {
  if (confirm('Tem certeza que deseja limpar todos os campos do formulário? Esta ação não pode ser desfeita.')) {
    document.getElementById('anime-admin-form').reset();
    titles = [];
    genres = [];
    producers = [];
    licensors = [];

    renderTitles();
    renderGenres();
    renderProducers();
    renderLicensors();

    clearPreviews();
    localStorage.removeItem('animeFormState');

    // Reseta os estados visuais
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error', 'success');
    });

    // Atualiza o progresso
    updateFormProgress();
  }
}

// Auto-save do estado do formulário
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

// Validadores de URL para imagens e vídeos
function isValidUrl(url, type = 'image') {
  try {
    const urlObj = new URL(url);
    if (type === 'image') {
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(urlObj.pathname);
    } else if (type === 'video') {
      return /(youtube\.com|youtu\.be|vimeo\.com)/i.test(urlObj.hostname);
    }
    return false;
  } catch {
    return false;
  }
}

// Limpa previews de mídia
function clearPreviews() {
  const imagePreview = document.getElementById('image-preview');
  const trailerPreview = document.getElementById('trailer-preview');

  imagePreview.classList.add('hidden');
  trailerPreview.classList.add('hidden');
  imagePreview.querySelector('img').src = '';
  trailerPreview.querySelector('iframe').src = '';
}

// Validação em tempo real de URLs
document.getElementById('image-url').addEventListener('input', function() {
  const isValid = isValidUrl(this.value, 'image');
  this.closest('.form-group').classList.toggle('error', !isValid && this.value);
});

document.getElementById('trailer-url').addEventListener('input', function() {
  if (this.value) {
    const isValid = isValidUrl(this.value, 'video');
    this.closest('.form-group').classList.toggle('error', !isValid);
  }
});