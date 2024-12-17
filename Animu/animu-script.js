document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.toggle');
  const body = document.body;

  // Verifica a preferência salva no localStorage
  const savedTheme = localStorage.getItem('theme');
  
  // Aplica o tema salvo ou o tema padrão do sistema
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    // Alterna a classe de tema no body
    body.classList.toggle('dark-mode');
    
    // Alterna a classe do botão
    themeToggle.classList.toggle('dark');
    
    // Salva a preferência no localStorage
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
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