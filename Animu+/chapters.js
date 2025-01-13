// Obter ID do mangá da URL
const urlParams = new URLSearchParams(window.location.search);
const mangaId = urlParams.get('id');

// Carregar dados do mangá
const mangas = JSON.parse(localStorage.getItem('mangas')) || [];
const manga = mangas.find(m => m.id == mangaId);

if (!manga) {
    window.location.href = 'animu+.html';
}

// Inicializar interface
document.getElementById('mangaTitle').textContent = manga.title;
document.getElementById('mangaCover').src = manga.cover;

// Gerenciar capítulos
let chapters = JSON.parse(localStorage.getItem(`chapters_${mangaId}`)) || [];

function updateChaptersList() {
    const chaptersList = document.getElementById('chaptersList');
    chaptersList.innerHTML = chapters
        .sort((a, b) => b.number - a.number)
        .map(chapter => `
            <div class="chapter-card">
                <div class="chapter-info">
                    <h3>Capítulo ${chapter.number}: ${chapter.title}</h3>
                    <p>${chapter.images.length} páginas</p>
                </div>
                <div class="chapter-actions">
                    <button class="edit-btn" onclick="editChapter(${chapter.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteChapter(${chapter.id})">Excluir</button>
                    <button class="view-btn" onclick="viewChapter(${chapter.id})">Visualizar</button>
                </div>
            </div>
        `).join('');
}

// Gerenciar modal
const modal = document.getElementById('chapterModal');
const addChapterBtn = document.getElementById('addChapterBtn');
const closeBtn = document.querySelector('.close');
const chapterForm = document.getElementById('chapterForm');

// Sistema de upload de imagens
const uploadContainer = document.querySelector('.image-upload-container');
const imagePreview = document.getElementById('imagePreview');
let uploadedImages = [];

// Drag and drop para upload
uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.classList.add('dragover');
});

uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('dragover');
});

uploadContainer.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadContainer.classList.remove('dragover');
    const files = [...e.dataTransfer.files];
    await handleImageUpload(files);
});

document.getElementById('chapterImages').addEventListener('change', async (e) => {
    await handleImageUpload([...e.target.files]);
});

// Função para comprimir imagem
async function compressImage(base64String) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calcular novas dimensões mantendo proporção
            let width = img.width;
            let height = img.height;
            const maxSize = 1024; // Tamanho máximo em pixels
            
            if (width > height && width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            } else if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Desenhar imagem redimensionada
            ctx.drawImage(img, 0, 0, width, height);
            
            // Comprimir para JPEG com qualidade reduzida
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = base64String;
    });
}

// Função para gerenciar armazenamento
function manageStorage(key, data) {
    try {
        localStorage.setItem(key, data);
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            // Limpar dados antigos
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('chapters_')) {
                    keysToRemove.push(key);
                }
            }
            
            // Remover capítulos mais antigos primeiro
            if (keysToRemove.length > 0) {
                localStorage.removeItem(keysToRemove[0]);
                try {
                    localStorage.setItem(key, data);
                    return true;
                } catch (e) {
                    showMessage('Erro: Espaço insuficiente. Por favor, exclua alguns capítulos.', true);
                    return false;
                }
            }
        }
        showMessage('Erro ao salvar: ' + e.message, true);
        return false;
    }
    return true;
}

// Modificar a função handleImageUpload
async function handleImageUpload(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const maxFiles = 200; // Limite de arquivos
    
    if (uploadedImages.length + imageFiles.length > maxFiles) {
        showMessage(`Limite máximo de ${maxFiles} imagens excedido.`, true);
        return;
    }
    
    for (const file of imageFiles) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
            showMessage('Arquivo muito grande: ' + file.name, true);
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const compressedImage = await compressImage(e.target.result);
            uploadedImages.push({
                id: Date.now() + Math.random(),
                data: compressedImage
            });
            updateImagePreview();
        };
        reader.readAsDataURL(file);
    }
}

function updateImagePreview() {
    imagePreview.innerHTML = uploadedImages
        .map((img, index) => `
            <div class="preview-item" draggable="true" data-id="${img.id}">
                <img src="${img.data}" alt="Página ${index + 1}">
                <div class="preview-controls">
                    <span class="page-number">Página ${index + 1}</span>
                    <button class="remove-image" onclick="removeImage('${img.id}')">&times;</button>
                </div>
                <div class="drag-handle">⣿</div>
            </div>
        `).join('');
    
    setupDragAndDrop();
}

function removeImage(id) {
    uploadedImages = uploadedImages.filter(img => img.id != id);
    updateImagePreview();
}

function setupDragAndDrop() {
    const items = imagePreview.querySelectorAll('.preview-item');
    
    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    imagePreview.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(imagePreview, e.clientY);
        
        if (afterElement) {
            imagePreview.insertBefore(dragging, afterElement);
        } else {
            imagePreview.appendChild(dragging);
        }
        
        reorderImages();
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.preview-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function reorderImages() {
    const newOrder = [...imagePreview.querySelectorAll('.preview-item')]
        .map(item => uploadedImages.find(img => img.id == item.dataset.id));
    uploadedImages = newOrder;
}

// Preview de imagens
document.getElementById('chapterImages').addEventListener('change', function(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    [...e.target.files].forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML += `
                <img src="${e.target.result}" class="preview-image">
            `;
        };
        reader.readAsDataURL(file);
    });
});

// Salvar capítulo
chapterForm.onsubmit = async (e) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
        alert('Por favor, adicione pelo menos uma imagem ao capítulo');
        return;
    }
    
    const chapter = {
        id: document.getElementById('chapterId').value || Date.now(),
        number: parseFloat(document.getElementById('chapterNumber').value),
        title: document.getElementById('chapterTitle').value,
        images: uploadedImages.map(img => img.data)
    };
    
    const index = chapters.findIndex(c => c.id == chapter.id);
    if (index >= 0) {
        chapters[index] = chapter;
    } else {
        chapters.push(chapter);
    }
    
    // Tentar salvar com gerenciamento de armazenamento
    if (manageStorage(`chapters_${mangaId}`, JSON.stringify(chapters))) {
        updateChaptersList();
        modal.classList.remove('active');
        chapterForm.reset();
        document.getElementById('imagePreview').innerHTML = '';
        uploadedImages = [];
        showMessage('Capítulo salvo com sucesso!');
    }
};

function editChapter(id) {
    const chapter = chapters.find(c => c.id == id);
    if (chapter) {
        document.getElementById('chapterId').value = chapter.id;
        document.getElementById('chapterNumber').value = chapter.number;
        document.getElementById('chapterTitle').value = chapter.title;
        
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = chapter.images
            .map(img => `<img src="${img}" class="preview-image">`)
            .join('');
            
        modal.classList.add('active');
    }
}

function deleteChapter(id) {
    if (confirm('Tem certeza que deseja excluir este capítulo?')) {
        chapters = chapters.filter(c => c.id != id);
        localStorage.setItem(`chapters_${mangaId}`, JSON.stringify(chapters));
        updateChaptersList();
        showMessage('Capítulo excluído com sucesso!');
    }
}

function viewChapter(id) {
    window.location.href = `viewer.html?mangaId=${mangaId}&chapterId=${id}`;
}

// Event Listeners
addChapterBtn.onclick = () => {
    chapterForm.reset();
    document.getElementById('chapterId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    modal.classList.add('active');
    updateStorageInfo();
};

closeBtn.onclick = () => modal.classList.remove('active');

window.onclick = (e) => {
    if (e.target == modal) modal.classList.remove('active');
};

document.querySelector('.cancel-btn').addEventListener('click', () => {
    modal.classList.remove('active');
    chapterForm.reset();
    document.getElementById('imagePreview').innerHTML = '';
    uploadedImages = [];
    showMessage('Operação cancelada');
});

// Adicionar função para verificar espaço disponível
function getAvailableSpace() {
    const testKey = 'storage-test';
    let size = 0;
    try {
        while (true) {
            localStorage.setItem(testKey, new Array(size + 1024).join('a'));
            size += 1024;
        }
    } catch (e) {
        localStorage.removeItem(testKey);
        return size;
    }
}

// Adicionar informação de espaço ao modal
function updateStorageInfo() {
    const available = Math.round(getAvailableSpace() / 1024 / 1024);
    const storageInfo = document.createElement('div');
    storageInfo.className = 'storage-info';
    storageInfo.textContent = `Espaço disponível: aproximadamente ${available}MB`;
    document.querySelector('.image-upload-container').appendChild(storageInfo);
}

// Inicialização
updateChaptersList();
