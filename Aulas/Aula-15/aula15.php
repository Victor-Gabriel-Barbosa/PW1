<!-- 1) Desenvolva um script em PHP que exiba uma lista
de notas e informe se cada aluno foi Aprovado ou
Reprovado. As notas dos alunos são fornecidas em
um array. O critério para aprovação é ter uma nota
maior ou igual a 60. A saída deve ser uma página
HTML que apresente os resultados de cada aluno,
informando a nota e o respectivo status de aprovação. -->

<!-- 2) Usando PHP, gere uma lista HTML (<ul>) que exiba
os números de 1 até 30, utilizando o loop for. -->

<!-- 3) Crie um array associativo em PHP que contenha
informações de três produtos (nome, preço e
quantidade). Em uma página HTML, exiba esses
produtos em formato de tabela (<table>), usando PHP
para iterar sobre o array. -->

<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aula 15 - PHP</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>

<body>
  <div class="container-fluid text-bg-dark py-4">
    <h1 class="text-center">PHP com HTML</h1>
  </div>

  <!-- Exercício [1] -->
  <div class="container-fluid text-bg-dark py-4">
    <h2 class="text-center">Exercício 1</h2>
  </div>
  <div class='text-center mt-4'>
    <?php
      $notas = [35, 77, 65, 49, 28, 95];
      foreach ($notas as $nota) echo "<span class='text-" . ($nota >= 60 ? "success'>Aprovado"  : "danger'>Reprovado") . " com nota: $nota</span><br>";
    ?>
  </div>

  <!-- Exercício [2] -->
  <div class="container-fluid text-bg-dark py-4 mt-4">
    <h2 class="text-center">Exercício 2</h2>
  </div>
  <ul class="text-center ps-0 mt-4" style="list-style-position: inside;">
    <?php
      for ($i = 0; $i < 30; $i++) echo "<li>" . $i + 1 . "</li>";
    ?>
  </u>

  <!-- Exercício [3] -->
  <div class="container-fluid text-bg-dark py-4 mt-4">
    <h2 class="text-center">Exercício 3</h2>
  </div>
  <table class="table table-striped table-hover table-dark">
    <?php
      $produtos = [
        ["nome" => "Chocolate", "preco" => 10.00, "quantidade" => 2],
        ["nome" => "Abacate", "preco" => 20.00, "quantidade" => 1],
        ["nome" => "Projetor", "preco" => 999999.99, "quantidade" => 1]
      ];

      echo "<tr><th>Nome</th><th>Preço</th><th>Quantidade</th></tr>";
      foreach ($produtos as $produto) {
        echo "<tr>";
        echo "<td>" . $produto["nome"] . "</td>";
        echo "<td>" . $produto["preco"] . "</td>";
        echo "<td>" . $produto["quantidade"] . "</td>";
        echo "</tr>";
      }
    ?>
  </table>
</body>

</html>