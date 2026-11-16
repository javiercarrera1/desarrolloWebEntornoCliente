import { calcularCoste } from "./tarifa.js";

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

const ERROR_ENTERO = { ok: false, errores: ["El consumo debe ser un número entero"] };
const ERROR_NEGATIVO = { ok: false, errores: ["El consumo no puede ser negativo"] };

// obligatorios
comprobar("1. Consumo 0", calcularCoste(0), { ok: true, valor: 0 });
comprobar("2. Consumo 1 (solo tramo 1)", calcularCoste(1), { ok: true, valor: 12 });
comprobar("3. Consumo 100 (fin del tramo 1)", calcularCoste(100), { ok: true, valor: 1200 });
comprobar("4. Consumo 101 (empieza el tramo 2)", calcularCoste(101), { ok: true, valor: 1218 });
comprobar("5. Consumo 200 (fin del tramo 2)", calcularCoste(200), { ok: true, valor: 3000 });
comprobar("6. Consumo 201 (empieza el tramo 3)", calcularCoste(201), { ok: true, valor: 3025 });
comprobar("7. Consumo negativo (-1)", calcularCoste(-1), ERROR_NEGATIVO);
comprobar("8. Consumo decimal (1.5)", calcularCoste(1.5), ERROR_ENTERO);

// extra
comprobar("9. Consumo 150 (mitad del tramo 2)", calcularCoste(150), { ok: true, valor: 2100 });
comprobar("10. Consumo 300 (los tres tramos)", calcularCoste(300), { ok: true, valor: 5500 });

comprobar("11. Texto '5'", calcularCoste("5"), ERROR_ENTERO);
comprobar("12. undefined", calcularCoste(undefined), ERROR_ENTERO);
comprobar("13. Negativo y decimal (-1.5)", calcularCoste(-1.5), ERROR_ENTERO);
comprobar("14. NaN", calcularCoste(NaN), ERROR_ENTERO);

informe.textContent += "\nFallos: " + fallos + "\n";
