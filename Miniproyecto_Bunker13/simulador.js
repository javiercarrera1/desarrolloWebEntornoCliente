"use strict";

const readline = require("readline-sync");

const TURNOS_MAXIMOS = 10;
const SUPERVIVIENTES_INICIALES = 5;
const MAX_INTENTOS = 20; // fallos seguidos al pedir una acción

const NOMBRES = { agua: "agua", comida: "comida", energia: "energía", chatarra: "chatarra", moral: "moral" };

// racionamiento: reduce a la mitad el consumo de agua y comida
const ACCIONES = {
    racionar: { coste: {}, efectos: {}, amenaza: 0, racionamiento: true },
    explorar: { coste: { energia: 2 }, efectos: { agua: 8, comida: 10, chatarra: 4 }, amenaza: 15, racionamiento: false },
    reparar: { coste: { chatarra: 3, energia: 4 }, efectos: { energia: 8 }, amenaza: -5, racionamiento: false },
    cultivar: { coste: { energia: 2, agua: 1 }, efectos: { comida: 12 }, amenaza: 2, racionamiento: false },
    animar: { coste: { comida: 1 }, efectos: { moral: 12 }, amenaza: 0, racionamiento: false },
};

// Se aplica el último incidente cuyo "desde" no supera la amenaza
const INCIDENTES = [
    { desde: 0, nombre: "Ninguno", moral: 0, bajas: 0 },
    { desde: 40, nombre: "Alarma exterior", moral: -5, bajas: 0 },
    { desde: 70, nombre: "Ataque zombi", moral: -10, bajas: 1 },
];

// Opción C: rangos (el 800 exacto no lo cubre el enunciado y cuenta como A)
const RANGOS = [
    { letra: "S", minimo: 801, descripcion: "Estrategia legendaria" },
    { letra: "A", minimo: 650, descripcion: "Supervivencia excelente" },
    { letra: "B", minimo: 500, descripcion: "Supervivencia aceptable" },
    { letra: "C", minimo: -Infinity, descripcion: "Supervivencia crítica" },
];

/**
 * Crea el estado con el que empieza cada partida.
 * @returns {object} Estado inicial nuevo.
 */
function crearEstadoInicial() {
    return {
        turno: 1,
        supervivientes: SUPERVIVIENTES_INICIALES,
        recursos: { agua: 24, comida: 30, energia: 18, moral: 70, chatarra: 6 },
        capacidad: { agua: 40, comida: 50, energia: 30, chatarra: 20 },
        amenaza: 15,
        historial: [],
    };
}

/**
 * Comprueba que el estado tiene todos los datos y que sus valores son correctos.
 * @param {object} estado Estado a revisar.
 * @throws {Error} Si falta un dato o hay un valor fuera de rango.
 */
function validarEstado(estado) {
    if (typeof estado !== "object" || estado === null || typeof estado.recursos !== "object" ||
        estado.recursos === null || typeof estado.capacidad !== "object" || estado.capacidad === null ||
        !Array.isArray(estado.historial)) {
        throw new Error("Faltan datos del estado (recursos, capacidad o historial)");
    }
    const correcto = esEnteroEntre(estado.turno, 1, TURNOS_MAXIMOS + 1) &&
        esEnteroEntre(estado.supervivientes, 0, SUPERVIVIENTES_INICIALES) &&
        esEnteroEntre(estado.recursos.moral, 0, 100) &&
        esEnteroEntre(estado.amenaza, 0, 100) &&
        Object.keys(estado.capacidad).every((n) => esEnteroEntre(estado.recursos[n], 0, estado.capacidad[n]));
    if (!correcto) {
        throw new Error("El estado tiene valores fuera de rango");
    }
}

/**
 * Indica si la acción existe y se pueden pagar sus costes.
 * @param {object} estado Estado actual.
 * @param {string} accion Identificador de la acción.
 * @returns {boolean} true si se puede ejecutar.
 */
function puedeEjecutarse(estado, accion) {
    return existeAccion(accion) && recursosQueFaltan(estado, accion).length === 0;
}

/**
 * Aplica los costes y efectos de la acción. No modifica el estado recibido.
 * @param {object} estado Estado actual.
 * @param {string} accion Identificador de la acción.
 * @returns {object} Estado nuevo, con los valores ajustados a sus límites.
 * @throws {Error} Si la acción no existe o no se puede pagar.
 */
function aplicarAccion(estado, accion) {
    validarEstado(estado);
    if (!puedeEjecutarse(estado, accion)) {
        throw new Error("La acción no se puede ejecutar: " + accion);
    }
    const nuevo = copiarEstado(estado);
    for (const [nombre, cantidad] of Object.entries(ACCIONES[accion].coste)) {
        nuevo.recursos[nombre] -= cantidad;
    }
    for (const [nombre, cantidad] of Object.entries(ACCIONES[accion].efectos)) {
        nuevo.recursos[nombre] += cantidad;
    }
    nuevo.amenaza += ACCIONES[accion].amenaza;
    return ajustarLimites(nuevo);
}

/**
 * Resuelve un turno completo: acción, consumo, incidente, límites e historial.
 * @param {object} estado Estado al empezar el turno.
 * @param {string} accion Identificador de la acción.
 * @returns {{estado: object, resumen: object}} Estado nuevo (ya en el turno siguiente) y resumen del turno.
 * @throws {Error} Si el estado no es válido, ya pasaron los 10 turnos o la acción no se puede ejecutar.
 */
function resolverTurno(estado, accion) {
    validarEstado(estado);
    if (estado.turno > TURNOS_MAXIMOS) {
        throw new Error("La partida ya ha pasado el turno " + TURNOS_MAXIMOS);
    }
    const tras = aplicarAccion(estado, accion);

    // el consumo usa los supervivientes que había antes del incidente
    const consumo = calcularConsumo(tras.supervivientes, ACCIONES[accion].racionamiento);
    const conConsumo = copiarEstado(tras);
    for (const nombre of Object.keys(consumo)) {
        conConsumo.recursos[nombre] -= consumo[nombre];
    }

    const incidente = elegirIncidente(conConsumo.amenaza);
    conConsumo.supervivientes -= incidente.bajas;
    conConsumo.recursos.moral += incidente.moral;
    const ajustado = ajustarLimites(conConsumo);

    const resumen = {
        turno: estado.turno,
        accion: accion,
        incidente: incidente.nombre,
        consumo: consumo,
        recursos: { ...ajustado.recursos },
        amenaza: ajustado.amenaza,
        supervivientes: ajustado.supervivientes,
    };
    return {
        estado: { ...ajustado, turno: estado.turno + 1, historial: [...ajustado.historial, resumen] },
        resumen: resumen,
    };
}

/**
 * Comprueba si la partida ha terminado y cómo.
 * @param {object} estado Estado tras resolver un turno.
 * @returns {{terminado: boolean, resultado: (string|null), motivo: (string|null)}} Si sigue, resultado y motivo son null.
 */
function comprobarFinal(estado) {
    validarEstado(estado);
    for (const nombre of ["agua", "comida", "energia", "moral"]) {
        if (estado.recursos[nombre] === 0) {
            return { terminado: true, resultado: "derrota", motivo: "El grupo se ha quedado sin " + NOMBRES[nombre] };
        }
    }
    if (estado.supervivientes === 0) {
        return { terminado: true, resultado: "derrota", motivo: "No queda ningún superviviente" };
    }
    if (estado.turno > TURNOS_MAXIMOS) {
        return {
            terminado: true,
            resultado: "victoria",
            motivo: "Se han completado los " + TURNOS_MAXIMOS + " turnos con " + estado.supervivientes +
                " supervivientes y moral " + estado.recursos.moral,
        };
    }
    return { terminado: false, resultado: null, motivo: null };
}

/**
 * Opción C: calcula la puntuación y el rango de una partida ganada.
 * @param {object} estado Estado final de la victoria.
 * @returns {{desglose: object[], total: number, rango: object}} Puntos por concepto, total y rango.
 */
function calcularPuntuacion(estado) {
    const r = estado.recursos;
    const sobrantes = r.agua + r.comida + r.energia + r.chatarra;
    const sinBajas = estado.supervivientes === SUPERVIVIENTES_INICIALES;
    const desglose = [
        { concepto: "Supervivientes (" + estado.supervivientes + " x 100)", puntos: estado.supervivientes * 100 },
        { concepto: "Recursos sobrantes (" + sobrantes + " x 2)", puntos: sobrantes * 2 },
        { concepto: "Moral (" + r.moral + " x 5)", puntos: r.moral * 5 },
        { concepto: "Rescate perfecto (sin bajas)", puntos: sinBajas ? 250 : 0 },
        { concepto: "Amenaza residual (" + estado.amenaza + " x -3)", puntos: estado.amenaza * -3 },
    ];
    const total = desglose.reduce((suma, linea) => suma + linea.puntos, 0);
    return { desglose: desglose, total: total, rango: RANGOS.find((rango) => total >= rango.minimo) };
}

// Funciones auxiliares

/** true si el valor es un entero entre minimo y maximo. */
function esEnteroEntre(valor, minimo, maximo) {
    return Number.isInteger(valor) && valor >= minimo && valor <= maximo;
}

/** true si el texto es una de las cinco acciones. */
function existeAccion(accion) {
    return typeof accion === "string" && Object.hasOwn(ACCIONES, accion);
}

/** Copia el estado con spread para no tocar el original. */
function copiarEstado(estado) {
    return {
        ...estado,
        recursos: { ...estado.recursos },
        capacidad: { ...estado.capacidad },
        historial: [...estado.historial],
    };
}

/** Devuelve un estado con recursos, moral y amenaza dentro de sus límites. */
function ajustarLimites(estado) {
    const nuevo = copiarEstado(estado);
    for (const nombre of Object.keys(nuevo.capacidad)) {
        nuevo.recursos[nombre] = limitar(nuevo.recursos[nombre], 0, nuevo.capacidad[nombre]);
    }
    nuevo.recursos.moral = limitar(nuevo.recursos.moral, 0, 100);
    nuevo.amenaza = limitar(nuevo.amenaza, 0, 100);
    nuevo.supervivientes = Math.max(0, nuevo.supervivientes);
    return nuevo;
}

/** Deja el valor entre minimo y maximo. */
function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

/** Consumo del día (1 agua, 2 comida, 1 energía por persona); racionar reduce a la mitad agua y comida. */
function calcularConsumo(supervivientes, racionando) {
    const consumo = { agua: supervivientes, comida: supervivientes * 2, energia: supervivientes };
    if (racionando) {
        consumo.agua = Math.floor(consumo.agua / 2);
        consumo.comida = Math.floor(consumo.comida / 2);
    }
    return consumo;
}

/** Devuelve el incidente que corresponde a la amenaza. */
function elegirIncidente(amenaza) {
    return INCIDENTES.findLast((incidente) => amenaza >= incidente.desde);
}

/** Lista los recursos que no alcanzan para pagar la acción (vacía si se puede pagar). */
function recursosQueFaltan(estado, accion) {
    return Object.entries(ACCIONES[accion].coste)
        .filter(([nombre, cantidad]) => estado.recursos[nombre] < cantidad)
        .map(([nombre, cantidad]) => NOMBRES[nombre] + " (tienes " + estado.recursos[nombre] + ", necesitas " + cantidad + ")");
}

// Pantalla

/** Muestra recursos, amenaza, moral y supervivientes. */
function mostrarRecursos(recursos, capacidad, amenaza, supervivientes) {
    console.log("  Agua " + recursos.agua + "/" + capacidad.agua + " | Comida " + recursos.comida + "/" + capacidad.comida +
        " | Energía " + recursos.energia + "/" + capacidad.energia + " | Chatarra " + recursos.chatarra + "/" + capacidad.chatarra);
    console.log("  Amenaza: " + amenaza + " | Moral: " + recursos.moral + " | Supervivientes: " + supervivientes);
}

/** Muestra VICTORIA o DERROTA con su motivo y, si se ha ganado, la puntuación (opción C). */
function mostrarFinal(estado, final) {
    console.log("");
    console.log(final.resultado === "victoria" ? "VICTORIA" : "DERROTA");
    console.log("Motivo: " + final.motivo);
    if (final.resultado === "victoria") {
        const puntuacion = calcularPuntuacion(estado);
        console.log("\nPuntuación:");
        for (const linea of puntuacion.desglose) {
            console.log("  " + linea.concepto.padEnd(40) + String(linea.puntos).padStart(6));
        }
        console.log("  " + "TOTAL".padEnd(40) + String(puntuacion.total).padStart(6));
        console.log("Rango " + puntuacion.rango.letra + ": " + puntuacion.rango.descripcion);
    }
}

/** Pide una acción hasta que sea válida y se pueda pagar; el turno no avanza. Devuelve null si se superan los intentos. */
function pedirAccion(estado) {
    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
        const accion = readline.question("Elige una acción: ").trim().toLowerCase();
        if (!existeAccion(accion)) {
            console.log("  \"" + accion + "\" no es una acción. Elige una de: " + Object.keys(ACCIONES).join(", "));
        } else if (!puedeEjecutarse(estado, accion)) {
            console.log("  No puedes " + accion + ": faltan " + recursosQueFaltan(estado, accion).join(" y "));
        } else {
            return accion;
        }
    }
    return null;
}

/** Juega una partida de 10 turnos como máximo. */
function jugarPartida() {
    let estado = crearEstadoInicial();
    let final = comprobarFinal(estado);
    console.log("BÚNKER 13: sobrevive " + TURNOS_MAXIMOS + " días.");
    for (let turno = 1; turno <= TURNOS_MAXIMOS; turno++) {
        console.log("\nTurno " + estado.turno + " de " + TURNOS_MAXIMOS);
        mostrarRecursos(estado.recursos, estado.capacidad, estado.amenaza, estado.supervivientes);
        console.log("  Acciones: " + Object.keys(ACCIONES).join(", "));

        const accion = pedirAccion(estado);
        if (accion === null) {
            console.log("\nDemasiados intentos fallidos. Partida cancelada.");
            return;
        }
        const resultado = resolverTurno(estado, accion);
        estado = resultado.estado;
        const resumen = resultado.resumen;
        console.log("  Turno " + resumen.turno + " | Acción: " + resumen.accion + " | Incidente: " + resumen.incidente);
        console.log("  Consumo: agua " + resumen.consumo.agua + ", comida " + resumen.consumo.comida + ", energía " + resumen.consumo.energia);
        mostrarRecursos(resumen.recursos, estado.capacidad, resumen.amenaza, resumen.supervivientes);

        final = comprobarFinal(estado);
        if (final.terminado) {
            break;
        }
    }
    mostrarFinal(estado, final);
}

jugarPartida();
