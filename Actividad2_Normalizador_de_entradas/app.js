import { normalizarParticipante } from "./validacion.js";

const formulario = document.getElementById("formulario");
const salida = document.getElementById("salida");

formulario.addEventListener("submit", (evento) => {
   evento.preventDefault();

   const nombre = document.getElementById("nombre").value;
   const edadTexto = document.getElementById("edad").value;
   const opcion = document.getElementById("acepta").value;

   let aceptaNormas;
   if (opcion === "true") {
      aceptaNormas = true;
   } else if (opcion === "false") {
      aceptaNormas = false;
   } else {
      aceptaNormas = "false";
   }

   const resultado = normalizarParticipante(nombre, edadTexto, aceptaNormas);
   salida.textContent = JSON.stringify(resultado, null, 2);
})