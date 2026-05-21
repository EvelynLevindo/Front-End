// ==========================================
// EXERCÍCIO 1: CADASTRO DE USUÁRIOS
// ==========================================

// Interface usuário
interface Usuario {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

// Função renderizarPerfil
function renderizarPerfil(usuario: Usuario): void {
  if (usuario.isAdmin) {
    console.log(`Usuário Administrador: ${usuario.nome} (${usuario.email})`);
  } else {
    console.log(`Usuário Comum: ${usuario.nome} (${usuario.email})`);
  }
}

// Usuarios para teste
const admin: Usuario = {
  id: 1,
  nome: "Carlos",
  email: "carlos@email.com",
  isAdmin: true,
};
const comum: Usuario = {
  id: 2,
  nome: "Ana",
  email: "ana@email.com",
  isAdmin: false,
};

// Exebição das mensagens
console.log("--- Exercício 1 ---");
renderizarPerfil(admin);
renderizarPerfil(comum);

// ==========================================
// EXERCÍCIO 2: SISTEMA DE NOTAS ESCOLARES
// ==========================================

// Interface estudante
interface Estudante {
  nome: string;
  notas: number[];
}

// Função calcularMedia
function calcularMedia(estudante: Estudante): void {
  if (estudante.notas.length === 0) {
    console.log(`O estudante ${estudante.nome} não possui notas registradas.`);
    return;
  }

  // Calcula a soma das notas e depois a média
  const soma = estudante.notas.reduce(
    (acumulador, nota) => acumulador + nota,
    0,
  );
  const media = soma / estudante.notas.length;

  // Define o status com base na média
  const status = media >= 7 ? "Aprovado" : "Reprovado";

  // Exibe o resultado formatado no console
  console.log(
    `Aluno: ${estudante.nome} | Média: ${media.toFixed(2)} | Situação: ${status}`,
  );
}

// Teste para verificar de esta funcionando
console.log("\n--- Teste Exercício 2 ---");

const estudanteTeste1: Estudante = {
  nome: "Mariana Souza",
  notas: [8.5, 7.0, 6.5, 9.0],
};

const estudanteTeste2: Estudante = {
  nome: "Pedro Santos",
  notas: [5.0, 6.0, 4.5, 7.0],
};

calcularMedia(estudanteTeste1);
calcularMedia(estudanteTeste2);
