// Estudos Avançados de POO em JS

// Criação de uma classe
class Pessoa { // Abstract Class, só funciona no TypeScript
  // Atributos Privados (Encapsulamento)
  #nome;
  #idade;
  #cpf;

  // Constructor
  constructor(nome, idade, cpf) {
    this.#nome = nome;
    this.#idade = idade;
    this.#cpf = cpf;
  }

  // Getters and Setters
  getNome() {
    // Pegam o valor do atributo privado
    return this.#nome;
  }
  getIdade() {
    return this.#idade;
  }
  getCpf() {
    return this.#cpf;
  }
  setNome(nome) {
    this.#nome = nome;
  }
  setIdade(idade) {
    this.#idade = idade;
  }

  // Métodos de acesso
  exibirInfo() {
    console.log(
      `Nome: ${this.#nome}\nIdade: ${this.#idade}\nCPF: ${this.#cpf}`,
    );
  }
}

// Instanciar objetos de pessoas
let pessoa1 = new Pessoa("João", 25, "123.456.789.00");
let pessoa2 = new Pessoa("Maria", 30, "987.654.321-00");

pessoa1.exibirInfo();
pessoa2.exibirInfo();

// Alterar a idade da pessoa
pessoa1.setIdade(26);
pessoa1.exibirInfo();

// Herança em POO (Extends)
class Funcionario extends Pessoa {
  // Funcionario hera as caracteristicas de Pessoa

  // Novo atributos para funcionário
  #cargo;
  #salario;

  // Constructor
  constructor(nome, idade, cpf, cargo, salario) {
    super(nome, idade, cpf); // Chama os atributos da superclasse
    this.#cargo = cargo;
    this.#salario = salario;
  }

  // Métodos que estão faltando
  getCargo() {
    return this.#cargo;
  }
  getSalario() {
    return this.#salario;
  }

  setCargo(cargo) {
    this.#cargo = cargo;
  }
  setSalario(novoSalario) {
    this.#salario = novoSalario;
  }

  // Método de acesso
  exibirInfo() {
    // Polimosfismo
    super.exibirInfo();
    console.log(`Cargo: ${this.#cargo} \n Salário: ${this.#salario}`);
  }
}

// Instanciar o objeto de funcinário
let funcionario1 = new Funcionario("Pedro", 27, "321.654.987-00", "Motorista", 3500);
funcionario1.exibirInfo();
funcionario1.setSalario(4000);
funcionario1.exibirInfo();