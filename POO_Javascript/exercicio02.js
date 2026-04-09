// Atividade 2: Criar uma classe representando um veículo

class Veiculo {
  // Atributos privados
  #marca;
  #modelo;
  #ano;

  constructor(marca, modelo, ano) {
    this.#marca = marca;
    this.#modelo = modelo;
    this.#ano = ano;
  }

  // Método da classe pai
  exibirInfo() {
    console.log(
      `Marca: ${this.#marca} \nModelo: ${this.#modelo} \nAno: ${this.#ano}`,
    );
  }
}

// Subclasse Carro que herda de Veiculo (Herança)
class Carro extends Veiculo {
  // Novo atributo específico da subclasse
  #quantidadePortas;

  constructor(marca, modelo, ano, quantidadePortas) {
    // super() chama o construtor da classe pai (Veiculo)
    super(marca, modelo, ano);
    this.#quantidadePortas = quantidadePortas;
  }

  // Sobrescrevendo o método exibirInfo (Polimorfismo)
  exibirInfo() {
    // Chama o comportamento do exibirInfo da classe Veiculo
    super.exibirInfo();
    // Adiciona o comportamento específico da classe Carro
    console.log(`Quantidade de Portas: ${this.#quantidadePortas}`);
  }
}

// Instanciando e testando os objetos
console.log("--- Veículo ---");
let veiculo1 = new Veiculo("Renault", "Kwid", 2016);
veiculo1.exibirInfo();

console.log("\n--- Carro ---");
let carro1 = new Carro("Volkswagen", "Fusca", 1985, 4);
carro1.exibirInfo();
