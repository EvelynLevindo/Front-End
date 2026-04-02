// GERENCIADOR DE NOTAS ESCOLARES

// Cadastrando Notas
var prompt = require("prompt-sync")();
let alunos = [];
var qntdAlunos = Number(prompt("Digite a quantidade de alunos: "));
for (let i = 0; i < qntdAlunos; i++){
    let notas = [];
    for (let j = 0; j < 3; j++) {
        let nota = Number(prompt(`Digite a nota ${j + 1} do aluno ${i + 1}: `));
        notas.push(nota);
    }
    alunos.push(notas);
}

// Formato De Tabela
console.log(alunos);

// Calculando Média e Se Foi Aprovado
let medias = []
for (let k = 0; k < alunos.length; k++) {
  let soma = 0;
  for (let l = 0; l < alunos[k].length; l++) {
    soma += alunos[k][l];
  }
  medias.push(soma / alunos[k].length);
}

console.log("Médias: "+medias);
