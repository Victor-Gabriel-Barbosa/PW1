<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema CRUD com jQuery e MySQL</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome para ícones -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    body {
      background-color: #f8f9fa;
      padding-top: 20px;
    }

    .container {
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .table-responsive {
      margin-top: 20px;
    }

    .fade-in {
      animation: fadeIn 0.5s;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    .loading {
      text-align: center;
      margin: 20px 0;
    }

    .alert {
      margin-top: 15px;
    }
  </style>
</head>

<body>
  <?php
  // Inicializar o banco de dados
  include 'p3db.php';
  setupDatabase();
  ?>

  <div class="container">
    <h1 class="mb-4 text-center">Sistema CRUD com jQuery e MySQL</h1>
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0" id="formTitle">Cadastrar Novo Usuário</h5>
          </div>
          <div class="card-body">
            <form id="userForm">
              <input type="hidden" id="userId" value="">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="nome" class="form-label">Nome</label>
                  <input type="text" class="form-control" id="nome" required>
                </div>
                <div class="col-md-6">
                  <label for="email" class="form-label">E-mail</label>
                  <input type="email" class="form-control" id="email" required>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-primary" id="submitBtn">
                  <i class="fas fa-save"></i> Salvar
                </button>
                <button type="button" class="btn btn-secondary" id="cancelBtn" style="display:none;">
                  <i class="fas fa-times"></i> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Alertas para feedback -->
        <div id="alertArea"></div>

        <!-- Área de carregamento -->
        <div class="loading" id="loading" style="display:none;">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando dados...</p>
        </div>

        <!-- Tabela de usuários -->
        <div class="card">
          <div class="card-header bg-dark text-white">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Lista de Usuários</h5>
              <button class="btn btn-sm btn-light" id="refreshBtn">
                <i class="fas fa-sync-alt"></i> Atualizar
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Data de Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody id="userTableBody">
                  <!-- Dados serão inseridos pelo jQuery -->
                </tbody>
              </table>
            </div>
            <div id="emptyMessage" class="text-center p-3" style="display:none;">
              <p class="text-muted">Nenhum usuário encontrado. Cadastre um novo usuário!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Informações do projeto -->
    <div class="mt-4 text-center">
      <p class="text-muted">Demonstração de jQuery com MySQL | Prova P3 - <?php echo date('Y'); ?></p>
    </div>
  </div>

  <!-- Modal de confirmação de exclusão -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">Confirmar Exclusão</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" id="confirmDelete">Excluir</button>
        </div>
      </div>
    </div>
  </div>

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <!-- Bootstrap JS com Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Arquivo de JavaScript personalizado -->
  <script src="p3.js"></script>
</body>

</html>