class Navbar {
  constructor() {
    this.navHTML = `
            <nav class="fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-50">
                <div class="container mx-auto px-4">
                    <div class="flex items-center justify-between h-16">
                        <!-- Logo -->
                        <div class="flex-shrink-0">
                            <a href="/" class="text-2xl font-bold text-purple-600">Animu</a>
                        </div>

                        <!-- Links de navegação principais -->
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-center space-x-4">
                                <a href="inicio.html" class="hover:text-purple-600 transition-colors font-medium">Início</a>
                                <a href="animes.html?anime=all" class="hover:text-purple-600 transition-colors font-medium">Animes</a>
                                <a href="categorias.html" class="hover:text-purple-600 transition-colors font-medium">Categorias</a>
                                <a href="sobre.html" class="hover:text-purple-600 transition-colors font-medium">Sobre</a>
                            </div>
                        </div>

                        <!-- Barra de pesquisa -->
                        <div class="flex-1 max-w-2xl mx-4" id="search-area">
                            <!-- Gerada via JavaScript -->
                        </div>

                        <!-- Área do usuário/admin -->
                        <div class="flex items-center space-x-4">
                            <!-- Painel do administrador -->
                            <div id="admin-panel" class="hidden relative">
                                ${this.getAdminPanel()}
                            </div>

                            <!-- Painel do usuário -->
                            <div id="user-panel" class="flex items-center top-0 left-0 p-2 rounded" style="width: fit-content;">
                                ${this.getUserPanel()}
                            </div>

                            <!-- Botão para alternância de tema claro/escuro -->
                            <div class="theme-toggle-container">
                                <button class="toggle-theme">
                                    <div class="clouds"></div>
                                    <div class="stars"><span><span></span></span></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
  }

  getAdminPanel() {
    return `
        <div class="admin-menu-container">
            <button id="admin-menu-button" class="p-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            <div id="admin-menu-items" class="admin-menu hidden">
                <a href="./usuarios.html" class="admin-menu-item">Usuários</a>
                <a href="./admin-categorias.html" class="admin-menu-item">Categorias</a>
                <a href="./admin-animes.html" class="admin-menu-item">Animes</a>
            </div>
        </div>
    `;
  }

  getUserPanel() {
    return `
            <img class="h-10 w-10 rounded-full object-cover" src="https://via.placeholder.com/100" alt="Avatar do Usuário" />
            <div class="flex flex-col ml-2">
                <span class="font-medium" id="user-name"><a href="./signin.html">Login</a></span>
                <a href="#" id="logout-link" class="text-sm text-purple-600 hover:text-purple-700 hidden">Sair</a>
            </div>
        `;
  }

  init() {
    // Inserir a navbar no início do body
    document.body.insertAdjacentHTML('afterbegin', this.navHTML);

    // Primeiro verificar o status de login para garantir que o painel admin seja mostrado se necessário
    this.checkLoginStatus();

    // Depois inicializar os eventos
    this.initializeEvents();
  }

  initializeEvents() {
    // Remove a inicialização do menu admin daqui, pois agora está em initAdminMenu()
    // Mantém outros eventos que possam existir
  }

  checkLoginStatus() {
    // Verificar se existe um usuário logado no localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      const userNameElement = document.getElementById('user-name');
      const logoutLink = document.getElementById('logout-link');
      const adminPanel = document.getElementById('admin-panel');

      if (userNameElement) {
        userNameElement.innerHTML = user.name;
      }

      if (logoutLink) {
        logoutLink.classList.remove('hidden');
        logoutLink.addEventListener('click', this.handleLogout);
      }

      // Mostrar painel admin se o usuário for admin
      if (adminPanel && user.isAdmin) {
        adminPanel.classList.remove('hidden');
        // Garantir que o menu admin seja inicializado após ser mostrado
        this.initAdminMenu();
      }
    }
  }

  initAdminMenu() {
    const adminButton = document.getElementById('admin-menu-button');
    const adminMenu = document.getElementById('admin-menu-items');

    if (adminButton && adminMenu) {
      // Adiciona manipulador de clique ao botão
      adminButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        adminMenu.classList.toggle('hidden');
      });

      // Fecha o menu ao clicar em qualquer lugar fora
      document.addEventListener('click', (e) => {
        if (!adminButton.contains(e.target) && !adminMenu.contains(e.target)) {
          adminMenu.classList.add('hidden');
        }
      });

      // Previne que cliques dentro do menu o fechem
      adminMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = './signin.html';
  }
}

// Inicializar a navbar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  const navbar = new Navbar();
  navbar.init();
});