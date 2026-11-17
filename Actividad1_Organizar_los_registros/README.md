# Actividad 1. Organizar los registros

## Descripción

Se parte del array `registros` del enunciado (cinco entradas, con `r4` repetido).
El programa crea un `Set` con los id sin repetir, un `Map` que agrupa los
registros por zona, muestra cuántos registros diferentes hay en cada zona y
presenta una fecha en español con `Date` e `Intl.DateTimeFormat`.

Criterio que evidencia: **CE3.a** (identifica y utiliza objetos predefinidos).

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página que muestra la salida |
| `app.js` | Llama a las funciones y escribe la salida en la consola y en la página |
| `registros.js` | Módulo con el array `registros` y las funciones con `Set`, `Map` y `Intl` |
| `pruebas.html` | Página que muestra el resultado de las pruebas |
| `pruebas.js` | Pruebas |

## Cómo ejecutarlo

Los módulos de JavaScript (`import` / `export`) no se cargan si se abre el HTML
con doble clic (`file://`). Hay que servir la carpeta desde un servidor local:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `python -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.

`index.html` muestra la salida (y la escribe en la consola) y `pruebas.html`
las pruebas. Resultado esperado de las pruebas: `Fallos: 0`.

## Salida de la consola

```
Registros recibidos: 5
Id distintos (Set): 4 -> r1, r2, r3, r4
Entradas repetidas descartadas: 1

Registros diferentes por zona (Map):
  entrada: 2
  almacén: 1
  oficina: 1

Fecha de r1: 7 de octubre de 2026 a las 9:10
```

El separador entre la fecha y la hora (`a las` o una coma) depende de la
versión del navegador.

## Decisión sobre el id repetido (r4)

`r4` aparece dos veces con la misma zona y la misma fecha. **Se conserva la
primera entrada** ("Se imprimió una lista de salida.") y se descarta la
segunda ("Registro duplicado para la prueba."). La regla está en una sola
condición, `if (!porId.has(registro.id))`: si se quisiera conservar la última,
bastaría quitarla.

Por eso la zona `oficina` cuenta **1** registro diferente y no 2.

### Por qué un Set y por qué un Map

- **`Set`:** responde a "¿qué id distintos hay?". Guarda cada valor una sola vez, así que no hace falta comprobar a mano si un id ya estaba. Su `size` da el número de id distintos (4).
- **`Map`:** relaciona una clave con un valor. Se usa de dos formas: id → primer registro (para decidir qué hacer con el repetido) y zona → registros de esa zona (para agrupar). Un `Set` no sirve para esto, porque no asocia cada clave con sus datos.
- **`Array`:** sigue siendo la fuente de datos. Conserva las cinco entradas y su orden original, y no se modifica.

## Pruebas

| Nº | Qué comprueba | Resultado esperado |
|---|---|---|
| 1 | `Set` de id | `r1, r2, r3, r4` |
| 2 | **Registro duplicado:** la zona `oficina` | 1 registro, el primero |
| 3 | Registros diferentes por zona | entrada 2, almacén 1, oficina 1 |
| 4 | `Map` por id con `r4` repetido | Conserva la primera entrada |
| 5 | Fecha de `r1` en español | Contiene `7 de octubre de 2026` y `9:10` |
| 6 | Fecha inválida | Lanza `TypeError` |
| 7 | Algo que no es un array | Lanza `TypeError` |
| 8 | Lista vacía | 0 id y 0 zonas |
| 9 | El array original | Sigue teniendo 5 entradas |

Las pruebas 1 a 3 son las tres pedidas; la 2 usa el registro duplicado.

## Datos guardados en el navegador

Ninguno.

## Requisitos comunes

- HTML semántico y módulos de JavaScript (`type="module"`).
- Estado y reglas (`registros.js`) separados del código que escribe en pantalla (`app.js`).
- La salida se escribe con `textContent`, sin `innerHTML`.
