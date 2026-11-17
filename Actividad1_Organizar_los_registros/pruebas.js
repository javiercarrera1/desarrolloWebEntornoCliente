import { registros, idsUnicos, primerRegistroPorId, agruparPorZona, contarPorZona, formatearFecha } from "./registros.js";

const informe = document.getElementById("informe");
let fallos = 0;

// compara como texto: dos objetos nunca son === aunque sean iguales
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

function lanza(funcion) {
    try {
        funcion();
    } catch (error) {
        return error instanceof TypeError;
    }
    return false;
}

// las tres pruebas pedidas (la 2 usa el registro duplicado)
comprobar("1. Set: 5 registros, 4 id distintos", [...idsUnicos(registros)], ["r1", "r2", "r3", "r4"]);

const oficina = agruparPorZona(registros).get("oficina");
comprobar("2. Duplicado r4: oficina tiene 1 registro y es el primero", [oficina.length, oficina[0].texto], [1, "Se imprimió una lista de salida."]);

comprobar("3. Registros diferentes por zona", [...contarPorZona(registros)], [["entrada", 2], ["almacén", 1], ["oficina", 1]]);

// pruebas adicionales
comprobar("4. Map por id conserva la primera entrada de r4", primerRegistroPorId(registros).get("r4").texto, "Se imprimió una lista de salida.");
// el separador entre fecha y hora cambia según el navegador, así que se comprueban las dos partes
const fecha = formatearFecha(registros[0].fecha);
comprobar("5. Fecha de r1 en español (día, mes y hora de Madrid)", [fecha.includes("7 de octubre de 2026"), fecha.includes("9:10")], [true, true]);
comprobar("6. Una fecha inválida lanza TypeError", lanza(() => formatearFecha("no es una fecha")), true);
comprobar("7. Algo que no es un array lanza TypeError", lanza(() => idsUnicos("hola")), true);
comprobar("8. Lista vacía: sin id y sin zonas", [idsUnicos([]).size, agruparPorZona([]).size], [0, 0]);
comprobar("9. El array original no se modifica", registros.length, 5);

informe.textContent += "\nFallos: " + fallos + "\n";
