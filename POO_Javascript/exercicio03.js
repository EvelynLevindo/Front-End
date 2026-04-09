// Atividade 3: Criar uma classe representando uma conta bancária

class ContaBancaria {
  // Atributo privado para proteger o valor armazenado
  #saldo;

  constructor(titular, saldoInicial = 0) {
    this.titular = titular;
    this.#saldo = saldoInicial;
  }

  // Método para adicionar saldo
  depositar(valor) {
    if (valor > 0) {
      this.#saldo += valor;
      console.log(
        `Depósito de R$ ${valor.toFixed(2)} na conta de ${this.titular} realizado com sucesso!`,
      );
    } else {
      console.log("Valor de depósito inválido.");
    }
  }

  // Método para remover saldo, com verificação de fundos
  sacar(valor) {
    if (valor > 0 && valor <= this.#saldo) {
      this.#saldo -= valor;
      console.log(
        `Saque de R$ ${valor.toFixed(2)} na conta de ${this.titular} realizado com sucesso!`,
      );
    } else if (valor > this.#saldo) {
      console.log(
        `Saque negado: Saldo insuficiente para sacar R$ ${valor.toFixed(2)}.`,
      );
    } else {
      console.log("Valor de saque inválido.");
    }
  }

  // Método para exibir o saldo atual
  exibirSaldo() {
    console.log(
      `[Conta: ${this.titular}] Saldo Atual: R$ ${this.#saldo.toFixed(2)}`,
    );
  }
}

// Instanciando e testando o objeto
console.log("--- Conta Bancária ---");
let minhaConta = new ContaBancaria("Evelyn", 1000.0);

minhaConta.exibirSaldo();
minhaConta.depositar(350.0); // Aumenta o saldo para 1350
minhaConta.sacar(200.0); // Reduz o saldo para 1150
minhaConta.sacar(2000.0); // Tenta sacar mais do que tem, mas dá errado
minhaConta.exibirSaldo();