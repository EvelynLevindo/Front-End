// Estudos de POO em JavaScript
// Diferença entre Procedural e POO

// Declaração de uma variável em procedural
let produto1 = {
  nome: "Impressora",
  preco: 1000,
  marca: "Epson",
  disponivel: true,
  desconto: function () {
    return this.preco * 0.1; // Desconto de 10% no preço
  },
}; // Coleção

let produto2 = {
  nome: "Mouse",
  preco: 100,
  marca: "elgin",
  disponivel: false,
  desconto: function () {
    return this.preco * 0.2; // 20% de desconto
  },
};

// Imprimir informaçõess do produto
console.log(`
    Produto: ${produto1.nome},
    Preço: ${produto1.preco},
    Marca: ${produto1.marca},
    Disponível: ${produto1.disponivel ? "Sim" : "Não"},
    Desconto: ${produto1.disponivel ? produto1.desconto() : ""}]
    `);

// Criação de um objeto com uma classe (POO)
class Produto {
  // Atributos
  nome;
  preco;
  marca;
  disponivel;

  // Métodos
  // Construtor --> No JS o construtor não tem o nome da classe, ele chama apenas o construtor
  constructor(nome, preco, marca, disponibilidade) {
    this.nome = nome;
    this.preco = preco;
    this.marca = marca;
    this.disponivel = disponibilidade;
  }

  // Método para aplicar o desconto
  desconto() {
    return this.preco * 0.1; // 10% de desconto
  }

  // Mostrar as informações
  toString() {
    return `Produto: ${this.nome},
            Preço: ${this.preco},
            Marca: ${this.marca},
            Disponívels: ${this.disponivel ? "Sim" : "Não"},
            Desconto: ${this.disponivel ? this.desconto() : ""}`;
  }
}

// Declarar os objetos
let p1 = new Produto("HeadSet", 200, "Dragon", true);
let p2 = new Produto("Microfone", 600, "Razer", false);
console.log(p1.toString());
console.log(p2.toString());