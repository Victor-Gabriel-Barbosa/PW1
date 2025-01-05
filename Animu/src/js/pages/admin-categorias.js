class CategoryManager {
  constructor() {
    this.initializeForm();
    this.loadCategories();
    this.setupPreviewUpdates();
    this.setupEmojiPicker();
    this.setupColorInputs();
    this.setupCharacterCounters();
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
                        <button onclick="categoryManager.editCategory(${category.id})"
                                class="edit-btn px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600">
                            Editar
                        </button>
                        <button onclick="categoryManager.deleteCategory(${category.id})"
                                class="delete-btn px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600">
                            Excluir
                        </button>
                    </div>
                </div>
            `).join('');
    }
  }

  async editCategory(categoryId) {
    const categories = this.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) return;

    // Preenche o formulário com os dados da categoria
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-icon').value = category.icon;
    document.getElementById('category-description').value = category.description;
    document.getElementById('gradient-start').value = category.gradient.start;
    document.getElementById('gradient-end').value = category.gradient.start;
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
    const submitBtn = document.querySelector('#category-form button[type="submit"]');
    submitBtn.textContent = 'Salvar Alterações';
    submitBtn.classList.add('editing');

    // Adiciona o ID da categoria sendo editada ao formulário
    document.getElementById('category-form').dataset.editingId = categoryId;

    // Scroll suave até o formulário
    document.querySelector('.admin-form-container').scrollIntoView({ behavior: 'smooth' });
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