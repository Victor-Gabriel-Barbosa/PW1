function verificarNota() {
  let nota = document.getElementById("nota").value;
  let mensagem;

  if (nota < 0 || nota > 100) {
    document.getElementById("desempenho").innerText = "Nota inválida!";
    return;
  }

  if (nota >= 90) mensagem = "Excelente";
  else if (nota >= 60) mensagem = "Bom";
  else mensagem = "Precisa Melhorar";

  document.getElementById("desempenho").innerText = mensagem;
}

function verificarMes() {
  let mes = parseInt(document.getElementById("mes").value);
  let nomeMes;

  switch (mes) {
    case 1:
      nomeMes = "janeiro";
      break;
    case 2:
      nomeMes = "fevereiro";
      break
    case 3:
      nomeMes = "março";
      break
    case 4:
      nomeMes = "abril";
      break
    case 5:
      nomeMes = "maio";
      break
    case 6:
      nomeMes = "junho";
      break
    case 7:
      nomeMes = "julho";
      break
    case 8:
      nomeMes = "agosto";
      break
    case 9:
      nomeMes = "setembro";
      break
    case 10:
      nomeMes = "outubro";
      break
    case 11:
      nomeMes = "novembro";
      break
    case 12:
      nomeMes = "dezembro";
      break
    default:
      nomeMes = "inválido"
  }

  document.getElementById("nomeMes").innerText = nomeMes;
}

function mediaNotas() {
  let nota1 = parseFloat(document.getElementById("nota1").value);
  let nota2 = parseFloat(document.getElementById("nota2").value);
  let nota3 = parseFloat(document.getElementById("nota3").value);
  let media = (nota1 + nota2 + nota3) / 3;

  document.getElementById("media").innerText = media;
}

function impostoSalario() {
  let salario = parseFloat(document.getElementById("salario").value);
  let aliquota;

  if (salario <= 1903.98) aliquota = "Isento";
  else if (salario <= 2826.65) aliquota = "7.5%";
  else if (salario <= 3751.05) aliquota = "15%";
  else if (salario <= 4664.68) aliquota = "22.5%";
  else aliquota = "27.5%";

  if (aliquota != "Isento") aliquota += " do salário bruto";
  document.getElementById("imposto").innerText = (aliquota == "Isento") ? aliquota : aliquota + " do salário bruto";
}