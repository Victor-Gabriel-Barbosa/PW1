// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {
  // Classe de Gerenciamento de Autenticação
  class AuthManager {
    constructor() {
      this.users = this.loadUsers();
    }

    // Carregar usuários do localStorage
    loadUsers() {
      return JSON.parse(localStorage.getItem('animuUsers') || '[]');
    }

    // Salvar usuários no localStorage
    saveUsers() {
      localStorage.setItem('animuUsers', JSON.stringify(this.users));
    }

    // Validar registro de usuário
    validateRegistration(username, email, password, confirmPassword) {
      // Validações básicas
      if (username.length < 3) {
        throw new Error('Nome de usuário deve ter pelo menos 3 caracteres.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Por favor, insira um e-mail válido.');
      }

      if (password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres.');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem.');
      }

      // Verificar usuário ou e-mail existente
      const userExists = this.users.some(user =>
        user.username === username || user.email === email
      );

      if (userExists) {
        throw new Error('Usuário ou e-mail já cadastrado!');
      }
    }

    // Registro de usuário
    registerUser(username, email, password, confirmPassword) {
      try {
        // Validar registro
        this.validateRegistration(username, email, password, confirmPassword);

        // Criar novo usuário
        const newUser = {
          id: Date.now().toString(), // ID único
          username,
          email,
          password, // Em produção, use hash de senha
          isAdmin: false, // Por padrão, usuários não são admin
          createdAt: new Date().toISOString()
        };

        // Adicionar usuário
        this.users.push(newUser);
        this.saveUsers();

        return true;
      } catch (error) {
        alert(error.message);
        return false;
      }
    }

    // Login de usuário
    loginUser(username, password) {
      // Encontrar usuário
      const user = this.users.find(u =>
        u.username === username && u.password === password
      );

      if (user) {
        // Criar sessão
        const sessionData = {
          userId: user.id,
          username: user.username,
          isAdmin: user.isAdmin, // Adiciona status de admin à sessão
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('userSession', JSON.stringify(sessionData));
        return true;
      } else {
        alert('Usuário ou senha incorretos.');
        return false;
      }
    }

    // Atualizar painel de usuário
    updateUserPanel() {
      const userPanel = document.getElementById('user-panel');
      const userNameSpan = userPanel ? userPanel.querySelector('span') : null;
      const userAvatar = userPanel ? userPanel.querySelector('img') : null;

      // Verificar se há uma sessão ativa
      const sessionData = JSON.parse(localStorage.getItem('userSession'));

      if (sessionData && userPanel && userNameSpan) {
        // Encontrar usuário na lista de usuários
        const user = this.users.find(u => u.id === sessionData.userId);

        if (user) {
          // Mostrar painel de usuário
          userPanel.classList.remove('hidden');

          // Atualizar nome de usuário
          userNameSpan.textContent = user.username;

          // Gerar avatar único baseado no nome de usuário
          if (userAvatar) {
            userAvatar.src = this.generateAvatar(user.username);
          }

          return true;
        }
      }

      return false;
    }

    // Gerar avatar único baseado no nome de usuário
    generateAvatar(username) {
      // Gerar cor baseada no hash do nome de usuário
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Converter hash para cor
      const color = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

      // URL de placeholder colorido
      return `https://via.placeholder.com/100/${color}/FFFFFF?text=${username.charAt(0).toUpperCase()}`;
    }

    // Logout
    logout() {
      // Remover sessão
      localStorage.removeItem('userSession');

      // Recarrega a janela
      window.location.reload();
    }
  }

  // Inicializar AuthManager
  const authManager = new AuthManager();

  // Atualizar painel de usuário ao carregar página
  authManager.updateUserPanel();

  // Registro de usuário
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      const success = authManager.registerUser(
        username,
        email,
        password,
        confirmPassword
      );

      if (success) {
        alert('Conta criada com sucesso!');
        window.location.href = 'signin.html';
      }
    });
  }

  // Login de usuário
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const success = authManager.loginUser(username, password);

      if (success) {
        // Atualizar painel de usuário após login
        authManager.updateUserPanel();
        window.location.href = './inicio.html';
      }
    });
  }

  // Adicionar botão/link de logout (se existir)
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      authManager.logout();
    });
  }
});