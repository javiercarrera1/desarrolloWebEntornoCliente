import { analizarRondas, analizarRondasConMetodos } from "./rondas.js";

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

// la misma entrada se prueba con las dos versiones
function comprobarAmbas(titulo, entrada, esperado) {
    comprobar(titulo + " [for...of]", analizarRondas(entrada), esperado);
    comprobar(titulo + " [métodos]", analizarRondasConMetodos(entrada), esperado);
}

const VACIO = { total: 0, media: null, maximo: null, cantidad: 0 };

// enunciado
comprobarAmbas("1. Ejemplo del enunciado", [10, 7, -2, Number.NaN, 5], { total: 22, media: 7.333333333333333, maximo: 10, cantidad: 3 });
comprobarAmbas("2. Colección vacía", [], VACIO);

// entradas inválidas
comprobarAmbas("3. Todas inválidas", [-1, Number.NaN, "5", null, undefined], VACIO);
comprobarAmbas("4. Tipos que no son número", ["10", true, {}, [], 4], { total: 4, media: 4, maximo: 4, cantidad: 1 });
comprobarAmbas("5. Infinitos", [Infinity, -Infinity, 3], { total: 3, media: 3, maximo: 3, cantidad: 1 });

// entradas válidas
comprobarAmbas("6. Una sola puntuación", [8], { total: 8, media: 8, maximo: 8, cantidad: 1 });
comprobarAmbas("7. Ceros", [0, 0], { total: 0, media: 0, maximo: 0, cantidad: 2 });
comprobarAmbas("8. Decimales", [1.5, 2.5], { total: 4, media: 2, maximo: 2.5, cantidad: 2 });
comprobarAmbas("9. Máximo al final", [1, 2, 9], { total: 12, media: 4, maximo: 9, cantidad: 3 });
comprobarAmbas("10. Máximo al principio", [9, 2, 1], { total: 12, media: 4, maximo: 9, cantidad: 3 });

// lo que llega no es un array
comprobarAmbas("11. Un texto en vez de un array", "hola", VACIO);
comprobarAmbas("12. undefined", undefined, VACIO);

// el array original no se modifica
const original = [3, -1, 4];
analizarRondas(original);
analizarRondasConMetodos(original);
comprobar("13. El array original queda intacto", original, [3, -1, 4]);

informe.textContent += "\nFallos: " + fallos + "\n";
