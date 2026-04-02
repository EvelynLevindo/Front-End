// Criando elementos para a página index

// Clonando elemento com DOM
let card = document.createElement("div");
card.classList.add("card"); // Adicionando a classe card ao meu div = div.class= "card"

// Criar um container para adicionar os cards
let  container = document.createElement("div");
container.classList.add("container"); // Adicionando a classe container ao div

// Criar um botão para clonar elementos
let btnClonar = document.createElement("button");
btnClonar.innerText = "Clonar"; // Adicionar texto ao botão
btnClonar.id = "btnClonar"; // Adiciona um id ao botão

// Adiconar elemento a página
document.body.appendChild(btnClonar);
document.body.appendChild(container); // Adiciona container ao body
container.appendChild(card); // Adicona car ao container

// Adiciona um evento ao botão
btnClonar.addEventListener("click", () => {
    let clonar = card.cloneNode(true); // Clona o objeto card
    container.appendChild(clonar) // Adiciona um clone ao container
});

// Criar uma chave para o modo escuro
let chave = document.createElement("input"); // Mudando o tipo do input
chave.type = "checkbox"; 
chave.id = "darkMode";
document.body.appendChild(chave); // Adiciona a chave ao body

// Criar o evento para modo claro e escuro
chave.addEventListener("change", () => {
    // Adicionando ou removendo a classe darkMode ao body
    document.body.classList.toggle("darkMode");
});