//ESTRUTURA DE DADOS

//Condicionais

//IF - ELSE IF - ELSE
var precoProduto = 150;
//se preço do produto > 100 - desconto de 10%
if (precoProduto >= 100){
    console.log("Valor a Pagar: " + (precoProduto * 0.9));
}else{
    console.log("Valor a Pagar: " + (precoProduto));
}

// Condicional Intermediário (else if)
//preço > 200 15% desc | preço > 100 10% desc //

if (precoProduto >= 200){
    console.log("Valor a Pagar: " + (precoProduto * 0.85));
}
else if (precoProduto >= 100){
    console.log("Valor a Pagar: " + precoProduto * 0.9);
}
else{
    console.log("Valor a Pagar: " + precoProduto);
}

//  Switch Case
var mes = 4;
switch(mes){
    case 1:
        console.log ("Janeiro");
        break;
    case 2:
        console.log("Fevereiro");
        break;
    case 3:
        console.log("Março");
        break;
    case 4:
        console.log("Abril");
        break;
    default:
        console.log("Outro Mês");
        break;
}


//ESTRUTURA DE REPETIÇÃO (For, While)

//For ()
for(let i = 0; i <= 100; i++){
    console.log(i);
}

//while (Incontáveis)
var continuar = true;
var numEscolhido = 3;
var contador = 0;
while(continuar){ //enquanto cntinuar for verdadeiro, continua o loop
    contador++; //incremento do contador
    let numeroSorteado = Math.round(Math.random()*10); //número de 0 a 10
    if(numeroSorteado == numEscolhido){
        continuar = false;
        console.log("Acertou! 😎")
        console.log("Tentativas: " + contador)
    }
}

//Explicando o Math
//random: sorteia um número entre 0 e 1
//exemplo: 0.954321 / 0.23456 / 0.65432
//round: Arredonda o número para um inteiro


//FUNÇÕES (FUNCTIONS)
//Ações específicas que podem ser chamadas a qualquer momento dentro do código.

function ola (nome){ //função com retorno
    return "Olá, "+ nome;
}

function hello (nome){ //function void
    console.log("Hello, " + nome);
}

//chamando as functions
console.log(ola("Evelyn"));
hello("Evelyn");