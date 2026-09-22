// Formulário de cadastro de nova tarefa com semântica de acessibilidade

function TarefaForm({aoAddTarefa}) {
    function handleSubmit(e) {
        e.preventDefault();
        // Simular a criação de tarefa
        aoAddTarefa("Nova Tarefa Adicionada");
    }

    return (
        <form onSubmit={handleSubmit} className="tarefa-form">
            <label htmlFor="">Título da Tarefa</label>
            <div className="input-group">
                <input 
                    id="tarefa-titulo"
                    type="text" 
                    placeholder="Ex: Revisar Documentação"
                    required
                />
                <button type="submit" className="btn-primario">Adicionar</button>
            </div>
        </form>
    )
}

export default TarefaForm;