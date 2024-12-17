document.addEventListener('DOMContentLoaded', () => {
  const botaoTema = document.getElementById('botao-tema');
  const imagemCelestial = document.getElementById('imagem-celestial');
  const body = document.body;
  const rootElement = document.documentElement;

  // Função para salvar o tema atual
  const salvarTema = (tema) => {
      localStorage.setItem('tema', tema);
  };

  // Função para carregar o tema salvo
  const carregarTema = () => {
      const temaSalvo = localStorage.getItem('tema');
      if (temaSalvo === 'escuro') {
          body.classList.add('tema-escuro');
          rootElement.classList.add('tema-escuro');
      }
  };

  // Evento de alternância de tema
  botaoTema.addEventListener('click', () => {
      body.classList.toggle('tema-escuro');
      rootElement.classList.toggle('tema-escuro');
      
      // Salvar o estado atual do tema
      if (body.classList.contains('tema-escuro')) {
          salvarTema('escuro');
      } else {
          salvarTema('claro');
      }

      if (imagemCelestial.src.includes('sol')) {
          imagemCelestial.src = 'lua.png';
          imagemCelestial.classList.add('animacao-transição');
      } else {
          imagemCelestial.src = 'sol.png';
          imagemCelestial.classList.remove('animacao-transição');
      }
      imagemCelestial.classList.toggle('animacao-transição');
  });

  // Carregar o tema salvo quando a página é carregada
  carregarTema();

  // Efeitos de interatividade
  document.querySelectorAll('button, a').forEach(el => {
      el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.03)';
      });
      el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
      });
  });

  // Selecionando os botões
  const botaoChatGPT = document.getElementById('botao-ChatGPT');
  const botaoGemini = document.getElementById('botao-Gemini');

  // Adicionando eventos de clique
  botaoChatGPT.addEventListener('click', () => {
      window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
  });

  botaoGemini.addEventListener('click', () => {
      window.open('https://gemini.google.com/app?hl=pt-BR', '_blank', 'noopener,noreferrer');
  });
});