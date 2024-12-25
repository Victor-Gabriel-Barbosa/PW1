const reviews = [
    {
        titulo: "Attack on Titan",
        nota: 9.5,
        texto: "Uma obra-prima do anime moderno...",
        imagem: "aot.jpg"
    },
    // Mais reviews serão adicionados aqui
];

function criarCardReview(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <img src="images/${review.imagem}" alt="${review.titulo}">
        <h3>${review.titulo}</h3>
        <div class="nota">${review.nota}/10</div>
        <p>${review.texto}</p>
    `;
    return card;
}

function getPreferredTheme() {
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    // Verifica preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

class Auth {
    constructor() {
        this.modal = document.getElementById('authModal');
        this.loginBtn = document.getElementById('loginBtn');
        this.closeBtn = document.querySelector('.close');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.setupListeners();
        this.updateUIState();
    }

    setupListeners() {
        this.loginBtn.onclick = () => this.openModal();
        this.closeBtn.onclick = () => this.closeModal();
        window.onclick = (e) => {
            if (e.target === this.modal) this.closeModal();
        };

        this.tabBtns.forEach(btn => {
            btn.onclick = () => this.switchTab(btn.dataset.tab);
        });

        this.loginForm.onsubmit = (e) => this.handleLogin(e);
        this.registerForm.onsubmit = (e) => this.handleRegister(e);
        this.updateUIState();
    }

    updateUIState() {
        const loginBtn = document.getElementById('loginBtn');
        const adminMenuItem = document.getElementById('adminMenuItem');

        if (this.currentUser) {
            loginBtn.textContent = `Olá, ${this.currentUser.nome}`;
            loginBtn.onclick = () => this.logout();
            
            // Mostrar ou esconder botão admin baseado na role do usuário
            if (this.currentUser.role === 'admin') {
                adminMenuItem.classList.remove('hidden');
            } else {
                adminMenuItem.classList.add('hidden');
            }
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.onclick = () => this.openModal();
            adminMenuItem.classList.add('hidden');
        }
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    switchTab(tab) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        this.loginForm.classList.toggle('hidden', tab !== 'login');
        this.registerForm.classList.toggle('hidden', tab !== 'register');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.querySelector('[type="email"]').value;
        const senha = e.target.querySelector('[type="password"]').value;

        const user = this.users.find(u => u.email === email && u.senha === senha);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUIState();
            this.closeModal();
            alert('Login realizado com sucesso!');
        } else {
            alert('Email ou senha inválidos!');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const nome = e.target.querySelector('[placeholder="Nome"]').value;
        const email = e.target.querySelector('[type="email"]').value;
        const senha = e.target.querySelector('[placeholder="Senha"]').value;
        const confirmarSenha = e.target.querySelector('[placeholder="Confirmar Senha"]').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        if (this.users.some(u => u.email === email)) {
            alert('Este email já está cadastrado!');
            return;
        }

        const newUser = {
            id: Date.now(),
            nome,
            email,
            senha,
            role: 'user', // Usuário padrão
            dataCadastro: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        this.updateUIState();
        this.closeModal();
        alert('Cadastro realizado com sucesso!');
    }

    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUIState();
        alert('Logout realizado com sucesso!');
    }
}

function criarCardAnime(anime) {
    const comentarios = JSON.parse(localStorage.getItem(`comentarios_${anime.id}`)) || [];
    const mediaNotas = comentarios.length > 0 
        ? (comentarios.reduce((acc, c) => acc + c.nota, 0) / comentarios.length).toFixed(1)
        : anime.nota;

    const card = document.createElement('div');
    card.className = 'anime-card';
    card.innerHTML = `
        <img src="${anime.imagem}" alt="${anime.titulo}" class="anime-cover">
        <h3>${anime.titulo}</h3>
        <div class="anime-info">
            <span class="nota">⭐ ${mediaNotas}/10</span>
            <div class="generos">${anime.generos.join(', ')}</div>
        </div>
        <p class="sinopse">${anime.sinopse}</p>
        <button class="comentar-btn" onclick="toggleComentarios(${anime.id})">
            Comentários (${comentarios.length})
        </button>
        <div id="comentarios-${anime.id}" class="comentarios-section hidden">
            <div class="comentarios-lista">
                ${comentarios.map(c => `
                    <div class="comentario">
                        <strong>${c.usuario}</strong>
                        <span class="nota-comentario">⭐ ${c.nota}/10</span>
                        <p>${c.texto}</p>
                    </div>
                `).join('')}
            </div>
            ${localStorage.getItem('currentUser') ? `
                <form class="comentario-form" onsubmit="adicionarComentario(event, ${anime.id})">
                    <input type="number" name="nota" min="0" max="10" step="0.1" placeholder="Sua nota" required>
                    <textarea name="comentario" placeholder="Seu comentário" required></textarea>
                    <button type="submit">Enviar</button>
                </form>
            ` : '<p>Faça login para comentar</p>'}
        </div>
    `;
    return card;
}

function toggleComentarios(animeId) {
    const section = document.getElementById(`comentarios-${animeId}`);
    section.classList.toggle('hidden');
}

function adicionarComentario(event, animeId) {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Você precisa estar logado para comentar!');
        return;
    }

    const form = event.target;
    const comentario = {
        id: Date.now(),
        usuario: currentUser.nome,
        nota: parseFloat(form.nota.value),
        texto: form.comentario.value,
        data: new Date().toISOString()
    };

    const comentarios = JSON.parse(localStorage.getItem(`comentarios_${animeId}`)) || [];
    comentarios.push(comentario);
    localStorage.setItem(`comentarios_${animeId}`, JSON.stringify(comentarios));

    // Recarregar os cards para atualizar as médias e comentários
    const animes = JSON.parse(localStorage.getItem('animes')) || [];
    const seasonGrid = document.querySelector('.season-grid');
    seasonGrid.innerHTML = '';
    animes.forEach(anime => {
        seasonGrid.appendChild(criarCardAnime(anime));
    });

    alert('Comentário adicionado com sucesso!');
}

class Carousel {
    constructor() {
        this.container = document.querySelector('.carousel-container');
        this.grid = this.container.querySelector('.season-grid');
        this.prevBtn = this.container.querySelector('.prev');
        this.nextBtn = this.container.querySelector('.next');
        this.scrollAmount = 250 + 16; // largura do card + gap
        this.setupListeners();
    }

    setupListeners() {
        this.prevBtn.addEventListener('click', () => this.scroll('left'));
        this.nextBtn.addEventListener('click', () => this.scroll('right'));
        this.updateButtonStates();
        
        // Atualizar estados dos botões ao rolar
        this.grid.addEventListener('scroll', () => {
            this.updateButtonStates();
        });
    }

    scroll(direction) {
        const scrollLeft = this.grid.scrollLeft;
        const newScroll = direction === 'left' 
            ? scrollLeft - this.scrollAmount 
            : scrollLeft + this.scrollAmount;
        
        this.grid.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }

    updateButtonStates() {
        const { scrollLeft, scrollWidth, clientWidth } = this.grid;
        
        this.prevBtn.disabled = scrollLeft <= 0;
        this.nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const reviewGrid = document.querySelector('.review-grid');
    reviews.forEach(review => {
        reviewGrid.appendChild(criarCardReview(review));
    });

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = getPreferredTheme();
    
    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Listener para mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Carregar animes cadastrados
    const animes = JSON.parse(localStorage.getItem('animes')) || [];
    const seasonGrid = document.querySelector('.season-grid');
    
    if (animes.length > 0) {
        animes.forEach(anime => {
            seasonGrid.appendChild(criarCardAnime(anime));
        });
        new Carousel(); // Inicializar carrossel após adicionar os cards
    } else {
        seasonGrid.innerHTML = '<p>Nenhum anime cadastrado ainda.</p>';
    }

    // Adicionar mais funcionalidades conforme necessário
    const auth = new Auth();
});
