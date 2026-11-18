// dato de prueba: el texto parece HTML y debe mostrarse como texto
export const REGISTRO = { id: "r1", texto: "Puerta abierta: <img src=x onerror=alert(1)>" };

/** Estado inicial: todavía no se ha revelado nada. */
export function crearEstado() {
    return { revelado: false, mensaje: "Registro pendiente", entrada: null };
}

/** Devuelve el estado tras pulsar. Si ya estaba revelado, devuelve el mismo estado. */
export function revelar(estado) {
    if (estado.revelado) {
        return estado;
    }
    return {
        revelado: true,
        mensaje: "Registro " + REGISTRO.id + " revelado",
        entrada: REGISTRO.texto,
    };
}
