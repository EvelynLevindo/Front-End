// Funções Matemáticas (Math) --> Nativas
// SQRT e POW (Quadrodo e Potência)

// Calcular a raiz quadrada de 25
console.log(Math.sqrt(25)); // 5

//Potência de um número pelo o outro
console.log(Math.pow(7, 2)); // 7² = 49
console.log(Math.pow(4, 3)); // 4³ = 64
console.log(Math.pow(7, 1 / 3)); // ³ raiz 27 = 3

// Fuções de Arredondamento (round, ceil, floor)
console.log(Math.round(4.7)); // 5
console.log(Math.round(4.4)); // 4
console.log(Math.ceil(4.2)); // 5
console.log(Math.floor(4.7)); // 4

//Funções e Número Aleatório (Math.random)
console.log(Math.random()); // Gerar um némro aleatório entre 0 e 1
// Gerar um número entre 0 e 999
console.log(Math.random() * 1000);

//Números Absolutos (converte negativo em positivo)
console.log(Math.abs(-10)); // 10

// Funções Anlíticas Mínimo e Máximo (Math.min e Math.max)
console.log(Math.min(1, 2, 3, 4, 5, 6, 7, 8, 9)); // 1
console.log(Math.max(1, 2, 3, 4, 5, 6, 7, 8, 9)); // 9

//DESAFIO
// Criar um jogo de número aleatório

const prompt = require("prompt-sync")();
var continuar = true;

do {
  var numeroSecreto = Math.round(Math.random() * 100); // Sorteia um número de 0 a 100
  var contadorTentativas = 0;
  var acertou = false;

  while (acertou == false) {
    console.log("Tentativas: " + contadorTentativas);
    chute = prompt("Chute um número: ");

    if (chute < numeroSecreto) {
      console.log("\n\nERROU! Seu chute foi menor que o número sorteado!\n\n");
      contadorTentativas++;
    } else if (chute > numeroSecreto) {
      console.log("\n\nERROU! Seu chute foi maior que o número sorteado!\n\n");
      contadorTentativas++;
    } else {
      console.log(
        "\n\nACERTOU! O número sorteado era " + numeroSecreto + "\n\n",
      );
      acertou = true;
    }
  }

  console.log("\n\nDeseja continuar?\n1. Sim\n2. Não\n\n");
  var op = prompt("Escolha: ");

  if (op == 1) {
    numeroSecreto = Math.round(Math.random() * 100); // Sorteia um número de 1 a 100
    contadorTentativas = 0;
    acertou = false;
    continuar = true;
  } else {
    continuar = false;
    console.log("Saindo...");
  }
} while (continuar);