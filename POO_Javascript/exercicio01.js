// Atividade 1: Criar uma classe representando um produto

class Produto {
  // Construtor para inicializar os atributos
  constructor(nome, preco, estoque) {
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;
  }

  // Método para vender o produto e reduzir o estoque
  vender(quantidade) {
    if (quantidade > this.estoque) {
      console.log(
        `Falha na venda: Estoque insuficiente de ${this.nome}. Estoque atual: ${this.estoque}`,);
    } else {
      this.estoque -= quantidade;
      console.log(`Venda realizada: ${quantidade} unidades de ${this.nome}.`);
    }
  }

  // Método para repor o estoque
  repor(quantidade) {
    if (quantidade > 0) {
      this.estoque += quantidade;
      console.log(
        `Reposição concluída: ${quantidade} novas unidades de ${this.nome} no estoque.`,
      );
    }
  }

  // Método para exibir as informações do produto
  exibirInfo() {
    console.log(`\n--- Informações do Produto ---
        Nome: ${this.nome}
        Preço: R$ ${this.preco.toFixed(2)}
        Estoque: ${this.estoque} unidade(s)\n------------------------------\n`);
  }
}

// Instanciando e testando o objeto
let produto1 = new Produto("Guitarra", 2500.0, 10);

produto1.exibirInfo();
produto1.vender(3); // Reduz o estoque para 7
produto1.vender(10); // Se tentar vender mais do que tem (falha)
produto1.repor(5); // Aumenta o estoque para 12
produto1.exibirInfo();
