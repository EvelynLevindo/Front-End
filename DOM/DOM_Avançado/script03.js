// Criação de um formulário de contato com validação de campos do formulário
let form = document.createElement("form"); // Criação de um formulário HTML
form.id = "formContato";
let container = document.createElement("div");
container.classList.add("container");
document.body.appendChild(container);
container.appendChild(form);
container.style.flexDirection = "row-reverse";

// Adicionar elementos ao formulário
let inputName = document.createElement("input");
inputName.type = "text";
inputName.placeholder = "Digite seu nome...";
inputName.id = "nome";
form.appendChild(inputName);

let inputEmail = document.createElement("input");
inputEmail.type = "email";
inputEmail.placeholder = "Digite seu email...";
inputEmail.id = "email";
form.appendChild(inputEmail);

let inputMsg = document.createElement("textarea");
inputMsg.id = "info";
inputMsg.placeholder = "Digite sua Mensagem";
form.appendChild(inputMsg);

// Criar um botão de enviar
let btnEnviar = document.createElement("button");
btnEnviar.type = "submit";
btnEnviar.innerText = "Enviar";
form.appendChild(btnEnviar);

// Adicionar um parágrafo e mostrar a mensagem de validação
let p = document.createElement("p");
p.id = "mensagem";
document.body.appendChild(p);

// Evento de validação do formulário
document.getElementById("formContato").addEventListener("submit", (e) => {
  e.preventDefault(); // Evita o recarregamento da página
  let nome = document.getElementById("nome").value;
  let email = document.getElementById("email").value;
  let info = document.getElementById("info").value;
  let mensagem = document.getElementById("mensagem");

  // Condição
  if (nome === "" || email === "" || info === "") {
    mensagem.innerText = "Preencha Todos os Campos";
    mensagem.style.color = "red";
  } else {
    mensagem.innerText = "Contato Enviado com Sucesso";
    mensagem.style.color = "green";

    //limpar todos os campos
    inputName.value = "";
    inputEmail.value = "";
    inputMsg.value = "";
  }
});