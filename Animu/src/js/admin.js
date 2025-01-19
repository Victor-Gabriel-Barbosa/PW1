// Restringe acesso à área administrativa validando credenciais do usuário
function checkAdminAccess() {
  const session = JSON.parse(localStorage.getItem('userSession'));
  // Redireciona para página inicial se não for admin
  if (!session || !session.isAdmin) {
    alert('Acesso negado. Esta página é restrita a administradores.');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Inicialização da página administrativa
document.addEventListener('DOMContentLoaded', function () {
  // Verifica permissões apenas
  if (!checkAdminAccess()) return;
  
  // Se a página atual for edit-anime.html, carrega a lista de animes
  if (window.location.href.includes('edit-anime.html')) {
    loadAnimes(); // Esta função já existe em edit-anime.js
  }
});