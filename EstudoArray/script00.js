// Declaração de um Array
let array = []; // Array dinâmico

// Tipos de Array
let arrayNumerico = [1,2,3,4,5,6,7,8,9];
let arrayTexto = ["Sapato", "Chinelo", "Tamanco"];
let arrayMisto = [1, "José", true];

// Tamanho de um Array (length)
console.log(arrayNumerico.length); // 9

// Acessar a posição de um Array
console.log(arrayTexto[1]); // Chinelo

// Adicionar elementos no Array
// Push (No Final) / Unshift (No Começo)
arrayTexto.push("Tenis");
console.log(arrayTexto);
arrayTexto.unshift("Sandália");
console.log(arrayTexto);

// Trocar valor de um elemento
arrayTexto[2]="Crocs"; // Substitui o elemento da 3º posição [2] por Crocs

// Remover elementos do Array
// Pop (No Final) / Shift (No Começo)
arrayTexto.shift();
console.log(arrayTexto);
arrayTexto.pop();
console.log(arrayTexto);

// Laços de Repetição
// Percorrer um Array com For
for(let i = 0; i < arrayNumerico.length; i++) {
    console.log(`indice[${i}]=%{arrayNumerico[i]}`); // Forma moderna de incl
}

// forEach (para cada elemento do Array) -> Só pode ser usada em um Array
arrayMisto.forEach(e => {
    console.log(e);
})

// Métodos úteis de Arrays
// IndexOf
console.log(arrayNumerico.indexOf(5)); // 4
console.log(arrayNumerico.indexOf(10)); // -1 = Elemento inexistente