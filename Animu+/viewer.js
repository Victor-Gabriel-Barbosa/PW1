const urlParams = new URLSearchParams(window.location.search);
const mangaId = urlParams.get('mangaId');
const chapterId = urlParams.get('chapterId');

// Elementos do DOM
const mangaPage = document.getElementById('mangaPage');
const pageCounter = document.getElementById('pageCounter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const backBtn = document.getElementById('backBtn');
const chapterTitleEl = document.getElementById('chapterTitle');

// Estado
let currentChapter = null;
let currentPageIndex = 0;

// Carregar dados do capítulo
function loadChapter() {
    const chapters = JSON.parse(localStorage.getItem(`chapters_${mangaId}`)) || [];
    currentChapter = chapters.find(c => c.id == chapterId);
    
    if (!currentChapter) {
        window.location.href = `chapters.html?id=${mangaId}`;
        return;
    }

    chapterTitleEl.textContent = `Capítulo ${currentChapter.number}: ${currentChapter.title}`;
    updatePage();
}

// Atualizar página atual
function updatePage() {
    if (!currentChapter) return;
    
    mangaPage.src = currentChapter.images[currentPageIndex];
    pageCounter.textContent = `Página ${currentPageIndex + 1} de ${currentChapter.images.length}`;
    
    prevPageBtn.disabled = currentPageIndex === 0;
    nextPageBtn.disabled = currentPageIndex === currentChapter.images.length - 1;
}

// Navegação
function nextPage() {
    if (currentPageIndex < currentChapter.images.length - 1) {
        currentPageIndex++;
        updatePage();
    }
}

function prevPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        updatePage();
    }
}

// Controles de teclado
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            nextPage();
            break;
        case 'ArrowLeft':
            prevPage();
            break;
        case 'f':
            toggleFullscreen();
            break;
    }
});

// Tela cheia
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.body.classList.add('fullscreen');
    } else {
        document.exitFullscreen();
        document.body.classList.remove('fullscreen');
    }
}

// Event Listeners
nextPageBtn.addEventListener('click', nextPage);
prevPageBtn.addEventListener('click', prevPage);
fullscreenBtn.addEventListener('click', toggleFullscreen);
backBtn.addEventListener('click', () => {
    window.location.href = `chapters.html?id=${mangaId}`;
});

// Clique na imagem para próxima página
mangaPage.addEventListener('click', (e) => {
    const clickX = e.offsetX;
    const width = e.target.offsetWidth;
    
    if (clickX > width / 2) {
        nextPage();
    } else {
        prevPage();
    }
});

// Inicialização
loadChapter();
