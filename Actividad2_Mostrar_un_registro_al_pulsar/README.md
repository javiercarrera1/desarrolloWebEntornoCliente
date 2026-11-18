# Actividad 2. Mostrar un registro al pulsar

## Descripción

Página con un botón `#revelar`, un texto `#estado` y una lista `#registros`,
dentro de un panel (`#panel`). Al pulsar el botón por primera vez:

- cambia el texto de `#estado` con `textContent`,
- se añade la clase `descubierta` al panel con `classList`,
- se crea un `<li>` con `createElement` y se añade a la lista.

Si se vuelve a pulsar, no aparece otro `<li>`. El texto del registro es
`Puerta abierta: <img src=x onerror=alert(1)>` y se ve como texto: no se crea
ninguna imagen ni se ejecuta código.

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Marcado: panel, texto, botón y lista |
| `app.js` | Selecciona los elementos, comprueba que existen y llama a `conectar` |
| `pantalla.js` | Listener del botón y cambios en la pantalla (`textContent`, `classList`, `createElement`) |
| `reglas.js` | Estado y regla de revelar, sin tocar el documento |

## Cómo ejecutarlo

Los módulos de JavaScript (`import` / `export`) no se cargan si se abre el HTML
con doble clic (`file://`). Hay que servir la carpeta desde un servidor local:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `python -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.

Abre `index.html` desde el servidor.

## Reglas separadas de la pantalla

- `reglas.js`: `crearEstado()` y `revelar(estado)`. Si ya está revelado, `revelar` devuelve el mismo estado; si no, devuelve uno nuevo. No usa `document`.
- `pantalla.js`: cuando `revelar` devuelve un estado distinto, escribe el texto, añade la clase y crea el `<li>`. Si es el mismo, no hace nada. Así el segundo clic no duplica la entrada.

## Inspección del documento (pestaña Elements)

Dentro de `#panel`, antes y después de pulsar:

Antes del clic:

```html
<p id="estado">Registro pendiente</p>
<button id="revelar" type="button">Revelar registro</button>
<ul id="registros"></ul>
```

Después del primer clic (y igual después del segundo):

```html
<p id="estado">Registro r1 revelado</p>
<button id="revelar" type="button">Revelar registro</button>
<ul id="registros"><li>Puerta abierta: &lt;img src=x onerror=alert(1)&gt;</li></ul>
```

Además, el elemento `<section id="panel">` pasa de no tener clase a tener
`class="descubierta"`. En Elements, `<li>` solo tiene un nodo de texto: no
contiene ningún `<img>`.

| Momento | `#estado` | Clase `descubierta` | `<li>` en `#registros` |
|---|---|---|---|
| Antes del clic | «Registro pendiente» | No | 0 |
| Después del primer clic | «Registro r1 revelado» | Sí | 1 |
| Después del segundo clic | Igual | Sí | 1 |

## Prueba con ratón y con teclado

El botón es un `<button type="button">`, así que se puede activar con las dos
formas sin código adicional. Resultado de las pruebas hechas:

| Forma de pulsar | Resultado |
|---|---|
| Clic de ratón (dos veces) | Un solo `<li>`, texto `Registro r1 revelado`, sin ventana de alerta |
| Tecla Intro con el botón enfocado (dos veces) | Igual |
| Tecla Espacio con el botón enfocado (dos veces) | Igual |

## Datos guardados en el navegador

Ninguno.

## Requisitos comunes

- HTML semántico (`main`, `section`, `button`) y módulos de JavaScript.
- Los textos se muestran con `textContent`, sin `innerHTML`.
- Estado y reglas separados del código que cambia la pantalla.
- Controles fijos: un listener sobre el botón, sin atributos `onclick`.
