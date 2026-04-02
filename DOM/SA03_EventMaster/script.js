// Variáveis/elementos q vão ser usados no HTML
var formulario = document.getElementById("meuForm");
var lista = document.getElementById("lista-convidados");
var msgErro = document.getElementById("mensagem-erro");
var btnEscuro = document.getElementById("btn-cor");

// Vai deixar escuro quando clicar no botão
btnEscuro.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

// FORMULÁRIO
formulario.addEventListener("submit", function (event) {
  event.preventDefault(); 

  // vAriáveis que vão serr usadas no HTML
  var nome = document.getElementById("nome").value;
  var email = document.getElementById("email").value;
  var tel = document.getElementById("tel").value;
  var cargo = document.getElementById("cargo").value;
  var idade = document.getElementById("idade").value;

  // Validação de campos para ter certeza de que nenhum vai deixar de ser respondido
  if (nome == "" || email == "" || tel == "" || cargo == "" || idade == "") {
    msgErro.innerHTML = "<strong>ERRO! Preencha todos os campos!</strong>";
  } 
  else {
    msgErro.innerText = "";

    // VDefini como vai ficar (a interface gráfica) cadastrado as informações do usuário
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML ="<strong>" + nome + "</strong> - " + cargo + " (" + idade + " anos) <br>" + "Contato: " + email + " | " + tel + " " + "<button class='btn-delete'>Remover</button>"; 
    lista.appendChild(card);
    card.querySelector(".btn-delete").addEventListener("click", function () {
      card.remove();
    });
    formulario.reset();
  }
});

// Limpa os campos do formulario ao clicar ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    formulario.reset();
    msgErro.innerText = "";
  }
});
