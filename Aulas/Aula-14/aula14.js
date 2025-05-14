// Exercício [1]
$(function() {
  $("#par1").dblclick(function() {
    $(this).addClass("text-bg-danger");
  });
});

$(function() {
  $("#par2").dblclick(function() {
    $(this).addClass("text-bg-primary");
  });
});

$(function() {
  $("#par3").dblclick(function() {
    $(this).addClass("text-bg-success");
  });
});

// Exercício [2]
$(function() {
  $("#caixa").mousedown(function() {
    $(this).addClass("text-bg-primary");
  });
});

// Exercício [3]
$(function() {
  $("#bloco").mouseup(function() {
    $(this).addClass("text-bg-success");
  });
});

// Exercício [4]
$(function() {
  $("#div1").mouseenter(function() {
    $(this).css("background-color", "orange");
    $("#div2").css("background-color", "orange");
  });
});

$(function() {
  $("#div2").mouseenter(function() {
    $(this).css("background-color", "orange");
    $("#div1").css("background-color", "orange");
  });
});

// Exercício [5]
$(function() {
  $("#caixaBtn").mouseleave(function() {
    $(this).addClass("text-bg-danger");
  });
});

// Exercício [6]
$(function() {
  $("#imagem").hover(
    function() {
      $(this).css("border", "2px solid black");
    },
    function() {
      $(this).css("border", "none");
    }
  );
});