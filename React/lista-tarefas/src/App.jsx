import { useState } from "react";

import Header from "./components/Header";
import TarefaForm from "./components/TarefaForm";
import TarefaList from "./components/TarefaList";
import { tarefaInicial } from "./data/tarefaMock";
import TarefaFilters from "./components/TarefaFilters";

function App() {
  const [tarefas, setTarefas] = useState(tarefaInicial);

  function handleMudar(id) {
    setTarefas((prevTarefas) =>
      prevTarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  }

  function handleRemover(id) {
    setTarefas((prevTarefas) => prevTarefas.filter((tarefa) => tarefa.id !== id));
  }

  function handleAdicionar(titulo) {
    const novaTarefa = {
      id: Date.now().toString(),
      titulo,
      descricao: "Nova Tarefa do Usuário",
      prioridade: "Normal",
      concluida: false
    };

    setTarefas((prevTarefas) => [novaTarefa, ...prevTarefas]);
  }

  return (
    <main className="app-container">
      <Header />
      <TarefaForm aoAdicionar={handleAdicionar} />
      <TarefaFilters currentFilter={filter} aoFilter={setFilter} />
      <p className="tarefa-contador">Tarefas Cadastradas: {tarefas.length}</p>
      <TarefaList 
        tarefas={tarefas} 
        aoMudar={handleMudar} 
        aoRemover={handleRemover} 
      />
    </main>
  );
}

export default App;