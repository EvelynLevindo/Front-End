//Tipos de Operadosres

//Operadores Aritméticos (+ - * / %)
var a = 10;
var b = 3;
var c;

//SOMA
c =  a + b;
console.log("Soma: " + c);

//SUBSTRAÇÃO
c = a - b;
console.log("Subtração: " + c);

//MULTIPLICAÇÃO
c = a * b;
console.log("Multiplicação: " + c);

//DIVISÃO
c = a / b;
console.log("Divisão: " + c);

//RESTO DA IVISÃO
c = a % b;
console.log("Resto: " + c);


//Operações Relacionais (> < >= <= == === != !==)
var a = 10;
var b = 20;
var c = "20";

console.log("Relacionais" + (a > b)); //false
// Importante
console.log("Igualdade Simples: " + (b == c)) //true
console.log("Igualdade Estrita: " + (b === c)) //false


//Operadores Lógicos ( && - E, || - OU, ! - NÃO)
var nota1 = 5;
var nota2 = 8;

console.log("Aprovação: " + nota1 > 7 && nota2 > 7); //false
console.log("Aprovação " + nota1 > 7 || nota2 > 7); //true
console.log("Negação: " + !true); //false
