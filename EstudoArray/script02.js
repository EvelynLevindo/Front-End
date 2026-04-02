// Matrizes

let matriz = [
  [9, 8, 7],
  [6, 5, 4],
  [3, 2, 1],
];

let matrizMista = [
  ["João", 25, "19-99999990"],
  ["Maria", 22, "11-77765342"],
  ["Joana", 18, "12-987654321"],
];

// Busca de item na Matriz
console.log(matrizMista[1][0]); // Maria
console.log(matrizMista[2][2]); // 12-987654321

// Iterando sobre a Matriz (for aninhado)
for (let i = 0; i < matriz.length; i++) {
  for (let j = 0; j < matriz[i].length; j++) {
    console.log(matriz[i][j]);
  }
}