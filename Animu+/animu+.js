// Dados simulados
const featuredManga = [
    {
        title: "Solo Leveling",
        cover: "https://example.com/solo-leveling.jpg",
        rating: 4.9
    },
    {
        title: "One Piece",
        cover: "https://example.com/one-piece.jpg",
        rating: 4.8
    }
    // Adicione mais itens conforme necessário
];

// Armazenamento Local
let mangas = JSON.parse(localStorage.getItem('mangas')) || featuredManga;

// Função para criar cards de mangá
function createMangaCard(manga) {
    return `
        <div class="manga-card" data-id="${manga.id}">
            <img src="${manga.cover}" alt="${manga.title}" onerror="this.src='https://via.placeholder.com/200x280?text=Sem+Imagem'">
            <div class="manga-info">
                <h3>${manga.title}</h3>
                <p>⭐ ${manga.rating}</p>
                <div class="manga-actions">
                    <button class="edit-btn" onclick="editManga(${manga.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteManga(${manga.id})">Excluir</button>
                    <button class="chapters-btn" onclick="window.location.href='chapters.html?id=${manga.id}'">Capítulos</button>
                </div>
            </div>
        </div>
    `;
}

// Populate featured slider
document.querySelector('.slider-content').innerHTML = 
    mangas.slice(0, 3).map(manga => createMangaCard(manga)).join('');

// Populate popular and latest sections
document.querySelectorAll('.manga-grid').forEach(grid => {
    grid.innerHTML = mangas.map(manga => createMangaCard(manga)).join('');
});

// Implementar busca
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMangas = mangas.filter(manga => 
        manga.title.toLowerCase().includes(searchTerm)
    );
    
    document.querySelectorAll('.manga-grid').forEach(grid => {
        grid.innerHTML = filteredMangas.map(manga => createMangaCard(manga)).join('');
    });
});

// Gerenciamento do Modal
const modal = document.getElementById('mangaModal');
const addMangaBtn = document.getElementById('addMangaBtn');
const closeBtn = document.querySelector('.close');
const mangaForm = document.getElementById('mangaForm');

// Funções de Gerenciamento
function saveManga(manga) {
    if (manga.id) {
        // Editar mangá existente
        mangas = mangas.map(m => m.id === manga.id ? manga : m);
    } else {
        // Adicionar novo mangá
        manga.id = Date.now();
        mangas.unshift(manga);
    }
    localStorage.setItem('mangas', JSON.stringify(mangas));
    updateDisplay();
}

function deleteManga(id) {
    const manga = mangas.find(m => m.id === id);
    if (manga && confirm(`Tem certeza que deseja excluir "${manga.title}"?`)) {
        mangas = mangas.filter(m => m.id !== id);
        localStorage.setItem('mangas', JSON.stringify(mangas));
        updateDisplay();
        showMessage('Mangá excluído com sucesso!');
    }
}

function editManga(id) {
    const manga = mangas.find(m => m.id === id);
    if (manga) {
        document.getElementById('modalTitle').textContent = 'Editar Mangá';
        document.getElementById('mangaId').value = manga.id;
        document.getElementById('title').value = manga.title;
        document.getElementById('cover').value = manga.cover;
        document.getElementById('rating').value = manga.rating;
        modal.classList.add('active');
    }
}

function updateDisplay() {
    document.querySelector('.slider-content').innerHTML = 
        mangas.slice(0, 3).map(manga => createMangaCard(manga)).join('');
    
    document.querySelectorAll('.manga-grid').forEach(grid => {
        grid.innerHTML = mangas.map(manga => createMangaCard(manga)).join('');
    });
}

// Event Listeners
addMangaBtn.onclick = () => {
    document.getElementById('modalTitle').textContent = 'Adicionar Novo Mangá';
    mangaForm.reset();
    document.getElementById('mangaId').value = '';
    modal.classList.add('active');
};

closeBtn.onclick = () => {
    modal.classList.remove('active');
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.classList.remove('active');
    }
};

document.querySelector('.cancel-btn').addEventListener('click', () => {
    modal.classList.remove('active');
    mangaForm.reset();
    showMessage('Operação cancelada');
});

mangaForm.onsubmit = (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const cover = document.getElementById('cover').value.trim();
    const rating = parseFloat(document.getElementById('rating').value);
    
    if (!title || title.length < 2) {
        alert('O título deve ter pelo menos 2 caracteres');
        return;
    }
    
    if (!cover.startsWith('http')) {
        alert('Por favor, insira uma URL válida para a capa');
        return;
    }
    
    if (rating < 0 || rating > 5) {
        alert('A avaliação deve estar entre 0 e 5');
        return;
    }
    
    const manga = {
        id: document.getElementById('mangaId').value || Date.now(),
        title,
        cover,
        rating
    };
    
    saveManga(manga);
    modal.style.display = 'none';
    mangaForm.reset();
    
    // Feedback visual
    showMessage('Mangá salvo com sucesso!');
};

// Adicionar função para feedback visual
function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Inicialização
updateDisplay();
