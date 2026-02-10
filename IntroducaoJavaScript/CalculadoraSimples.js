//Calculadora Simples em JavaScript
//Usar o Prompt
var prompt = require("prompt-sync") ();//import da biblioteca

//Funções de Cálculo

//SOMA
function soma(a, b){
    return (a + b);
}

//SUBTRAÇÃO
function sub(a, b){
    return (a - b);
}

//MULTIPLICÃO
function multi(a, b){
    return (a * b);
}

//DIVISÃO
function div(a, b){
    return (a / b);
}

//Menu
function menu(){
    let operacao;
    let numero1;
    let numero2;
    let resultado;
    console.log("=== Calculadora Simples ===");
    console.log("| 1. Soma                  ");
    console.log("| 2. Subtração             ");
    console.log("| 3. Multiplicaç           ");
    console.log("| 4. Divisão               ");
    console.log("| 5. Sair                  ");
    console.log("===========================");
    console.log("==== Escolha a Operação ===");
    operacao = prompt(); // Recebe o valor digitado para a ação
    numero1 = Number(prompt("Digite o 1º número: ")); // Recebo o número 1
    numero2 = Number(prompt("Digite o 2º número: ")); // Recebo o número 2

    // Switch Case
    switch (operacao){
        case "1":
            resultado = soma(numero1, numero2);
            console.log("Resultado: " + resultado);
            break;
        case "2":
            resultado = sub(numero1, numero2);
            console.log("Resultado: " + resultado);
            break;
        case "3":
            resultado = multi(numero1, numero2);
            console.log("Resultado: " + resultado);
            break;
        case "4":
            if (numero2 == 0){
              console.log("Não Pode Dividir Por Zero!");
              resultado = null;
            }
            else{
                resultado = div(numero1, numero2);
                console.log("Resultado: " + resultado);
            }
            break;

        default:
            console.log("Operação Inválida");
            resultado = null
            break;
    } // Fim do Switch
}// Fim da Função
    //Não chamei o menu
    //Então vou chamar a função do menu em um while

var continuar = true;
while (continuar){
    menu();
    let escolha = prompt("1. Continuar // 2. Sair     Resposta: ");
    if (escolha == 2) {
        continuar = false;
        console.log("Saindo...")
    }
}
