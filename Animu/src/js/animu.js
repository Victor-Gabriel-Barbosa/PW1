// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o botão de alternância de tema
  const themeToggle = document.querySelector('.toggle');
  const body = document.body; // Referência ao elemento <body>

  // Verifica no localStorage se existe um tema salvo anteriormente
  const savedTheme = localStorage.getItem('theme');

  // Aplica o tema salvo ou o tema padrão do sistema
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode'); // Adiciona a classe para o modo escuro no <body>
    themeToggle.classList.add('dark'); // Adiciona a classe "dark" ao botão de alternância
  }

  // Adiciona um ouvinte de evento ao botão de alternância de tema
  themeToggle.addEventListener('click', () => {
    // Alterna entre os temas adicionando ou removendo a classe "dark-mode" no <body>
    body.classList.toggle('dark-mode');

    // Alterna a aparência do botão adicionando ou removendo a classe "dark"
    themeToggle.classList.toggle('dark');

    // Salva a preferência de tema no localStorage
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark'); // Armazena "dark" como tema escolhido
    } else {
      localStorage.setItem('theme', 'light'); // Armazena "light" como tema escolhido
    }
  });

  // Seleciona os elementos do painel de administração e de usuário pelo ID
  const adminPanel = document.getElementById("admin-panel");
  const userPanel = document.getElementById("user-panel");

  // Obtém os dados da sessão
  const sessionData = JSON.parse(localStorage.getItem('userSession'));

  // Verifica se o usuário está logado e é admin
  if (sessionData && sessionData.isAdmin && adminPanel) {
    // Remove a classe "hidden" do painel de administração
    adminPanel.classList.remove("hidden");
  }
});