import { API_BASE_URL } from './config.js';

// Contrato: GET /posts devuelve { posts, total, limit, offset, hasMore }.
// REVISAR (sesión 5): antes esta función devolvía solo datos.posts (sesión 1).
// Ahora devuelve el objeto completo, porque «Mostrar más» necesita total y hasMore.
// Sesión 5: acepta limit, offset, topic, search y sort. Solo envía los que tienen valor.
export async function obtenerPublicaciones({ limit, offset, topic, search, sort } = {}) {
    const parametros = new URLSearchParams();

    for (const [nombre, valor] of Object.entries({ limit, offset, topic, search, sort })) {
        if (valor !== undefined && valor !== '') {
            parametros.set(nombre, valor);
        }
    }

    const consulta = parametros.toString();
    const url = consulta ? `${API_BASE_URL}/posts?${consulta}` : `${API_BASE_URL}/posts`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error ${response.status}: no se pudieron cargar las publicaciones`);
    }

    const datos = await response.json();

    if (!Array.isArray(datos.posts)) {
        throw new TypeError('La API no ha devuelto la lista de publicaciones');
    }
    return datos;
}

// Sesión 5: pide el detalle de una publicación (GET /posts/{id}).
export async function obtenerPublicacion(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${encodeURIComponent(id)}`);

    if (!response.ok) {
        throw new Error(`Error ${response.status}: no se pudo cargar la publicación`);
    }

    const datos = await response.json();

    if (!datos.post) {
        throw new TypeError('La API no ha devuelto la publicación');
    }
    return datos.post;
}

// TODO sesión 9: implementar registro, login, perfil, preferencias y likes según Swagger.