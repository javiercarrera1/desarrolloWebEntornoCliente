import { crearEstado, revelar } from "./reglas.js";

/** Conecta el botón con las reglas y dibuja el resultado en la pantalla. */
export function conectar(boton, mensaje, panel, lista) {
    let estado = crearEstado();

    boton.addEventListener("click", () => {
        const nuevo = revelar(estado);
        if (nuevo === estado) {
            return; // ya estaba revelado: no se añade nada más
        }
        estado = nuevo;
        mostrar(estado);
    });

    // solo se llama cuando el estado cambia, es decir, una vez
    function mostrar(estadoActual) {
        mensaje.textContent = estadoActual.mensaje;
        panel.classList.add("descubierta");

        const entrada = document.createElement("li");
        entrada.textContent = estadoActual.entrada;
        lista.append(entrada);
    }
}
