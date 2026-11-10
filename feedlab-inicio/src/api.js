import { API_BASE_URL } from './config.js';

// Contrato: GET /posts devuelve { posts: Publicacion[] }.
export async function obtenerPublicaciones() {
    const response = await fetch(`${API_BASE_URL}/posts`);

    if (!response.ok) {
        throw new Error(`Error ${response.status}: no se pudieron cargar las publicaciones`);
    }

    const datos = await response.json();
    return datos.posts;
}

// TODO sesión 9: implementar registro, login, perfil, preferencias y likes según Swagger.