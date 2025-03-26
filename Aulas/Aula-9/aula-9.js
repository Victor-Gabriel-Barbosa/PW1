// Exibe os números de 1 a 10 em uma lista não ordenada
function exibirNumeros() {
  const resultado = document.getElementById('resultadoNumeros');

  let html = '<ul>';
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  numeros.forEach(numero => { html += `<li>${numero}</li>`; })
  html += '</ul>';
  
  resultado.innerHTML = html;
}

// Exibe uma lista de frutas (usando um array)
function exibirFrutas() {
  const resultado = document.getElementById('resultadoFrutas');

  let html = '<ol>';
  const frutas = ['Maçã', 'Banana', 'Laranja', 'Uva', 'Pera'];
  frutas.forEach(fruta => { html += `<li>${fruta}</li>`; })
  html += '</ol>';

  resultado.innerHTML = html;
}

// Exibe uma mensagem com as propriedades de um objeto carro (marca, modelo, ano)
function exibirCarro() {
  const resultado = document.getElementById('resultadoCarro');

  const carro = {
    marca: 'Wolkswagen',
    modelo: 'Fusca',
    ano: 1970
  };

  let html = '<p>';
  html += `Marca: ${carro.marca}, Modelo: ${carro.modelo}, Ano: ${carro.ano}`;
  html += '</p>';

  resultado.innerHTML = html;
}

// Classe para representar uma pessoa
class Pessoa {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }

  exibirMensagem() {
    return `Nome: ${this.nome}, Idade: ${this.idade}`;
  }
}

// Cria um objeto pessoa com nome e idade, e exibe uma mensagem
function criarPessoa() {
  const nome = document.getElementById('nome').value;
  const idade = parseInt(document.getElementById('idade').value);

  const pessoa = new Pessoa(nome, idade); 
  document.getElementById('resultadoPessoa').innerHTML = pessoa.exibirMensagem();
}