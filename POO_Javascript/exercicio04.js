// Atividade 4: Criar um sistema de funcionários

class Funcionario {
  // Atributos privados (Encapsulamento)
  #nome;
  #salario;
  #cargo;

  constructor(nome, salario, cargo) {
    this.#nome = nome;
    this.#salario = salario;
    this.#cargo = cargo;
  }

  // Método para aumentar o salário com base em um percentual
  aumentarSalario(percentual) {
    if (percentual > 0) {
      let valorAumento = this.#salario * (percentual / 100);
      this.#salario += valorAumento;
      console.log(
        `Sucesso: Salário de ${this.#nome} recebeu um aumento de ${percentual}%.`,
      );
    } else {
      console.log("Falha: O percentual de aumento deve ser maior que zero.");
    }
  }

  // Método de acesso para exibir as informações
  exibirInfo() {
    console.log(`\n--- Ficha do Funcionário ---
Nome: ${this.#nome}
Cargo: ${this.#cargo}
Salário: R$ ${this.#salario.toFixed(2)}
----------------------------`);
  }
}

// Instanciando e testando o objeto
let funcionario1 = new Funcionario(
  "Evelyn Levindo",
  1000.0,
  "Psicóloga",
);

funcionario1.exibirInfo();
funcionario1.aumentarSalario(15); // Aumenta o salário em 15% (R$ 150)
funcionario1.exibirInfo();