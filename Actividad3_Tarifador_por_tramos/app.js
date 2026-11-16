import { calcularCoste } from "./tarifa.js";

const formulario = document.getElementById("formulario");
const salida = document.getElementById("salida");
const importe = document.getElementById("importe");

// solo para mostrar el importe en euros
const formateadorEuros = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const texto = document.getElementById("consumo").value.trim();

    // si no parece un número, NaN (Number("") daría 0)
    const consumo = /^-?\d+(\.\d+)?$/.test(texto) ? Number(texto) : NaN;

    const resultado = calcularCoste(consumo);

    salida.textContent = JSON.stringify(resultado, null, 2);

    // de céntimos a euros, solo para mostrar
    importe.textContent = resultado.ok
        ? "Coste: " + formateadorEuros.format(resultado.valor / 100)
        : "";
});
