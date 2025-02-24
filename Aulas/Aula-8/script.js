function calcular() {
  const num1 = parseFloat(document.getElementById('num1').value);
  const num2 = parseFloat(document.getElementById('num2').value);
  const op = document.getElementById('operacao').value;

  let resultado;
  switch (op) {
    case '+':
      resultado = num1 + num2;
      break;
    case '-':
      resultado = num1 - num2;
      break;
    case '*':
      resultado = num1 * num2;
      break;
    case '/':
      if (num2 === 0) {
        alert('Erro: Divisão por zero');
        return;
      }
      resultado = num1 / num2;
      break;
    default:
      alert('Error: Operador inválido');
      return;
    }
    document.getElementById('resultado').textContent = `O resultado é: ${resultado}`;
}

let idades = [];
let pesos = [];

function calcularMedia() {
  const idade = parseInt(document.getElementById('idade').value);
  const peso = parseFloat(document.getElementById('peso').value);

  if (isNaN(idade) || isNaN(peso)) {
    alert('Por favor, insira valores válidos.');
    return;
  }

  if (idade < 1 || idade > 150) {
    alert('Por favor, insira uma idade válida entre 1 e 150 anos.');
    return;
  }

  if (peso < 1 || peso > 500) {
    alert('Por favor, insira um peso válido entre 1 e 500 kg.');
    return;
  }

  pesos.push(peso);
  idades.push(idade);
  const media = pesos.reduce((a, b) => a + b, 0) / pesos.length;
  const mediaIdade = idades.reduce((a, b) => a + b, 0) / idades.length;
  document.getElementById('media').textContent = `A média das idades é: ${mediaIdade}. A média dos pesos é: ${media}`;

  document.getElementById('idade').value = '';
  document.getElementById('peso').value = '';
  document.getElementById('idade').focus();
  document.getElementById('peso').focus();
  document.getElementById('idade').select();
}

function verificarPessoa() {
  const nome = document.getElementById('nome').value;
  const idade = parseInt(document.getElementById('idade2').value);
  const altura = parseFloat(document.getElementById('altura').value);

  if (isNaN(idade) || isNaN(altura)) {
    alert('Por favor, insira valores válidos.');
    return;
  }

  let pessoa;
  if (idade > 18 && idade < 35 && altura > 1.86) pessoa = nome;
  else pessoa = idade + " " + altura;

  document.getElementById('pessoa').textContent = `Resultado: ${pessoa}`;
}

let temperaturas = [];

function calcularTemperaturas() {
  const temperatura = parseFloat(document.getElementById('temperatura').value);

  if (isNaN(temperatura)) {
    alert('Por favor, insira um valor válido.');
    return;
  }
  temperaturas.push(temperatura);
  const mediaTemperaturas = temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length;
  document.getElementById('mediaTemp').textContent = `A média das temperaturas é: ${mediaTemperaturas} Cº`;
  document.getElementById('temperatura').value = '';
  document.getElementById('temperatura').focus();
  document.getElementById('temperatura').select();
}

let valores = [];

function calcularMediaValores() {
  let num = parseInt(document.getElementById('varNumeros').value);

  if (isNaN(num)) {
    alert('Por favor, insira um valor válido.');
    return;
  }

  valores.push(num);

  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const positivos = valores.filter(v => v > 0).length;
  const negativos = valores.filter(v => v < 0).length;
  const percentualNegativos = (negativos / valores.length) * 100;
  const percentualPositivos = (positivos / valores.length) * 100;
  
  document.getElementById('mediaValores').textContent = `A média dos valores é: ${media}`;
  document.getElementById('qtdPositivos').textContent = `Quantidade de valores positivos: ${positivos}`;
  document.getElementById('qtdNegativos').textContent = `Quantidade de valores negativos: ${negativos}`;
  document.getElementById('percentual').textContent = `Percentual de valores positivos: ${percentualPositivos.toFixed(2)}% e negativos: ${percentualNegativos.toFixed(2)}%`;
  document.getElementById('varNumeros').value = '';
  document.getElementById('varNumeros').focus();
  document.getElementById('varNumeros').select();
  document.getElementById('varNumeros').value = '';
}