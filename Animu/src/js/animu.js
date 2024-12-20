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
});

// Gerenciamento de visibilidade de painéis baseado no papel do usuário
const userRole = "user";

// Seleciona os elementos do painel de administração e de usuário pelo ID
const adminPanel = document.getElementById("admin-panel");
const userPanel = document.getElementById("user-panel");

// Verifica o papel do usuário e ajusta a visibilidade dos painéis
if (userRole === "admin") {
  // Caso o usuário seja um administrador, remove a classe "hidden" do painel de administração
  adminPanel.classList.remove("hidden");
} else if (userRole === "user") {
  // Caso o usuário seja um usuário comum, remove a classe "hidden" do painel de usuário
  userPanel.classList.remove("hidden");
}