//galeria de imagens Dinâmicas com DOM

let uploadInput = document.getElementById("upload");
let btnAdd = document.getElementById("addImagem");
let galeria = document.querySelector(".galeria");
let carrossel = document.querySelector(".carrossel");

//vetor para as imagens
let imagens = []; //array-vetor

//adicionar imagens no vetor

btnAdd.addEventListener("click", () => {
  let imagemURL = uploadInput.value.trim(); //pega o endereço da imagens no input
  if (imagemURL === "") return; // se a condição for verdadeira interrompe o código
  //parte de baixo do código continua se a condição acima for falsa
  imagens.push(imagemURL);
  atualizarGaleria(); //atualiza a imagem na galeria
  atualizarCarrossel(); //ataualiza a imagem no carrossel
  uploadInput.value = ""; //limpa o campo do input
});

//atualizar Galeria de Imagens
function atualizarGaleria() {
  galeria.innerHTML = ""; //limpar a galeria de imagens
  //adicionar todas aas imagens na galeria
  imagens.forEach(
    //percorrer
    (imagem, index) => {
      let div = document.createElement("div"); //criando uma div
      div.classList.add("imagemContainer");
      let img = document.createElement("img"); //criando uma img
      img.src = imagem; //add url da imagem
      let btnRemove = document.createElement("button"); //criando um btn
      btnRemove.innerText = "X"; //add X no botão
      btnRemove.classList.add("remove");
      //adicionar um evento para o btnRemove
      btnRemove.addEventListener("click", () => {
        imagens.splice(index, 1); //remove a imagem do vetor
        atualizarGaleria(); //recursão
        atualizarCarrossel();
      });
      //appendChild
      div.appendChild(img); //img a div
      div.appendChild(btnRemove); // btn a div
      galeria.appendChild(div); // div a galeria
    },
  );
}

//função para atualizar as imagens no carrossel

function atualizarCarrossel() {
  carrossel.innerHTML = ""; //limpar o Carrossel
  //refazer o carrossel com as imagens do vetor
  imagens.forEach((imagem) => {
    let img = document.createElement("img");
    img.src = imagem; //adicionar a url da imagem no carrossel
    img.style.width = "100%";
    carrossel.appendChild(img); //add img ao carrossel (div)
  });
  carrossel.style.width = `${imagens.length * 100}%`; // o nº de imagens vai determinar o tamanho do carrossel
  iniciarCarrossel(); //função para iniciar o rodizio do carrossel
}

function iniciarCarrossel() {
  let index = 0;
  setInterval(() => {
    index = (index + 1) % imagens.length;
    carrossel.style.transition = `transform ${(1 + imagens.length) / imagens.length}s ease-in-out`; //tempo para transição
    carrossel.style.transform = `translateX(-${(index * 100) / imagens.length}%)`; //quantidade de tela que sera rotacionada
  }, 2000);
}