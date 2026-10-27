// Interface representativa da estrutura de dados de uma tarefas no sistema

export interface ITodoItem {
  _id: string;
  title: string;
  completed: boolean;
  createAt: string;
}

// Elemento de Criação para uma nova Tarefa (só precisa do titulo)
export interface ICreateTodoDTO {
  title: string;
}

// Interface para modificar uma tarefa (pode modificar titulo ou status)
export interface IUpdateTodoDTO {
  title?: string;
  completed?: boolean;
}
