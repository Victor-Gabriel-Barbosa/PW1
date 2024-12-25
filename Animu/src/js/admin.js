// Verificar se o usuário é admin antes de permitir acesso à página
function checkAdminAccess() {
  const session = JSON.parse(localStorage.getItem('userSession'));
  if (!session || !session.isAdmin) {
    alert('Acesso negado. Esta página é restrita a administradores.');
    window.location.href = '../inicio.html';
    return false;
  }
  return true;
}

// Executar verificação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  if (!checkAdminAccess()) return;
  loadDataFromLocalStorage();
});