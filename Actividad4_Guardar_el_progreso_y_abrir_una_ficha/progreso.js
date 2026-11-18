import { ids } from "./catalogo.js";

export const CLAVE = "registros-ut3:v1:progreso";

/** Progreso con el que se empieza cuando no hay datos o no son válidos. */
export function crearProgresoInicial() {
    return { version: 1, registroActual: "r1", vistos: ["r1"] };
}

/** Comprueba versión, tipos e id. Un JSON bien formado puede seguir siendo incorrecto. */
export function esProgreso(valor) {
    return valor !== null
        && typeof valor === "object"
        && valor.version === 1
        && ids.has(valor.registroActual)
        && Array.isArray(valor.vistos)
        && valor.vistos.every((id) => ids.has(id))
        && new Set(valor.vistos).size === valor.vistos.length;
}

/**
 * Lee el progreso guardado. Devuelve { progreso, origen }, con origen:
 * "nuevo" (no había datos), "recuperado" (datos válidos) o "rechazado" (datos incorrectos o sin acceso).
 */
export function cargarProgreso(almacen) {
    try {
        const destino = almacen ?? window.localStorage;
        const texto = destino.getItem(CLAVE);
        if (texto === null) {
            return { progreso: crearProgresoInicial(), origen: "nuevo" };
        }
        const valor = JSON.parse(texto);
        if (!esProgreso(valor)) {
            return { progreso: crearProgresoInicial(), origen: "rechazado" };
        }
        return { progreso: valor, origen: "recuperado" };
    } catch (error) {
        return { progreso: crearProgresoInicial(), origen: "rechazado" };
    }
}

/** Guarda el progreso como JSON. Devuelve true si se guardó y false si no se pudo. */
export function guardarProgreso(progreso, almacen) {
    try {
        if (!esProgreso(progreso)) {
            return false;
        }
        const destino = almacen ?? window.localStorage;
        destino.setItem(CLAVE, JSON.stringify(progreso));
        return true;
    } catch (error) {
        return false;
    }
}

/** Devuelve un progreso nuevo con ese registro como actual y añadido a los vistos (sin repetir). */
export function registrarVisto(progreso, id) {
    if (!ids.has(id)) {
        return progreso;
    }
    const vistos = progreso.vistos.includes(id) ? [...progreso.vistos] : [...progreso.vistos, id];
    return { version: progreso.version, registroActual: id, vistos: vistos };
}
