/**
 * p3.js - Script jQuery para interação com banco de dados MySQL
 * Prova P3 - Sistema CRUD com jQuery e AJAX
 */

$(document).ready(function () {
  // Variáveis globais
  let currentUserId = null;
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

  // Carregar os dados iniciais
  loadUsers();

  // Manipular o envio do formulário (criar ou atualizar)
  $('#userForm').on('submit', function (e) {
    e.preventDefault();

    const nome = $('#nome').val().trim();
    const email = $('#email').val().trim();

    if (!nome || !email) {
      showAlert('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    // Mostrar o indicador de carregamento
    showLoading(true);

    // Definir a ação com base na presença de um ID
    const action = currentUserId ? 'update' : 'create';

    // Dados para enviar via AJAX
    const data = {
      action: action,
      nome: nome,
      email: email
    };

    // Adicionar o ID se estiver atualizando
    if (currentUserId) {
      data.id = currentUserId;
    }

    // Enviar a solicitação AJAX
    $.ajax({
      url: 'p3db.php',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (response) {
        showLoading(false);

        if (response.status === 'success') {
          // Mostrar mensagem de sucesso
          showAlert(response.message, 'success');

          // Limpar o formulário
          resetForm();

          // Recarregar a lista de usuários
          loadUsers();
        } else {
          // Mostrar mensagem de erro
          showAlert(`Erro: ${response.message}`, 'danger');
        }
      },
      error: function (xhr, status, error) {
        showLoading(false);
        showAlert(`Erro de comunicação com o servidor: ${error}`, 'danger');
        console.error('Erro AJAX:', error);
      }
    });
  });

  // Botão de cancelar edição
  $('#cancelBtn').on('click', function () {
    resetForm();
  });

  // Botão de atualizar lista
  $('#refreshBtn').on('click', function () {
    loadUsers();
  });

  // Botão de confirmar exclusão no modal
  $('#confirmDelete').on('click', function () {
    if (currentUserId) {
      deleteUser(currentUserId);
      deleteModal.hide();
    }
  });

  // Delegação de eventos para botões de editar e excluir
  $('#userTableBody').on('click', '.edit-btn', function () {
    const userId = $(this).data('id');
    const userName = $(this).data('name');
    const userEmail = $(this).data('email');

    // Preencher o formulário com os dados do usuário
    $('#userId').val(userId);
    $('#nome').val(userName);
    $('#email').val(userEmail);

    // Atualizar o estado do formulário
    currentUserId = userId;
    $('#formTitle').text('Editar Usuário');
    $('#submitBtn').html('<i class="fas fa-edit"></i> Atualizar');
    $('#cancelBtn').show();

    // Rolar para o topo da página
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  $('#userTableBody').on('click', '.delete-btn', function () {
    currentUserId = $(this).data('id');
    deleteModal.show();
  });

  // Função para carregar a lista de usuários
  function loadUsers() {
    showLoading(true);

    $.ajax({
      url: 'p3db.php',
      type: 'POST',
      data: { action: 'read' },
      dataType: 'json',
      success: function (response) {
        showLoading(false);

        if (response.status === 'success') {
          renderUserTable(response.data);
        } else {
          showAlert('Erro ao carregar dados', 'danger');
        }
      },
      error: function (xhr, status, error) {
        showLoading(false);
        showAlert(`Erro de comunicação: ${error}`, 'danger');
        console.error('Erro AJAX:', error);
      }
    });
  }

  // Função para excluir um usuário
  function deleteUser(userId) {
    showLoading(true);

    $.ajax({
      url: 'p3db.php',
      type: 'POST',
      data: {
        action: 'delete',
        id: userId
      },
      dataType: 'json',
      success: function (response) {
        showLoading(false);

        if (response.status === 'success') {
          showAlert(response.message, 'success');
          loadUsers();
        } else {
          showAlert(`Erro: ${response.message}`, 'danger');
        }
      },
      error: function (xhr, status, error) {
        showLoading(false);
        showAlert(`Erro de comunicação: ${error}`, 'danger');
        console.error('Erro AJAX:', error);
      }
    });
  }

  // Função para renderizar a tabela de usuários
  function renderUserTable(users) {
    const tableBody = $('#userTableBody');
    tableBody.empty();

    if (users.length === 0) {
      $('#emptyMessage').show();
      return;
    }

    $('#emptyMessage').hide();

    // Adicionar cada usuário à tabela
    users.forEach(function (user) {
      const row = $('<tr>').addClass('fade-in');

      // Formatar a data
      const date = new Date(user.data_cadastro);
      const formattedDate = date.toLocaleDateString('pt-BR') + ' ' +
        date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });

      row.append(
        $('<td>').text(user.id),
        $('<td>').text(user.nome),
        $('<td>').text(user.email),
        $('<td>').text(formattedDate),
        $('<td>').append(
          $('<div>').addClass('btn-group').append(
            $('<button>')
              .addClass('btn btn-sm btn-outline-primary edit-btn')
              .attr('data-id', user.id)
              .attr('data-name', user.nome)
              .attr('data-email', user.email)
              .html('<i class="fas fa-edit"></i>'),
            $('<button>')
              .addClass('btn btn-sm btn-outline-danger delete-btn')
              .attr('data-id', user.id)
              .html('<i class="fas fa-trash"></i>')
          )
        )
      );

      tableBody.append(row);
    });
  }

  // Função para exibir alertas
  function showAlert(message, type) {
    const alert = $('<div>')
      .addClass(`alert alert-${type} alert-dismissible fade show`)
      .attr('role', 'alert')
      .html(`
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `);

    $('#alertArea').prepend(alert);

    // Auto-ocultar após 5 segundos
    setTimeout(function () {
      alert.alert('close');
    }, 5000);
  }

  // Função para mostrar/ocultar o indicador de carregamento
  function showLoading(show) {
    if (show) {
      $('#loading').fadeIn();
    } else {
      $('#loading').fadeOut();
    }
  }

  // Função para redefinir o formulário
  function resetForm() {
    $('#userForm')[0].reset();
    $('#userId').val('');
    currentUserId = null;
    $('#formTitle').text('Cadastrar Novo Usuário');
    $('#submitBtn').html('<i class="fas fa-save"></i> Salvar');
    $('#cancelBtn').hide();
  }
});