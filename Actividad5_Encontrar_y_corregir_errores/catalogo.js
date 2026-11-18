export const registros = [
    { id: "r1", zona: "entrada", texto: "La puerta se abrió a las 09:10.", fecha: "2026-10-07T09:10:00+02:00" },
    { id: "r2", zona: "entrada", texto: "El lector registró una tarjeta.", fecha: "2026-10-07T09:11:00+02:00" },
    { id: "r3", zona: "almacén", texto: "Falta una caja del inventario.", fecha: "2026-10-07T09:15:00+02:00" },
    { id: "r4", zona: "oficina", texto: "Se imprimió una lista de salida.", fecha: "2026-10-07T09:18:00+02:00" },
    { id: "r4", zona: "oficina", texto: "Registro duplicado para la prueba.", fecha: "2026-10-07T09:18:00+02:00" },
];

export const ID_POR_DEFECTO = "r1";

// catálogo: id -> registro (si un id se repite, se conserva la primera entrada)
const porId = new Map();
for (const registro of registros) {
    if (!porId.has(registro.id)) {
        porId.set(registro.id, registro);
    }
}

export const ids = new Set(porId.keys());

/** Devuelve el registro del catálogo con ese id, o undefined si no existe. */
export function buscarRegistro(id) {
    return porId.get(id);
}

/** Lee ?registro= de la URL (por ejemplo "?registro=r2"). Solo acepta id del catálogo; si no, r1. */
export function elegirId(busqueda) {
    const solicitado = new URLSearchParams(busqueda).get("registro");
    return ids.has(solicitado) ? solicitado : ID_POR_DEFECTO;
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

/** Texto de la ficha de un registro. Lo usan la ventana auxiliar y la alternativa local, para que muestren lo mismo. */
export function describirRegistro(registro) {
    return registro.id + " · " + registro.zona + " · " + registro.texto + " · " + formatearFecha(registro.fecha);
}
