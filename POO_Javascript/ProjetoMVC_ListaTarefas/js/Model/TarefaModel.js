// Base da estrura do aplicativo
// É a classe responsável pela modelagem de dados


// Preciso adicionar uma anotação na classe --> Export
// Assim ela será usada em outras partes do código
export class TarefaModel {

    // O JS permite colocar atributos direto no construtor
    constructor() {
        this.tarefas = []; // Cria um vetor para as tarefas
        this.currentId = 1; // Contador para o ID
    }

    // Métodos
    // Adicionar tarefa (CREATE)
    addTarefa(titulo) {
        const newTarefa = {
            id: this.currentId++,
            titulo: titulo,
            completed: false
        };

        this.tarefas.push(newTarefa); // Adicionar a tarefa ao vetor
    }

    // Buscar as tarefas (READ)
    getTarefas() {
        return this.tarefas; // Retorna o vetor de tarefas
    }

    // Atualizar tarefa (UPDATE)
    atualizarTarefa(id) {
        const tarefa = this.tarefas.find(tarefa => tarefa.id === id);
        if(tarefa) { // Se a tarefa for encontrada
            tarefa.completed = !tarefa.completed; // Inverter o valor da booleana
        }
    }

    // Remover a tarefa do vetor (DELETE)
    removerTarefa(id) {
        this.tarefas = this.tarefas.filter(tarefa => tarefa.id !== id)
    }
}

// O que foi feito?
//  - Um CRUD
//  - Um vetor de tarefas
//  - Geramos um ID automático para as tarefas

