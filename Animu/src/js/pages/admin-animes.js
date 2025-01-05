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
                <button onclick="editAnime(${index})" 
                        class="text-blue-600 hover:text-blue-800 mr-3">
                    ✏️ Editar
                </button>
                <button onclick="deleteAnime(${index})"
                        class="text-red-600 hover:text-red-800">
                    🗑️ Excluir
                </button>
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
  document.getElementById('animeModal').classList.remove('hidden');
  if (!currentAnimeId) {
    document.getElementById('modalTitle').textContent = 'Adicionar Novo Anime';
    document.getElementById('animeForm').reset();
    alternativeTitles = [];
    genres = [];
    producers = [];
    licensors = [];
    updateAlternativeTitlesList();
    updateGenresList();
    updateProducersList();
    updateLicensorsList();
  }
}

// Fecha formulário
function closeAnimeForm() {
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
            <button type="button" onclick="removeAlternativeTitle(${index})"
                    class="tag-remove">
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

// Gerencia entrada de gêneros
function handleGenreInput(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const input = event.target;
    const genre = input.value.trim();

    if (genre && !genres.includes(genre)) {
      genres.push(genre);
      input.value = '';
      updateGenresList();
    }
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
        <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>${producer}</span>
            <button type="button" onclick="removeProducer(${index})"
                    class="text-red-600 hover:text-red-800">✕</button>
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
        <div class="flex items-center justify-between p-2 rounded">
            <span>${licensor}</span>
            <button type="button" onclick="removeLicensor(${index})"
                    class="text-red-600 hover:text-red-800">✕</button>
        </div>
    `).join('');
}

function removeLicensor(index) {
  licensors.splice(index, 1);
  updateLicensorsList();
}

// Carrega dados do anime para edição
function editAnime(index) {
  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const anime = animes[index];
  currentAnimeId = index;

  // Primeiro mostra o modal para garantir que os elementos existam no DOM
  document.getElementById('animeModal').classList.remove('hidden');
  document.getElementById('modalTitle').textContent = 'Editar Anime';

  // Limpa os arrays globais
  alternativeTitles = [];
  genres = [];

  // Pequeno delay para garantir que o modal está visível
  setTimeout(() => {
    // Carrega informações básicas
    document.getElementById('primaryTitle').value = anime.primaryTitle || '';
    document.getElementById('coverImage').value = anime.coverImage || '';
    document.getElementById('synopsis').value = anime.synopsis || '';
    document.getElementById('episodes').value = anime.episodes || '';
    document.getElementById('episodeDuration').value = anime.episodeDuration || '';

    // Ajuste para Status - garante correspondência exata
    const statusSelect = document.getElementById('status');
    const statusValue = anime.status || 'Em Exibição';
    // Procura a opção que corresponde ao valor salvo
    for (let option of statusSelect.options) {
      if (option.value === statusValue) {
        statusSelect.value = statusValue;
        break;
      }
    }

    // Ajuste para Classificação Etária - garante correspondência exata
    const ageRatingSelect = document.getElementById('ageRating');
    const ageRatingValue = anime.ageRating || 'Livre';
    // Procura a opção que corresponde ao valor salvo
    for (let option of ageRatingSelect.options) {
      if (option.value === ageRatingValue) {
        ageRatingSelect.value = ageRatingValue;
        break;
      }
    }

    // Ajuste para Temporada - garante correspondência exata
    const seasonPeriodSelect = document.getElementById('seasonPeriod');
    const seasonPeriodValue = anime.season?.period || 'winter';
    // Procura a opção que corresponde ao valor salvo
    for (let option of seasonPeriodSelect.options) {
      if (option.value === seasonPeriodValue) {
        seasonPeriodSelect.value = seasonPeriodValue;
        break;
      }
    }

    // Carrega ano da temporada
    document.getElementById('seasonYear').value = anime.season?.year || '';

    // Carrega URL do trailer
    document.getElementById('trailerUrl').value = anime.trailerUrl || '';

    // Carrega títulos alternativos
    if (Array.isArray(anime.alternativeTitles)) {
      alternativeTitles = [...anime.alternativeTitles];
      updateAlternativeTitlesList();
    }

    // Carrega gêneros
    if (Array.isArray(anime.genres)) {
      genres = [...anime.genres];
      updateGenresList();
    }

    // Carregar dados adicionais
    document.getElementById('studio').value = anime.studio || '';
    document.getElementById('source').value = anime.source || '';

    // Carregar produtores
    producers = Array.isArray(anime.producers) ? [...anime.producers] : [];
    updateProducersList();

    // Carregar licenciadores
    licensors = Array.isArray(anime.licensors) ? [...anime.licensors] : [];
    updateLicensorsList();

    // Força atualização das listas visuais
    updateAlternativeTitlesList();
    updateGenresList();
  }, 100);
}

// Salva anime (novo ou editado)
document.getElementById('animeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const animes = JSON.parse(localStorage.getItem('animeData')) || [];
  const now = new Date().toISOString();

  // Dados do formulário com todos os campos necessários
  const formData = {
    // Campos básicos
    primaryTitle: document.getElementById('primaryTitle').value.trim(),
    coverImage: document.getElementById('coverImage').value.trim(),
    synopsis: document.getElementById('synopsis').value.trim(),
    alternativeTitles: alternativeTitles,

    // Informações de episódios
    episodes: parseInt(document.getElementById('episodes').value) || 0,
    episodeDuration: parseInt(document.getElementById('episodeDuration').value) || 0,

    // Status e classificação
    status: document.getElementById('status').value,
    ageRating: document.getElementById('ageRating').value,

    // Informações de temporada
    season: {
      period: document.getElementById('seasonPeriod').value,
      year: parseInt(document.getElementById('seasonYear').value) || new Date().getFullYear()
    },

    // Metadados
    releaseYear: parseInt(document.getElementById('seasonYear').value) || new Date().getFullYear(),
    genres: genres,
    studio: document.getElementById('studio').value.trim(),
    source: document.getElementById('source').value,
    producers: producers,
    licensors: licensors,
    trailerUrl: document.getElementById('trailerUrl').value.trim(),

    // Dados de engajamento
    score: 0,
    popularity: 0,
    comments: [],

    // Campos de controle
    updatedAt: now
  };

  if (currentAnimeId !== null) {
    // Editando anime existente
    const existingAnime = animes[currentAnimeId];
    animes[currentAnimeId] = {
      ...existingAnime,           // Mantém dados existentes
      ...formData,                // Atualiza com novos dados
      score: existingAnime.score || 0,
      popularity: existingAnime.popularity || 0,
      comments: existingAnime.comments || [],
      createdAt: existingAnime.createdAt, // Mantém data de criação original
      updatedAt: now
    };
  } else {
    // Adicionando novo anime
    const newAnime = {
      ...formData,
      createdAt: now,
      comments: [],
      score: 0,
      popularity: 0
    };
    animes.push(newAnime);
  }

  localStorage.setItem('animeData', JSON.stringify(animes));
  closeAnimeForm();
  loadAnimesList();
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
