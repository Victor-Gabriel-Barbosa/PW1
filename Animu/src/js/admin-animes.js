let currentAnimeId = null;
let alternativeTitles = [];
let genres = [];
let producers = [];
let licensors = [];

// Verifica se o usuário é admin ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('userSession'));
  if (!session?.isAdmin) {
    window.location.href = 'index.html';
    return;
  }
  loadAnimesList();
  setupDropZone('coverImageDropzone', 'coverImageInput', 'coverImage', 'coverImagePreview', handleImageDrop);
  setupDropZone('trailerDropzone', 'trailerInput', 'trailerUrl', 'trailerPreview', handleVideoDrop);
  setupMediaRemoval(); // Adicione esta linha
});

// Carrega lista de animes
function loadAnimesList() {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const tbody = document.getElementById('animesList');

  tbody.innerHTML = animes.map((anime, index) => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${anime.coverImage}" alt="${anime.primaryTitle}" 
                     class="h-20 w-14 object-cover rounded">
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium">${anime.primaryTitle}</div>
                <div class="text-sm text-gray-500">${anime.alternativeTitles[0]?.title || ''}</div>
            </td>
            <td class="px-6 py-4 text-sm">
                ${anime.episodes || 'N/A'}
            </td>
            <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 rounded-full ${getStatusClass(anime.status)}">
                    ${anime.status || 'N/A'}
                </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="action-buttons">
                <button class="btn-action btn-edit" title="Editar" onclick="editAnime(${index})">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="btn-action btn-delete" title="Remover" onclick="deleteAnime(${index})">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </td>
        </tr>
    `).join('');
}

// Retorna classe CSS baseada no status do anime
function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case 'em exibição':
      return 'bg-green-100 text-green-800';
    case 'finalizado':
      return 'bg-blue-100 text-blue-800';
    case 'anunciado':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Mostra formulário para adicionar/editar anime
function showAnimeForm() {
  const modalContent = document.querySelector('.admin-form-container');
  document.getElementById('animeModal').classList.remove('hidden');
  
  // Reseta a posição de rolagem do formulário
  if (modalContent) {
    modalContent.scrollTop = 0;
  }

  if (!currentAnimeId) {
    document.getElementById('modalTitle').textContent = 'Adicionar Novo Anime';
    document.getElementById('animeForm').reset();
    
    // Limpar arrays
    alternativeTitles = [];
    genres = [];
    producers = [];
    licensors = [];
    
    // Limpar previews e valores dos campos de imagem e trailer
    const coverPreview = document.getElementById('coverImagePreview');
    const coverPrompt = coverPreview.previousElementSibling;
    const removeCoverBtn = document.getElementById('removeCoverImage');
    
    coverPreview.src = '';
    coverPreview.classList.add('hidden');
    coverPrompt.classList.remove('hidden');
    removeCoverBtn.classList.add('hidden'); // Garante que o botão de remover está oculto
    document.getElementById('coverImage').value = '';
    
    const trailerPreview = document.getElementById('trailerPreview');
    const trailerPrompt = trailerPreview.previousElementSibling;
    const removeTrailerBtn = document.getElementById('removeTrailer');
    
    trailerPreview.innerHTML = '';
    trailerPreview.classList.add('hidden');
    trailerPrompt.classList.remove('hidden');
    removeTrailerBtn.classList.add('hidden'); // Garante que o botão de remover está oculto
    document.getElementById('trailerUrl').value = '';
    
    // Atualizar todas as listas
    updateAlternativeTitlesList();
    updateGenresList();
    updateProducersList();
    updateLicensorsList();
  }
}

// Fecha formulário
function closeAnimeForm() {
  const modalContent = document.querySelector('.admin-form-container');
  
  // Reseta a posição de rolagem antes de fechar
  if (modalContent) {
    modalContent.scrollTop = 0;
  }
  
  document.getElementById('animeModal').classList.add('hidden');
  currentAnimeId = null;
}

// Adiciona título alternativo à lista
function addAlternativeTitle() {
  const titleInput = document.getElementById('altTitle');
  const typeSelect = document.getElementById('altTitleType');

  if (titleInput.value.trim()) {
    alternativeTitles.push({
      title: titleInput.value.trim(),
      type: typeSelect.value
    });
    titleInput.value = '';
    updateAlternativeTitlesList();
  }
}

// Atualiza lista visual de títulos alternativos
function updateAlternativeTitlesList() {
  const container = document.getElementById('altTitlesList');
  container.innerHTML = alternativeTitles.map((title, index) => `
    <div class="tag">
      <span>${title.title} (${title.type})</span>
      <button type="button" onclick="removeAlternativeTitle(${index})" class="tag-remove">
        ✕
      </button>
    </div>
  `).join('');
}

// Remove título alternativo
function removeAlternativeTitle(index) {
  alternativeTitles.splice(index, 1);
  updateAlternativeTitlesList();
}

// Adiciona gênero à lista
function addGenre() {
  const input = document.getElementById('genreInput');
  const genre = input.value.trim();

  if (genre && !genres.includes(genre)) {
    genres.push(genre);
    input.value = '';
    updateGenresList();
  }
}

// Atualiza lista visual de gêneros
function updateGenresList() {
  const container = document.getElementById('genresList');
  container.innerHTML = genres.map((genre, index) => `
    <div class="tag">
      <span>
        ${genre}
        <button type="button" onclick="removeGenre(${index})" class="tag-remove">
          ✕
        </button>
      </span>
    </div>
  `).join('');
}

// Remove gênero
function removeGenre(index) {
  genres.splice(index, 1);
  updateGenresList();
}

// Funções para produtores
function addProducer() {
  const input = document.getElementById('producerInput');
  const producer = input.value.trim();

  if (producer && !producers.includes(producer)) {
    producers.push(producer);
    input.value = '';
    updateProducersList();
  }
}

function updateProducersList() {
  const container = document.getElementById('producersList');
  container.innerHTML = producers.map((producer, index) => `
    <div class="tag">
      <span>
        ${producer}
        <button type="button" onclick="removeProducer(${index})" class="tag-remove">
          ✕
        </button>
      </span>
    </div>
  `).join('');
}

function removeProducer(index) {
  producers.splice(index, 1);
  updateProducersList();
}

// Funções para licenciadores
function addLicensor() {
  const input = document.getElementById('licensorInput');
  const licensor = input.value.trim();

  if (licensor && !licensors.includes(licensor)) {
    licensors.push(licensor);
    input.value = '';
    updateLicensorsList();
  }
}

function updateLicensorsList() {
  const container = document.getElementById('licensorsList');
  container.innerHTML = licensors.map((licensor, index) => `
    <div class="tag">
      <span>${licensor}
        <button type="button" onclick="removeLicensor(${index})" class="tag-remove">
          ✕
        </button>
      </span>
    </div>
  `).join('');
}

function removeLicensor(index) {
  licensors.splice(index, 1);
  updateLicensorsList();
}

// Carrega dados do anime para edição
function editAnime(index) {
  try {
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    const anime = animes[index];
    if (!anime) throw new Error('Anime não encontrado');

    currentAnimeId = index;
    showAnimeForm();

    // Configura temporizador para garantir que o modal esteja visível
    setTimeout(() => {
      // Preenche campos básicos
      document.getElementById('primaryTitle').value = anime.primaryTitle || '';
      document.getElementById('coverImage').value = anime.coverImage || '';
      document.getElementById('synopsis').value = anime.synopsis || '';
      document.getElementById('episodes').value = anime.episodes || '';
      document.getElementById('episodeDuration').value = anime.episodeDuration || '';
      document.getElementById('status').value = anime.status || 'Em Exibição';
      document.getElementById('ageRating').value = anime.ageRating || 'Livre';
      document.getElementById('seasonPeriod').value = anime.season?.period || 'Inverno';
      document.getElementById('seasonYear').value = anime.season?.year || new Date().getFullYear();
      document.getElementById('studio').value = anime.studio || '';
      document.getElementById('source').value = anime.source || '';
      document.getElementById('trailerUrl').value = anime.trailerUrl || '';

      // Reseta e preenche arrays
      alternativeTitles = Array.isArray(anime.alternativeTitles) ? [...anime.alternativeTitles] : [];
      genres = Array.isArray(anime.genres) ? [...anime.genres] : [];
      producers = Array.isArray(anime.producers) ? [...anime.producers] : [];
      licensors = Array.isArray(anime.licensors) ? [...anime.licensors] : [];

      // Atualiza todas as listas visuais
      updateAlternativeTitlesList();
      updateGenresList();
      updateProducersList();
      updateLicensorsList();

      // Atualiza previews de mídia
      updateMediaPreviews(anime);

    }, 100);

  } catch (error) {
    console.error('Erro ao editar anime:', error);
    alert('Erro ao carregar dados do anime para edição.');
  }
}

// Salva anime (novo ou editado)
document.getElementById('animeForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    // Validações básicas
    const primaryTitle = document.getElementById('primaryTitle').value.trim();
    const coverImage = document.getElementById('coverImage').value.trim();
    const synopsis = document.getElementById('synopsis').value.trim();
    const episodes = document.getElementById('episodes').value.trim();
    const episodeDuration = document.getElementById('episodeDuration').value.trim();
    const studio = document.getElementById('studio').value.trim();
    const source = document.getElementById('source').value;

    // Validação de campos obrigatórios
    if (!primaryTitle || !synopsis || !episodes || !episodeDuration || !studio || !source) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de gêneros
    if (genres.length === 0) {
      alert('Por favor, adicione pelo menos um gênero.');
      return;
    }

    // Validação de imagem de capa
    if (!coverImage) {
      alert('Por favor, adicione uma imagem de capa.');
      return;
    }

    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    const now = new Date().toISOString();

    // Comprimir imagem se existir
    let processedCoverImage = coverImage;
    if (coverImage.startsWith('data:image')) {
      processedCoverImage = await compressImage(coverImage, 800, 0.7);
    }

    // Formata os dados
    const formData = {
      primaryTitle,
      coverImage: processedCoverImage,
      synopsis,
      alternativeTitles: [...alternativeTitles],
      episodes: Math.max(0, parseInt(document.getElementById('episodes').value) || 0),
      episodeDuration: Math.max(0, parseInt(document.getElementById('episodeDuration').value) || 0),
      status: document.getElementById('status').value,
      ageRating: document.getElementById('ageRating').value,
      season: {
        period: document.getElementById('seasonPeriod').value,
        year: Math.max(1960, parseInt(document.getElementById('seasonYear').value) || new Date().getFullYear())
      },
      releaseYear: Math.max(1960, parseInt(document.getElementById('seasonYear').value) || new Date().getFullYear()),
      genres: [...genres],
      studio: document.getElementById('studio').value.trim(),
      source: document.getElementById('source').value,
      producers: [...producers],
      licensors: [...licensors],
      trailerUrl: document.getElementById('trailerUrl').value.trim(),
      updatedAt: now
    };

    let updatedAnimes = [];
    if (currentAnimeId !== null) {
      const existingAnime = animes[currentAnimeId];
      if (!existingAnime) throw new Error('Anime não encontrado');

      updatedAnimes = [...animes];
      updatedAnimes[currentAnimeId] = {
        ...existingAnime,
        ...formData,
        score: existingAnime.score || 0,
        popularity: existingAnime.popularity || 0,
        comments: existingAnime.comments || [],
        createdAt: existingAnime.createdAt
      };
    } else {
      updatedAnimes = [...animes, {
        ...formData,
        createdAt: now,
        comments: [],
        score: 0,
        popularity: 0
      }];
    }

    // Verifica espaço disponível
    if (!checkStorageQuota(updatedAnimes)) {
      throw new Error('Limite de armazenamento excedido. Tente remover alguns animes antigos.');
    }

    localStorage.setItem('animeData', JSON.stringify(updatedAnimes));
    closeAnimeForm();
    loadAnimesList();
    alert('Anime salvo com sucesso!');

  } catch (error) {
    console.error('Erro ao salvar anime:', error);
    alert(`Erro ao salvar o anime: ${error.message}`);
  }
});

// Exclui anime e seus comentários
function deleteAnime(index) {
  if (confirm('Tem certeza que deseja excluir este anime? Todos os comentários associados também serão excluídos.')) {
    const animes = JSON.parse(localStorage.getItem('animeData')) || [];
    const animeToDelete = animes[index];

    // Remove o anime do array de animes
    animes.splice(index, 1);
    localStorage.setItem('animeData', JSON.stringify(animes));

    // Remove os comentários associados ao anime
    const comments = JSON.parse(localStorage.getItem('animeComments')) || {};
    if (comments[animeToDelete.primaryTitle]) {
      delete comments[animeToDelete.primaryTitle];
      localStorage.setItem('animeComments', JSON.stringify(comments));
    }

    // Atualiza a lista de animes na interface
    loadAnimesList();
  }
}

// Exporta dados dos animes
function exportAnimes() {
  const animes = localStorage.getItem('animeData');
  const blob = new Blob([animes], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'animes_backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Importa dados dos animes
function importAnimes(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const animes = JSON.parse(e.target.result);
        if (Array.isArray(animes)) {
          localStorage.setItem('animeData', JSON.stringify(animes));
          loadAnimesList();
          alert('Dados importados com sucesso!');
        } else {
          throw new Error('Formato inválido');
        }
      } catch (error) {
        alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
      }
    };
    reader.readAsText(file);
  }
}

function setupDropZone(dropzoneId, inputId, urlInputId, previewId, dropHandler) {
  const dropZone = document.getElementById(dropzoneId);
  const fileInput = document.getElementById(inputId);
  const urlInput = document.getElementById(urlInputId);

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove('drag-over');
    });
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
  });

  // Adicione suporte para drag and drop de texto (URLs)
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');

    const dt = e.dataTransfer;
    const file = dt.files[0];

    // Verifica se é um arquivo ou texto (URL)
    if (file) {
      dropHandler(file, urlInput, document.getElementById(previewId));
    } else {
      // Tenta pegar o texto arrastado (URL)
      const text = dt.getData('text');
      if (text) {
        dropHandler(text, urlInput, document.getElementById(previewId));
      }
    }
  });

  // Adicione suporte para colar URLs
  dropZone.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (text) {
      dropHandler(text, urlInput, document.getElementById(previewId));
    }
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      dropHandler(file, urlInput, document.getElementById(previewId));
    }
  });
}

async function handleImageDrop(file, urlInput, previewElement) {
  if (!file.type?.startsWith('image/')) {
    alert('Por favor, selecione apenas arquivos de imagem.');
    return;
  }

  try {
    const reader = new FileReader();
    reader.onloadend = async () => {
      // Comprimir imagem antes de salvar
      const compressedImage = await compressImage(reader.result);
      
      previewElement.src = compressedImage;
      previewElement.classList.remove('hidden');
      previewElement.previousElementSibling.classList.add('hidden');
      document.getElementById('removeCoverImage').classList.remove('hidden');
      urlInput.value = compressedImage;
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    alert('Erro ao processar a imagem. Tente novamente.');
  }
}

function handleVideoDrop(file, urlInput, previewElement) {
  // Se for um arquivo de vídeo
  if (file instanceof File && file.type.startsWith('video/')) {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewElement.innerHTML = `
          <video controls class="max-h-48 mx-auto">
            <source src="${reader.result}" type="${file.type}">
            Seu navegador não suporta a tag de vídeo.
          </video>
        `;
        previewElement.classList.remove('hidden');
        previewElement.previousElementSibling.classList.add('hidden');
        document.getElementById('removeTrailer').classList.remove('hidden'); // Mostra botão de remover
        urlInput.value = reader.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar vídeo:', error);
      alert('Erro ao processar o vídeo. Tente novamente.');
    }
    return;
  }

  // Se for uma URL do YouTube (do drag and drop)
  let url = '';
  if (file instanceof File) {
    // Tenta ler o conteúdo do arquivo como texto (caso seja um arquivo de texto com a URL)
    const reader = new FileReader();
    reader.onload = (e) => {
      url = e.target.result.trim();
      handleYoutubeUrl(url, urlInput, previewElement);
    };
    reader.readAsText(file);
  } else {
    // Se for uma URL arrastada diretamente
    url = file.toString().trim();
    handleYoutubeUrl(url, urlInput, previewElement);
  }
}

function handleYoutubeUrl(url, urlInput, previewElement) {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    previewElement.innerHTML = `
      <iframe width="280" height="157" 
              src="https://www.youtube.com/embed/${videoId}" 
              frameborder="0" allowfullscreen>
      </iframe>
    `;
    previewElement.classList.remove('hidden');
    previewElement.previousElementSibling.classList.add('hidden');
    document.getElementById('removeTrailer').classList.remove('hidden'); // Mostra botão de remover
    urlInput.value = url;
  } else {
    alert('URL do YouTube inválida. Por favor, verifique a URL e tente novamente.');
  }
}

// Melhore a função extractYouTubeId para suportar mais formatos de URL
function extractYouTubeId(url) {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^/?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^/?]+)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Adicione essas funções após setupDropZone
function setupMediaRemoval() {
  // Setup para remover imagem de capa
  const removeCoverBtn = document.getElementById('removeCoverImage');
  removeCoverBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const coverPreview = document.getElementById('coverImagePreview');
    const coverPrompt = document.getElementById('coverImageDropzone').querySelector('.drop-zone-prompt');
    
    coverPreview.src = '';
    coverPreview.classList.add('hidden');
    removeCoverBtn.classList.add('hidden');
    coverPrompt.classList.remove('hidden');
    document.getElementById('coverImage').value = '';
    document.getElementById('coverImageInput').value = '';
  });

  // Setup para remover trailer
  const removeTrailerBtn = document.getElementById('removeTrailer');
  removeTrailerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const trailerPreview = document.getElementById('trailerPreview');
    const trailerPrompt = document.getElementById('trailerDropzone').querySelector('.drop-zone-prompt');
    
    trailerPreview.innerHTML = '';
    trailerPreview.classList.add('hidden');
    removeTrailerBtn.classList.add('hidden');
    trailerPrompt.classList.remove('hidden');
    document.getElementById('trailerUrl').value = '';
    document.getElementById('trailerInput').value = '';
  });
}

function updateMediaPreviews(anime) {
  // Preview da imagem de capa
  const coverPreview = document.getElementById('coverImagePreview');
  const coverPrompt = coverPreview.previousElementSibling;
  const removeCoverBtn = document.getElementById('removeCoverImage');
  
  if (anime.coverImage && anime.coverImage.trim()) {
    coverPreview.src = anime.coverImage;
    coverPreview.classList.remove('hidden');
    coverPrompt.classList.add('hidden');
    removeCoverBtn.classList.remove('hidden');
  } else {
    coverPreview.src = '';
    coverPreview.classList.add('hidden');
    coverPrompt.classList.remove('hidden');
    removeCoverBtn.classList.add('hidden');
  }

  // Preview do trailer
  const trailerPreview = document.getElementById('trailerPreview');
  const trailerPrompt = trailerPreview.previousElementSibling;
  const removeTrailerBtn = document.getElementById('removeTrailer');
  
  if (anime.trailerUrl && anime.trailerUrl.trim()) {
    let trailerContent = '';
    if (anime.trailerUrl.includes('data:video')) {
      trailerContent = `<video controls class="max-h-48 mx-auto"><source src="${anime.trailerUrl}"></video>`;
    } else {
      const videoId = extractYouTubeId(anime.trailerUrl);
      if (videoId) {
        trailerContent = `<iframe width="280" height="157" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      }
    }
    
    if (trailerContent) {
      trailerPreview.innerHTML = trailerContent;
      trailerPreview.classList.remove('hidden');
      trailerPrompt.classList.add('hidden');
      removeTrailerBtn.classList.remove('hidden');
    } else {
      trailerPreview.innerHTML = '';
      trailerPreview.classList.add('hidden');
      trailerPrompt.classList.remove('hidden');
      removeTrailerBtn.classList.add('hidden');
    }
  } else {
    trailerPreview.innerHTML = '';
    trailerPreview.classList.add('hidden');
    trailerPrompt.classList.remove('hidden');
    removeTrailerBtn.classList.add('hidden');
  }
}

// Comprime imagem antes de salvar
async function compressImage(imageDataUrl, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.floor(height * (maxWidth / width));
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = imageDataUrl;
  });
}

// Verifica e gerencia espaço no localStorage
function checkStorageQuota(data) {
  const totalSpace = 5 * 1024 * 1024; // 5MB (aproximado para localStorage)
  const currentData = JSON.stringify(data);
  const requiredSpace = currentData.length * 2; // Em bytes

  if (requiredSpace > totalSpace) {
    throw new Error('Tamanho dos dados excede o limite permitido');
  }

  try {
    // Teste de escrita
    localStorage.setItem('quotaTest', currentData);
    localStorage.removeItem('quotaTest');
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      return false;
    }
    throw e;
  }
}
