import { buscarRegistro, describirRegistro } from "./catalogo.js";
import { cargarProgreso, guardarProgreso, registrarVisto } from "./progreso.js";

const titulo = document.querySelector("#titulo");
const texto = document.querySelector("#texto");
const vistos = document.querySelector("#vistos");
const aviso = document.querySelector("#aviso");
const botonFicha = document.querySelector("#abrir-ficha");
const fichaLocal = document.querySelector("#ficha-local");
const fichaTexto = document.querySelector("#ficha-texto");

if (!(titulo instanceof HTMLElement)
    || !(texto instanceof HTMLElement)
    || !(vistos instanceof HTMLElement)
    || !(aviso instanceof HTMLElement)
    || !(botonFicha instanceof HTMLButtonElement)
    || !(fichaLocal instanceof HTMLElement)
    || !(fichaTexto instanceof HTMLElement)) {
    throw new Error("Falta un elemento de la pantalla");
}

const AVISOS = {
    nuevo: "",
    recuperado: "Progreso recuperado.",
    rechazado: "Los datos guardados no eran válidos: se ha empezado de nuevo.",
};

const cargado = cargarProgreso();
let progreso = cargado.progreso;
aviso.textContent = AVISOS[cargado.origen];
mostrar(progreso);

function mostrar(actual) {
    const registro = buscarRegistro(actual.registroActual);
    titulo.textContent = "Registro " + registro.id;
    texto.textContent = registro.texto;
    vistos.textContent = "Vistos: " + actual.vistos.join(", ");
}

function elegir(id) {
    progreso = registrarVisto(progreso, id);
    mostrar(progreso);
    if (guardarProgreso(progreso)) {
        aviso.textContent = "";
    } else {
        aviso.textContent = "El progreso no se ha guardado: puedes seguir jugando, pero quizá no se conserve al recargar.";
    }
}

function conectarBoton(selector, id) {
    const boton = document.querySelector(selector);
    if (!(boton instanceof HTMLButtonElement)) {
        throw new Error("Falta el botón " + selector);
    }
    boton.addEventListener("click", () => elegir(id));
}

conectarBoton("#ver-r1", "r1");
conectarBoton("#ver-r2", "r2");
conectarBoton("#ver-r3", "r3");
conectarBoton("#ver-r4", "r4");

// window.open va dentro del clic, que es cuando el navegador lo permite
botonFicha.addEventListener("click", () => {
    const url = new URL("./ficha.html", window.location.href);
    url.searchParams.set("registro", progreso.registroActual);
    const auxiliar = window.open(url.href, "ficha-registro", "popup,width=640,height=520");
    if (auxiliar === null) {
        // ventana bloqueada: la misma ficha se muestra en esta página
        fichaTexto.textContent = describirRegistro(buscarRegistro(progreso.registroActual));
        fichaLocal.hidden = false;
        return;
    }
    fichaLocal.hidden = true;
    auxiliar.focus();
});
