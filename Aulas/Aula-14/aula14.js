// Exercício [1]
$("#par1").dblclick(function() {
  $(this).addClass("text-bg-danger");
});

$("#par2").dblclick(function() {
  $(this).addClass("text-bg-primary");
});

$("#par3").dblclick(function() {
  $(this).addClass("text-bg-success");
});

// Exercício [2]
$("#caixa").mousedown(function() {
  $(this).addClass("text-bg-primary");
});

// Exercício [3]
$("#bloco").mouseup(function() {
  $(this).addClass("text-bg-success");
});

// Exercício [4]
$("#div1").mouseenter(function() {
  $(this).css("background-color", "orange");
  $("#div2").css("background-color", "orange");
});

$("#div2").mouseenter(function() {
  $(this).css("background-color", "orange");
  $("#div1").css("background-color", "orange");
});

// Exercício [5]
$("#caixaBtn").mouseleave(function() {
  $(this).addClass("text-bg-danger");
});

// Exercício [6]
$("#imagem").hover(
  function() {
    $(this).css("border", "2px solid black");
  },
  function() {
    $(this).css("border", "none");
  }
);