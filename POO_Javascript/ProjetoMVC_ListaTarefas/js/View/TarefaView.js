// Classe para a organização da interface da aplicação

export class TarefaView {
    constructor() {
      this.tarefaInput = document.getElementById("tarefaInput"); // Entrada de dados da nova tarefa
      this.addTarefaBtn = document.getElementById("addTarefaBtn"); // Botão para enviar
      this.listaTarefas = document.getElementById("listaTarefas"); // UL --> Lista de tarefas
      this.mensagem = document.getElementById("mensagem"); // P --> Para mensagem
    }

    // Métodos
    // Pegar a tarefa do input
    getTarefaInputValue() {
        return this.tarefaInput.value.trim();
    }

    // Limpar o valor o input
    clearInput() {
        this.tarefaInput.value = "";
    }

    // Mandar uma mensagem para o usuário no parágrafo
    showMensagem(texto) {
        this.mensagem.textContent = texto;
    }
    clearMensagem() {
        this.mensagem.textContent = "";
    }

    // Renderizar a lista de tarefas
    renderTarefa(tarefas, atualizar, remover){
        // Limpar a lista existente
        this.listaTarefas.innerHTML = ""; // Remover todo HTML do UL

        // Reconstruir a lista
        tarefas.forEach(tarefa => {
          // Lógica do laço de repetição
          const li = document.createElement("li"); // Criando um item da lista

          if (tarefa.completed) {
            li.classList.add("completed"); // Adicionando a classe completed no elemento
          }

          const span = document.createElement("span");
          span.textContent = tarefa.titulo;

          const action = document.createElement("div");
          action.classList.add("action");

          // Botão para atualizar a tarefa
          const atualizarBtn = document.createElement("button");
          atualizarBtn.textContent = tarefa.completed ? "Desfazer" : "Concluir"; // Operador ternário
          atualizarBtn.addEventListener("click", () => atualizar(tarefa.id)); // A função estará no controller

          // Botão para remover a tarefa
          const removerBtn = document.createElement("button");
          removerBtn.textContent = "Remover";
          removerBtn.addEventListener("click", () => remover (tarefa.id));

          // Adicionar o elemento HTML
          // Adiciona o button na div action
          action.appendChild(atualizarBtn);
          action.appendChild(removerBtn);

          // Adiciona um span e uma div ao li
          li.appendChild(span);
          li.appendChild(action);

          // Adiciona li ao ul
          this.listaTarefas.appendChild(li);
        });
    }
}

// O que o código faz?
//  - Le um valor do input
//  - Limpa o input
//  - Mostra mensagem
//  - Limpa a mensagem
//  - Renderiza a lista de tarefas na ul