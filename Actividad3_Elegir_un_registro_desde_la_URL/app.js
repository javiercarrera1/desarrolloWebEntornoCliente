import { ids, buscarRegistro, elegirId, formatearFecha } from "./catalogo.js";

const titulo = document.querySelector("#titulo");
const zona = document.querySelector("#zona");
const texto = document.querySelector("#texto");
const fecha = document.querySelector("#fecha");

if (!(titulo instanceof HTMLElement)
    || !(zona instanceof HTMLElement)
    || !(texto instanceof HTMLElement)
    || !(fecha instanceof HTMLElement)) {
    throw new Error("Falta un elemento de la pantalla");
}

mostrar(elegirId(window.location.search));

function mostrar(id) {
    const registro = buscarRegistro(id);
    titulo.textContent = "Registro " + registro.id;
    zona.textContent = "Zona: " + registro.zona;
    texto.textContent = registro.texto;
    fecha.textContent = "Fecha: " + formatearFecha(registro.fecha);
}

// cambia de registro sin recargar: guarda la nueva URL en el historial
function seleccionar(id) {
    if (!ids.has(id)) {
        return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("registro", id);
    window.history.pushState({ registro: id }, "", url);
    mostrar(id);
}

// pushState no avisa a la pantalla: lo hace seleccionar. Atrás y adelante sí disparan popstate
window.addEventListener("popstate", () => {
    mostrar(elegirId(window.location.search));
});

function conectarBoton(selector, id) {
    const boton = document.querySelector(selector);
    if (!(boton instanceof HTMLButtonElement)) {
        throw new Error("Falta el botón " + selector);
    }
    boton.addEventListener("click", () => seleccionar(id));
}

conectarBoton("#ver-r1", "r1");
conectarBoton("#ver-r2", "r2");
conectarBoton("#ver-r3", "r3");
conectarBoton("#ver-r4", "r4");
