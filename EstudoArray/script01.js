// Operações Avançadas de Array

let valores = [10,20,30,40,50];

// Map --> Criação de novos valores de um Array
let valoresDobro = valores.map(x => x * 2);
console.log(valoresDobro);

// Filter --> Filtragem de dados de um Array
let valoresFilter = valores.filter(x => x > 25);
console.log(valoresFilter); // [30, 40,50]

// Reduce --> Transforma um Array em variável simples
let soma = valores.reduce((soma, e) => soma + e);
console.log(soma); // 150

// Sort --> Ordenação de Array
let aleatorio = [7,4,2,9,1,5,8,6,3];
console.log(aleatorio);
let ordenado = aleatorio.sort();
console.log(ordenado);