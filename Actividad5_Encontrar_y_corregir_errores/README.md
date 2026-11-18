# Actividad 5. Encontrar y corregir errores

## Descripción

Un programa pequeño con un botón (`#revelar`) que revela el siguiente registro
del catálogo, muestra los registros vistos y guarda el progreso en
`localStorage` (clave `registros-ut3:v1:progreso`). Se provocan y se corrigen
tres errores, uno cada vez:

1. Buscar `#revelarr` en vez de `#revelar`. El resultado es `null`.
2. Guardar `{mal json` en la clave del progreso.
3. Registrar dos funciones distintas que hacen lo mismo al pulsar el botón.

Cada error tiene su propia copia con el defecto en la carpeta `errores/`. El
programa corregido está en la raíz.

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Programa corregido |
| `app.js` | Llama a `iniciar` |
| `pantalla.js` | `buscar` (comprueba los elementos) e `iniciar` (carga, muestra, guarda y registra un solo listener) |
| `progreso.js` | Carga y guardado validados del progreso y `revelarSiguiente` |
| `catalogo.js` | Catálogo de registros |
| `errores/error1_selector/` | Copia con el error 1 (`index.html` y `app.js`) |
| `errores/error2_json/` | Copia con el error 2 |
| `errores/error3_listeners/` | Copia con el error 3 |

## Cómo ejecutarlo

Los módulos de JavaScript (`import` / `export`) no se cargan si se abre el HTML
con doble clic (`file://`). Hay que servir la carpeta desde un servidor local:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `python -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.

| Página | Qué muestra |
|---|---|
| `index.html` | El programa corregido |
| `errores/error1_selector/index.html` | El programa con el error 1 |
| `errores/error2_json/index.html` | El programa con el error 2 (antes hay que guardar `{mal json`, ver abajo) |
| `errores/error3_listeners/index.html` | El programa con el error 3 |

## Herramientas utilizadas

DevTools de Chrome: **Console** (leer la excepción y comprobar valores),
**Sources** (breakpoints por línea y panel *Scope*), **Application**
(inspeccionar y modificar `localStorage`) y **Elements** → *Event Listeners*
(ver los listeners de un elemento).

## Registro de depuración

### Error 1. Selector mal escrito (`#revelarr`)

| Campo | Registro |
|---|---|
| Cómo lo provoqué | En `errores/error1_selector/app.js` el selector es `document.querySelector("#revelarr")` (sobra una `r`). Abro `errores/error1_selector/index.html` y pulso el botón |
| Qué pensaba que ocurría | Que el botón encontraría el listener y revelaría un registro |
| Qué ocurre | Al pulsar no pasa nada. La pantalla se queda en «Registros vistos: r1» |
| Herramienta de DevTools | **Console** y **Sources** (breakpoint en la línea 9, `boton.addEventListener("click", ...)`) |
| Valor visto | Console: `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')`. Sources, panel *Scope*: `boton = null`. En Console, `document.querySelector("#revelarr")` devuelve `null` y `document.querySelector("#revelar")` devuelve el `<button>` |
| Causa | `querySelector` devuelve `null` si ningún elemento coincide, y el código usa `boton` sin comprobarlo. El ID del HTML es `revelar`, no `revelarr` |
| Corrección | Se busca con el selector correcto y se comprueba el resultado con `buscar("#revelar", HTMLButtonElement)`: si falta, lanza `Falta el elemento #revelar en la pantalla` antes de conectar nada |
| Cómo comprobé la solución | `index.html` revela un registro por clic. |

### Error 2. `{mal json` en la clave del progreso

| Campo | Registro |
|---|---|
| Cómo lo provoqué | Con la página abierta, en Console: `localStorage.setItem("registros-ut3:v1:progreso", "{mal json")`, y recargo `errores/error2_json/index.html` |
| Qué pensaba que ocurría | Que la página ignoraría el dato incorrecto y empezaría de cero |
| Qué ocurre | La pantalla queda vacía (`#estado` sin texto) y el botón no responde |
| Herramienta de DevTools | **Application** (ver el valor de la clave), **Console** y **Sources** (breakpoint en la línea 6, `JSON.parse(window.localStorage.getItem(CLAVE))`) |
| Valor visto | Application: la clave contiene `{mal json`. Console: `Uncaught SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)` (el texto exacto cambia según la versión del navegador). Sources: en la línea 6, `window.localStorage.getItem(CLAVE)` vale `"{mal json"` y `guardado` todavía no existe |
| Causa | `JSON.parse` lanza una excepción con texto que no es JSON, y no hay `try...catch`. Al fallar en la carga del módulo, el resto del código (mostrar el estado y conectar el botón) no se ejecuta |
| Corrección | `cargarProgreso` envuelve la lectura en `try...catch`, y después comprueba el contenido con `esProgreso` (versión, tipos, id y coherencia). Si falla, usa el progreso inicial, registra un `console.warn` y la pantalla avisa |
| Cómo comprobé la solución | Con `{mal json` guardado, `index.html` muestra «Registros vistos: r1» y el aviso «Los datos guardados no eran válidos: se ha empezado de nuevo.»; el botón funciona |

### Error 3. Dos funciones que hacen lo mismo al pulsar

| Campo | Registro |
|---|---|
| Cómo lo provoqué | En `errores/error3_listeners/app.js` se registran dos listeners de clic, `revelarYMostrar` y `revelarYGuardar`, y las dos llaman a `revelarSiguiente`. Abro `errores/error3_listeners/index.html` y pulso el botón una vez |
| Qué pensaba que ocurría | Que un clic revelaría un solo registro |
| Qué ocurre | Tras un clic, la pantalla muestra «r1, r2», pero en Application el progreso guardado es `vistos: ["r1","r2","r3"]`. Al recargar aparece «r1, r2, r3»: se reveló uno de más |
| Herramienta de DevTools | **Elements** → *Event Listeners* (o `getEventListeners(document.querySelector("#revelar"))` en Console) y **Sources** (breakpoints en las líneas 10 y 15) |
| Valor visto | Hay 2 listeners de tipo `click`: `revelarYMostrar` y `revelarYGuardar`. Con un solo clic, el código se detiene en la línea 10 (`progreso.vistos` = `r1`) y luego en la línea 15 (`progreso.vistos` = `r1,r2`): la segunda función ya parte del resultado de la primera |
| Causa | Dos funciones distintas hacen la misma acción (`revelarSiguiente`) y las dos están conectadas al mismo botón, así que la acción se ejecuta dos veces por clic |
| Corrección | Un solo listener (en `iniciar`) que revela, muestra y guarda una vez |
| Cómo comprobé la solución | `index.html`: un clic muestra «r1, r2» y se guarda `vistos: ["r1","r2"]`; al recargar sigue «r1, r2» |

## Datos guardados en el navegador

Una clave de `localStorage`, `registros-ut3:v1:progreso`, con
`{ "version": 1, "registroActual": ..., "vistos": [...] }`. Solo id del
catálogo. Para borrarla: Application → Local Storage → clic derecho en la clave
→ *Delete*.

## Requisitos comunes

- HTML semántico y módulos de JavaScript.
- Los textos se muestran con `textContent`.
- Estado y reglas (`progreso.js`) separados del código que cambia la pantalla (`pantalla.js`).
- Controles fijos: un listener sobre el botón, sin atributos `onclick`.

## Entrega

Las notas de depuración están en este README. Falta añadir una **captura útil
de Sources o Console** (por ejemplo, el panel *Scope* con `boton = null` en el
error 1, o la excepción `SyntaxError` en el error 2), tomada desde tu navegador.
