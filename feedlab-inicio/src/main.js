import { obtenerPublicaciones } from './api.js';

const estado = document.getElementById('feed-status');

async function cargarPublicaciones() {
    estado.textContent = 'Cargando publicaciones...';

    try {
        const posts = await obtenerPublicaciones();

        if (posts.length === 0) {
            estado.textContent = 'No hay publicaciones.';
            return;
        }

        estado.textContent = `${posts.length} publicaciones`;
    } catch (error) {
        estado.textContent = error.message;
    }
}

cargarPublicaciones();

// TODO sesión 1: cargar y representar temáticas (GET /topics).
// TODO sesión 4: filtros de publicaciones y comparación entre filtrado en cliente y en API.
// TODO sesión 5: ordenación, paginación con servidor (limit/offset), botón «Mostrar más» y vista de detalle (GET /posts/{id}).
// TODO sesión 6: estadísticas con reduce sobre las publicaciones cargadas.
// TODO sesión 9: autenticación (registro/login/logout), restaurar likes (GET /users/me/likes) y crear publicaciones (POST /posts).
// TODO sesión 10: cálculo del feed personalizado «Para ti» en el cliente según intereses.
// TODO sesiones 11 y 12: separación en módulos/repositorio y pruebas finales.