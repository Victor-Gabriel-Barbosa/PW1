class Navbar {
  constructor() {
    // Template HTML principal da navbar com menu lateral e painel de usuário
    this.navHTML = `
      <!-- Menu Container -->
      <div class="nav-menu-container">
        <!-- Menu Toggle Button -->
        <button id="menu-toggle" class="menu-toggle-btn" title="Alternar Menu de Navegação">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        
        <!-- Logo -->
        <div class="logo-container">
          <a href="index.html" class="text-2xl font-bold text-purple-600">Animu</a>
        </div>
      </div>

      <nav class="fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-50">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <!-- Espaço reservado para o menu e logo -->
            <div class="w-48"></div>

            <!-- Barra de pesquisa -->
            <div class="flex-1 max-w-xl mx-4" id="search-area">
              <!-- Gerada via JavaScript -->
            </div>

            <!-- Área do usuário -->
            <div class="flex items-center space-x-4">
              <!-- Botão para esconder/mostrar navbar -->
              <button id="toggle-navbar" class="nav-toggle-btn" title="Esconder/Mostrar Barra de Navegação">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" class="nav-toggle-icon">
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                </svg>
              </button>

              <!-- Painel do usuário -->
              <div id="user-panel" class="flex items-center">
                ${this.getUserPanel()}
              </div>

              <!-- Botão para alternância de tema claro/escuro -->
              <div class="theme-toggle-container">
                <button class="toggle-theme">
                  <div class="clouds"></div>
                  <div class="stars"><span><span></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Menu Lateral -->
      <div id="side-menu" class="side-menu">
        <div class="side-menu-content">
          <a href="index.html" class="nav-link" title="Ir para página inicial">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Início</span>
          </a>
          <a href="animes.html" class="nav-link" title="Ver lista de animes">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
            <span>Animes</span>
          </a>
          <a href="recommendation.html" class="nav-link" title="Ver recomendações de animes">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span>Recomendações</span>
          </a>
          <a href="news.html" class="nav-link" title="Ver notícias sobre animes">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-6h11v6zm0-8H4V6h11v4zm5 8h-4V6h4v12z"/>
            </svg>
            <span>Notícias</span>
          </a>
          <a href="profile.html" class="nav-link" title="Acessar perfil do usuário">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Perfil</span>
          </a>
          <a href="category.html" class="nav-link" title="Explorar categorias de animes">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
            <span>Categorias</span>
          </a>
          <a href="about.html" class="nav-link" title="Informações sobre o site">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span>Sobre</span>
          </a>
          <!-- Opções de Admin (inicialmente ocultas) -->
          <div id="admin-options" class="hidden">
            <div class="admin-section-divider">Administração</div>
            <a href="./admin-users.html" class="nav-link admin-link" title="Gerenciar usuários do sistema">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              <span>Gerenciar Usuários</span>
            </a>
            <a href="./admin-category.html" class="nav-link admin-link" title="Gerenciar categorias de animes">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
              <span>Gerenciar Categorias</span>
            </a>
            <a href="./admin-animes.html" class="nav-link admin-link" title="Gerenciar catálogo de animes">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z"/>
              </svg>
              <span>Gerenciar Animes</span>
            </a>
            <a href="./admin-news.html" class="nav-link admin-link" title="Gerenciar notícias do site">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-6h11v6zm0-8H4V6h11v4zm5 8h-4V6h4v12z"/>
              </svg>
              <span>Gerenciar Notícias</span>
            </a>
          </div>
        </div>
      </div>
      <div id="menu-overlay" class="menu-overlay"></div>
    `;
    this.lastScrollPosition = 0;
    this.isNavbarVisible = true;
  }

  // Gera o painel do usuário com avatar e opções de login/logout
  getUserPanel() {
    return `
      <img class="h-10 w-10 rounded-full object-cover" src="https://ui-avatars.com/api/?name=User&background=random" alt="Avatar do Usuário" />
      <div class="flex flex-col ml-2">
        <span class="font-medium" id="user-name"><a href="./signin.html">Login</a></span>
        <a href="#" id="logout-link" class="text-sm text-purple-600 hover:text-purple-700 hidden">Sair</a>
      </div>
    `;
  }

  // Inicializa todos os componentes da navbar
  init() {
    // Insere a navbar no início do body
    document.body.insertAdjacentHTML('afterbegin', this.navHTML);
    document.body.classList.add('has-navbar');

    // Destaca o link da página atual
    this.highlightCurrentPage();

    this.checkLoginStatus();
    this.initScrollHandler();
    this.initSideMenu();
  }

  // Marca o link ativo baseado na URL atual, tratando páginas normais e admin
  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop().split('?')[0]; // Ignora parâmetros após o .html

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href').split('?')[0]; // Ignora parâmetros do href também
      const isAdminPage = currentPage.startsWith('admin-');
      const isAdminLink = href.startsWith('./admin-');

      // Verifica se é uma página de administração
      if (isAdminPage && isAdminLink) {
        // Remove o './' do início do href para comparação
        const cleanHref = href.replace('./', '');
        if (currentPage === cleanHref) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
      // Verifica páginas normais
      else if (!isAdminPage && !isAdminLink) {
        if (currentPage === href ||
          (currentPage.includes('anime') && href === 'animes.html') ||
          (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // Verifica status de login e configura interface de acordo com permissões
  checkLoginStatus() {
    // Alterado de 'user' para 'userSession'
    const userSession = JSON.parse(localStorage.getItem('userSession'));

    if (userSession) {
      const userNameElement = document.getElementById('user-name');
      const logoutLink = document.getElementById('logout-link');
      const adminOptions = document.getElementById('admin-options');

      if (userNameElement) {
        userNameElement.innerHTML = userSession.username;  // Alterado de 'name' para 'username'
      }

      if (logoutLink) {
        logoutLink.classList.remove('hidden');
        logoutLink.addEventListener('click', this.handleLogout);
      }

      // Mostrar opções de admin no menu lateral se o usuário for admin
      if (adminOptions && userSession.isAdmin) {
        console.log('Usuário é admin, mostrando opções de admin');
        adminOptions.classList.remove('hidden');
        // Adicionar classe específica para links de admin
        const adminLinks = adminOptions.querySelectorAll('.nav-link');
        adminLinks.forEach(link => {
          link.classList.add('admin-link');
        });
      }
    }
  }

  // Gerencia o menu de administração dropdown
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

  // Controla a visibilidade da navbar durante scroll e salva estado
  initScrollHandler() {
    // Removendo o manipulador de scroll antigo
    const navToggle = document.getElementById('toggle-navbar');
    const navbar = document.querySelector('nav');

    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('nav-hidden');
      navToggle.classList.toggle('rotated');

      // Salvar estado da navbar no localStorage
      const isHidden = navbar.classList.contains('nav-hidden');
      localStorage.setItem('navbarState', isHidden ? 'hidden' : 'visible');
    });

    // Restaurar estado da navbar
    const savedState = localStorage.getItem('navbarState');
    if (savedState === 'hidden') {
      navbar.classList.add('nav-hidden');
      navToggle.classList.add('rotated');
    }
  }

  // Gerencia estados e eventos do menu lateral, incluindo persistência
  initSideMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    // Verifica o estado do menu ao carregar a página
    const menuState = localStorage.getItem('sideMenuState');
    if (menuState === 'open') {
      sideMenu.classList.add('open');
      menuOverlay.classList.add('show');
      document.body.classList.add('menu-open');
    }

    menuToggle.addEventListener('click', () => {
      sideMenu.classList.toggle('open');
      menuOverlay.classList.toggle('show');
      document.body.classList.toggle('menu-open');

      // Salva o estado do menu
      const isOpen = sideMenu.classList.contains('open');
      localStorage.setItem('sideMenuState', isOpen ? 'open' : 'closed');
    });

    menuOverlay.addEventListener('click', () => {
      sideMenu.classList.remove('open');
      menuOverlay.classList.remove('show');
      document.body.classList.remove('menu-open');
      // Atualiza o estado quando fecha pelo overlay
      localStorage.setItem('sideMenuState', 'closed');
    });
  }

  // Limpa sessão e redireciona para login
  handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('userSession');
    window.location.href = './signin.html';
  }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const navbar = new Navbar();
  navbar.init();
});