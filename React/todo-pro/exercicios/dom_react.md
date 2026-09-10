# DOM Imperativo e React Declarativo

### Compare as duas abordagens para uma tela que deve mostrar 0 ou 1 tarefa concluída:

**Descreva quais elementos o código imperativo precisaria localizar e modificar.**
+ Resposta: Precisaria buscar os elementos HTML com querySelector e alterar manualmente propriedades como textContent e classList.

**Descreva quais dados o componente React receberia.**
+ Resposta: Receberia apenas o estado ou propriedades contendo os dados da tarefa.

**Explique qual abordagem tende a ficar mais fácil de manter quando a tela crescer.**
+ Resposta: A abordagem declarativa do React. Em vez de rastrear e alterar cada elemento HTML manualmente, você só atualiza os dados (estado) e o React atualiza a interface automaticamente.

**Abra o DevTools do navegador, inspecione o `<main>` e identifique o DOM real gerado pelo React.**
+ Resposta: O DevTools exibe a árvore de elementos HTML reais gerados no navegador, que é o resultado final que o React aplica ao navegador a partir da sua árvore de componentes.