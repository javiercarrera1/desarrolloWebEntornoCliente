import { cargarProgreso, guardarProgreso, revelarSiguiente } from "../../progreso.js";

const boton = document.querySelector("#revelarr");
const estado = document.querySelector("#estado");

let progreso = cargarProgreso().progreso;
estado.textContent = "Registros vistos: " + progreso.vistos.join(", ");

boton.addEventListener("click", () => {
    progreso = revelarSiguiente(progreso);
    estado.textContent = "Registros vistos: " + progreso.vistos.join(", ");
    guardarProgreso(progreso);
});
