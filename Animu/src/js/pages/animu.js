// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  // Elementos do tema
  const themeToggle = document.querySelector('.toggle-theme');
  const body = document.body;

  // Restaura tema salvo ou usa padrão
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.classList.add('dark');
  }

  // Gerencia alternância de tema e persiste escolha
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('dark');
    
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });

  // Controle de visibilidade dos painéis baseado em permissões
  const adminPanel = document.getElementById("admin-panel");
  const userPanel = document.getElementById("user-panel");
  const sessionData = JSON.parse(localStorage.getItem('userSession'));

  if (sessionData?.isAdmin && adminPanel) {
    adminPanel.classList.remove("hidden");
  }

  // Gerenciamento do menu administrativo
  const adminButton = document.getElementById('admin-menu-button');
  const adminMenu = document.getElementById('admin-menu-items');

  if (adminButton && adminMenu) {
    // Controle do menu admin e animação do ícone
    adminButton.addEventListener('click', (e) => {
      e.stopPropagation();
      adminMenu.classList.toggle('hidden');

      const gearIcon = adminButton.querySelector('svg');
      gearIcon.classList.add('gear-spin');
      setTimeout(() => gearIcon.classList.remove('gear-spin'), 600);
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!adminMenu.contains(e.target) && !adminButton.contains(e.target)) {
        adminMenu.classList.add('hidden');
      }
    });
  }
});

// Função para obter o avatar do usuário
function getUserAvatar(username) {
  const users = JSON.parse(localStorage.getItem('animuUsers') || '[]');
  const user = users.find(u => u.username === username);
  return user ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8B5CF6&color=ffffff&size=100`;
}

// Atualiza interface do usuário na navbar
function updateUserInterface() {
  const sessionData = JSON.parse(localStorage.getItem('userSession'));
  if (sessionData) {
    const userPanel = document.getElementById('user-panel');
    const userNameSpan = document.getElementById('user-name');
    const userAvatar = userPanel?.querySelector('img');
    const logoutLink = document.getElementById('logout-link');

    if (userPanel && userNameSpan) {
      userNameSpan.innerHTML = `<a href="perfil.html" class="hover:text-purple-600 transition-colors">${sessionData.username}</a>`;
      if (userAvatar) {
        userAvatar.src = getUserAvatar(sessionData.username);
        userAvatar.style.cursor = 'pointer';
        userAvatar.onclick = () => window.location.href = 'perfil.html';
        userAvatar.title = 'Ver perfil';
      }
      if (logoutLink) {
        logoutLink.classList.remove('hidden');
      }
    }
  }
}

// Inicialização da página
window.addEventListener('DOMContentLoaded', () => {
  updateUserInterface();
});