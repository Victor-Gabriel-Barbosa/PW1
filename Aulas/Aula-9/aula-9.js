// Exibe os números de 1 a 10 em uma lista não ordenada
function exibirNumeros() {
  const resultado = document.getElementById('resultadoNumeros');
  resultado.innerHTML = '';
  const lista = document.createElement('ul');
  for (let i = 1; i <= 10; i++) {
    const item = document.createElement('li');
    item.textContent = i;
    lista.appendChild(item);
  }
  resultado.appendChild(lista);
}

// Exibe uma lista de frutas (usando um array)
function exibirFrutas() {
  const frutas = ['Maçã', 'Banana', 'Laranja', 'Uva', 'Pera'];
  const resultado = document.getElementById('resultadoFrutas');
  resultado.innerHTML = '';
  const lista = document.createElement('ol');
  for (let i = 0; i < frutas.length; i++) {
    const item = document.createElement('li');
    item.textContent = frutas[i];
    lista.appendChild(item);
  }
  resultado.appendChild(lista);
}

// Exibe uma mensagem com as propriedades de um objeto carro (marca, modelo, ano)
function exibirCarro() {
  const carro = {
    marca: 'Wolkswagen',
    modelo: 'Fusca',
    ano: 1970
  };

  const resultado = document.getElementById('resultadoCarro');
  resultado.innerHTML = '';
  const lista = document.createElement('p');
  lista.textContent = `Marca: ${carro.marca}, Modelo: ${carro.modelo}, Ano: ${carro.ano}`;
  resultado.appendChild(lista);
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

  if (isNaN(idade)) {
    alert('Por favor, insira uma idade válida!');
    return;
  }

  const pessoa = new Pessoa(nome, idade);
  const resultado = document.getElementById('resultadoPessoa');
  resultado.innerHTML = pessoa.exibirMensagem();
}