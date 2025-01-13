class CategoryManager {
  constructor() {
    this.setupFormVisibility();
    this.loadCategories();

    // Adiciona o event listener para atualização de categorias
    window.addEventListener('categoriesUpdated', () => {
      this.loadCategories();
    });
  }

  generateForm() {
    return `
      <h2 class="text-xl font-semibold mb-4">Adicionar Nova Categoria</h2>
      <form id="category-form" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nome da categoria com contador -->
          <div class="form-group col-span-full md:col-span-1">
            <label for="category-name" class="block mb-2 font-medium">Nome da Categoria *</label>
            <div class="relative">
              <input type="text" id="category-name" required maxlength="30"
                class="w-full p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Ação, Comédia, etc">
              <small class="text-right block mt-1 text-gray-500">
                <span id="name-count">0</span>/30
              </small>
            </div>
          </div>

          <!-- Tipo de categoria -->
          <div class="form-group col-span-full md:col-span-1">
            <label class="block mb-2 font-medium">Tipo de Categoria *</label>
            <div class="flex gap-4">
              <label class="inline-flex items-center">
                <input type="radio" name="category-type" value="main" checked class="text-purple-600">
                <span class="ml-2">Principal</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="category-type" value="sub" class="text-purple-600">
                <span class="ml-2">Subcategoria</span>
              </label>
            </div>
          </div>

          <!-- Ícone com seletor de emojis -->
          <div class="form-group col-span-full md:col-span-1">
            <label for="category-icon" class="block mb-2 font-medium">Ícone (emoji) *</label>
            <div class="relative">
              <input type="text" id="category-icon" required
                class="w-full p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                placeholder="Clique para escolher">
              <button type="button" id="emoji-picker-btn"
                class="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-600">
                😊
              </button>
            </div>
            <div id="emoji-picker" class="hidden mt-2 p-2 border rounded-lg bg-white dark:bg-gray-700 shadow-lg">
              <!-- Emojis serão inseridos via JavaScript -->
            </div>
          </div>

          <!-- Descrição com contador -->
          <div class="form-group col-span-full">
            <label for="category-description" class="block mb-2 font-medium">Descrição *</label>
            <div class="relative">
              <textarea id="category-description" required maxlength="100" rows="3"
                class="w-full p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Descreva brevemente o tipo de conteúdo desta categoria"></textarea>
              <small class="text-right block mt-1 text-gray-500">
                <span id="desc-count">0</span>/100
              </small>
            </div>
          </div>

          <!-- Cores do gradiente -->
          <div class="form-group">
            <label for="gradient-start" class="block mb-2 font-medium">Cor Inicial *</label>
            <div class="flex items-center gap-2">
              <input type="color" id="gradient-start" required value="#6366F1" class="w-16 h-10 rounded cursor-pointer">
              <input type="text" id="gradient-start-hex" class="w-28 p-2 border rounded-lg" value="#6366F1">
            </div>
          </div>

          <div class="form-group">
            <label for="gradient-end" class="block mb-2 font-medium">Cor Final *</label>
            <div class="flex items-center gap-2">
              <input type="color" id="gradient-end" required value="#8B5CF6" class="w-16 h-10 rounded cursor-pointer">
              <input type="text" id="gradient-end-hex" class="w-28 p-2 border rounded-lg" value="#8B5CF6">
            </div>
          </div>
        </div>

        <!-- Preview aprimorado -->
        <div class="mt-6">
          <label class="block mb-4 font-medium">Preview da Categoria:</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="mb-2 text-sm text-gray-500">Modo Claro</p>
              <div id="category-preview-light" class="category-card bg-white">
                <div class="category-icon"></div>
                <h3></h3>
                <p></p>
                <span class="anime-count">0 animes</span>
              </div>
            </div>
            <div>
              <p class="mb-2 text-sm text-gray-500">Modo Escuro</p>
              <div id="category-preview-dark" class="category-card bg-gray-800">
                <div class="category-icon"></div>
                <h3></h3>
                <p></p>
                <span class="anime-count">0 animes</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end gap-4 pt-4 border-t">
          <button type="button" id="btn-cancel" 
            class="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            Cancelar
          </button>
          <button type="submit" 
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Adicionar Categoria
          </button>
        </div>
      </form>
    `;
  }

  setupFormVisibility() {
    const formContainer = document.getElementById('category-form-container');
    const showFormButton = document.getElementById('btn-show-form');

    // Mostra o formulário ao clicar no botão
    showFormButton.addEventListener('click', () => {
      formContainer.innerHTML = this.generateForm();
      formContainer.classList.remove('hidden');
      showFormButton.classList.add('hidden');

      // Inicializa todos os componentes do formulário
      this.initializeForm();
      this.setupPreviewUpdates();
      this.setupEmojiPicker();
      this.setupColorInputs();
      this.setupCharacterCounters();

      // Configura o botão cancelar
      const cancelButton = document.getElementById('btn-cancel');
      cancelButton.addEventListener('click', () => {
        formContainer.classList.add('hidden');
        showFormButton.classList.remove('hidden');
        formContainer.innerHTML = ''; // Limpa o formulário do DOM
      });
    });
  }

  initializeForm() {
    const form = document.getElementById('category-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
  }

  setupPreviewUpdates() {
    ['category-name', 'category-icon', 'category-description', 'gradient-start', 'gradient-end'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.updatePreview());
      }
    });
  }

  setupEmojiPicker() {
    const commonEmojis = ['⚔️', '🎭', '😄', '🔮', '🤖', '💝', '👻', '🎮', '🌟', '🎬', '🎨', '🎵', '👊', '🏃', '💫', '🌍'];
    const picker = document.getElementById('emoji-picker');
    const pickerBtn = document.getElementById('emoji-picker-btn');
    const iconInput = document.getElementById('category-icon');

    if (picker && pickerBtn) {
      // Preenche o seletor de emojis
      picker.innerHTML = commonEmojis.map(emoji => `
        <button type="button" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
          ${emoji}
        </button>
      `).join('');

      // Toggle do picker
      pickerBtn.addEventListener('click', () => {
        picker.classList.toggle('hidden');
      });

      // Seleciona emoji
      picker.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          iconInput.value = e.target.textContent.trim();
          picker.classList.add('hidden');
          this.updatePreview();
        }
      });

      // Fecha picker ao clicar fora
      document.addEventListener('click', (e) => {
        if (!picker.contains(e.target) && !pickerBtn.contains(e.target)) {
          picker.classList.add('hidden');
        }
      });
    }
  }

  setupColorInputs() {
    ['start', 'end'].forEach(type => {
      const colorInput = document.getElementById(`gradient-${type}`);
      const hexInput = document.getElementById(`gradient-${type}-hex`);

      if (colorInput && hexInput) {
        // Atualiza hex quando color muda
        colorInput.addEventListener('input', () => {
          hexInput.value = colorInput.value.toUpperCase();
          this.updatePreview();
        });

        // Atualiza color quando hex muda
        hexInput.addEventListener('input', () => {
          if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
            colorInput.value = hexInput.value;
            this.updatePreview();
          }
        });
      }
    });
  }

  setupCharacterCounters() {
    // Contador para nome
    const nameInput = document.getElementById('category-name');
    const nameCount = document.getElementById('name-count');
    if (nameInput && nameCount) {
      this.setupCounter(nameInput, nameCount, 30);
    }

    // Contador para descrição
    const descInput = document.getElementById('category-description');
    const descCount = document.getElementById('desc-count');
    if (descInput && descCount) {
      this.setupCounter(descInput, descCount, 100);
    }
  }

  setupCounter(input, counter, max) {
    const updateCount = () => {
      const count = input.value.length;
      counter.textContent = count;
      counter.style.color = count === max ? 'red' : '';
    };

    input.addEventListener('input', updateCount);
    updateCount(); // Inicializa contador
  }

  updatePreview() {
    const name = document.getElementById('category-name').value;
    const icon = document.getElementById('category-icon').value;
    const description = document.getElementById('category-description').value;
    const gradientStart = document.getElementById('gradient-start').value;
    const gradientEnd = document.getElementById('gradient-end').value;
    const isSubcategory = document.querySelector('input[name="category-type"]:checked').value === 'sub';

    // Atualiza preview modo claro
    this.updatePreviewElement('light', { name, icon, description, gradientStart, gradientEnd, isSubcategory });
    
    // Atualiza preview modo escuro
    this.updatePreviewElement('dark', { name, icon, description, gradientStart, gradientEnd, isSubcategory });
  }

  updatePreviewElement(mode, { name, icon, description, gradientStart, gradientEnd, isSubcategory }) {
    const preview = document.getElementById(`category-preview-${mode}`);
    if (!preview) return;

    preview.style.background = `linear-gradient(45deg, ${gradientStart}, ${gradientEnd})`;
    preview.querySelector('.category-icon').textContent = icon;
    preview.querySelector('h3').textContent = name;
    preview.querySelector('p').textContent = description;
    
    // Ajusta estilo baseado no tipo
    if (isSubcategory) {
      preview.classList.add('subcategory-preview');
      preview.style.width = '200px';
      preview.style.padding = '0.5rem 1rem';
    } else {
      preview.classList.remove('subcategory-preview');
      preview.style.width = '100%';
      preview.style.padding = '2rem';
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const editingId = parseInt(form.dataset.editingId);

    const categoryData = {
      id: editingId || Date.now(),
      name: form.querySelector('#category-name').value.trim(),
      icon: form.querySelector('#category-icon').value.trim(),
      description: form.querySelector('#category-description').value.trim(),
      isSubcategory: form.querySelector('input[name="category-type"]:checked').value === 'sub',
      gradient: {
        start: form.querySelector('#gradient-start').value,
        end: form.querySelector('#gradient-end').value
      }
    };

    try {
      if (editingId) {
        await this.updateCategory(categoryData);
        alert('Categoria atualizada com sucesso!');
      } else {
        await this.saveCategory(categoryData);
        alert('Categoria adicionada com sucesso!');
      }

      // Esconde o formulário após salvar
      const formContainer = document.getElementById('category-form-container');
      const showFormButton = document.getElementById('btn-show-form');
      formContainer.classList.add('hidden');
      showFormButton.classList.remove('hidden');

      // Limpa o formulário e reseta o estado
      form.reset();
      delete form.dataset.editingId;
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Adicionar Categoria';
      submitBtn.classList.remove('editing');

      this.updatePreview();
      this.loadCategories();
    } catch (error) {
      alert(error.message);
    }
  }

  async saveCategory(categoryData) {
    const categories = this.getCategories();
    
    // Adiciona campo isSubcategory e normaliza os dados
    const newCategory = {
      ...categoryData,
      // Obtém o valor correto do radio button
      isSubcategory: categoryData.isSubcategory,
      name: categoryData.name.trim(),
      description: categoryData.description.trim(),
      icon: categoryData.icon.trim()
    };

    // Verifica se já existe uma categoria com o mesmo nome
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      throw new Error('Já existe uma categoria com este nome');
    }

    // Se não existirem categorias ainda, cria um array
    const updatedCategories = categories.length ? categories : [];
    updatedCategories.push(newCategory);

    // Salva no localStorage
    try {
      localStorage.setItem('animuCategories', JSON.stringify(updatedCategories));
      
      // Atualiza a lista de categorias na página
      this.loadCategories();
      
      // Força a atualização da página de categorias se ela estiver aberta em outra aba
      window.dispatchEvent(new Event('categoriesUpdated'));
    } catch (error) {
      throw new Error('Erro ao salvar categoria: ' + error.message);
    }
  }

  async updateCategory(categoryData) {
    const categories = this.getCategories();
    
    // Verifica se existe outra categoria com o mesmo nome (exceto a própria)
    if (categories.some(cat => 
      cat.id !== categoryData.id && 
      cat.name.toLowerCase() === categoryData.name.toLowerCase()
    )) {
      throw new Error('Já existe uma categoria com este nome');
    }

    // Atualiza a categoria
    const updatedCategories = categories.map(cat =>
      cat.id === categoryData.id ? categoryData : cat
    );

    // Salva no localStorage
    try {
      localStorage.setItem('animuCategories', JSON.stringify(updatedCategories));
      window.dispatchEvent(new Event('categoriesUpdated'));
    } catch (error) {
      throw new Error('Erro ao atualizar categoria: ' + error.message);
    }
  }

  getCategories() {
    return JSON.parse(localStorage.getItem('animuCategories')) || [];
  }

  loadCategories() {
    const categoriesList = document.getElementById('categories-list');
    const categories = this.getCategories();

    if (categoriesList) {
      categoriesList.innerHTML = categories.map(category => `
                <div class="category-item flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 flex items-center justify-center rounded-lg text-2xl"
                             style="background: linear-gradient(45deg, ${category.gradient.start}, ${category.gradient.end})">
                            ${category.icon}
                        </div>
                        <div>
                            <h3 class="font-semibold">
                                ${category.name}
                                ${category.isSubcategory ? 
                                  '<span class="ml-2 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 rounded-full">Subcategoria</span>' 
                                  : ''}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">${category.description}</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="action-buttons">
                            <button onclick="categoryManager.editCategory(${category.id})" class="btn-action btn-edit" title="Editar">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button onclick="categoryManager.deleteCategory(${category.id})" class="btn-action btn-delete" title="Remover">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                    </div>
                </div>
            `).join('');
    }
  }

  async editCategory(categoryId) {
    const categories = this.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) return;

    // Mostra o formulário
    const formContainer = document.getElementById('category-form-container');
    const showFormButton = document.getElementById('btn-show-form');
    
    // Primeiro, gera o formulário
    formContainer.innerHTML = this.generateForm();
    formContainer.classList.remove('hidden');
    showFormButton.classList.add('hidden');

    // Inicializa os componentes do formulário
    this.initializeForm();
    this.setupPreviewUpdates();
    this.setupEmojiPicker();
    this.setupColorInputs();
    this.setupCharacterCounters();

    // Agora preenche o formulário com os dados da categoria
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-icon').value = category.icon;
    document.getElementById('category-description').value = category.description;
    document.getElementById('gradient-start').value = category.gradient.start;
    document.getElementById('gradient-end').value = category.gradient.end;
    document.getElementById('gradient-start-hex').value = category.gradient.start;
    document.getElementById('gradient-end-hex').value = category.gradient.end;
    
    // Define o tipo de categoria
    const radioButtons = document.querySelectorAll('input[name="category-type"]');
    for (const radio of radioButtons) {
      radio.checked = (radio.value === 'sub') === category.isSubcategory;
    }

    // Atualiza preview
    this.updatePreview();

    // Muda o botão de submit para modo de edição
    const form = document.getElementById('category-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Salvar Alterações';
    submitBtn.classList.add('editing');

    // Adiciona o ID da categoria sendo editada ao formulário
    form.dataset.editingId = categoryId;

    // Scroll suave até o formulário
    formContainer.scrollIntoView({ behavior: 'smooth' });
  }

  async deleteCategory(categoryId) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      const categories = this.getCategories();
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);

      // Atualiza o localStorage
      localStorage.setItem('animuCategories', JSON.stringify(updatedCategories));

      // Recarrega a lista de categorias
      this.loadCategories();

      alert('Categoria excluída com sucesso!');
    } catch (error) {
      alert('Erro ao excluir categoria: ' + error.message);
    }
  }

  // Função para verificar se o usuário é admin
  checkAdminAccess() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (!session || !session.isAdmin) {
      alert('Acesso negado. Esta página é restrita a administradores.');
      window.location.href = 'inicio.html';
      return false;
    }
    return true;
  }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o usuário tem permissão de admin
  const manager = new CategoryManager();
  if (manager.checkAdminAccess()) {
    window.categoryManager = manager; // Torna acessível globalmente para os event handlers
  }
});