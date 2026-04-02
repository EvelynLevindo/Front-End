// Estudo Avançado com o DOM
// Adicionar elemnetos com DOM em páginas de HTML

// Contruir um header com DOM
let header = document.createElement("header"); // Criação de uma tag <header>

// Estilização do header
header.style.backgroundColor = "cornflowerblue";
header.style.height = "8vh";

// Adicona o header como elemento filho do body
document.body.appendChild(header);
document.body.style.margin = "0"; // Retirou a margin do body

// Adicionar ao header
let divNav = document.createElement("div");

// Configurando o display da div
divNav.style.display = "flex";
divNav.style.justifyContent = "space-around";
divNav.style.color = "aliceblue";
divNav.style.height = "100%";
divNav.style.alignItems = "center";
divNav.style.fontSize = "5vh";
divNav.style.fontFamily = "Comic Sans MS";

// Adicionar a div ao header
header.appendChild(divNav);

// Adicionar itens a nav
let itensNav = ["Home", "Produtos", "Contato"];

// Percorrer o vertor
itensNav.forEach(e => {
    let item = document.createElement("a");
    item.innerHTML = e;
    item.href = e.toLowerCase()+".html"; // Criando link
    item.style.textDecoration = "none"; // Remove o link
    item.style.color = "inherit" // Mantém a cor original
    divNav.appendChild(item); // Adicionando o item divNav
});

// Faça um rodapé...
let footer = document.createElement("footer");
footer.style.backgroundColor = "cornflowerblue";
footer.style.height = "5vh";
footer.style.width = "100%";
footer.style.position = "fixed";
footer.style.bottom = "0";
let paragrafoFooter = document.createElement("p");
paragrafoFooter.innerHTML =
  "Copyright &copy; 2026 - Todos os direitos reservados.";
paragrafoFooter.style.color = "aliceblue";
paragrafoFooter.style.textAlign = "center";
paragrafoFooter.style.lineHeight = "5vh";
footer.appendChild(paragrafoFooter);
document.body.appendChild(footer);

