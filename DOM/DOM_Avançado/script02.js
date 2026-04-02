// Eventos DOM Avançados

// Capturar letras digitadas --> function
document.addEventListener("keydown", (e) => {
    // Capurar a letr digitada e exibir a letra no console
    console.log("Tecla Presionada: " +e.key);
});

// Função para sugestão de texto em campos de busca -->
let input = document.createElement("input");
input.type = "text";
input.id = "busca";
input.placeholder = "Digite para buscar...";
document.body.appendChild(input); // Adiciona input ao body

//Lista de sugestões
let lista = document.createElement("ul"); // Lista não ordenada
lista.id = "sugestoes";
lista.style.listStyle = "none"; // Remove a característica de lista * antes do texto
document.body.appendChild(lista); // Adiciona lista ao body

// Criar um vetor de sugestões
let sugestoes = [
    "JavaScript", "TypeScript", "Java", "Dart", "Kotlin", "C#", "PHP", "Go", "Ruby",  
    "C++", "Assembly", "Cobol", "C", "Lua", "Swift", "Pascal", "Delphi", "Rust"];

// Evento para captiurar o texto e sugerir a partir dos caracteres digitados
document.getElementById("busca").addEventListener("keyup", () => {
    let texto = input.value.toLowerCase();
    lista.innerHTML=""; // Limpa a lista
    sugestoes.forEach(sugestao => {
        if(sugestao.toLowerCase().includes(texto)) {
            let item = document.createElement("li");
            // Permitir clique no item
            item.style.cursor = "pointer"; // Transforma em cursor pointer
            item.addEventListener("click", () => { 
              input.value = sugestao; // Ao clicar no item, pega o texto e limpa a lista
              lista.innerHTML = "";
            });
            item.innerText = sugestao;
            lista.appendChild(item);
        }
    });
});

