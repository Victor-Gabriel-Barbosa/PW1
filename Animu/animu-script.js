// Seleciona o botão de alternância de tema e o elemento body
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Verifica no localStorage se o modo escuro está ativo
if (localStorage.getItem('dark-mode') === 'true') {
  // Ativa o modo escuro adicionando a classe ao body e ao botão
  body.classList.add('dark-mode');
  toggleButton.classList.add('dark');
}

// Adiciona um evento de clique ao botão de alternância
toggleButton.addEventListener('click', () => {
  // Alterna o modo escuro no body e no botão
  const isDarkMode = body.classList.toggle('dark-mode');
  toggleButton.classList.toggle('dark');
  // Salva o estado do modo escuro no localStorage
  localStorage.setItem('dark-mode', isDarkMode);
});

// Seleciona os elementos de painel de administração e de usuário
const userRole = "user"; 
const adminPanel = document.getElementById("admin-panel");
const userPanel = document.getElementById("user-panel");

// Remove a classe hidden dos painéis dependendo do papel do usuário
if (userRole === "admin") {
  // Exibe o painel de administração caso o usuário seja admin
  adminPanel.classList.remove("hidden");
} else if (userRole === "user") {
  // Exibe o painel de usuário caso contrário
  userPanel.classList.remove("hidden");
}