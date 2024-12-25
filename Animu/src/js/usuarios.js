document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário atual é admin
    const sessionData = JSON.parse(localStorage.getItem('userSession'));
    if (!sessionData?.isAdmin) {
        window.location.href = 'inicio.html';
        return;
    }

    // Elementos DOM
    const searchInput = document.getElementById('search-user');
    const filterType = document.getElementById('filter-type');
    const tableBody = document.getElementById('users-table-body');
    const totalUsuarios = document.getElementById('total-usuarios');
    const totalAdmins = document.getElementById('total-admins');
    const novosUsuarios = document.getElementById('novos-usuarios');

    // Carregar usuários do localStorage
    function loadUsers() {
        try {
            return JSON.parse(localStorage.getItem('animuUsers')) || [];
        } catch (e) {
            console.error('Erro ao carregar usuários:', e);
            return [];
        }
    }

    // Salvar usuários no localStorage
    function saveUsers(users) {
        try {
            localStorage.setItem('animuUsers', JSON.stringify(users));
            updateTable(); // Atualiza a tabela após salvar
            updateStats(); // Atualiza as estatísticas
        } catch (e) {
            console.error('Erro ao salvar usuários:', e);
        }
    }

    // Formatar data
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    // Atualizar estatísticas
    function updateStats() {
        const users = loadUsers();
        const admins = users.filter(user => user.isAdmin);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsers = users.filter(user => new Date(user.createdAt) > sevenDaysAgo);

        totalUsuarios.textContent = users.length;
        totalAdmins.textContent = admins.length;
        novosUsuarios.textContent = newUsers.length;
    }

    // Gerar avatar único baseado no nome de usuário (mesma função do sign.js)
    function generateAvatar(username) {
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return `https://via.placeholder.com/40/${color}/FFFFFF?text=${username.charAt(0).toUpperCase()}`;
    }

    // Criar linha da tabela para um usuário (função atualizada)
    function createUserRow(user) {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-200 hover:bg-gray-50';
        
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img class="h-10 w-10 rounded-full object-cover"
                         src="${user.avatar || 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=' + user.username[0].toUpperCase()}"
                         alt="${user.username}">
                    <div class="ml-4">
                        <div class="font-medium">${user.username}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}">
                    ${user.isAdmin ? 'Admin' : 'Usuário'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">${formatDate(user.createdAt)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                    <button onclick="toggleAdminStatus('${user.id}')"
                            class="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors">
                        ${user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                    </button>
                    <button onclick="deleteUser('${user.id}')"
                            class="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                        Excluir
                    </button>
                </div>
            </td>
        `;
        return tr;
    }

    // Atualizar tabela de usuários
    function updateTable(filterValue = '', userType = 'all') {
        const users = loadUsers();
        tableBody.innerHTML = '';

        users
            .filter(user => {
                const matchesSearch = user.username.toLowerCase().includes(filterValue.toLowerCase()) ||
                                   user.email.toLowerCase().includes(filterValue.toLowerCase());
                const matchesType = userType === 'all' || 
                                  (userType === 'admin' && user.isAdmin) ||
                                  (userType === 'user' && !user.isAdmin);
                return matchesSearch && matchesType;
            })
            .forEach(user => {
                tableBody.appendChild(createUserRow(user));
            });
    }

    // Alternar status de administrador
    window.toggleAdminStatus = function(userId) {
        const users = loadUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
            user.isAdmin = !user.isAdmin;
            saveUsers(users);
        }
    };

    // Excluir usuário
    window.deleteUser = function(userId) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        const users = loadUsers();
        const updatedUsers = users.filter(u => u.id !== userId);
        saveUsers(updatedUsers);
    };

    // Event Listeners
    searchInput.addEventListener('input', () => {
        updateTable(searchInput.value, filterType.value);
    });

    filterType.addEventListener('change', () => {
        updateTable(searchInput.value, filterType.value);
    });

    // Inicialização
    updateTable();
    updateStats();
});
