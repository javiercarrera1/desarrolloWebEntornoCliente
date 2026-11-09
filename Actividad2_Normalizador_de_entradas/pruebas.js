import { normalizarParticipante } from "./validacion.js";

const informe = document.getElementById("informe");
let fallos = 0;

function comprobar(titulo, obtenido, esperado) {
   const textoObtenido = JSON.stringify(obtenido);
   const textoEsperado = JSON.stringify(esperado);
   if (textoObtenido === textoEsperado) {
      informe.textContent += "OK     " + titulo + "\n";
   } else {
      fallos += 1;
      informe.textContent += "FALLA  " + titulo + "\n";
      informe.textContent += "       esperado: " + textoEsperado + "\n";
      informe.textContent += "       obtenido: " + textoObtenido + "\n";
   }
}

// --- CASOS VÁLIDOS ---

comprobar(
   "1. Caso válido con espacios en el nombre",
   normalizarParticipante(" Ada ", "17", true),
   { ok: true, valor: { nombre: "Ada", edad: 17, aceptaNormas: true } }
);

comprobar(
   "2. Conversión: edad con espacios",
   normalizarParticipante("Ada", " 17 ", true),
   { ok: true, valor: { nombre: "Ada", edad: 17, aceptaNormas: true } }
);

comprobar(
   "9. Frontera baja válida (14)",
   normalizarParticipante("Ada", "14", true),
   { ok: true, valor: { nombre: "Ada", edad: 14, aceptaNormas: true } }
);

comprobar(
   "10. Frontera alta válida (99)",
   normalizarParticipante("Ada", "99", true),
   { ok: true, valor: { nombre: "Ada", edad: 99, aceptaNormas: true } }
);

comprobar(
   "13. Aceptación false real (es booleano, se acepta)",
   normalizarParticipante("Ada", "17", false),
   { ok: true, valor: { nombre: "Ada", edad: 17, aceptaNormas: false } }
);

// --- ERRORES DE NOMBRE ---

comprobar(
   "3. Nombre vacío",
   normalizarParticipante("", "17", true),
   { ok: false, errores: ["El nombre no puede estar vacío"] }
);

comprobar(
   "4. Nombre solo con espacios",
   normalizarParticipante("   ", "17", true),
   { ok: false, errores: ["El nombre no puede estar vacío"] }
);

comprobar(
   "15. Nombre que no es texto",
   normalizarParticipante(5, "17", true),
   { ok: false, errores: ["El nombre no puede estar vacío"] }
);

// --- ERRORES DE EDAD: FORMA ---

comprobar(
   "5. Edad con texto",
   normalizarParticipante("Ada", "17 años", true),
   { ok: false, errores: ["La edad debe ser un número entero"] }
);

comprobar(
   "6. Edad vacía",
   normalizarParticipante("Ada", "", true),
   { ok: false, errores: ["La edad debe ser un número entero"] }
);

comprobar(
   "7. Edad hexadecimal",
   normalizarParticipante("Ada", "0x1F", true),
   { ok: false, errores: ["La edad debe ser un número entero"] }
);

comprobar(
   "16. Edad que no es texto",
   normalizarParticipante("Ada", 17, true),
   { ok: false, errores: ["La edad debe ser un número entero"] }
);

// --- ERRORES DE EDAD: RANGO ---

comprobar(
   "8. Frontera baja (13)",
   normalizarParticipante("Ada", "13", true),
   { ok: false, errores: ["La edad debe estar entre 14 y 99"] }
);

comprobar(
   "11. Frontera alta (100)",
   normalizarParticipante("Ada", "100", true),
   { ok: false, errores: ["La edad debe estar entre 14 y 99"] }
);

// --- ERRORES DE ACEPTACIÓN ---

comprobar(
   "12. Aceptación en texto",
   normalizarParticipante("Ada", "17", "false"),
   { ok: false, errores: ["Debes indicar true o false en la aceptación"] }
);

comprobar(
   "17. Aceptación undefined",
   normalizarParticipante("Ada", "17", undefined),
   { ok: false, errores: ["Debes indicar true o false en la aceptación"] }
);

// --- VARIOS ERRORES A LA VEZ ---

comprobar(
   "14. Tres errores a la vez",
   normalizarParticipante("", "13", "false"),
   {
      ok: false,
      errores: [
         "El nombre no puede estar vacío",
         "La edad debe estar entre 14 y 99",
         "Debes indicar true o false en la aceptación"
      ]
   }
);

informe.textContent += "\nFallos: " + fallos + "\n";