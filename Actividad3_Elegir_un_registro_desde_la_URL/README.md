# Actividad 3. Elegir un registro desde la URL

## Descripción

La página lee el parámetro `registro` de la URL con `URLSearchParams` y muestra
ese registro del catálogo (id, zona, texto y fecha). Solo se aceptan los id que
están en el catálogo (`r1` a `r4`). Si no hay parámetro o el id no existe, se
muestra `r1`.

Incluye la **ampliación opcional**: cuatro botones fijos cambian de registro con
`history.pushState`, y los botones de atrás y adelante del navegador actualizan
la pantalla con `popstate`.

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Botones fijos y zona donde se muestra el registro |
| `app.js` | Muestra el registro, cambia la URL con `pushState` y responde a `popstate` |
| `catalogo.js` | Catálogo, `elegirId` (lee y valida la URL), `buscarRegistro` y `formatearFecha` |
| `pruebas.html` | Página que muestra el resultado de las pruebas |
| `pruebas.js` | Pruebas |

## Cómo ejecutarlo

Los módulos de JavaScript (`import` / `export`) no se cargan si se abre el HTML
con doble clic (`file://`). Hay que servir la carpeta desde un servidor local:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `python -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.

## Cómo se decide qué registro se muestra

`elegirId(busqueda)` en `catalogo.js`:

1. `new URLSearchParams(busqueda).get("registro")` devuelve el texto del parámetro, o `null` si no está.
2. Si ese texto está en el `Set` de id del catálogo, se usa. Si no, se usa `r1`.

La URL es una petición de navegación, no un dato fiable: cualquiera puede
escribir `?registro=r99`. Por eso nunca se usa el valor leído sin comprobarlo, y
el contenido se escribe con `textContent`.

## Prueba de las tres URL

| URL | Valor leído | Registro mostrado |
|---|---|---|
| `index.html?registro=r2` (id válido) | `r2` | **r2** |
| `index.html` (sin registro) | `null` | **r1** |
| `index.html?registro=desconocido` (id desconocido) | `desconocido` | **r1** |

Comprobado también en el navegador (título mostrado):

| Acción | Resultado |
|---|---|
| Abrir `?registro=r4` | r4, con el texto de la primera entrada |
| Botón *Ver r3* | Muestra r3 y la URL pasa a `?registro=r3` sin recargar |
| Botón *Ver r2* | Muestra r2 |
| Atrás | Vuelve a r3 |
| Atrás | Vuelve a r1 (la URL sin parámetro) |
| Adelante | Vuelve a r3 |

`pushState` cambia la URL pero no actualiza la pantalla, por eso `seleccionar`
llama a `mostrar`. `popstate` solo salta al usar atrás o adelante; por eso hacen
falta los dos caminos.

## Pruebas

| Nº | Entrada | Resultado esperado |
|---|---|---|
| 1 | `?registro=r2` | `r2` |
| 2 | (vacío) | `r1` |
| 3 | `?registro=desconocido` | `r1` |
| 4 | `?registro=` | `r1` |
| 5 | `?registro=<img src=x onerror=alert(1)>` | `r1` |
| 6 | `?registro=R2` | `r1` (distingue mayúsculas) |
| 7 | `?registro=r3&registro=r9` | `r3` (el primero) |
| 8 | `?otro=r2` | `r1` |
| 9 | `?registro=constructor` | `r1` |
| 10 | Catálogo | `r1, r2, r3, r4` |
| 11 | `r4` repetido | Primera entrada |
| 12 | `r99` | `undefined` |

Las pruebas 1 a 3 son las tres URL pedidas. Resultado esperado: `Fallos: 0`.

## Datos guardados en el navegador

Ninguno. En la URL solo viaja el identificador del registro.

## Requisitos comunes

- HTML semántico (`main`, `nav`, `article`) y módulos de JavaScript.
- Los textos que vienen del catálogo se muestran con `textContent`.
- Reglas (`catalogo.js`) separadas del código que cambia la pantalla (`app.js`).
- Controles fijos: un listener por botón, sin atributos `onclick`.
