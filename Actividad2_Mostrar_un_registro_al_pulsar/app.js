import { conectar } from "./pantalla.js";

const panel = document.querySelector("#panel");
const mensaje = document.querySelector("#estado");
const boton = document.querySelector("#revelar");
const lista = document.querySelector("#registros");

if (!(panel instanceof HTMLElement)
    || !(mensaje instanceof HTMLParagraphElement)
    || !(boton instanceof HTMLButtonElement)
    || !(lista instanceof HTMLUListElement)) {
    throw new Error("Falta un elemento de la pantalla de registros");
}

conectar(boton, mensaje, panel, lista);
