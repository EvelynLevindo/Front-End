import { useState, useEffect } from "react";

function MonitorPerigo(){
    const [contador, setContador] = useState(0);

    // Function usando useEffect => Erro grave de loop infinito

    useEffect(()=>{
        console.log("Executando efeito sem array de depências...");
        set(contador + 1); // Dispara a re-renderização
    });

    return (
    <div>Contador: {contador}</div>
);
}

export default MonitorPerigo;