# Actividad 2. Normalizador de entradas

## Descripción ✏️

Función `normalizarParticipante` que recibe los datos de un formulario de
inscripción (nombre, edad escrita como texto y aceptación de normas), los
limpia y los valida. Devuelve los datos ya normalizados o la lista de
errores encontrados. Incluye un formulario para probarla y un archivo de
casos de prueba.

## Estructura del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Formulario de uso |
| `app.js` | Código del formulario: lee los campos, llama a la función y muestra el resultado |
| `validacion.js` | Módulo con la función `normalizarParticipante` |
| `pruebas.html` | Página que muestra el resultado de las pruebas |
| `pruebas.js` | Casos de prueba |

## Cómo ejecutarlo

Los módulos de JavaScript (`import` / `export`) no se cargan si abres el
HTML con doble clic (`file://`): el navegador los bloquea. Hay que servir
la carpeta desde un servidor local, por ejemplo:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `python -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.

Para el formulario se abre `index.html`; para las pruebas, `pruebas.html`.
Resultado esperado de las pruebas: `Fallos: 0`.

## Contrato de la función

```javascript
normalizarParticipante(nombre, edadTexto, aceptaNormas)
```

Devuelve siempre un objeto con `ok`, y **nunca lanza excepciones**, aunque
los argumentos no sean del tipo esperado.

- Si todo es válido: `{ ok: true, valor: { nombre, edad, aceptaNormas } }`
  - `nombre`: texto sin espacios a los lados.
  - `edad`: **número** entero.
  - `aceptaNormas`: el booleano recibido.
- Si hay errores: `{ ok: false, errores: [ ...mensajes ] }`
  - Se acumulan todos los errores, en este orden: nombre, edad, aceptación.

## Reglas de validación

| Dato | Regla | Mensaje de error |
|---|---|---|
| `nombre` | Texto no vacío tras quitar espacios | El nombre no puede estar vacío |
| `edadTexto` | Texto formado solo por dígitos | La edad debe ser un número entero |
| `edadTexto` | Una vez convertida, entre 14 y 99 (ambos incluidos) | La edad debe estar entre 14 y 99 |
| `aceptaNormas` | Valor de tipo booleano (`true` o `false`) | Debes indicar true o false en la aceptación |

## Decisiones de diseño ✏️

- **Limpiar antes de validar:** se aplica `trim()` y después se comprueba, para que `"   "` cuente como vacío.
- **Validar la forma antes de convertir:** `Number("")` da `0` y `Number("0x1F")` da `31`. Por eso primero se comprueba con la expresión regular `/^\d+$/` y solo después se usa `Number()`.
- **Entradas que no son texto:** si `nombre` o `edadTexto` no son texto, se tratan como `""` y fallan las validaciones normales, sin excepción.
- **`false` se acepta:** el requisito es que la aceptación sea un booleano explícito, no que sea `true`. *(Pendiente de confirmar con el profesor.)*
- **Ceros a la izquierda:** `"017"` se acepta y se convierte en `17`.
- **Signos y decimales:** `"-5"`, `"+5"` y `"17.5"` se rechazan como "no es un número entero".

## Ámbitos ✏️

- `normalizarParticipante` está en su propio módulo y se comparte con `export`; `app.js` y `pruebas.js` la importan.
- Dentro de la función, `errores`, `nombreLimpio` y `edadLimpia` son `const`. `edad` es `let` porque recibe su valor más tarde, dentro del `else`, y se necesita fuera de ese bloque para el `return` final.
- No hay variables globales: cada archivo es un módulo con su propio ámbito.

## Tabla de pruebas (entrada → salida)

| Nº | nombre | edadTexto | aceptaNormas | Salida |
|---|---|---|---|---|
| 1 | `" Ada "` | `"17"` | `true` | ok: `Ada`, `17`, `true` |
| 2 | `"Ada"` | `" 17 "` | `true` | ok: edad `17` (número) |
| 3 | `""` | `"17"` | `true` | error de nombre |
| 4 | `"   "` | `"17"` | `true` | error de nombre |
| 5 | `"Ada"` | `"17 años"` | `true` | error de entero |
| 6 | `"Ada"` | `""` | `true` | error de entero |
| 7 | `"Ada"` | `"0x1F"` | `true` | error de entero |
| 8 | `"Ada"` | `"13"` | `true` | error de rango |
| 9 | `"Ada"` | `"14"` | `true` | ok: edad `14` |
| 10 | `"Ada"` | `"99"` | `true` | ok: edad `99` |
| 11 | `"Ada"` | `"100"` | `true` | error de rango |
| 12 | `"Ada"` | `"17"` | `"false"` | error de aceptación |
| 13 | `"Ada"` | `"17"` | `false` | ok: `aceptaNormas: false` |
| 14 | `""` | `"13"` | `"false"` | 3 errores |
| 15 | `5` | `"17"` | `true` | error de nombre |
| 16 | `"Ada"` | `17` | `true` | error de entero |
| 17 | `"Ada"` | `"17"` | `undefined` | error de aceptación |

## Condiciones de entrega

- Sin `var`, sin `==` ni `!=` (solo `===` y `!==`) y sin bucles.
- Sin variables globales accidentales: todo declarado con `const` o `let` dentro de módulos.
- Consola limpia en el uso normal: los errores de entrada se devuelven en el objeto y se muestran en pantalla.