// Exercício [1]
$("#btnDin").click(function() {
  $(this).text("Você clicou aqui!");
});

// Exercício [2]
$(document).ready(function() {
  $("#div2").css("background-color", "red");
});

// Exercício [3]
$(document).ready(function() {
  $("td:nth-child(even)").css("background-color", "green");
  $("td:nth-child(odd)").css("background-color", "yellow");
});

// Exercício [4]
$("#btnPar").click(function() {
  $("p:nth-child(3)").css("color", "red");
});