class Navbar {
  constructor() {
    this.navHTML = `
            <nav class="fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-50">
                <div class="container mx-auto px-4">
                    <div class="flex items-center justify-between h-16">
                        <!-- Menu Toggle -->
                        <button id="menu-toggle" class="menu-toggle-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                            </svg>
                        </button>

                        <!-- Logo -->
                        <div class="flex-shrink-0 ml-4">
                            <a href="inicio.html" class="text-2xl font-bold text-purple-600">Animu</a>
                        </div>

                        <!-- Barra de pesquisa -->
                        <div class="flex-1 max-w-xl mx-4" id="search-area">
                            <!-- Gerada via JavaScript -->
                        </div>

                        <!-- Área do usuário -->
                        <div class="flex items-center space-x-4">
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
                    <a href="inicio.html" class="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Início
                    </a>
                    <a href="animes.html?anime=all" class="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                        </svg>
                        Animes
                    </a>
                    <a href="categorias.html" class="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                        </svg>
                        Categorias
                    </a>
                    <a href="sobre.html" class="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        Sobre
                    </a>
                    <!-- Opções de Admin (inicialmente ocultas) -->
                    <div id="admin-options" class="hidden">
                        <div class="admin-section-divider">Administração</div>
                        <a href="./admin-usuarios.html" class="nav-link admin-link">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                            </svg>
                            Gerenciar Usuários
                        </a>
                        <a href="./admin-categorias.html" class="nav-link admin-link">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                            </svg>
                            Gerenciar Categorias
                        </a>
                        <a href="./admin-animes.html" class="nav-link admin-link">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z"/>
                            </svg>
                            Gerenciar Animes
                        </a>
                        <a href="./admin-noticias.html" class="nav-link admin-link">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-6h11v6zm0-8H4V6h11v4zm5 8h-4V6h4v12z"/>
                            </svg>
                            Gerenciar Notícias
                        </a>
                    </div>
                </div>
            </div>
            <div id="menu-overlay" class="menu-overlay"></div>
        `;
    this.lastScrollPosition = 0;
    this.isNavbarVisible = true;
  }

  // Remover o método getAdminPanel() pois não é mais necessário

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
    document.body.classList.add('has-navbar');
    
    // Destacar o link da página atual
    this.highlightCurrentPage();

    this.checkLoginStatus();
    this.initializeEvents();
    this.initScrollHandler();
    this.initSideMenu();
  }

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
            (currentPage === '' && href === 'inicio.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  initializeEvents() {
    // Remove a inicialização do menu admin daqui, pois agora está em initAdminMenu()
    // Mantém outros eventos que possam existir
  }

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

  initScrollHandler() {
    let ticking = false;
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Mostra navbar ao rolar para cima, esconde ao rolar para baixo
                if (currentScroll > this.lastScrollPosition && currentScroll > 100) {
                    // Rolando para baixo
                    navbar.classList.add('nav-hidden');
                } else {
                    // Rolando para cima
                    navbar.classList.remove('nav-hidden');
                }
                
                this.lastScrollPosition = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    });
  }

  initSideMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    menuToggle.addEventListener('click', () => {
      sideMenu.classList.toggle('open');
      menuOverlay.classList.toggle('show');
      document.body.classList.toggle('menu-open');
    });

    menuOverlay.addEventListener('click', () => {
      sideMenu.classList.remove('open');
      menuOverlay.classList.remove('show');
      document.body.classList.remove('menu-open');
    });
  }

  handleLogout(e) {
    e.preventDefault();
    // Alterado de 'user' para 'userSession'
    localStorage.removeItem('userSession');
    window.location.href = './signin.html';
  }
}

// Inicializar a navbar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  const navbar = new Navbar();
  navbar.init();
});