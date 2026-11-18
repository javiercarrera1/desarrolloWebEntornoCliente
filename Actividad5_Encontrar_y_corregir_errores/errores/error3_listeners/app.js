import { cargarProgreso, guardarProgreso, revelarSiguiente } from "../../progreso.js";

const boton = document.querySelector("#revelar");
const estado = document.querySelector("#estado");

let progreso = cargarProgreso().progreso;
estado.textContent = "Registros vistos: " + progreso.vistos.join(", ");

function revelarYMostrar() {
    progreso = revelarSiguiente(progreso);
    estado.textContent = "Registros vistos: " + progreso.vistos.join(", ");
}

function revelarYGuardar() {
    progreso = revelarSiguiente(progreso);
    guardarProgreso(progreso);
}

boton.addEventListener("click", revelarYMostrar);
boton.addEventListener("click", revelarYGuardar);
