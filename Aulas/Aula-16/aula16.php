<?php
// Arquivo com as funções do banco de dados
require_once "aula16-db.php";

// Inicializa as variáveis
$id = 0;
$nome = "";
$telefone = "";
$endereco = "";
$experiencia = "";
$salario = "";
$modo = "inserir";
$mensagem = "";
$erro = "";

// Processa o formulário quando ele for enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Valida e processar os dados do formulário
  if (isset($_POST["acao"])) {
    $acao = $_POST["acao"];

    // Valida os dados de acordo com a ação
    if ($acao == "inserir" || $acao == "atualizar") {
      // Obter dados do formulário
      $nome = trim($_POST["nome"]);
      $telefone = trim($_POST["telefone"]);
      $endereco = trim($_POST["endereco"]);
      $experiencia = trim($_POST["experiencia"]);
      $salario = trim($_POST["salario"]);

      // Valida os campos do formulário
      if (empty($nome)) $erro = "O nome é obrigatório";
      elseif (empty($telefone)) $erro = "O telefone é obrigatório";
      // Validação para o número de telefone
      elseif (!preg_match('/^\(?\d{2}\)?[\s-]?9?\d{4}[-\s]?\d{4}$/', $telefone)) $erro = "Formato de telefone inválido. Use: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX";
      elseif (empty($endereco)) $erro = "O endereço é obrigatório";
      elseif (!is_numeric($experiencia) || $experiencia < 0) $erro = "A experiência deve ser um número positivo";
      elseif (!is_numeric($salario) || $salario <= 0) $erro = "O salário deve ser um número positivo";

      // Procede com a ação se não tiver erros
      if (empty($erro)) {
        // Formatar telefone para armazenamento padrão
        $telefone = preg_replace('/[^\d]/', '', $telefone);
        
        if ($acao == "inserir") {
          if (inserirColaborador($nome, $telefone, $endereco, $experiencia, $salario)) {
            $mensagem = "Colaborador adicionado com sucesso!";
            // Limpa os campos do formulário
            $nome = $telefone = $endereco = $experiencia = $salario = "";
          } else $erro = "Erro ao inserir colaborador: " . mysqli_error($conexao);
        } elseif ($acao == "atualizar") {
          $id = $_POST["id"];
          if (atualizarColaborador($id, $nome, $telefone, $endereco, $experiencia, $salario)) {
            $mensagem = "Colaborador atualizado com sucesso!";
            $modo = "inserir"; // Volta ao modo de inserção
            // Limpa os campos do formulário
            $id = 0;
            $nome = $telefone = $endereco = $experiencia = $salario = "";
          } else $erro = "Erro ao atualizar colaborador: " . mysqli_error($conexao);
        }
      }
    } elseif ($acao == "editar" && isset($_POST["id"])) {
      // Carrega os dados para edição
      $id = $_POST["id"];
      $colaborador = buscarColaboradorPorId($id);
      if ($colaborador) {
        $nome = $colaborador["nome"];
        $telefone = $colaborador["telefone"];
        $endereco = $colaborador["endereco"];
        $experiencia = $colaborador["experiencia"];
        $salario = $colaborador["salario"];
        $modo = "atualizar";
      }
    } elseif ($acao == "excluir" && isset($_POST["id"])) {
      // Exclui o colaborador
      $id = $_POST["id"];
      if (excluirColaborador($id)) $mensagem = "Colaborador excluído com sucesso!";
      else $erro = "Erro ao excluir colaborador: " . mysqli_error($conexao);
    }
  }
}

// Busca todos os colaboradores para exibir na tabela
$colaboradores = buscarColaboradores();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Gerenciamento de Colaboradores</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Ícones do Bootstrap -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
</head>

<body class="bg-light">
  <div class="container py-4">
    <h1 class="text-center mb-4">Sistema de Gerenciamento de Colaboradores</h1>

    <?php if (!empty($mensagem)): ?>
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <?php echo $mensagem; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
      </div>
    <?php endif; ?>

    <?php if (!empty($erro)): ?>
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <?php echo $erro; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
      </div>
    <?php endif; ?>

    <div class="card shadow-sm mb-4">
      <div class="card-header bg-primary text-white">
        <h2 class="h5 m-0"><?php echo ($modo == "inserir") ? "Adicionar Novo Colaborador" : "Editar Colaborador"; ?></h2>
      </div>
      <div class="card-body">
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
          <input type="hidden" name="id" va5lue="<?php echo $id; ?>">
          <input type="hidden" name="acao" value="<?php echo $modo; ?>">

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="nome" class="form-label">Nome Completo:</label>
              <input type="text" class="form-control" id="nome" name="nome" 
                     value="<?php echo htmlspecialchars($nome); ?>" 
                     placeholder="Ex: João da Silva" required>
            </div>

            <div class="col-md-6 mb-3">
              <label for="telefone" class="form-label">Número de Telefone:</label>
              <input type="text" class="form-control" id="telefone" name="telefone" 
                     value="<?php echo htmlspecialchars($telefone); ?>" 
                     placeholder="Ex: (11) 98765-4321" required>
              <div class="form-text">Formatos aceitos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX</div>
            </div>
          </div>

          <div class="mb-3">
            <label for="endereco" class="form-label">Endereço Residencial:</label>
            <input type="text" class="form-control" id="endereco" name="endereco" 
                   value="<?php echo htmlspecialchars($endereco); ?>" 
                   placeholder="Ex: Rua das Flores, 123 - Bairro, Cidade/UF" required>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="experiencia" class="form-label">Anos de Experiência em Programação:</label>
              <input type="number" class="form-control" id="experiencia" name="experiencia" min="0" 
                     value="<?php echo htmlspecialchars($experiencia); ?>" 
                     placeholder="Ex: 5" required>
            </div>

            <div class="col-md-6 mb-3">
              <label for="salario" class="form-label">Salário Mensal (R$):</label>
              <input type="number" class="form-control" id="salario" name="salario" min="0" step="0.01" 
                     value="<?php echo htmlspecialchars($salario); ?>" 
                     placeholder="Ex: 5000.00" required>
            </div>
          </div>

          <div class="d-flex mt-3">
            <button type="submit" class="btn btn-success me-2">
              <i class="bi bi-save me-1"></i>
              <?php echo ($modo == "inserir") ? "Adicionar Colaborador" : "Atualizar Colaborador"; ?>
            </button>

            <?php if ($modo == "atualizar"): ?>
              <a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" class="btn btn-secondary">
                <i class="bi bi-x-circle me-1"></i>
                Cancelar
              </a>
            <?php endif; ?>
          </div>
        </form>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h2 class="h5 m-0">Lista de Colaboradores</h2>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-light">
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Experiência (anos)</th>
                <th>Salário (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <?php if (mysqli_num_rows($colaboradores) > 0): ?>
                <?php while ($row = mysqli_fetch_assoc($colaboradores)): ?>
                  <tr>
                    <td><?php echo htmlspecialchars($row["nome"]); ?></td>
                    <td><?php echo htmlspecialchars($row["telefone"]); ?></td>
                    <td><?php echo htmlspecialchars($row["endereco"]); ?></td>
                    <td><?php echo htmlspecialchars($row["experiencia"]); ?></td>
                    <td>R$ <?php echo number_format($row["salario"], 2, ',', '.'); ?></td>
                    <td>
                      <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="d-inline">
                        <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
                        <button type="submit" name="acao" value="editar" class="btn btn-sm btn-primary">
                          <i class="bi bi-pencil"></i> Editar
                        </button>
                      </form>
                      <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="d-inline" 
                            onsubmit="return confirm('Tem certeza que deseja excluir este colaborador?');">
                        <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
                        <button type="submit" name="acao" value="excluir" class="btn btn-sm btn-danger">
                          <i class="bi bi-trash"></i> Excluir
                        </button>
                      </form>
                    </td>
                  </tr>
                <?php endwhile; ?>
              <?php else: ?>
                <tr>
                  <td colspan="6" class="text-center">Nenhum colaborador cadastrado.</td>
                </tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap JS Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  
  <!-- Script para formatação de telefone -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const telefoneInput = document.getElementById('telefone');
      
      telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
          // Formata o DDD
          formattedValue = '(' + value.substring(0, 2);
          
          if (value.length > 2) {
            formattedValue += ') ';
            
            // Verifica se é celular (9 dígitos) ou fixo (8 dígitos)
            if (value.length > 2) {
              // Se tiver o 9 na frente (celular)
              if (value.charAt(2) === '9') {
                if (value.length > 7) formattedValue += value.substring(2, 7) + '-' + value.substring(7, 11);
                else formattedValue += value.substring(2);
              } else {
                // Telefone fixo
                if (value.length > 6) formattedValue += value.substring(2, 6) + '-' + value.substring(6, 10);
                else formattedValue += value.substring(2);
              }
            }
          }
        }
        
        e.target.value = formattedValue;
      });
    });
  </script>
</body>

</html>