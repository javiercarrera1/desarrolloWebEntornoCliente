/* ============================================================
   ACTIVIDAD 2. Normalizador de entradas
   ============================================================

   Enunciado:
   Implementa normalizarParticipante(nombre, edadTexto, aceptaNormas)
   que devuelva un objeto válido o una lista de errores.

   Requisitos:
   - nombre no vacío.
   - edad entera entre 14 y 99.
   - aceptación booleana explícita.
   - No uses ==.
*/

// Export hace que otros archivos puedan usar la función

export function normalizarParticipante(nombre, edadTexto, aceptaNormas) {
    const errores = [];

    // --- NOMBRE ---
    const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
    if (nombreLimpio === "") {
        errores.push("El nombre no puede estar vacío");
    }
    // --- EDAD ---
    const edadLimpia = typeof edadTexto === "string" ? edadTexto.trim() : "";
    let edad = null;
    if (!/^\d+$/.test(edadLimpia)) {
        errores.push("La edad debe ser un número entero");
    } else {
        edad = Number(edadLimpia);
        if (edad < 14 || edad > 99) {
            errores.push("La edad debe estar entre 14 y 99");
        }
    }
    // --- ACEPTACIÓN ---
    if (typeof aceptaNormas !== "boolean") {
        errores.push("Debes indicar true o false en la aceptación");
    }
    // --- RESULTADO ---
    if (errores.length > 0) {
        return { ok: false, errores: errores };
    }

    return {
        ok: true,
        valor: { nombre: nombreLimpio, edad: edad, aceptaNormas: aceptaNormas }
    };
}