# Actividad 4. Analizador de rondas

## Descripción

Función `analizarRondas` que recibe un array de puntuaciones, ignora las
entradas inválidas y devuelve el total, la media, el máximo y la cantidad de
puntuaciones válidas. Está resuelta dos veces: primero con `for...of` y
después con métodos de array, para comparar las dos formas. Incluye un
formulario para probarla y una página de casos de prueba.

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Formulario de uso |
| `app.js` | Lee el campo, lo convierte en un array de números, llama a las dos versiones y muestra el resultado |
| `rondas.js` | Módulo con `analizarRondas` (for...of) y `analizarRondasConMetodos` (con JSDoc) |
| `pruebas.html` | Página que muestra el resultado de las pruebas |
| `pruebas.js` | Casos de prueba |

## Cómo ejecutarlo

Los módulos de JavaScript (`import` / `export`) no se cargan si se abre el
HTML con doble clic (`file://`): el navegador los bloquea. Hay que servir la
carpeta desde un servidor local, por ejemplo:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `python -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.

Para el formulario se abre `index.html`; para las pruebas, `pruebas.html`.
Resultado esperado de las pruebas: `Fallos: 0`.

## Qué es una entrada inválida

Una puntuación es válida si es un **número finito y no negativo**. Todo lo
demás se ignora, sin dar error:

| Entrada | ¿Válida? | Motivo |
|---|---|---|
| `10`, `0`, `2.5` | Sí | Números finitos, cero o más |
| `-2` | No | Negativa |
| `NaN` | No | No es un número utilizable |
| `Infinity`, `-Infinity` | No | No son finitos |
| `"5"`, `true`, `null`, `undefined`, `{}`, `[]` | No | No son de tipo número |

La regla está en una sola función, `esValida`, dentro de `rondas.js`.

## Contrato de la función

```javascript
analizarRondas(puntuaciones)
analizarRondasConMetodos(puntuaciones)
```

Las dos devuelven siempre un objeto con esta forma y **nunca lanzan
excepciones**:

```javascript
{ total, media, maximo, cantidad }
```

| Propiedad | Valor |
|---|---|
| `total` | Suma de las puntuaciones válidas (`0` si no hay ninguna) |
| `media` | `total / cantidad`, o `null` si no hay ninguna válida |
| `maximo` | La puntuación válida más alta, o `null` si no hay ninguna |
| `cantidad` | Número de puntuaciones válidas |

Ejemplo del enunciado:

```javascript
analizarRondas([10, 7, -2, Number.NaN, 5]);
// { total: 22, media: 7.333333333333333, maximo: 10, cantidad: 3 }
```

## Las dos versiones

### Con `for...of`

Recorre el array una sola vez. En cada vuelta, si la puntuación es válida,
la suma al total, cuenta una más y actualiza el máximo si la supera.

### Con métodos de array

- `filter(esValida)` crea un array nuevo solo con las válidas.
- `length` da la cantidad.
- `reduce` las suma, empezando en 0.
- `Math.max(...validas)` da la más alta.

### Comparación

| | `for...of` | Métodos de array |
|---|---|---|
| Resultado | Igual | Igual |
| Recorridos del array | Uno | Tres (`filter`, `reduce` y `Math.max`) |
| Variables | Tres `let` que cambian en cada vuelta | Solo `const` |
| Arrays intermedios | Ninguno | Uno (`validas`) |
| Lectura | Se ve el paso a paso | Cada línea dice qué calcula |

Las pruebas pasan cada entrada por las dos versiones y comprueban que
coinciden. El formulario también lo indica debajo del resultado.

## Traza del bucle

Entrada `[10, 7, -2, NaN, 5]`. Valores iniciales: `total = 0`,
`cantidad = 0`, `maximo = null`.

| Vuelta | puntuacion | ¿Válida? | total | cantidad | maximo |
|---|---|---|---|---|---|
| 1 | `10` | Sí | 10 | 1 | 10 |
| 2 | `7` | Sí | 17 | 2 | 10 |
| 3 | `-2` | No | 17 | 2 | 10 |
| 4 | `NaN` | No | 17 | 2 | 10 |
| 5 | `5` | Sí | 22 | 3 | 10 |

Al salir del bucle: `media = 22 / 3 = 7.333333333333333`.

## Por qué el bucle termina

El único bucle es `for (const puntuacion of lista)`. Da exactamente una
vuelta por cada elemento del array y termina cuando se acaban. El array no
se modifica dentro del bucle, así que el número de vueltas es su longitud:
cinco elementos, cinco vueltas. Con un array vacío no da ninguna.

## Decisiones de diseño

- **`maximo` es `null` sin puntuaciones válidas:** el enunciado solo lo fija para la media, pero un máximo de una colección vacía tampoco existe.
- **Si no llega un array** (un texto, `undefined`...), se trata como una colección vacía en vez de lanzar un error. Así la consola queda limpia.
- **Se aceptan decimales** (`2.5`): el enunciado solo descarta el negativo y `NaN`. Con decimales la suma puede arrastrar el error de coma flotante (`0.1 + 0.2`).
- **`0` es una puntuación válida:** por eso el máximo se compara con `maximo === null`, y no con un valor inicial de 0 ni con `!maximo`.
- **El array original no se modifica:** `filter` devuelve uno nuevo y el bucle solo lee.
- **Conversión en el formulario:** el campo da texto. Se parte por las comas y cada trozo se convierte solo si tiene forma de número; si no, queda como `NaN` y se ignora.

## Tabla de pruebas (entrada → salida)

Cada caso se ejecuta con las dos versiones.

| Nº | Entrada | total | media | maximo | cantidad |
|---|---|---|---|---|---|
| 1 | `[10, 7, -2, Number.NaN, 5]` | 22 | 7.333333333333333 | 10 | 3 |
| 2 | `[]` | 0 | null | null | 0 |
| 3 | `[-1, Number.NaN, "5", null, undefined]` | 0 | null | null | 0 |
| 4 | `["10", true, {}, [], 4]` | 4 | 4 | 4 | 1 |
| 5 | `[Infinity, -Infinity, 3]` | 3 | 3 | 3 | 1 |
| 6 | `[8]` | 8 | 8 | 8 | 1 |
| 7 | `[0, 0]` | 0 | 0 | 0 | 2 |
| 8 | `[1.5, 2.5]` | 4 | 2 | 2.5 | 2 |
| 9 | `[1, 2, 9]` | 12 | 4 | 9 | 3 |
| 10 | `[9, 2, 1]` | 12 | 4 | 9 | 3 |
| 11 | `"hola"` | 0 | null | null | 0 |
| 12 | `undefined` | 0 | null | null | 0 |

Caso 13: después de llamar a las dos versiones con `[3, -1, 4]`, el array
sigue siendo `[3, -1, 4]`.

## Condiciones de entrega

- Sin `var` y sin igualdad débil (solo `===` y `!==`).
- Un único bucle, `for...of`, con límite demostrable: una vuelta por elemento.
- Sin variables globales accidentales: todo se declara con `const` o `let` dentro de módulos.
- Consola limpia en el uso normal: las entradas inválidas se ignoran y el resultado se muestra en pantalla.
