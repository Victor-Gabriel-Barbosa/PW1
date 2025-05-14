<?php
// Configurações da conexão com o banco de dados
$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "empresa_db";

// Estabelece a conexão com o MySQL
$conexao = mysqli_connect($host, $usuario, $senha);

// Verifica se a conexão foi estabelecida
if (!$conexao) die("Não foi possível conectar ao MySQL: " . mysqli_connect_error());

// Cria o banco de dados se não existir
$sql = "CREATE DATABASE IF NOT EXISTS $banco";
if (!mysqli_query($conexao, $sql)) die("Erro ao criar o banco de dados: " . mysqli_error($conexao));

// Seleciona o banco de dados
mysqli_select_db($conexao, $banco);

// Cria a tabela de colaboradores se não existir
$sql = "CREATE TABLE IF NOT EXISTS colaboradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  experiencia INT NOT NULL,
  salario DECIMAL(10,2) NOT NULL,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!mysqli_query($conexao, $sql)) die("Erro ao criar tabela: " . mysqli_error($conexao));

// Insere um novo colaborador no banco
function inserirColaborador($nome, $telefone, $endereco, $experiencia, $salario)
{
  global $conexao;
  $nome = mysqli_real_escape_string($conexao, $nome);
  $telefone = mysqli_real_escape_string($conexao, $telefone);
  $endereco = mysqli_real_escape_string($conexao, $endereco);
  $experiencia = (int)$experiencia;
  $salario = (float)$salario;

  $sql = "INSERT INTO colaboradores (nome, telefone, endereco, experiencia, salario) 
            VALUES ('$nome', '$telefone', '$endereco', $experiencia, $salario)";

  return mysqli_query($conexao, $sql);
}

// Busca todos os colaboradores
function buscarColaboradores()
{
  global $conexao;

  $sql = "SELECT * FROM colaboradores ORDER BY nome";
  $resultado = mysqli_query($conexao, $sql);

  return $resultado;
}

// Busca um colaborador pelo ID
function buscarColaboradorPorId($id)
{
  global $conexao;

  $id = (int)$id;
  $sql = "SELECT * FROM colaboradores WHERE id = $id";
  $resultado = mysqli_query($conexao, $sql);

  return mysqli_fetch_assoc($resultado);
}

// Atualiza um colaborador pelo ID
function atualizarColaborador($id, $nome, $telefone, $endereco, $experiencia, $salario)
{
  global $conexao;

  $id = (int)$id;
  $nome = mysqli_real_escape_string($conexao, $nome);
  $telefone = mysqli_real_escape_string($conexao, $telefone);
  $endereco = mysqli_real_escape_string($conexao, $endereco);
  $experiencia = (int)$experiencia;
  $salario = (float)$salario;

  $sql = "UPDATE colaboradores SET 
            nome = '$nome', 
            telefone = '$telefone', 
            endereco = '$endereco', 
            experiencia = $experiencia, 
            salario = $salario 
            WHERE id = $id";

  return mysqli_query($conexao, $sql);
}

// Exclui um colaborador pelo ID
function excluirColaborador($id)
{
  global $conexao;

  $id = (int)$id;
  $sql = "DELETE FROM colaboradores WHERE id = $id";

  return mysqli_query($conexao, $sql);
}