// Botões de seleção do status da tarefa

function TarefaFilters({currentFilter, aoFiltrar}) {
    const filters = [
        {key: "all", label: "Todas"},
        {key: "pendentes", label: "Pendentes"},
        {key: "concluida", label: "Concluída"},
    ];

    return (
        <div className="tarefa-filters">
            {filters.map((f) => (
                <button key={f.key} type="button" className={`filter-btn ${currentFilter === f.key ? "active" : ""}`} onClick={() => aoFiltrar(f.key)}>{f.label}</button>
            ))}
        </div>
    );
}

export default TarefaFilters;