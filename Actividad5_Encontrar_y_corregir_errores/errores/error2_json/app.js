import { CLAVE, crearProgresoInicial, guardarProgreso, revelarSiguiente } from "../../progreso.js";

const boton = document.querySelector("#revelar");
const estado = document.querySelector("#estado");

const guardado = JSON.parse(window.localStorage.getItem(CLAVE));
let progreso = guardado ?? crearProgresoInicial();
estado.textContent = "Registros vistos: " + progreso.vistos.join(", ");

boton.addEventListener("click", () => {
    progreso = revelarSiguiente(progreso);
    estado.textContent = "Registros vistos: " + progreso.vistos.join(", ");
    guardarProgreso(progreso);
});
