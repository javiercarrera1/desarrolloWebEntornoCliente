// Regla única de la unidad: 10 puntos por tema de interés + min(likes, 20).

// Sesión 3: calcula la puntuación de una publicación (25 por tema de interés + likes, máximo 20).
// Es pura: no modifica lo que recibe ni usa nada de fuera. Lanza TypeError si los datos no son válidos.
// REVISAR (sesión 3): el comentario de arriba (del profesor) dice 10 puntos por tema; el texto de la sesión pide 25.
export function puntuarPublicacion(publicacion, intereses) {
    if (
        !publicacion ||
        typeof publicacion !== 'object' ||
        !Number.isInteger(publicacion.likes) ||
        publicacion.likes < 0 ||
        !Array.isArray(intereses)
    ) {
        throw new TypeError('Datos inválidos');
    }

    const puntosTema = intereses.includes(publicacion.topic) ? 25 : 0;
    const puntosLikes = Math.min(publicacion.likes, 20);

    return puntosTema + puntosLikes;
}

// Sesión 3: devuelve una función que recuerda los intereses del usuario (closure)
// y usa puntuarPublicacion para no repetir la fórmula.
export function crearPuntuador(intereses) {
    if (!Array.isArray(intereses)) {
        throw new TypeError('intereses debe ser un array');
    }

    const interesesUsuario = [...intereses];

    return function (publicacion) {
        return puntuarPublicacion(publicacion, interesesUsuario);
    };
}

// TODO sesión 10: recuperar páginas del catálogo para evaluar todo el conjunto y ordenarParaTi(lista, intereses) con desempate por id.
