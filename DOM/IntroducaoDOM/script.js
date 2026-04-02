// DOM --> Documento Object Model
// Script de Manipulação DOM
// getElementById --> Variável simples, o ID é sempre único

// Usar sempre o "document" para manipular o DOM
let titulo = document.getElementById("titulo"); // Busca no HTML o elemento com o IS correspondente
console.log(titulo); // Mostra a informação do ID
titulo.innerText = "Outro Título Para o Site"; // Modifica o conteúdo do ID

// getEmentByTagName --> Vetor (Array) de elementos
let paragrafo = document.getElementsByTagName("p"); // HTML --> p
paragrafo[0].innerText="Exemplo de Parágrafo Modificado Por DOM"; // Modificar elemento
paragrafo[1].style.color="red"; // Modificar o Style do elemento

// getElementByClassName --> Vetor de elementos
let descricao = document.getElementsByClassName("descricao");
// Modificar elementos do Array
for(let i = 0; i < descricao.length; i++);{
    descricao[i].style.color = "blue";
}

// querySelector --> Variavel simples = selecione sempre o primeiro elemento com o seletor
let p = document.querySelector("p");
// Modificar a fonte
p.style.fontWeight = "bold";

// querySelectorAll --> Vetor de Elementos --> Seleciona todos os elementos
let descriaoAll = document.querySelector(".descricao");
descricaoAll.forEach(e => e.style.fontWeight = "bold");

// Eventos Listener (ouvintes)
// Chamar pelo nome da função 
function MudarCorFundo(){
    let body = document.querySelector("body");
    body.style.backgroundColor = "green";
}

// Chamar diretamente no script o ouvinte
document.getElementById("btnColor").addEventListener("click", OutraCor);

function OutraCor(){
    let body = document.querySelector("body");
    body.style.backgroundColor = "orange";
}