// Actividad 4. Analizador de rondas

// una puntuación vale si es un número finito y no es negativa
function esValida(puntuacion) {
    return Number.isFinite(puntuacion) && puntuacion >= 0;
}

/**
 * Analiza un array de puntuaciones ignorando las entradas inválidas.
 * Versión con for...of.
 *
 * @param {Array} puntuaciones - Lista de puntuaciones; puede traer valores inválidos.
 * @returns {{total: number, media: number|null, maximo: number|null, cantidad: number}}
 *   Si no hay ninguna puntuación válida, media y maximo son null.
 */
export function analizarRondas(puntuaciones) {
    // si no llega un array se trata como una colección vacía
    const lista = Array.isArray(puntuaciones) ? puntuaciones : [];

    let total = 0;
    let maximo = null;
    let cantidad = 0;

    // una vuelta por elemento: termina cuando se acaba el array
    for (const puntuacion of lista) {
        if (esValida(puntuacion)) {
            total += puntuacion;
            cantidad += 1;
            if (maximo === null || puntuacion > maximo) {
                maximo = puntuacion;
            }
        }
    }

    const media = cantidad === 0 ? null : total / cantidad;

    return { total, media, maximo, cantidad };
}

/**
 * Hace lo mismo que analizarRondas, pero con métodos de array.
 *
 * @param {Array} puntuaciones - Lista de puntuaciones; puede traer valores inválidos.
 * @returns {{total: number, media: number|null, maximo: number|null, cantidad: number}}
 */
export function analizarRondasConMetodos(puntuaciones) {
    const lista = Array.isArray(puntuaciones) ? puntuaciones : [];

    // filter se queda con las válidas y reduce las suma
    const validas = lista.filter(esValida);
    const cantidad = validas.length;
    const total = validas.reduce((suma, puntuacion) => suma + puntuacion, 0);
    const maximo = cantidad === 0 ? null : Math.max(...validas);
    const media = cantidad === 0 ? null : total / cantidad;

    return { total, media, maximo, cantidad };
}
