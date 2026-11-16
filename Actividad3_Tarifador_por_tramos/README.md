# Actividad 3. Tarifador por tramos

## Descripción

Función `calcularCoste` que recibe un consumo (entero no negativo) y devuelve
su coste en **céntimos**, acumulando tres tramos de precio. Incluye un
formulario para probarla y una página de casos de prueba.

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Formulario de uso |
| `app.js` | Lee el campo, convierte el texto a número, llama a la función y muestra el resultado |
| `tarifa.js` | Módulo con la función `calcularCoste` (con JSDoc) |
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

## Tarifa

El coste se **acumula por tramos**: cada unidad se cobra según el tramo en el
que cae. No se aplica una tarifa única al total.

| Tramo | Unidades | Céntimos por unidad |
|---|---|---|
| 1 | de la 1 a la 100 | 12 |
| 2 | de la 101 a la 200 | 18 |
| 3 | de la 201 en adelante | 25 |

Ejemplo, consumo 201: `100 * 12 + 100 * 18 + 1 * 25 = 3025` céntimos.
Con una tarifa única daría `201 * 25 = 5025`, que sería incorrecto.

## Contrato de la función

```javascript
calcularCoste(consumo)
```

Devuelve siempre un objeto con `ok` y **nunca lanza excepciones**.

- Entrada válida: `{ ok: true, valor: costeEnCentimos }`
- Entrada inválida: `{ ok: false, errores: [ ...mensajes ] }`

| Entrada | Resultado |
|---|---|
| Entero mayor o igual que 0 | `ok: true`, coste en céntimos |
| Negativo (`-1`) | `ok: false`, "El consumo no puede ser negativo" |
| Decimal (`1.5`), texto (`"5"`), `NaN`, `undefined` | `ok: false`, "El consumo debe ser un número entero" |

## Por qué se trabaja en céntimos

Los números decimales de JavaScript se guardan en binario, y valores como
`0.1` no se pueden representar con exactitud (igual que 1/3 no se puede
escribir exacto en decimal). Por eso `0.1 + 0.2` da `0.30000000000000004`.
En un cálculo de dinero, esos errores diminutos se acumulan.

Los números enteros, en cambio, se suman y se multiplican sin error. Por eso
la función calcula todo en céntimos (12, 18 y 25 son enteros). La conversión
a euros (`/ 100`) se hace **solo al mostrar** el resultado, con
`Intl.NumberFormat`, como se ve en `app.js`.

## Cómo se calculan los tramos

Para cada tramo se calcula cuántas unidades caen en él:

| consumo | en tramo 1 | en tramo 2 | en tramo 3 | coste |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 0 | 0 | 12 |
| 100 | 100 | 0 | 0 | 1200 |
| 101 | 100 | 1 | 0 | 1218 |
| 200 | 100 | 100 | 0 | 3000 |
| 201 | 100 | 100 | 1 | 3025 |

- Tramo 1: `Math.min(consumo, 100)`.
- Tramo 2: `Math.min(Math.max(consumo - 100, 0), 100)`.
- Tramo 3: `Math.max(consumo - 200, 0)`.

`Math.min` devuelve el menor de dos valores y `Math.max` el mayor. Se usan
para "recortar" cada cantidad al rango de su tramo.

## Decisiones de diseño

- **Constantes con nombre** para límites y precios: cambiar una tarifa solo exige tocar una línea.
- **Errores devueltos, no lanzados:** la consola queda limpia en el uso normal, como en la Actividad 2.
- **Una sola comprobación para "es entero":** `Number.isInteger` rechaza decimales, textos, `NaN` y `undefined`.
- **Conversión en el formulario:** el campo da texto. Solo se convierte si tiene forma de número, porque `Number("")` da `0` y un campo vacío no debe valer cero.
- **Orden de errores:** si el valor es `-1.5`, sale el error de entero (se comprueba primero).

## Tabla de pruebas (entrada → salida)

| Nº | consumo | Salida |
|---|---|---|
| 1 | `0` | ok: `0` |
| 2 | `1` | ok: `12` |
| 3 | `100` | ok: `1200` |
| 4 | `101` | ok: `1218` |
| 5 | `200` | ok: `3000` |
| 6 | `201` | ok: `3025` |
| 7 | `-1` | error de negativo |
| 8 | `1.5` | error de entero |
| 9 | `150` | ok: `2100` |
| 10 | `300` | ok: `5500` |
| 11 | `"5"` | error de entero |
| 12 | `undefined` | error de entero |
| 13 | `-1.5` | error de entero |
| 14 | `NaN` | error de entero |

## Condiciones de entrega

- Sin `var`, sin igualdad débil (solo `===` y `!==`) y sin bucles.
- Sin variables globales accidentales: todo se declara con `const` o `let` dentro de módulos.
- Consola limpia en el uso normal: los errores de entrada se devuelven en el objeto y se muestran en pantalla.
