document.addEventListener('DOMContentLoaded', function () {
  if (!checkAdminAccess()) return;

  const modal = document.getElementById('news-modal');
  const form = document.getElementById('news-form');
  const addBtn = document.getElementById('add-news-btn');
  const closeBtn = document.querySelector('.modal-close');
  const cancelBtn = document.getElementById('cancel-btn');
  const newsList = document.querySelector('.admin-news-list');

  let editingId = null;

  // Carregar notícias existentes
  loadNews();

  // Event Listeners
  addBtn.addEventListener('click', () => openModal());
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  form.addEventListener('submit', handleSubmit);

  // Funções
  function loadNews() {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    newsList.innerHTML = news.map(item => createNewsCard(item)).join('');

    // Adicionar event listeners para edição e exclusão
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => editNews(btn.dataset.id));
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteNews(btn.dataset.id));
    });
  }

  function createNewsCard(news) {
    return `
            <div class="admin-news-item">
                <div class="news-preview">
                    <img src="${news.image}" alt="${news.title}">
                </div>
                <div class="news-info">
                    <span class="news-category">${news.category}</span>
                    <h3>${news.title}</h3>
                    <p class="text-sm opacity-75 line-clamp-2">${news.summary}</p>
                    <div class="news-tags">
                        ${news.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="news-actions">
                    <button class="btn-edit" title="Editar notícia" data-id="${news.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <button class="btn-delete" title="Excluir notícia" data-id="${news.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
  }

  function openModal(newsData = null) {
    modal.classList.remove('hidden');
    if (newsData) {
      editingId = newsData.id;
      document.getElementById('title').value = newsData.title;
      document.getElementById('category').value = newsData.category;
      document.getElementById('tags').value = newsData.tags.join(', ');
      document.getElementById('image').value = newsData.image;
      // Atualizar preview da imagem se existir
      if (newsData.image) {
        previewImage.src = newsData.image;
        imagePreview.classList.remove('hidden');
        imageDropZone.querySelector('.upload-area').classList.add('hidden');
      }
      document.getElementById('summary').value = newsData.summary;
      document.getElementById('content').value = newsData.content;
      document.getElementById('modal-title').textContent = 'Editar Notícia';
    } else {
      editingId = null;
      form.reset();
      imagePreview.classList.add('hidden');
      imageDropZone.querySelector('.upload-area').classList.remove('hidden');
      document.getElementById('modal-title').textContent = 'Nova Notícia';
    }
  }

  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
    editingId = null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newsData = {
      id: editingId || Date.now().toString(),
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: document.getElementById('image').value,
      summary: document.getElementById('summary').value,
      content: document.getElementById('content').value,
      date: editingId ? (await getExistingDate(editingId)) : new Date().toISOString()
    };

    saveNews(newsData);
    closeModal();
    loadNews();
  }

  async function getExistingDate(id) {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const existingNews = news.find(item => item.id === id);
    return existingNews ? existingNews.date : new Date().toISOString();
  }

  function saveNews(newsData) {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const index = news.findIndex(item => item.id === newsData.id);

    if (index > -1) {
      news[index] = newsData;
    } else {
      news.unshift(newsData); // Adiciona no início do array
    }

    localStorage.setItem('news', JSON.stringify(news));
    // Disparar evento para atualizar outras páginas
    window.dispatchEvent(new Event('newsUpdated'));
  }

  function editNews(id) {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const newsData = news.find(item => item.id === id);
    if (newsData) {
      openModal(newsData);
    }
  }

  function deleteNews(id) {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      const news = JSON.parse(localStorage.getItem('news') || '[]');
      const filteredNews = news.filter(item => item.id !== id);
      localStorage.setItem('news', JSON.stringify(filteredNews));
      loadNews();
    }
  }

  // Adicionar manipulação de imagem
  const imageDropZone = document.getElementById('image-drop-zone');
  const imageFile = document.getElementById('image-file');
  const imagePreview = document.querySelector('.image-preview');
  const previewImage = document.getElementById('preview-image');
  const removeImageBtn = document.getElementById('remove-image');
  const imageInput = document.getElementById('image'); // Corrigido para usar o ID correto

  // Eventos de arrastar e soltar
  imageDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageDropZone.classList.add('dragover');
  });

  imageDropZone.addEventListener('dragleave', () => {
    imageDropZone.classList.remove('dragover');
  });

  imageDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    imageDropZone.classList.remove('dragover');
    handleImageFile(e.dataTransfer.files[0]);
  });

  imageDropZone.addEventListener('click', () => {
    imageFile.click();
  });

  imageFile.addEventListener('change', (e) => {
    handleImageFile(e.target.files[0]);
  });

  removeImageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o evento chegue ao imageDropZone
    if (imageInput) {
      imageInput.value = '';
      imagePreview.classList.add('hidden');
      imageDropZone.querySelector('.upload-area').classList.remove('hidden');
    }
  });

  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      document.getElementById('image').value = imageData;
      previewImage.src = imageData;
      imagePreview.classList.remove('hidden');
      imageDropZone.querySelector('.upload-area').classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }
});