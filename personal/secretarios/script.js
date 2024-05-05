// ========== ========== NavBar ========== ==========
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

// ========== ========== NavBar ========== ==========

// ========== ========== Modal ========== ==========
// Función para abrir un modal específico
function abrirModal(id) {
    document.getElementById(id).style.display = 'block';
  }
  
  // Función para cerrar un modal específico
  function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
  }
  
  // Eventos para los botones de abrir
  // Secretarios
  document.getElementById('btnModal-chapalin').onclick = function() { abrirModal('modal-chapalin'); }
  document.getElementById('btnModal-gabriel').onclick = function() { abrirModal('modal-gabriel'); }
  document.getElementById('btnModal-pollito').onclick = function() { abrirModal('modal-pollito'); }
  
  // Cerrar el modal si se hace clic fuera de él
  window.onclick = function(event) {
    if (event.target.className === 'modal') {
      event.target.style.display = 'none';
    }
  }
  // ========== ========== Modal ========== ==========