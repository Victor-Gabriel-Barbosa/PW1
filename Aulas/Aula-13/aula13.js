// Exercício [1]
$(function() {
  $("#btnDin").click(function() {
    $(this).text("Você clicou aqui!");
  });
});

// Exercício [2]
$(function() {
  $("#div2").css("background-color", "red");
});

// Exercício [3]
$(function() {
  $("td:nth-child(even)").css("background-color", "green");
  $("td:nth-child(odd)").css("background-color", "yellow");
});

// Exercício [4]
$(function() {
  $("#btnPar").click(function() {
    $("p:nth-child(3)").css("color", "red");
  });
});