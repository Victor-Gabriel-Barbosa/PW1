// Criar variável global para o gerenciador
let animeManager;

// Verificação de acesso
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Acesso negado! Você precisa ser um administrador para acessar esta página.');
        window.location.href = 'animu.html';
        return false;
    }
    return true;
}

class AnimeManager {
    constructor() {
        this.animes = JSON.parse(localStorage.getItem('animes')) || [];
        this.form = document.getElementById('animeForm');
        this.animesList = document.getElementById('animesList');
        this.setupEventListeners();
        this.renderAnimes();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAnime();
        });
    }

    addAnime() {
        const anime = {
            id: Date.now(),
            titulo: this.form.titulo.value,
            sinopse: this.form.sinopse.value,
            generos: this.form.generos.value.split(',').map(g => g.trim()),
            nota: parseFloat(this.form.nota.value),
            imagem: this.form.imagem.value,
            dataCadastro: new Date().toISOString()
        };

        this.animes.push(anime);
        this.saveAnimes();
        this.renderAnimes();
        this.form.reset();
        alert('Anime adicionado com sucesso!');
    }

    saveAnimes() {
        localStorage.setItem('animes', JSON.stringify(this.animes));
    }

    renderAnimes() {
        if (!this.animesList) return;
        
        this.animesList.innerHTML = this.animes.map(anime => `
            <div class="anime-card">
                <img src="${anime.imagem}" alt="${anime.titulo}" style="width: 100%; height: 150px; object-fit: cover;">
                <h3>${anime.titulo}</h3>
                <p>Nota: ${anime.nota}</p>
                <p>Gêneros: ${anime.generos.join(', ')}</p>
                <button onclick="animeManager.deleteAnime(${anime.id})" class="btn-delete">
                    Deletar
                </button>
            </div>
        `).join('');
    }

    deleteAnime(id) {
        if (confirm('Tem certeza que deseja deletar este anime?')) {
            this.animes = this.animes.filter(anime => anime.id !== id);
            this.saveAnimes();
            this.renderAnimes();
            alert('Anime deletado com sucesso!');
        }
    }
}

// Inicializar apenas se o acesso for permitido
if (checkAdminAccess()) {
    // Criar instância global
    animeManager = new AnimeManager();
    
    // Adicionar ao objeto window para garantir acesso global
    window.animeManager = animeManager;
}
