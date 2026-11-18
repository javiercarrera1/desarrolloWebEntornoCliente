import { cargarProgreso, guardarProgreso, revelarSiguiente } from "./progreso.js";

/** Busca un elemento y comprueba que existe y es del tipo esperado. Si no, falla con un mensaje claro. */
export function buscar(selector, Tipo, raiz = document) {
    const elemento = raiz.querySelector(selector);
    if (!(elemento instanceof Tipo)) {
        throw new Error("Falta el elemento " + selector + " en la pantalla");
    }
    return elemento;
}

/** Conecta la pantalla: carga el progreso, lo muestra y registra UN listener en el botón. */
export function iniciar(raiz = document, almacen) {
    const boton = buscar("#revelar", HTMLButtonElement, raiz);
    const estado = buscar("#estado", HTMLElement, raiz);
    const aviso = buscar("#aviso", HTMLElement, raiz);

    const cargado = cargarProgreso(almacen);
    let progreso = cargado.progreso;
    if (cargado.origen === "rechazado") {
        aviso.textContent = "Los datos guardados no eran válidos: se ha empezado de nuevo.";
    }
    mostrar();

    boton.addEventListener("click", () => {
        progreso = revelarSiguiente(progreso);
        mostrar();
        aviso.textContent = guardarProgreso(progreso, almacen)
            ? ""
            : "El progreso no se ha guardado: quizá no se conserve al recargar.";
    });

    function mostrar() {
        estado.textContent = "Registros vistos: " + progreso.vistos.join(", ");
    }
}
