"use strict";
// Exemplo de Aplicação de TypeScript
// ======================================
// Criar Funções Tipadas (Exercício 2)
// ======================================
// Função para calcular o desconto aplicado a um produto
function calcularDesconto(preco, percentual) {
    return preco - (preco * (percentual / 100));
}
// Função para exibir a informação do produto
function exibirInfo(p, desconto = 0) {
    console.log(`Produto: ${p.nome.toUpperCase()}`);
    console.log("Categoria: " + p.categoria);
    console.log(`Status: ${p.emEstoque ? "Disponível" : "Indiponível"}`);
    if (desconto > 0) {
        const precoFinal = calcularDesconto(p.preco, desconto);
        console.log(`Preço: R$ ${precoFinal.toFixed(2)}`);
    }
    else {
        console.log(`Preço: R$ ${p.preco.toFixed(2)}`);
    }
    console.log("======================================");
}
// ======================================
// Execução da Aplicação
// ======================================
console.log("===  SISTEMA DE INVENTÁRIO TS v1.0 ===\n");
// Criando uma lista de produtos baseada na interface
const listaProdutos = [
    {
        nome: "Notebook Gamer",
        preco: 4500.0,
        categoria: "Eletrônicos",
        emEstoque: true,
    },
    {
        nome: "Camiseta Algodão",
        preco: 89.9,
        categoria: "Vestuário",
        emEstoque: true,
    },
    {
        nome: "Teclado Mecânico",
        preco: 350.0,
        categoria: "Eletrônicos",
        emEstoque: false,
    },
];
// Percorrer a lista e aplicar deconto para produtos de eletrônicos
listaProdutos.forEach((produto) => {
    if (produto.categoria === "Eletrônicos" && produto.emEstoque) {
        exibirInfo(produto, 10);
    }
    else {
        exibirInfo(produto);
    }
});
