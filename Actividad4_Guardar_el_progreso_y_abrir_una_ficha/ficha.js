import { buscarRegistro, describirRegistro, elegirId } from "./catalogo.js";

const fichaTexto = document.querySelector("#ficha-texto");
if (!(fichaTexto instanceof HTMLElement)) {
    throw new Error("Falta el elemento #ficha-texto");
}

// el id llega por la URL: solo se acepta si está en el catálogo
const registro = buscarRegistro(elegirId(window.location.search));
fichaTexto.textContent = describirRegistro(registro);
