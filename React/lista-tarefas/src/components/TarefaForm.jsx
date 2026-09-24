// Formulário de cadastro de nova tarefa com semântica de acessibilidade

import { useState } from "react";

function TarefaForm({aoAddTarefa}) {

    // Adicionando os useState
    const [titulo, setTitulo] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        // Verificar se o título da tarefa é válida
        if (titulo.trim().length < 4) {
            setError("O título da tarefa deve ter pelo menos 4 caracteres...");
            return;
        }

        // Simular a criação de tarefa
        aoAddTarefa(titulo.trim()); // Adiciona a título da função de CallBack
        setError(""); // Limpa os campos de erro e título
        setTitulo("");
    }

    return (
        <form className="tarefa-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Digite o título da Tarefa"
                    value = {titulo}
                    onChange={(e) => setTitulo(e.target.value)} 
                />
                <button type="submit" className="btn-add">Adicionar</button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </form>
    )
}

export default TarefaForm;