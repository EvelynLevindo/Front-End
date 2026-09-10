import { useState } from "react"; // Importa o hook useState da biblioteca React para gerenciar os estados.
import "./index.css"; // Importa o arquivo de estilos CSS para aplicar o visual na aplicação.

function App() { // Define a função do componente principal da aplicação chamada App.
  // Estado para armazenar a lista de tarefas, iniciando sem nenhuma tarefa fixa.
  const [tasks, setTasks] = useState([]);

  // Estado para guardar o título da nova tarefa informado no formulário.
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Estado para guardar a descrição da nova tarefa informada no formulário.
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Estado para guardar o ID da tarefa que está sendo editada no momento.
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Estado para armazenar o novo título digitado no modo de edição.
  const [editingTitle, setEditingTitle] = useState("");

  // Estado para armazenar a nova descrição digitada no modo de edição.
  const [editingDescription, setEditingDescription] = useState("");

  // Função para adicionar uma nova tarefa contendo título e descrição.
  function handleAddTask(e) {
    e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário.
    if (!newTaskTitle.trim()) return; // Impede a criação de tarefas sem título.

    const newTask = { // Cria o objeto da nova tarefa.
      id: Date.now(), // Gera um ID único baseado na data e hora atual.
      title: newTaskTitle, // Atribui o título digitado pelo usuário.
      description: newTaskDescription, // Atribui a descrição digitada pelo usuário.
      completed: false, // Define o status inicial da tarefa como não concluída.
    };

    setTasks((prevTasks) => [...prevTasks, newTask]); // Adiciona a nova tarefa ao estado.
    setNewTaskTitle(""); // Limpa o campo do título após cadastrar.
    setNewTaskDescription(""); // Limpa o campo da descrição após cadastrar.
  }

  // Função para excluir uma tarefa da lista pelo seu ID.
  function handleDeleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Remove a tarefa com o ID selecionado.
  }

  // Função para alternar o status de concluída/pendente de uma tarefa.
  function handleToggleTask(taskId) {
    setTasks((prevTasks) => // Mapeia o array e inverte a propriedade completed da tarefa.
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  // Função para iniciar o modo de edição carregando o título e a descrição atuais.
  function handleStartEdit(task) {
    setEditingTaskId(task.id); // Define qual tarefa entra em modo de edição guardando seu ID.
    setEditingTitle(task.title); // Preenche o campo com o título atual.
    setEditingDescription(task.description); // Preenche o campo com a descrição atual.
  }

  // Função para salvar as edições de título e descrição realizadas.
  function handleSaveEdit(taskId) {
    if (!editingTitle.trim()) return; // Evita salvar o título como um texto em branco.
    setTasks((prevTasks) => // Atualiza o título e a descrição da tarefa correspondente.
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: editingTitle, description: editingDescription } : task
      )
    );
    setEditingTaskId(null); // Encerra o modo de edição.
  }

  // Função para cancelar a edição sem salvar nenhuma alteração.
  function handleCancelEdit() {
    setEditingTaskId(null); // Limpa o estado do ID em edição.
  }

  // Conta a quantidade de tarefas marcadas como concluídas.
  const completedCount = tasks.filter((task) => task.completed).length;

  // Conta a quantidade de tarefas que continuam pendentes.
  const pendingCount = tasks.length - completedCount;

  return ( // Retorna a estrutura JSX da interface.
    <main> {/* Elemento container principal da aplicação */}
      <header> {/* Cabeçalho da página */}
        <h1>To-Do Pro</h1> {/* Título do sistema */}
        <p>Gerencie suas tarefas com título e descrição.</p> {/* Subtítulo explicativo */}
      </header>

      <section className="task-section"> {/* Seção de gerenciamento de tarefas */}
        <h2>Gerenciador de Tarefas</h2> {/* Subtítulo da seção */}

        {/* Formulário para cadastrar uma nova tarefa */}
        <form onSubmit={handleAddTask} className="add-form">
          <input // Campo de entrada para o título.
            type="text"
            placeholder="Título da tarefa..." // Dica do campo de título.
            value={newTaskTitle} // Valor vinculado ao estado newTaskTitle.
            onChange={(e) => setNewTaskTitle(e.target.value)} // Atualiza o estado do título.
          />
          <textarea // Campo de entrada para a descrição.
            placeholder="Descrição da tarefa (opcional)..." // Dica do campo de descrição.
            value={newTaskDescription} // Valor vinculado ao estado newTaskDescription.
            onChange={(e) => setNewTaskDescription(e.target.value)} // Atualiza o estado da descrição.
            rows="2" // Altura inicial do campo de texto.
          />
          <button type="submit" className="add-btn">Adicionar Tarefa</button> {/* Botão para cadastrar */}
        </form>

        {/* Resumo do total de tarefas */}
        <p className="summary">
          {pendingCount} pendentes | {completedCount} concluídas
        </p>

        {/* Exibe mensagem informativa caso não exista nenhuma tarefa na lista */}
        {tasks.length === 0 && (
          <p className="empty-msg">Nenhuma tarefa cadastrada. Adicione uma tarefa acima!</p>
        )}

        {/* Lista de tarefas */}
        <ul className="task-list">
          {tasks.map((task) => ( // Mapeia as tarefas cadastradas para renderizar cada item.
            <li key={task.id} className={task.completed ? "completed" : "pending"}> {/* Item com classe condicional */}
              
              {/* Se estiver no modo de edição desta tarefa, exibe o formulário de edição */}
              {editingTaskId === task.id ? (
                <div className="edit-container">
                  <input // Campo para editar o título.
                    type="text"
                    value={editingTitle} // Valor vinculado ao estado de edição do título.
                    onChange={(e) => setEditingTitle(e.target.value)} // Atualiza o título em edição.
                  />
                  <textarea // Campo para editar a descrição.
                    value={editingDescription} // Valor vinculado ao estado de edição da descrição.
                    onChange={(e) => setEditingDescription(e.target.value)} // Atualiza a descrição em edição.
                    rows="2" // Altura do campo.
                  />
                  <div className="edit-buttons"> {/* Container para os botões do modo de edição */}
                    <button type="button" onClick={() => handleSaveEdit(task.id)} className="save-btn">Salvar</button> {/* Salvar */}
                    <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancelar</button> {/* Cancelar */}
                  </div>
                </div>
              ) : (
                /* Se NÃO estiver em edição, exibe os dados e botões normais */
                <>
                  <div className="task-info"> {/* Bloco contendo texto do título e descrição */}
                    <strong className="task-title">{task.title}</strong> {/* Título da tarefa */}
                    {task.description && <p className="task-desc">{task.description}</p>} {/* Exibe a descrição se houver */}
                  </div>

                  <div className="actions"> {/* Container para os botões de ação */}
                    <button type="button" onClick={() => handleToggleTask(task.id)} className="toggle-btn"> {/* Alternar status */}
                      {task.completed ? "Reabrir" : "Concluir"}
                    </button>
                    <button type="button" onClick={() => handleStartEdit(task)} className="edit-btn">Editar</button> {/* Editar */}
                    <button type="button" onClick={() => handleDeleteTask(task.id)} className="delete-btn">Excluir</button> {/* Excluir */}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App; // Exporta o componente App para ser renderizado pelo React.