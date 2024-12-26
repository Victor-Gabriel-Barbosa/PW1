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
        const avatar = this.generateAvatar(user.username);
        // Criar sessão
        const sessionData = {
          userId: user.id,
          username: user.username,
          isAdmin: user.isAdmin, // Adiciona status de admin à sessão
          avatar: avatar, // Salva o avatar na sessão
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
      const userNameSpan = document.getElementById('user-name');
      const userAvatar = userPanel ? userPanel.querySelector('img') : null;
      const logoutLink = document.getElementById('logout-link');

      // Verificar se há uma sessão ativa
      const sessionData = JSON.parse(localStorage.getItem('userSession'));

      if (sessionData && userPanel) {
        // Encontrar usuário na lista de usuários
        const user = this.users.find(u => u.id === sessionData.userId);

        if (user) {
          // Mostrar painel de usuário
          userPanel.classList.remove('hidden');

          // Atualizar nome de usuário com link para o perfil
          userNameSpan.innerHTML = `<a href="profile.html" class="hover:text-purple-600 transition-colors">${user.username}</a>`;

          // Mostrar link de logout
          logoutLink.classList.remove('hidden');

          // Usar o avatar da sessão e adicionar link para o perfil
          if (userAvatar) {
            userAvatar.src = sessionData.avatar;
            userAvatar.style.cursor = 'pointer';
            userAvatar.onclick = () => window.location.href = 'profile.html';
            userAvatar.title = 'Ver perfil';
          }

          return true;
        }
      } else if (userNameSpan) {
        // Se não houver sessão, mostrar link de login e esconder logout
        userNameSpan.innerHTML = '<a href="./login/signin.html">Login</a>';
        if (logoutLink) {
          logoutLink.classList.add('hidden');
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

      // Gerar uma cor mais agradável usando HSL
      const hue = hash % 360;
      const saturation = 70; // Fixo em 70% para cores não muito saturadas
      const lightness = 60;  // Fixo em 60% para cores não muito claras ou escuras

      // Converter HSL para HEX
      const color = this.hslToHex(hue, saturation, lightness);

      // Retorna URL do avatar usando a cor gerada
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${color.substring(1)}&color=ffffff&size=100`;
    }

    // Função auxiliar para converter HSL para HEX
    hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
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
        window.location.href = '../inicio.html';
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