// Actividad 3. Tarifador por tramos

const LIMITE_TRAMO_1 = 100;
const LIMITE_TRAMO_2 = 200;
const PRECIO_TRAMO_1 = 12;   // céntimos por unidad
const PRECIO_TRAMO_2 = 18;
const PRECIO_TRAMO_3 = 25;

/**
 * Calcula el coste en céntimos de un consumo, acumulando los tramos.
 * Se trabaja en céntimos porque los decimales de JavaScript no son exactos
 * (0.1 + 0.2 da 0.30000000000000004) y con enteros no hay ese problema.
 * Solo se pasa a euros al mostrar el resultado.
 *
 * @param {number} consumo - Unidades consumidas (entero, 0 o más).
 * @returns {{ok: true, valor: number} | {ok: false, errores: string[]}}
 *   El coste en céntimos, o la lista de errores si la entrada no es válida.
 */
export function calcularCoste(consumo) {
    // no es entero (decimal, texto, NaN...)
    if (!Number.isInteger(consumo)) {
        return { ok: false, errores: ["El consumo debe ser un número entero"] };
    }
    // negativo
    if (consumo < 0) {
        return { ok: false, errores: ["El consumo no puede ser negativo"] };
    }

    // unidades que caen en cada tramo
    const enTramo1 = Math.min(consumo, LIMITE_TRAMO_1);
    const enTramo2 = Math.min(
        Math.max(consumo - LIMITE_TRAMO_1, 0),
        LIMITE_TRAMO_2 - LIMITE_TRAMO_1
    );
    const enTramo3 = Math.max(consumo - LIMITE_TRAMO_2, 0);

    // cada tramo por su precio
    const centimos =
        enTramo1 * PRECIO_TRAMO_1 +
        enTramo2 * PRECIO_TRAMO_2 +
        enTramo3 * PRECIO_TRAMO_3;

    return { ok: true, valor: centimos };
}
