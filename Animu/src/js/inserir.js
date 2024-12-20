// Arrays globais para armazenar títulos alternativos e gêneros
let titles = [];
let genres = [];

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
  // Recupera os animes existentes no Local Storage (se houver)
  const existingAnimes = JSON.parse(localStorage.getItem('animeData')) || [];

  // Adiciona o novo anime à lista
  existingAnimes.push(formData);

  // Salva a lista atualizada no Local Storage
  localStorage.setItem('animeData', JSON.stringify(existingAnimes));

  alert('Anime salvo no Local Storage!');
}

/**
 * Carrega os dados salvos no Local Storage e atualiza os campos do formulário e a interface.
 * Antes de carregar, solicita a confirmação do usuário.
 */
function loadDataFromLocalStorage() { 
  const savedData = localStorage.getItem('animeData'); // Obtém os dados salvos no Local Storage
  if (!savedData) return; // Sai se não houver dados salvos

  // Solicita confirmação ao usuário
  const userConfirmed = confirm('Deseja carregar os dados salvos do formulário?');
  if (!userConfirmed) return; // Sai se o usuário cancelar

  const formData = JSON.parse(savedData); // Converte os dados de volta para um objeto

  // Preenche os campos do formulário com os dados salvos
  document.getElementById('primary-title').value = formData.primaryTitle || '';
  document.getElementById('synopsis').value = formData.synopsis || '';
  document.getElementById('episodes').value = formData.episodes || '';
  document.getElementById('release-year').value = formData.releaseYear || '';
  document.getElementById('studio').value = formData.studio || '';
  document.getElementById('image-url').value = formData.coverImage || '';
  document.getElementById('trailer-url').value = formData.trailerUrl || '';

  titles = formData.alternativeTitles || []; // Atualiza a lista de títulos
  genres = formData.genres || []; // Atualiza a lista de gêneros

  renderTitles(); // Atualiza a interface com os títulos
  renderGenres(); // Atualiza a interface com os gêneros

  // alert('Dados carregados do Local Storage!');
}

/**
 * Carrega os dados do Local Storage quando a página é carregada.
 * Pede confirmação ao usuário.
 */
window.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);

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
  const releaseYear = document.getElementById('release-year').value.trim();
  const studio = document.getElementById('studio').value.trim();
  const coverImage = document.getElementById('image-url').value.trim();
  const trailerUrl = document.getElementById('trailer-url').value.trim();

  // Valida os campos obrigatórios
  if (!primaryTitle || !synopsis || !episodes || !releaseYear || !studio || !coverImage) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Valida se o número de episódios é positivo
  if (isNaN(episodes) || episodes <= 0) {
    alert('O número de episódios deve ser um número positivo.');
    return;
  }

  // Valida se o ano de lançamento tem 4 dígitos
  if (isNaN(releaseYear) || releaseYear.length !== 4) {
    alert('O ano de lançamento deve ser um número válido de 4 dígitos.');
    return;
  }

  // Cria o objeto com os dados do formulário
  const formData = {
    primaryTitle: escapeHTML(primaryTitle),
    alternativeTitles: titles,
    genres: genres,
    synopsis: escapeHTML(synopsis),
    episodes: parseInt(episodes, 10),
    releaseYear: parseInt(releaseYear, 10),
    studio: escapeHTML(studio),
    coverImage: coverImage,
    trailerUrl: trailerUrl,
  };

  console.log('Dados do Anime:', formData); // Exibe os dados no console

  saveToLocalStorage(formData); // Salva os dados no Local Storage
  resetForm(); // Reseta o formulário
});

/**
 * Carrega os dados do Local Storage quando a página é carregada.
 */
window.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);

/**
 * Reseta o formulário e limpa as listas `titles` e `genres`.
 * Atualiza a interface após a limpeza.
 */
function resetForm() {
  document.getElementById('anime-admin-form').reset(); // Reseta os campos do formulário
  titles = []; // Limpa a lista de títulos
  genres = []; // Limpa a lista de gêneros
  renderTitles(); // Atualiza a interface com os títulos
  renderGenres(); // Atualiza a interface com os gêneros
}