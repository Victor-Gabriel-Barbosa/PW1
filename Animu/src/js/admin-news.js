/**
 * Gerenciador de notícias para área administrativa
 * Permite criar, editar, excluir e visualizar notícias
 */
document.addEventListener('DOMContentLoaded', function () {
  if (!checkAdminAccess()) return;

  // Elementos do DOM
  const modal = document.getElementById('news-modal');
  const form = document.getElementById('news-form');
  const addBtn = document.getElementById('add-news-btn');
  const closeBtn = document.querySelector('.modal-close');
  const cancelBtn = document.getElementById('cancel-btn');

  let editingId = null;

  // Inicialização
  loadNews();

  // Inicialização do TinyMCE
  tinymce.init({
    selector: '#content',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: 'body { font-family: Inter, sans-serif; font-size: 14px }',
    height: 400,
    language: 'pt_BR',
    menubar: false,
    branding: false,
    promotion: false,
    // Configuração para tema escuro
    skin: (document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide'),
    content_css: (document.documentElement.classList.contains('dark') ? 'dark' : 'default'),
  }).then(() => {
    // Chama setupFormProgress somente após o TinyMCE estar pronto
    setupFormProgress();
  });

  // Adiciona após a inicialização do TinyMCE
  let updateFormProgress; // Define a variável em um escopo acessível

  function setupFormProgress() {
    const form = document.getElementById('news-form');
    const progressBar = document.getElementById('formProgress');
    const requiredFields = ['title', 'category', 'summary', 'image'];
    const totalFields = requiredFields.length + 1; // +1 para o campo de conteúdo
    
    updateFormProgress = function() {
      let filledFields = 0;
      
      // Verifica campos obrigatórios
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim()) {
          filledFields++;
          console.log(`Campo ${fieldId} preenchido: ${field.value.trim()}`);
        }
      });

      // Verifica o conteúdo do editor TinyMCE
      const editor = tinymce.get('content');
      if (editor && editor.getContent().trim()) {
        filledFields++;
        console.log('Editor preenchido');
      }

      // Calcula a porcentagem
      const progress = Math.round((filledFields / totalFields) * 100);
      console.log(`Progresso: ${progress}% (${filledFields}/${totalFields} campos)`);
      
      // Atualiza a barra de progresso
      progressBar.style.width = `${progress}%`;
      
      // Atualiza a cor baseado no progresso
      if (progress < 33) {
        progressBar.style.background = 'var(--error-color, #EF4444)';
      } else if (progress < 66) {
        progressBar.style.background = 'var(--warning-color, #F59E0B)';
      } else {
        progressBar.style.background = 'var(--success-color, #10B981)';
      }
    }

    // Monitora mudanças em campos de texto e select
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', updateFormProgress);
      field.addEventListener('change', updateFormProgress);
    });

    // Monitora mudanças no TinyMCE
    const editor = tinymce.get('content');
    if (editor) {
      editor.on('input', updateFormProgress);
      editor.on('change', updateFormProgress);
    }

    // Atualização inicial
    updateFormProgress();
  }

  // Após a inicialização do TinyMCE
  const generateBtn = document.getElementById('generate-news-btn');
  generateBtn.addEventListener('click', generateNewsContent);

  async function generateNewsContent() {
    const title = document.getElementById('title').value;
    if (!title) {
      alert('Digite um título ou tópico para gerar a notícia');
      return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Gerando...';

    try {
      // Simulação de resposta
      const templates = {
        anuncio: {
          title: `${title} anuncia nova temporada para 2024`,
          summary: `Fãs comemoram o anúncio oficial da nova temporada de ${title}, que promete trazer grandes revelações e animações ainda mais impressionantes.`,
          content: `<p>Os fãs de anime têm um grande motivo para comemorar! Foi anunciado oficialmente que ${title} retornará com uma nova temporada em 2024. O anúncio foi feito através das redes sociais oficiais da obra e já está gerando grande expectativa na comunidade.</p>
                    <p>O estúdio responsável pela adaptação garantiu que manterá o alto padrão de animação que tornou a série famosa, prometendo cenas ainda mais impressionantes e fiéis ao material original. A equipe principal de produção permanece a mesma da temporada anterior, o que é uma ótima notícia para os fãs.</p>
                    <p>Ainda não foram revelados detalhes específicos sobre a quantidade de episódios ou exatamente qual arco do mangá será adaptado, mas especula-se que a nova temporada poderá cobrir alguns dos momentos mais aguardados pelos fãs da obra.</p>`,
          tags: ["anime", "anúncio", "nova temporada", title.toLowerCase()],
          category: "Anúncio"
        },
        evento: {
          title: `${title} confirmado na Anime Expo 2024`,
          summary: `Produtores e dubladores de ${title} farão participação especial no maior evento de anime do ocidente.`,
          content: `<p>A Anime Expo 2024 acaba de anunciar mais uma atração imperdível: um painel especial dedicado a ${title}! O evento, que acontece em Los Angeles, receberá membros da equipe de produção e dubladores do anime para uma série de atividades exclusivas.</p>
                    <p>Entre as atrações confirmadas estão sessões de autógrafos, exibição de cenas inéditas da próxima temporada e uma exposição com artworks originais utilizados na produção do anime. Os fãs também poderão participar de uma sessão de perguntas e respostas com os convidados.</p>
                    <p>Os ingressos para o evento começarão a ser vendidos no próximo mês, e a organização já alerta que a procura deve ser intensa, especialmente para as atividades relacionadas a ${title}.</p>`,
          tags: ["anime", "evento", "anime expo", title.toLowerCase()],
          category: "Evento"
        },
        noticia: {
          title: `${title} quebra recordes de audiência no streaming`,
          summary: `Série alcança números impressionantes e se torna um dos animes mais assistidos da temporada.`,
          content: `<p>O sucesso de ${title} não para de crescer! De acordo com dados recentes divulgados pelas principais plataformas de streaming, o anime atingiu números recordes de visualização, superando todas as expectativas iniciais.</p>
                    <p>O crescimento expressivo na base de fãs internacional tem chamado atenção da indústria, com destaque especial para o mercado ocidental. A popularidade da série tem influenciado significativamente o cenário do anime, inspirando novas produções e elevando os padrões de qualidade.</p>
                    <p>Este sucesso também se reflete no mercado de mangás e produtos relacionados, com um aumento significativo nas vendas de volumes físicos e itens colecionáveis da franquia. A editora responsável já confirmou que fará novas tiragens para atender à demanda crescente.</p>`,
          tags: ["anime", "sucesso", "streaming", title.toLowerCase()],
          category: "Notícia"
        }
      };

      // Seleciona aleatoriamente um dos templates
      const types = Object.keys(templates);
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newsData = templates[randomType];

      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Preenche os campos do formulário
      document.getElementById('title').value = newsData.title;
      document.getElementById('summary').value = newsData.summary;
      document.getElementById('category').value = newsData.category;
      document.getElementById('tags').value = newsData.tags.join(', ');
      tinymce.get('content').setContent(newsData.content);

      // Atualiza o contador de caracteres do resumo
      updateSummaryCounter();
      
      // Atualiza o progresso do formulário
      if (typeof updateFormProgress === 'function') {
        updateFormProgress();
      }

    } catch (error) {
      console.error('Erro ao gerar notícia:', error);
      alert('Erro ao gerar notícia. Por favor, tente novamente.');
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Gerar com IA';
    }
  }

  // Event Listeners principais
  addBtn.addEventListener('click', () => openModal());
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  form.addEventListener('submit', handleSubmit);

  const clearBtn = document.getElementById('clear-btn');
  clearBtn.addEventListener('click', clearForm);

  function clearForm() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
      // Limpa campos principais
      document.getElementById('title').value = '';
      document.getElementById('category').value = '';
      document.getElementById('tags').value = '';
      document.getElementById('summary').value = '';
      
      // Limpa o editor TinyMCE
      tinymce.get('content').setContent('');
      
      // Limpa a imagem
      document.getElementById('image').value = '';
      imagePreview.classList.add('hidden');
      imageDropZone.querySelector('.upload-area').classList.remove('hidden');
      
      // Reseta contadores
      summaryCounter.textContent = `0/${maxLength}`;
      summaryCounter.classList.remove('text-red-500');
      
      // Usa updateFormProgress ao invés de setupFormProgress
      if (typeof updateFormProgress === 'function') {
        updateFormProgress();
      }
    }
  }

  /**
   * Carrega e exibe as notícias do localStorage
   * Configura listeners para edição/exclusão
   */
  function loadNews() {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const newsList = document.querySelector('.admin-news-list');
  
    if (!news.length) {
      newsList.innerHTML = `
        <div class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Nenhuma notícia cadastrada</p>
        </div>
      `;
      return;
    }
  
    newsList.innerHTML = `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Título</th>
              <th>Categoria</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${news.map(item => `
              <tr>
                <td>
                  <div class="w-20 h-12 rounded overflow-hidden">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                  </div>
                </td>
                <td>
                  <div class="max-w-xs">
                    <p class="font-medium truncate">${item.title}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">${item.summary}</p>
                  </div>
                </td>
                <td>
                  <span class="px-2 py-1 text-xs text-white bg-purple-100 dark:bg-purple-900 rounded-full">
                    ${item.category}
                  </span>
                </td>
                <td>${new Date(item.date).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <button class="btn-action btn-edit" title="Editar" data-id="${item.id}">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button class="btn-action btn-delete" title="Remover" data-id="${item.id}">
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
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  
    // Adiciona event listeners para edição e exclusão
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => editNews(btn.dataset.id));
    });
  
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteNews(btn.dataset.id));
    });
  }
  


  /**
   * Gerencia estado do modal para criação/edição
   * @param {Object|null} newsData - Dados da notícia para edição
   */
  function openModal(newsData = null) {
    modal.classList.remove('hidden');
    if (newsData) {
      editingId = newsData.id;
      document.getElementById('title').value = newsData.title;
      document.getElementById('category').value = newsData.category;
      document.getElementById('tags').value = newsData.tags.join(', ');
      document.getElementById('image').value = newsData.image;
      // Atualiza preview da imagem se existir
      if (newsData.image) {
        previewImage.src = newsData.image;
        imagePreview.classList.remove('hidden');
        imageDropZone.querySelector('.upload-area').classList.add('hidden');
      }
      document.getElementById('summary').value = newsData.summary;
      tinymce.get('content').setContent(newsData.content); // Setar conteúdo no editor
      document.getElementById('modal-title').textContent = 'Editar Notícia';
    } else {
      editingId = null;
      form.reset();
      imagePreview.classList.add('hidden');
      imageDropZone.querySelector('.upload-area').classList.remove('hidden');
      tinymce.get('content').setContent(''); // Limpar editor
      document.getElementById('modal-title').textContent = 'Nova Notícia';
    }
    
    // Atualiza o progresso após abrir o modal
    if (typeof updateFormProgress === 'function') {
      setTimeout(updateFormProgress, 100); // Pequeno delay para garantir que o TinyMCE está pronto
    }
  }

  // Adicionar contador de caracteres para o resumo
  const summaryInput = document.getElementById('summary');
  const summaryCounter = document.getElementById('summary-counter');
  const maxLength = 200;

  function updateSummaryCounter() {
    const currentLength = summaryInput.value.length;
    summaryCounter.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength >= maxLength * 0.9) summaryCounter.classList.add('text-red-500');
    else summaryCounter.classList.remove('text-red-500');
  }

  summaryInput.addEventListener('input', updateSummaryCounter);

  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
    editingId = null;
    summaryCounter.textContent = `0/${maxLength}`;
    summaryCounter.classList.remove('text-red-500');
  }

  /**
   * Processa submissão do formulário
   * Preserva data original em edições
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Validar campos obrigatórios
    const requiredFields = ['title', 'category', 'summary', 'image'];
    const emptyFields = requiredFields.filter(field => !document.getElementById(field).value.trim());
    
    if (emptyFields.length > 0) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validar conteúdo do TinyMCE
    const content = tinymce.get('content').getContent().trim();
    if (!content) {
      alert('Por favor, preencha o conteúdo da notícia');
      return;
    }

    const newsData = {
      id: editingId || Date.now().toString(),
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: document.getElementById('image').value,
      summary: document.getElementById('summary').value,
      content: content,
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

    if (index > -1) news[index] = newsData;
    else news.unshift(newsData); // Adiciona no início do array

    localStorage.setItem('news', JSON.stringify(news));
    // Dispara evento para atualizar outras páginas
    window.dispatchEvent(new Event('newsUpdated'));
  }

  function editNews(id) {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const newsData = news.find(item => item.id === id);
    if (newsData) openModal(newsData);
  }

  function deleteNews(id) {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      const news = JSON.parse(localStorage.getItem('news') || '[]');
      const filteredNews = news.filter(item => item.id !== id);
      localStorage.setItem('news', JSON.stringify(filteredNews));
      loadNews();
    }
  }

  // Gerenciamento de imagens
  const imageDropZone = document.getElementById('image-drop-zone');
  const imageFile = document.getElementById('image-file');
  const imagePreview = document.querySelector('.image-preview');
  const previewImage = document.getElementById('preview-image');
  const removeImageBtn = document.getElementById('remove-image');
  const imageInput = document.getElementById('image');

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
      
      // Atualiza a barra de progresso quando a imagem for removida
      if (typeof updateFormProgress === 'function') {
        updateFormProgress();
      }
    }
  });

  /**
   * Processa arquivo de imagem e gera preview
   * Converte para Base64 para armazenamento
   */
  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      document.getElementById('image').value = imageData;
      previewImage.src = imageData;
      imagePreview.classList.remove('hidden');
      imageDropZone.querySelector('.upload-area').classList.add('hidden');
      
      // Atualiza a barra de progresso quando a imagem for carregada
      if (typeof updateFormProgress === 'function') {
        updateFormProgress();
      }
    };
    reader.readAsDataURL(file);
  }
});