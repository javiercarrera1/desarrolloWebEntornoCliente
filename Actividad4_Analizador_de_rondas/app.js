import { analizarRondas, analizarRondasConMetodos } from "./rondas.js";

const formulario = document.getElementById("formulario");
const salida = document.getElementById("salida");
const comparacion = document.getElementById("comparacion");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const texto = document.getElementById("puntuaciones").value;

    // cada trozo entre comas pasa a número; lo que no parece un número queda como NaN
    const puntuaciones = texto.split(",").map((trozo) => {
        const limpio = trozo.trim();
        return /^-?\d+(\.\d+)?$/.test(limpio) ? Number(limpio) : NaN;
    });

    const resultado = analizarRondas(puntuaciones);
    const resultadoMetodos = analizarRondasConMetodos(puntuaciones);

    salida.textContent = JSON.stringify(resultado, null, 2);

    // las dos versiones tienen que dar lo mismo
    comparacion.textContent =
        JSON.stringify(resultado) === JSON.stringify(resultadoMetodos)
            ? "Con métodos de array: mismo resultado"
            : "Con métodos de array: resultado distinto";
});
