// Sesión 2: devuelve una lista nueva con los posts que cumplen la condición (predicado).
export function seleccionarPublicaciones(posts, predicado) {
    return posts.filter(predicado);
}

// Sesión 2: devuelve una lista nueva, de la misma longitud, con cada post transformado.
export function prepararTarjetas(posts, transformadora) {
    return posts.map(transformadora);
}

// Sesión 4: quita espacios y pasa a minúsculas para comparar textos.
function normalizar(texto) {
    return texto.trim().toLocaleLowerCase('es');
}

// Sesión 4: filtra por texto (en contenido o autor) y por tema a la vez.
// Sin texto o sin tema, no filtra por ese dato. No modifica la lista original.
// REVISAR (sesión 5): main.js ya no la usa, porque ahora filtra y busca el servidor
// (parámetros topic y search). Se deja aquí como filtrado en cliente (sesión 4).
export function buscarPublicaciones(lista, texto = '', tema = '') {
    const consulta = normalizar(texto);

    return lista.filter(post => {
        const coincideTema = !tema || post.topic === tema;
        const coincideTexto = !consulta
            || normalizar(post.content).includes(consulta)
            || normalizar(post.author).includes(consulta);

        return coincideTema && coincideTexto;
    });
}

// Sesión 5: fecha de publicación como número (si no es válida, 0).
function tiempoDe(post) {
    return Date.parse(post.publishedAt) || 0;
}

// Sesión 5: lista nueva con las más recientes primero. Si empatan, desempata por id.
// REVISAR (sesión 5): el TODO inicial la llamaba ordenarRecientes; el texto la llama ordenarPorRecientes.
export function ordenarPorRecientes(lista) {
    return lista.toSorted((a, b) => (tiempoDe(b) - tiempoDe(a)) || a.id.localeCompare(b.id));
}

// Sesión 5: lista nueva con las de más likes primero. Si empatan, desempata por id.
// REVISAR (sesión 5): el TODO inicial la llamaba ordenarPopulares; el texto la llama ordenarPorPopulares.
export function ordenarPorPopulares(lista) {
    return lista.toSorted((a, b) => (b.likes - a.likes) || a.id.localeCompare(b.id));
}