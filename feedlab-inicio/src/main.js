// Sesión 1: obtenerPublicaciones y obtenerPublicacion piden los datos a la API (api.js).
// Sesiones 2, 4 y 5: funciones de feed.js. Sesión 3: puntuación de recomendaciones.js
import { obtenerPublicaciones, obtenerPublicacion } from './api.js';
import { seleccionarPublicaciones, prepararTarjetas, ordenarPorRecientes, ordenarPorPopulares } from './feed.js';
import { crearPuntuador } from './recomendaciones.js';

const estado = document.getElementById('feed-status');
// Hueco donde van las tarjetas (const contenedor)
const contenedor = document.getElementById('posts');
const buscador = document.getElementById('search');
const selectorTema = document.getElementById('topic');
const selectorOrden = document.getElementById('order');
// REVISAR (sesión 5): el texto llama a este botón #load-more-btn; en el HTML es #show-more.
const botonMas = document.getElementById('show-more');

const dialogo = document.getElementById('post-dialog');
const dialogoAutor = document.getElementById('dialog-author');
const dialogoCerrar = document.getElementById('dialog-close-btn');
const dialogoCuerpo = document.getElementById('dialog-body');
const dialogoTema = document.getElementById('dialog-topic');
const dialogoMeta = document.getElementById('dialog-meta');

// Sesión 5: estado de la paginación. limit es fijo y offset avanza de 12 en 12.
const limit = 12;
let offset = 0;
// Publicaciones descargadas hasta ahora (se van acumulando con «Mostrar más»).
let publicaciones = [];
let total = 0;
let hayMas = false;
// Sesión 5: número de la última petición, para ignorar respuestas antiguas.
let peticionActual = 0;

// Para cambiar el criterio, cambia solo esta línea. Por ejemplo: post => post.topic === 'JavaScript'
// Sesión 2: condición de selección (callback) que se aplica a las publicaciones descargadas.
const criterio = post => true;

// Sesión 2: convierte un post de la API en los datos que necesita la tarjeta (callback).
const transformadora = post => ({
    id: post.id,
    tema: post.topic,
    autor: post.author,
    contenido: post.content,
    pie: `♡ ${post.likes} · ${post.views} vistas`
});

// Sesión 1: crea una tarjeta con createElement y textContent (texto seguro, sin HTML).
// Sesión 5: añade el botón «Ver detalle».
function crearTarjeta(datos) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'card';

    const arriba = document.createElement('div');
    arriba.className = 'card-top';
    const tema = document.createElement('span');
    tema.className = 'badge';
    tema.textContent = datos.tema;
    arriba.append(tema);

    const autor = document.createElement('h3');
    autor.textContent = datos.autor;

    const contenido = document.createElement('p');
    contenido.textContent = datos.contenido;

    const abajo = document.createElement('div');
    abajo.className = 'card-bottom';
    const likes = document.createElement('span');
    likes.textContent = datos.pie;
    const detalle = document.createElement('button');
    detalle.type = 'button';
    detalle.textContent = 'Ver detalle';
    detalle.addEventListener('click', () => abrirDetalle(datos.id));
    abajo.append(likes, detalle);

    tarjeta.append(arriba, autor, contenido, abajo);
    return tarjeta;
}

// Sesión 5: lee lo que ha elegido la persona para pedirlo al servidor.
// REVISAR (sesión 5): el desplegable tiene la opción «Para ti» (sesión 10); mientras tanto se pide como «recent».
function leerFiltros() {
    return {
        topic: selectorTema.value,
        search: buscador.value.trim(),
        sort: selectorOrden.value === 'popular' ? 'popular' : 'recent'
    };
}

// Sesión 5: ordena las publicaciones descargadas con las funciones de feed.js.
function ordenar(lista, orden) {
    return orden === 'popular' ? ordenarPorPopulares(lista) : ordenarPorRecientes(lista);
}

// Sesiones 2 y 5: elige, ordena y dibuja las tarjetas. Muestra u oculta «Mostrar más».
// Si no hay resultados, muestra un mensaje.
function mostrarPublicaciones() {
    const elegidas = seleccionarPublicaciones(publicaciones, criterio);
    const ordenadas = ordenar(elegidas, leerFiltros().sort);
    const tarjetas = prepararTarjetas(ordenadas, transformadora);

    contenedor.replaceChildren(...tarjetas.map(crearTarjeta));
    botonMas.style.display = hayMas ? '' : 'none';

    if (tarjetas.length === 0) {
        estado.textContent = 'No se encontraron publicaciones que coincidan con los criterios seleccionados';
        return;
    }
    estado.textContent = `${tarjetas.length} de ${total} publicaciones`;
}

// Sesiones 1 y 5: pide una página al servidor y muestra los estados (cargando, error, vacío).
// Con reiniciar = true empieza de cero (offset 0); si no, añade la página siguiente.
async function cargarPublicaciones(reiniciar) {
    const numero = ++peticionActual;
    if (reiniciar) {
        offset = 0;
    }
    estado.textContent = 'Cargando publicaciones...';

    try {
        const datos = await obtenerPublicaciones({ limit, offset, ...leerFiltros() });
        if (numero !== peticionActual) return;

        publicaciones = reiniciar ? datos.posts : [...publicaciones, ...datos.posts];
        total = datos.total ?? publicaciones.length;
        hayMas = Boolean(datos.hasMore);
        mostrarPublicaciones();
    } catch (error) {
        if (numero !== peticionActual) return;
        if (!reiniciar) {
            offset -= limit;
        }
        estado.textContent = error.message;
    }
}

// Sesión 5: abre el diálogo y lo rellena con el detalle (GET /posts/{id}). Todo con textContent.
async function abrirDetalle(id) {
    dialogoAutor.textContent = '';
    dialogoTema.textContent = '';
    dialogoMeta.textContent = '';
    dialogoCuerpo.textContent = 'Cargando detalle...';
    if (!dialogo.open) {
        dialogo.showModal();
    }

    try {
        const post = await obtenerPublicacion(id);
        const fecha = new Date(post.publishedAt);
        const textoFecha = Number.isNaN(fecha.getTime()) ? 'Fecha desconocida' : fecha.toLocaleDateString('es-ES');

        dialogoAutor.textContent = post.author;
        dialogoCuerpo.textContent = post.content;
        dialogoTema.textContent = post.topic;
        dialogoMeta.textContent = `${textoFecha} · ♡ ${post.likes}`;
    } catch (error) {
        dialogoCuerpo.textContent = error.message;
    }
}

// Sesión 5: cualquier cambio de búsqueda, tema u orden vuelve a pedir la primera página.
// REVISAR (sesión 5): en la sesión 4 se filtraba en el navegador (buscarPublicaciones); ahora lo hace el servidor.
buscador.addEventListener('input', () => cargarPublicaciones(true));
selectorTema.addEventListener('change', () => cargarPublicaciones(true));
selectorOrden.addEventListener('change', () => cargarPublicaciones(true));

// Sesión 5: «Mostrar más» pide la página siguiente.
botonMas.addEventListener('click', () => {
    offset += limit;
    cargarPublicaciones(false);
});

dialogoCerrar.addEventListener('click', () => dialogo.close());

cargarPublicaciones(true);

// Sesión 3: comprobación de las puntuaciones. Los resultados salen en la consola.
function comprobarPuntuacion() {
    const muestra = [
        { id: '1', topic: 'JavaScript', likes: 5 },
        { id: '2', topic: 'Videojuegos', likes: 12 },
        { id: '3', topic: 'JavaScript', likes: 25 }
    ];
    const antes = JSON.stringify(muestra);

    const puntuarParaAna = crearPuntuador(['JavaScript']);
    const puntuarParaCarlos = crearPuntuador(['Videojuegos']);

    for (const post of muestra) {
        console.log(`Post ${post.id} -> Ana: ${puntuarParaAna(post)}, Carlos: ${puntuarParaCarlos(post)}`);
    }

    console.log('Las publicaciones no cambian:', JSON.stringify(muestra) === antes);

    const invalidas = [
        () => puntuarParaAna({ id: '4', topic: 'CSS', likes: -1 }),
        () => puntuarParaAna(null),
        () => puntuarParaAna({ id: '5', topic: 'CSS' }),
        () => crearPuntuador('JavaScript')
    ];
    for (const intento of invalidas) {
        try {
            intento();
            console.log('Error: no ha lanzado excepción');
        } catch (error) {
            console.log('Entrada inválida ->', error.name);
        }
    }
}

comprobarPuntuacion();

// TODO sesión 1: cargar y representar temáticas (GET /topics).
// TODO sesión 4: filtros de publicaciones y comparación entre filtrado en cliente y en API.
// TODO sesión 6: estadísticas con reduce sobre las publicaciones cargadas.
// TODO sesión 9: autenticación (registro/login/logout), restaurar likes (GET /users/me/likes) y crear publicaciones (POST /posts).
// TODO sesión 10: cálculo del feed personalizado «Para ti» en el cliente según intereses.
// TODO sesiones 11 y 12: separación en módulos/repositorio y pruebas finales.