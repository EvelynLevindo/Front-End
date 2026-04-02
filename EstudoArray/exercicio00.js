// Calculadora de Média
var prompt = require("prompt-sync")();
var notas = [];
console.log("+++ Calculador de Média +++")
var quantidade = Number(prompt("Digite a quantidade de notas: "));
for (let i = 0; i < quantidade; i++) {
    let notaDigitada = Number(prompt(`Digite a nota ${i + 1}: `));
    notas.push(notaDigitada);
}
var soma = notas.reduce(function(acumulado, total) {
    return acumulado + total;}, 0);
var media = soma / quantidade;
console.log("---");
console.log("A média é: " + media);