let forumTopics = [];

// Elementos do DOM
const newTopicBtn = document.getElementById('new-topic-btn');
const newTopicModal = document.getElementById('new-topic-modal');
const newTopicForm = document.getElementById('new-topic-form');
const cancelTopicBtn = document.getElementById('cancel-topic');
const forumTopicsContainer = document.getElementById('forum-topics');

// Verificar se usuário está logado
function isUserLoggedIn() {
  const session = localStorage.getItem('userSession');
  return session !== null;
}

// Obter nome do usuário logado
function getLoggedUsername() {
  const session = JSON.parse(localStorage.getItem('userSession'));
  return session ? session.username : null;
}

// Função para verificar se o usuário é admin
function isAdmin() {
  const session = JSON.parse(localStorage.getItem('userSession'));
  return session && session.isAdmin;
}

// Função para verificar se o usuário é o autor do comentário
function isAuthor(authorName) {
  const session = JSON.parse(localStorage.getItem('userSession'));
  return session && session.username === authorName;
}

// Configurações do fórum
const FORUM_CONFIG = {
  categories: [
    { id: 'geral', name: 'Geral', icon: '💭' },
    { id: 'reviews', name: 'Reviews', icon: '⭐' },
    { id: 'teorias', name: 'Teorias', icon: '🤔' },
    { id: 'noticias', name: 'Notícias', icon: '📰' },
    { id: 'recomendacoes', name: 'Recomendações', icon: '👍' }
  ],
  maxTitleLength: 100,
  maxContentLength: 2000,
  moderationRules: {
    forbiddenWords: [] // Será preenchido ao carregar
  }
};

// Função para carregar a lista de palavrões
async function loadBadWords() {
  try {
    const response = await fetch('./src/js/data/badwords.json');
    const data = await response.json();
    FORUM_CONFIG.moderationRules.forbiddenWords = data.palavroes;
  } catch (error) {
    console.error('Erro ao carregar lista de palavrões:', error);
  }
}

// Classe para formatação de texto
class TextFormatter {
  static format(text) {
    text = this.censorText(text);
    text = this.formatMentions(text);
    text = this.formatMarkdown(text);
    text = this.formatEmojis(text);
    return text;
  }

  static censorText(text) {
    let censoredText = text;
    FORUM_CONFIG.moderationRules.forbiddenWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      censoredText = censoredText.replace(regex, match => '•'.repeat(match.length));
    });
    return censoredText;
  }

  static formatMentions(text) {
    return text.replace(/@(\w+)/g, '<a href="#user-$1" class="mention">@$1</a>');
  }

  static formatMarkdown(text) {
    // Negrito
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Itálico
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Código
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    return text;
  }

  static formatEmojis(text) {
    // Substitui códigos de emoji por emojis reais
    const emojiMap = {
      ':)': '😊',
      ':(': '😢',
      ':D': '😀',
      '<3': '❤️'
    };

    return text.replace(/:\)|:\(|:D|<3/g, match => emojiMap[match]);
  }
}

// Classe para gerenciamento de moderação
class ForumModerator {
  static validateContent(content, type = 'conteúdo') {
    if (!content || content.trim() === '') {
      throw new Error(`O ${type} não pode estar vazio.`);
    }

    // Verifica comprimento máximo
    const maxLengths = {
      título: FORUM_CONFIG.maxTitleLength,
      conteúdo: FORUM_CONFIG.maxContentLength,
      resposta: FORUM_CONFIG.maxContentLength,
      tag: 30 // Limite máximo para tags
    };

    if (maxLengths[type] && content.length > maxLengths[type]) {
      throw new Error(`O ${type} excede o limite máximo de ${maxLengths[type]} caracteres.`);
    }

    return true;
  }

  static validateTags(tags) {
    if (!Array.isArray(tags)) return [];
    
    return tags.map(tag => {
      try {
        this.validateContent(tag, 'tag');
        // Primeiro censura as palavras impróprias, depois limpa caracteres especiais
        const censoredTag = TextFormatter.censorText(tag);
        return censoredTag.replace(/[^a-zA-Z0-9\*]/g, '');
      } catch (error) {
        console.warn(`Tag "${tag}" inválida: ${error.message}`);
        return null;
      }
    }).filter(Boolean); // Remove tags nulas
  }

  static canUserPost() {
    return !!JSON.parse(localStorage.getItem('userSession'));
  }
}

// Função para fechar o modal
function closeModal() {
  newTopicModal.classList.add('hidden');
  newTopicForm.reset();
}

// Event Listeners
newTopicBtn?.addEventListener('click', () => {
  if (!isUserLoggedIn()) {
    alert('Você precisa estar logado para criar uma discussão!');
    window.location.href = './login/signin.html';
    return;
  }
  newTopicModal.classList.remove('hidden');
  populateCategories(); // Adicionar esta linha
});

// Fechar modal com o X
document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);

// Fechar modal com o botão Cancelar
document.getElementById('cancel-topic-btn')?.addEventListener('click', closeModal);

// Fechar modal clicando fora dele
newTopicModal?.addEventListener('click', (e) => {
  if (e.target === newTopicModal) {
    closeModal();
  }
});

// Prevenir que cliques dentro do modal o fechem
newTopicModal?.querySelector('.new-topic-modal')?.addEventListener('click', (e) => {
  e.stopPropagation();
});

newTopicForm?.addEventListener('submit', addTopic);

// Renderiza as discussões
function renderTopics() {
  if (!forumTopicsContainer) return;

  const userId = isUserLoggedIn() ? JSON.parse(localStorage.getItem('userSession')).userId : null;

  // Adiciona filtros de categoria
  const categoryFilters = `
    <div class="category-filters mb-6 flex gap-2 overflow-x-auto p-2">
      ${FORUM_CONFIG.categories.map(cat => `
        <button class="category-filter px-4 py-2 rounded-full border transition-colors hover:bg-purple-700"
                data-category="${cat.id}">
          ${cat.icon} ${cat.name}
        </button>
      `).join('')}
    </div>
  `;

  // Organiza tópicos por categoria
  const topicsByCategory = FORUM_CONFIG.categories.reduce((acc, cat) => {
    acc[cat.id] = forumTopics.filter(topic => topic.category === cat.id);
    return acc;
  }, {});

  forumTopicsContainer.innerHTML = categoryFilters + Object.entries(topicsByCategory)
    .map(([catId, topics]) => {
      const category = FORUM_CONFIG.categories.find(c => c.id === catId);
      return topics.length ? `
        <div class="category-section mb-8">
          <h3 class="text-2xl font-bold mb-4">${category.icon} ${category.name}</h3>
          ${topics.map(topic => renderTopicCard(topic, userId)).join('')}
        </div>
      ` : '';
    }).join('');

  // Adiciona event listeners para filtros
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', () => filterTopicsByCategory(btn.dataset.category));
  });
}

// Nova função para renderizar card de tópico
function renderTopicCard(topic, userId) {
  const category = FORUM_CONFIG.categories.find(c => c.id === topic.category) ||
    { icon: '💬', name: 'Geral' };

  return `
    <div class="card p-6 mb-4 transform transition-all hover:-translate-y-1 hover:shadow-lg" id="topic-${topic.id}">
      <div class="topic-content">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">${category.icon}</span>
              <h3 class="text-xl font-bold">${topic.title}</h3>
            </div>
            <p class="text-sm">
              Por <span class="font-semibold">${topic.author}</span> 
              em ${formatDate(topic.date)}
              ${topic.editedAt ? `<span class="text-xs">(editado)</span>` : ''}
            </p>
          </div>
          <div class="flex items-center gap-2">
            ${(isAuthor(topic.author) || isAdmin()) ? `
              <button onclick="editTopic(${topic.id})" class="edit-topic-btn text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </button>
              <button onclick="deleteTopic(${topic.id})" class="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
            ` : ''}
            <button onclick="likeTopic(${topic.id})" 
                    class="flex items-center gap-2 ${topic.likedBy && topic.likedBy.includes(userId) ? 'text-purple-600' : 'text-gray-400'} transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
              </svg>
              ${topic.likes}
            </button>
          </div>
        </div>
        <p class="mb-4">${topic.content}</p>
      </div>

      <!-- Formulário de edição do tópico -->
      <div class="topic-edit-form hidden">
        <form onsubmit="saveTopicEdit(event, ${topic.id})" class="space-y-4">
          <div>
            <input type="text" value="${topic.title}" 
                   class="w-full p-2 border rounded-lg text-xl font-bold mb-2">
          </div>
          <div>
            <textarea class="w-full p-2 border rounded-lg min-h-[100px]">${topic.content}</textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="cancelTopicEdit(${topic.id})" 
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Cancelar</button>
            <button type="submit" 
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg">Salvar</button>
          </div>
        </form>
      </div>
      
      <!-- Seção de respostas -->
      <div class="ml-6 border-l-2 border-purple-200 pl-4">
        ${renderReplies(topic.replies, topic.id, userId)}
      </div>
      
      ${isUserLoggedIn() ? `
        <div class="mt-4">
          <form onsubmit="addReply(event, ${topic.id})" class="flex gap-2">
            <input type="text" placeholder="Adicione uma resposta..." 
                   class="flex-1 p-2 border rounded-lg">
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg">
              Responder
            </button>
          </form>
        </div>
      ` : `
        <div class="mt-4 text-center">
          <a href="./login/signin.html" class="text-purple-600 hover:text-purple-700">
            Faça login para participar da discussão
          </a>
        </div>
      `}
      
      <!-- Adiciona badges e estatísticas -->
      <div class="flex gap-2 mt-4 text-sm text-gray-600">
        <span class="badge">${topic.views || 0} 👀</span>
        <span class="badge">${topic.replies.length} 💬</span>
        <span class="badge">${topic.likes} 👍</span>
      </div>

      <!-- Sistema de tags -->
      <div class="flex gap-2 mt-2">
        ${(topic.tags || []).map(tag => `
          <span class="tag text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600">
            #${tag}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}

// Renderiza a lista de tópicos
function renderReplies(replies, topicId, userId) {
  return replies.map(reply => `
    <div class="mb-3" id="reply-${reply.id}">
        <div class="flex justify-between items-start">
            <p class="text-sm">
                <span class="font-semibold">${reply.author}</span>
                em ${formatDate(reply.date)}
                ${reply.editedAt ? `<span class="text-xs">(editado)</span>` : ''}
            </p>
            <div class="flex items-center gap-2">
                ${(isAuthor(reply.author) || isAdmin()) ? `
                    <button onclick="editReply(${topicId}, ${reply.id})" class="text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                    </button>
                    <button onclick="deleteReply(${topicId}, ${reply.id})" class="text-red-600 hover:text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                    </button>
                ` : ''}
                <button onclick="likeReply(${topicId}, ${reply.id})" 
                        class="text-sm ${reply.likedBy && reply.likedBy.includes(userId) ? 'text-purple-600' : 'text-gray-400'} transition-colors">
                    ${reply.likes || 0} ❤️
                </button>
            </div>
        </div>
        <div class="reply-content">
            <p>${reply.content}</p>
        </div>
        <div class="reply-edit-form hidden">
            <form onsubmit="saveReplyEdit(event, ${topicId}, ${reply.id})" class="flex gap-2 mt-2">
                <textarea class="flex-1 p-2 border rounded-lg">${reply.content}</textarea>
                <div class="flex flex-col gap-2">
                    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg">Salvar</button>
                    <button type="button" onclick="cancelReplyEdit(${reply.id})" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
  `).join('');
}

// Funções auxiliares
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

function likeTopic(topicId) {
  if (!isUserLoggedIn()) {
    alert('Você precisa estar logado para curtir!');
    window.location.href = './login/signin.html';
    return;
  }

  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic) return;

  const userId = JSON.parse(localStorage.getItem('userSession')).userId;

  // Verifica se o usuário já deu like
  if (topic.likedBy && topic.likedBy.includes(userId)) {
    // Remove o like
    topic.likes--;
    topic.likedBy = topic.likedBy.filter(id => id !== userId);
  } else {
    // Adiciona o like
    topic.likes++;
    if (!topic.likedBy) topic.likedBy = [];
    topic.likedBy.push(userId);
  }

  renderTopics();
  saveForumData(); // Adicionar esta linha
}

function likeReply(topicId, replyId) {
  if (!isUserLoggedIn()) {
    alert('Você precisa estar logado para curtir!');
    window.location.href = './login/signin.html';
    return;
  }

  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic) return;

  const reply = topic.replies.find(r => r.id === replyId);
  if (!reply) return;

  const userId = JSON.parse(localStorage.getItem('userSession')).userId;

  // Verifica se o usuário já deu like
  if (reply.likedBy && reply.likedBy.includes(userId)) {
    // Remove o like
    reply.likes--;
    reply.likedBy = reply.likedBy.filter(id => id !== userId);
  } else {
    // Adiciona o like
    reply.likes++;
    if (!reply.likedBy) reply.likedBy = [];
    reply.likedBy.push(userId);
  }

  renderTopics();
  saveForumData(); // Adicionar esta linha
}

function addReply(event, topicId) {
  event.preventDefault();

  if (!isUserLoggedIn()) {
    alert('Você precisa estar logado para responder!');
    window.location.href = './login/signin.html';
    return;
  }

  const input = event.target.querySelector('input');
  const content = input.value.trim();

  try {
    ForumModerator.validateContent(content, 'resposta');

    const topic = forumTopics.find(t => t.id === topicId);
    if (topic) {
      topic.replies.push({
        id: Date.now(), // Adiciona ID único
        author: getLoggedUsername(),
        content: TextFormatter.format(content),
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        likedBy: []
      });
      renderTopics();
      saveForumData(); // Adicionar esta linha
      input.value = '';
    }
  } catch (error) {
    alert(error.message);
  }
}

// Funções de edição e remoção
function editTopic(topicId) {
  const topicElement = document.getElementById(`topic-${topicId}`);
  if (!topicElement) return;

  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic || (!isAuthor(topic.author) && !isAdmin())) return;

  const contentDiv = topicElement.querySelector('.topic-content');
  const editFormDiv = topicElement.querySelector('.topic-edit-form');
  const editButton = topicElement.querySelector('.edit-topic-btn');

  contentDiv.classList.add('hidden');
  editFormDiv.classList.remove('hidden');
  editButton.disabled = true;
}

function saveTopicEdit(event, topicId) {
  event.preventDefault();

  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic) return;

  const form = event.target;
  const newTitle = form.querySelector('input').value.trim();
  const newContent = form.querySelector('textarea').value.trim();

  try {
    ForumModerator.validateContent(newTitle, 'título');
    ForumModerator.validateContent(newContent, 'conteúdo');

    topic.title = TextFormatter.format(newTitle);
    topic.content = TextFormatter.format(newContent);
    topic.editedAt = new Date().toISOString();
    renderTopics();
    saveForumData();
  } catch (error) {
    alert(error.message);
  }
}

function cancelTopicEdit(topicId) {
  const topicElement = document.getElementById(`topic-${topicId}`);
  if (!topicElement) return;

  const contentDiv = topicElement.querySelector('.topic-content');
  const editFormDiv = topicElement.querySelector('.topic-edit-form');
  const editButton = topicElement.querySelector('.edit-topic-btn');

  contentDiv.classList.remove('hidden');
  editFormDiv.classList.add('hidden');
  editButton.disabled = false;
}

function deleteTopic(topicId) {
  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic || (!isAuthor(topic.author) && !isAdmin())) return;

  if (confirm('Tem certeza que deseja excluir esta discussão? Todos os comentários serão removidos permanentemente.')) {
    try {
      // Log para debug
      console.log('Deletando tópico:', topic);
      console.log('Número de respostas antes da exclusão:', topic.replies.length);
      
      // Remove o tópico e todos seus dados relacionados
      forumTopics = forumTopics.filter(t => t.id !== topicId);
      
      // Verificação após exclusão
      const topicStillExists = forumTopics.some(t => t.id === topicId);
      if (topicStillExists) {
        throw new Error('Falha ao excluir o tópico');
      }

      // Salva as alterações e atualiza a visualização
      saveForumData();
      renderTopics();
      
      // Log de confirmação
      console.log('Tópico excluído com sucesso');
      console.log('Número atual de tópicos:', forumTopics.length);
      
      // Feedback visual para o usuário
      alert('Tópico excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir tópico:', error);
      alert('Ocorreu um erro ao tentar excluir o tópico. Por favor, tente novamente.');
    }
  }
}

// Nova função de edição de reply
function editReply(topicId, replyId) {
  const replyElement = document.getElementById(`reply-${replyId}`);
  if (!replyElement) return;

  const contentDiv = replyElement.querySelector('.reply-content');
  const editFormDiv = replyElement.querySelector('.reply-edit-form');
  const editButton = replyElement.querySelector('.edit-btn');

  contentDiv.classList.add('hidden');
  editFormDiv.classList.remove('hidden');
  editButton.disabled = true;
}

// Nova função para salvar a edição
function saveReplyEdit(event, topicId, replyId) {
  event.preventDefault();

  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic) return;

  const reply = topic.replies.find(r => r.id === replyId);
  if (!reply) return;

  const form = event.target;
  const newContent = form.querySelector('textarea').value.trim();

  try {
    ForumModerator.validateContent(newContent, 'resposta');

    reply.content = TextFormatter.format(newContent);
    reply.editedAt = new Date().toISOString();
    renderTopics();
    saveForumData();
  } catch (error) {
    alert(error.message);
  }
}

// Nova função para cancelar a edição
function cancelReplyEdit(replyId) {
  const replyElement = document.getElementById(`reply-${replyId}`);
  if (!replyElement) return;

  const contentDiv = replyElement.querySelector('.reply-content');
  const editFormDiv = replyElement.querySelector('.reply-edit-form');
  const editButton = replyElement.querySelector('.edit-btn');

  contentDiv.classList.remove('hidden');
  editFormDiv.classList.add('hidden');
  editButton.disabled = false;
}

function deleteReply(topicId, replyId) {
  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic) return;

  const reply = topic.replies.find(r => r.id === replyId);
  if (!reply || (!isAuthor(reply.author) && !isAdmin())) return;

  if (confirm('Tem certeza que deseja excluir esta resposta?')) {
    topic.replies = topic.replies.filter(r => r.id !== replyId);
    saveForumData(); // Adicionar esta linha
    renderTopics();
  }
}

// Novas funções para gerenciamento de tópicos
function addTopic(event) {
  event.preventDefault();

  if (!isUserLoggedIn()) {
    alert('Você precisa estar logado para criar tópicos.');
    window.location.href = './login/signin.html';
    return;
  }

  const title = document.getElementById('topic-title').value.trim();
  const content = document.getElementById('topic-content').value.trim();
  const category = document.getElementById('topic-category').value;
  const rawTags = document.getElementById('topic-tags').value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  // Adicionar validação de categoria
  if (!category) {
    alert('Por favor, selecione uma categoria.');
    return;
  }

  try {
    ForumModerator.validateContent(title, 'título');
    ForumModerator.validateContent(content, 'conteúdo');
    
    // Validar e filtrar tags impróprias
    const validatedTags = ForumModerator.validateTags(rawTags);
    
    if (rawTags.length !== validatedTags.length) {
      alert('Algumas tags foram removidas por conterem palavras impróprias.');
    }

    const newTopic = {
      id: Date.now(),
      title: TextFormatter.format(title),
      content: TextFormatter.format(content),
      category,
      tags: validatedTags,
      author: getLoggedUsername(),
      date: new Date().toISOString(),
      likes: 0,
      views: 0,
      likedBy: [],
      replies: []
    };

    forumTopics.unshift(newTopic);
    saveForumData(); // Adicionar esta linha
    renderTopics();
    newTopicModal.classList.add('hidden');
    event.target.reset();

  } catch (error) {
    alert(error.message);
  }
}

// Função para preencher o select de categorias
function populateCategories() {
  const categorySelect = document.getElementById('topic-category');
  if (!categorySelect) return;

  categorySelect.innerHTML = `
    <option value="">Selecione uma categoria</option>
    ${FORUM_CONFIG.categories.map(cat => `
      <option value="${cat.id}">${cat.icon} ${cat.name}</option>
    `).join('')}
  `;
}

// Funções para persistência de dados
function saveForumData() {
  localStorage.setItem('forumTopics', JSON.stringify(forumTopics));
}

// Modificar a função loadForumData para garantir que sempre retorne um array
function loadForumData() {
  try {
    const savedTopics = localStorage.getItem('forumTopics');
    forumTopics = savedTopics ? JSON.parse(savedTopics) : [];

    // Garantir que é um array mesmo que o JSON seja inválido
    if (!Array.isArray(forumTopics)) {
      forumTopics = [];
    }
  } catch (error) {
    console.error('Erro ao carregar dados do fórum:', error);
    forumTopics = [];
  }
}

// Função para filtrar tópicos por categoria
function filterTopicsByCategory(categoryId) {
  // Remove a classe ativa de todos os botões
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.classList.remove('bg-purple-100', 'text-purple-600');
  });

  // Adiciona classe ativa ao botão selecionado
  const selectedButton = document.querySelector(`[data-category="${categoryId}"]`);
  if (selectedButton) {
    selectedButton.classList.add('bg-purple-100', 'text-purple-600');
  }

  // Se não houver categoria selecionada, mostra todos os tópicos
  if (!categoryId) {
    renderTopics();
    return;
  }

  // Filtra os tópicos pela categoria
  const filteredTopics = forumTopics.filter(topic => topic.category === categoryId);

  // Atualiza a exibição mantendo os filtros de categoria
  if (forumTopicsContainer) {
    const categoryFilters = `
      <div class="category-filters mb-6 flex gap-2 overflow-x-auto p-2">
        <button class="category-filter px-4 py-2 rounded-full border transition-colors hover:bg-purple-1000"
                onclick="filterTopicsByCategory()">
          🔍 Todas
        </button>
        ${FORUM_CONFIG.categories.map(cat => `
          <button class="category-filter px-4 py-2 rounded-full border transition-colors" ${cat.id === categoryId ? 'bg-purple-100 text-purple-600' : ''}"
                  data-category="${cat.id}"
                  onclick="filterTopicsByCategory('${cat.id}')">
            ${cat.icon} ${cat.name}
          </button>
        `).join('')}
      </div>
    `;

    const category = FORUM_CONFIG.categories.find(c => c.id === categoryId);
    forumTopicsContainer.innerHTML = categoryFilters + `
      <div class="category-section mb-8">
        <h3 class="text-2xl font-bold mb-4">${category.icon} ${category.name}</h3>
        ${filteredTopics.map(topic => renderTopicCard(topic,
      isUserLoggedIn() ? JSON.parse(localStorage.getItem('userSession')).userId : null
    )).join('')}
      </div>
    `;

    // Reativar os event listeners para os botões de filtro
    document.querySelectorAll('.category-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterTopicsByCategory(btn.dataset.category);
      });
    });
  }
}

// Modificar a inicialização para incluir a inicialização das categorias
document.addEventListener('DOMContentLoaded', async () => {
  // Garantir que forumTopics começa como array vazio
  forumTopics = [];

  // Carregar lista de palavrões primeiro
  await loadBadWords();

  // Carregar dados salvos
  loadForumData();

  // Renderizar tópicos e popular categorias
  renderTopics();
  populateCategories();
});