export const registros = [
    { id: "r1", zona: "entrada", texto: "La puerta se abrió a las 09:10.", fecha: "2026-10-07T09:10:00+02:00" },
    { id: "r2", zona: "entrada", texto: "El lector registró una tarjeta.", fecha: "2026-10-07T09:11:00+02:00" },
    { id: "r3", zona: "almacén", texto: "Falta una caja del inventario.", fecha: "2026-10-07T09:15:00+02:00" },
    { id: "r4", zona: "oficina", texto: "Se imprimió una lista de salida.", fecha: "2026-10-07T09:18:00+02:00" },
    { id: "r4", zona: "oficina", texto: "Registro duplicado para la prueba.", fecha: "2026-10-07T09:18:00+02:00" },
];

function comprobarLista(lista) {
    if (!Array.isArray(lista)) {
        throw new TypeError("Los registros deben llegar en un array");
    }
}

/** Set con los id sin repetir. */
export function idsUnicos(lista) {
    comprobarLista(lista);
    return new Set(lista.map(({ id }) => id));
}

/** Map id -> registro. Si un id se repite, se conserva la primera entrada. */
export function primerRegistroPorId(lista) {
    comprobarLista(lista);
    const porId = new Map();
    for (const registro of lista) {
        if (!porId.has(registro.id)) {
            porId.set(registro.id, registro);
        }
    }
    return porId;
}

/** Map zona -> registros de esa zona, sin id repetidos. */
export function agruparPorZona(lista) {
    const porZona = new Map();
    for (const registro of primerRegistroPorId(lista).values()) {
        if (!porZona.has(registro.zona)) {
            porZona.set(registro.zona, []);
        }
        porZona.get(registro.zona).push(registro);
    }
    return porZona;
}

/** Map zona -> cuántos registros diferentes tiene. */
export function contarPorZona(lista) {
    const cuentas = new Map();
    for (const [zona, delaZona] of agruparPorZona(lista)) {
        cuentas.set(zona, delaZona.length);
    }
    return cuentas;
}

const formato = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
});

/** Fecha ISO 8601 -> texto en español. Lanza TypeError si la fecha no es válida. */
export function formatearFecha(texto) {
    const instante = new Date(texto);
    if (Number.isNaN(instante.getTime())) {
        throw new TypeError("Fecha inválida");
    }
    return formato.format(instante);
}
