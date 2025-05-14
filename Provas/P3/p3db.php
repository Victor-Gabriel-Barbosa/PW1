<?php
// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "p3database";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexão
if ($conn->connect_error) {
  die("Falha na conexão: " . $conn->connect_error);
}

// Definir charset para UTF-8
$conn->set_charset("utf8");

// Função para processar as requisições AJAX
if (isset($_POST['action'])) {
  $action = $_POST['action'];

  switch ($action) {
    case 'create':
      createItem();
      break;
    case 'read':
      readItems();
      break;
    case 'update':
      updateItem();
      break;
    case 'delete':
      deleteItem();
      break;
    default:
      echo json_encode(['status' => 'error', 'message' => 'Ação inválida']);
  }
}

// Funções CRUD
function createItem()
{
  global $conn;

  $nome = $conn->real_escape_string($_POST['nome']);
  $email = $conn->real_escape_string($_POST['email']);

  $sql = "INSERT INTO usuarios (nome, email) VALUES ('$nome', '$email')";

  if ($conn->query($sql) === TRUE) {
    echo json_encode(['status' => 'success', 'message' => 'Usuário cadastrado com sucesso!']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao cadastrar: ' . $conn->error]);
  }
}

function readItems()
{
  global $conn;

  $sql = "SELECT * FROM usuarios ORDER BY id DESC";
  $result = $conn->query($sql);

  $items = [];
  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $items[] = $row;
    }
  }

  echo json_encode(['status' => 'success', 'data' => $items]);
}

function updateItem()
{
  global $conn;

  $id = (int)$_POST['id'];
  $nome = $conn->real_escape_string($_POST['nome']);
  $email = $conn->real_escape_string($_POST['email']);

  $sql = "UPDATE usuarios SET nome='$nome', email='$email' WHERE id=$id";

  if ($conn->query($sql) === TRUE) {
    echo json_encode(['status' => 'success', 'message' => 'Usuário atualizado com sucesso!']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar: ' . $conn->error]);
  }
}

function deleteItem()
{
  global $conn;

  $id = (int)$_POST['id'];

  $sql = "DELETE FROM usuarios WHERE id=$id";

  if ($conn->query($sql) === TRUE) {
    echo json_encode(['status' => 'success', 'message' => 'Usuário excluído com sucesso!']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir: ' . $conn->error]);
  }
}

// Criar a tabela se não existir (apenas para demonstração)
function setupDatabase()
{
  global $conn;

  // Criar o banco de dados se não existir
  $conn->query("CREATE DATABASE IF NOT EXISTS p3database");
  $conn->select_db("p3database");

  // Criar a tabela usuarios
  $sql = "CREATE TABLE IF NOT EXISTS usuarios (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

  return $conn->query($sql);
}

// Configurar o banco de dados quando o arquivo for acessado diretamente
if (basename($_SERVER['PHP_SELF']) == 'p3db.php') {
  if (setupDatabase()) {
    echo "Banco de dados configurado com sucesso!";
  } else {
    echo "Erro ao configurar o banco de dados: " . $conn->error;
  }
}
