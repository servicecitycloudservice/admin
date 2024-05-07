import { ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

export { changeSelectEvent };
  
// Evento para actualizar el estado al cambiar el select
function changeSelectEvent(tabla, database, collection) {
    tabla.addEventListener("change", function (event) {
      if (event.target.classList.contains("estado-select")) { 
        const confirmar = confirm("¿Estás seguro de que deseas cambiar el estado?");
        if (confirmar) {
          const id = event.target.getAttribute("data-id");
          const nuevoEstado = event.target.value;
  
          update(ref(database, `${collection}/${id}`), { estado: nuevoEstado })
            .then(() => {
              console.log("Estado actualizado exitosamente");
            })
            .catch((error) => {
              console.error("Error al actualizar el estado:", error);
            });
        } else {
          // Volver al estado original si se cancela la operación
          mostrarDatos();
        }
      }
    });
  }
  

// Referencias
// estado-select = <select class="estado-select" data-id="${childData.id}">