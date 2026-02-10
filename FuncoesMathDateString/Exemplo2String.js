// Funções de String

const mensagem = " JavaScript é Incrível ";

// Contar quantos caracteres tem a variável
console.log(mensagem.length); // 23

// MAIÚSCULAS e minúsculas
console.log(mensagem.toUpperCase); // JAVASCRIPT É INCRÍVEL
console.log(mensagem.toLowerCase); // javascript é incrível

// Substituições de partes da String
const mensagem2 = mensagem.replace("Java", "Type");
console.log(mensagem2); // TypeScript é incrível

// Partes do texto
console.log(mensagem.substring(0, 5)); // " Java"
console.log(mensagem.slice(-11)); // JavaScript

// Tesoura (trim)
console.log(mensagem.trim()); // Remove espaços antes e depois do texto

//Sepaação de String
const mensagem3 = "Bom Tarde Com Muita Alegria";
const array = mensagem3.split(" "); // Usando o espaço para separar a frase e transfomar em vetor

// DESAFIO
// Converta o texto: " João, mariA, NicolaS, SocoRRo, zuLeica"
// Em um Array no seguinte formato: [João,Maria,Nicolas,Socorro,Zuleica]

const texto = " João, mariA, NicolaS, SocoRRo, zuLeiCa";

// Remover os espaços vazios (trim)
const textotrim = texto.trim();

// Split - Separa em array

const nomesSujos = textotrim.split(", ");

console.log(nomesSujos);

// Vetor de 5 nomes
let nomesLimpo = [];

for (let i = 0; i < nomesSujos.length; i++) {
  nomesLimpo[i] =
    nomesSujos[i].charAt(0).toUpperCase() +
    nomesSujos[i].slice(1).toLowerCase();
}

console.log(nomesLimpo);