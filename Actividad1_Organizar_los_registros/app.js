import { registros, idsUnicos, contarPorZona, formatearFecha } from "./registros.js";

const salida = document.querySelector("#salida");
if (!(salida instanceof HTMLElement)) {
    throw new Error("Falta el elemento #salida");
}

// la salida va a la consola (se entrega) y a la página
function escribir(linea) {
    console.log(linea);
    salida.textContent += linea + "\n";
}

const ids = idsUnicos(registros);

escribir("Registros recibidos: " + registros.length);
escribir("Id distintos (Set): " + ids.size + " -> " + [...ids].join(", "));
escribir("Entradas repetidas descartadas: " + (registros.length - ids.size));
escribir("");
escribir("Registros diferentes por zona (Map):");
for (const [zona, cantidad] of contarPorZona(registros)) {
    escribir("  " + zona + ": " + cantidad);
}
escribir("");
escribir("Fecha de r1: " + formatearFecha(registros[0].fecha));
