// Rendirizar a Lista de Tarefas
import TarefaItem from "./TarefaItem";

function TarefaList({tarefas=[], aoMudarTarefa, aoRemoverTarefa}) {
    if (tarefas.length === 0) {
        return <p className="empty">Nenhuma Tarefa Encontrada</p>
    }

    return (
        <div className="tarefa-grid">
            {tarefas.map((tarefa) =>(
                <TarefaItem
                    key={tarefa.id}
                    id={tarefa.id}
                    titulo={tarefa.titulo}
                    concluida={tarefa.concluida}
                    mudar={aoMudarTarefa}
                    remover={aoRemoverTarefa}
                />
            ))}
        </div>
    );
}

export default TarefaList;