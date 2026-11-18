# Actividad 4. Guardar el progreso y abrir una ficha

## Descripción

La página muestra el registro actual y los registros vistos. Cada vez que se
elige un registro, el progreso se guarda como JSON en `localStorage` bajo la
clave `registros-ut3:v1:progreso`, con esta forma:

```json
{ "version": 1, "registroActual": "r1", "vistos": ["r1"] }
```

Al cargar la página se lee y se valida (versión, tipos e id). Si no hay datos o
son incorrectos, se usa el objeto inicial anterior. Un botón abre la ficha del
registro actual en otra ventana; si `window.open` devuelve `null`, la misma
ficha se muestra en la propia página.

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Pantalla principal: botones, registro actual, aviso, botón de ficha y ficha local |
| `app.js` | Carga y guarda el progreso, cambia la pantalla y abre la ventana auxiliar |
| `progreso.js` | Reglas del progreso: `cargarProgreso`, `guardarProgreso`, `esProgreso`, `registrarVisto` |
| `catalogo.js` | Catálogo, `elegirId`, `buscarRegistro`, `formatearFecha` y `describirRegistro` |
| `ficha.html` y `ficha.js` | Página de la ficha que se abre en la ventana auxiliar |

## Cómo ejecutarlo

Los módulos de JavaScript (`import` / `export`) no se cargan si se abre el HTML
con doble clic (`file://`). Hay que servir la carpeta desde un servidor local:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `python -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.

Abre `index.html` desde el servidor.

## Qué se guarda en el navegador

- **Dónde:** `localStorage`, en la clave `registros-ut3:v1:progreso` (una sola).
- **Qué:** un JSON con la versión, el registro actual y la lista de registros vistos. Solo id del catálogo, ningún dato personal ni secreto.
- **Cómo:** se serializa con `JSON.stringify`. No se guardan objetos `Set`, `Map` ni `Date`: los vistos son un array.
- **Cómo borrarlo:** pestaña *Application* de DevTools → *Local Storage* → clic derecho sobre la clave → *Delete*.

## Recuperar los datos guardados

`cargarProgreso` devuelve el progreso y su origen. La validación (`esProgreso`)
exige: versión `1`, `registroActual` con un id del catálogo, `vistos` como array
de id del catálogo y sin repetidos, y que el registro actual figure entre los
vistos (coherencia, como indica la lección 04).

| Cadena guardada | Resultado |
|---|---|
| (no hay nada) | Progreso inicial (origen `nuevo`) |
| `{"version":1,"registroActual":"r2","vistos":["r1","r2"]}` | **Se recupera** |
| `{"version":0,"registroActual":"r1","vistos":["r1"]}` | Se rechaza la versión: progreso inicial |
| `{"version":1,"registroActual":"r99","vistos":["r1"]}` | Se rechaza el id desconocido: progreso inicial |
| `{"version":1,"registroActual":"r1","vistos":["r1","r99"]}` | Se rechaza el id desconocido en `vistos` |
| `{"version":1,"registroActual":"r1","vistos":["r1","r1"]}` | Se rechazan los repetidos |
| `{"version":1,"registroActual":"r1","vistos":"r1"}` | Se rechaza: `vistos` no es un array |
| `{"version":1,"registroActual":1,"vistos":["r1"]}` | Se rechaza: `registroActual` no es texto |
| `{"version":1,"registroActual":"r2","vistos":["r1"]}` | Se rechaza: el registro actual no está entre los vistos |
| `null` | Se rechaza: no es un objeto |
| `{mal json` | Se captura el error de análisis: progreso inicial |

En la página, "recuperado" muestra el aviso *Progreso recuperado.* y
"rechazado" muestra *Los datos guardados no eran válidos: se ha empezado de
nuevo.* Si no había datos no se avisa.

Prueba hecha en el navegador: se eligen `r3` y `r2` y se recarga la página. Se
recupera el registro `r2` con los vistos `r1, r3, r2`.

## Simular un error al guardar

Con la página abierta, en la pestaña **Console** de DevTools se escribe:

```js
Storage.prototype.setItem = () => { throw new Error("cuota llena"); };
```

Después se pulsa cualquier botón de registro. La pantalla sigue funcionando
con el estado en memoria y aparece el aviso *El progreso no se ha guardado:
puedes seguir jugando, pero quizá no se conserve al recargar.* No se promete que
vaya a recuperarse. Para volver a la normalidad basta recargar la página.

Resultado comprobado: con el fallo activo, al elegir `r4` y después `r2` se
muestran los dos cambios y el aviso, y en `localStorage` no se guarda nada.

## Ficha en otra ventana

El botón **Ver ficha** llama a `window.open` directamente en el clic (los
navegadores suelen bloquear las aperturas que ocurren más tarde). La ventana
carga `ficha.html?registro=<id>` y `ficha.js` valida el id antes de mostrarlo.

| Caso | Qué ocurre |
|---|---|
| El navegador abre la ventana | Se abre `ficha.html?registro=r1` con `r1 · entrada · La puerta se abrió a las 09:10. · 7 de octubre de 2026 a las 9:10` |
| `window.open` devuelve `null` (ventana bloqueada) | La misma ficha aparece en la sección `#ficha-local` de la propia página |
| Id raro en la URL de la ficha (`?registro=<img src=x>`) | Se muestra la ficha de `r1` y el texto sin interpretarse como HTML |

La ficha local y la de la ventana usan la misma función (`describirRegistro`),
así que muestran exactamente lo mismo: bloquear la ventana no cambia la
información disponible.

### Probar el caso en que no se abre la otra ventana

En la consola de DevTools, antes de pulsar el botón:

```js
window.open = () => null;
```

Al pulsar **Ver ficha** se muestra la ficha dentro de la página. (También
ocurre si el navegador bloquea las ventanas emergentes en su configuración.)

## Requisitos comunes

- HTML semántico (`main`, `nav`, `article`, `section`) y módulos de JavaScript.
- Los textos de datos, de la URL y del almacenamiento se muestran con `textContent`.
- Estado y reglas (`progreso.js`, `catalogo.js`) separados del código que cambia la pantalla (`app.js`).
- Controles fijos: un listener por botón, sin atributos `onclick`.

## Entrega

La tabla de resultados al recuperar los datos está en este README. Falta añadir
la **captura de la pestaña Application** (DevTools → Application → Local
Storage) con la clave `registros-ut3:v1:progreso` y su valor, tomada desde tu
navegador.
