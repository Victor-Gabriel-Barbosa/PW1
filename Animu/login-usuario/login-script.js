document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Validações
    if (!validateForm()) {
      return;
    }

    // Criar objeto de usuário
    const newUser = {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    };

    // Verificar se usuário já existe
    const existingUsers = JSON.parse(localStorage.getItem('animuUsers') || '[]');

    const userExists = existingUsers.some(user =>
      user.username === newUser.username || user.email === newUser.email
    );

    if (userExists) {
      alert('Usuário ou e-mail já cadastrado!');
      return;
    }

    // Adicionar novo usuário
    existingUsers.push(newUser);
    localStorage.setItem('animuUsers', JSON.stringify(existingUsers));

    // Limpar formulário
    form.reset();

    // Redirecionar ou mostrar mensagem de sucesso
    alert('Conta criada com sucesso! Você será redirecionado para a página de login.');
    window.location.href = 'login.html'; // Assumindo que você tenha uma página de login
  });

  function validateForm() {
    // Validar nome de usuário
    if (usernameInput.value.length < 3) {
      alert('Nome de usuário deve ter pelo menos 3 caracteres.');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      alert('Por favor, insira um e-mail válido.');
      return false;
    }

    // Validar senha
    if (passwordInput.value.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres.');
      return false;
    }

    // Validar confirmação de senha
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('As senhas não coincidem.');
      return false;
    }

    return true;
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const rememberMeCheckbox = document.getElementById('remember-me');
  const forgotPasswordLink = document.getElementById('forgot-password');

  // Verificar se há credenciais salvas
  const savedUsername = localStorage.getItem('rememberedUsername');
  if (savedUsername) {
    usernameInput.value = savedUsername;
    rememberMeCheckbox.checked = true;
  }

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Verificar login
    const result = loginUser(username, password);

    if (result) {
      // Gerenciar opção "Lembrar de mim"
      if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      // Redirecionar para página principal
      window.location.href = '../animu-inicio.html';
    }
  });

  function loginUser(username, password) {
    const existingUsers = JSON.parse(localStorage.getItem('animuUsers') || '[]');

    const user = existingUsers.find(user =>
      user.username === username && user.password === password
    );

    if (user) {
      // Login bem-sucedido
      alert('Login bem-sucedido!');
      return true;
    } else {
      // Falha no login
      alert('Usuário ou senha incorretos.');
      return false;
    }
  }

  // Tratamento de recuperação de senha (placeholder)
  forgotPasswordLink.addEventListener('click', function (event) {
    event.preventDefault();
    alert('Funcionalidade de recuperação de senha ainda não implementada. Entre em contato com o suporte.');
  });
});