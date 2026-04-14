// Classe controller para realizar a interação entre o Model e o View

export class TarefaController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  // Função que roda ao iniciar o sistema
  init() {
    // Evento para adicionar as tarefas
    this.view.addTarefaBtn.addEventListener("click", () => this.addTarefa());

    // Realizar a lista de tarefas
    this.view.renderTarefa(
      this.model.getTarefas(), // Pegar as tarefas do Model
      (id) => this.atualizarTarefa(id), // Função para atualizar tarefa
      (id) => this.removerTarefa(id), // Função para remover tarefa
    );
  }

  // Funções para adicionar tarefas
  addTarefa() {
    const titulo = this.view.getTarefaInputValue(); // Pega o valor do input

    if (titulo === "") {
      // Mandar uma mensagem de erro
      this.view.showMensagem("O título da tarefa NÃO pode ser vazio!");
      return; // Interrompe a função
    }

    // Continuo escrevendo a função
    this.view.clearMensagem(); // Limpa a mensagem de erro
    this.model.addTarefa(titulo); // Adiciona o título da tarefa no Model
    this.view.clearInput(); // Limpa o input
    this.updateView(); // Atualiza o view
  }

  // Função para mudar a tarefa em concluída ou não concluída
  atualizarTarefa(id) {
    this.model.atualizarTarefa(id); // Atualizar a tarefa no model
    this.updateView(); // Atualiza o view
  }

  // Função para remover a tarefa
  removerTarefa(id) {
    this.model.removerTarefa(id); // Remove a tarefa no model
    this.updateView(); // Atualiza o view
  }

  updateView() {
    this.view.renderTarefa(
      this.model.getTarefas(),
      (id) => this.atualizarTarefa(id),
      (id) => this.removerTarefa(id),
    );
  }
}