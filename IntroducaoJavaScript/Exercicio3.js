console.log("=========== NÚMEROS PARES DO 1 AO 20 ===========");

for (i = 1; i <= 20; i++){
    let resto = (i % 2)
    if (resto == 0){
        console.log(i)
    }
}