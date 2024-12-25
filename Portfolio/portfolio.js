document.addEventListener('DOMContentLoaded', () => {
  // Configuração do tema
  const themeButtons = {
    system: document.getElementById('theme-system'),
    light: document.getElementById('theme-light'),
    dark: document.getElementById('theme-dark')
  };

  // Carregar tema salvo ou usar padrão do sistema
  const savedTheme = localStorage.getItem('theme') || 'system';
  setTheme(savedTheme);

  // Adicionar eventos aos botões
  Object.entries(themeButtons).forEach(([theme, button]) => {
    button.addEventListener('click', () => setTheme(theme));
  });

  function setTheme(theme) {
    // Atualizar atributo do documento
    document.documentElement.setAttribute('data-theme', theme);
    
    // Salvar preferência
    localStorage.setItem('theme', theme);
    
    // Atualizar estado dos botões
    Object.entries(themeButtons).forEach(([t, button]) => {
      button.classList.toggle('active', t === theme);
    });
  }

  // Animação suave do scroll
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const section = document.querySelector(this.getAttribute('href'));
      section.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Adiciona classe active nos links do menu conforme scroll
  window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});