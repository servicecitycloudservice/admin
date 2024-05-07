import { ref, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

export { deleteRow };

// Eventos de escucha a los botones de eliminación después de crear las filas
function deleteRow(database, collection) {
  // Agregar eventos de escucha a los botones de eliminación después de crear las filas
  const deleteButtons = document.querySelectorAll(".delete-user-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const id = event.target.getAttribute("data-id");

      // Mostrar un mensaje de confirmación
      const confirmarBorrado = confirm("¿Estás seguro que deseas borrar este elemento?");

      // Verificar si se confirmó el borrado
      if (confirmarBorrado) {
        // Eliminar el elemento seleccionado
        remove(ref(database, `${collection}/${id}`))
          .then(() => {
            // Mostrar mensaje de éxito
            console.log("Elemento ha sido borrado exitosamente.");
          })
          .catch((error) => {
            console.error("Error al borrar el elemento:", error);
          });
      } else {
        // Si se cancela el borrado, mostrar un mensaje de cancelación
        console.log("Borrado cancelado.");
      }
    });
  });
}














const deleteButtons = document.querySelectorAll(".delete-user-button");
deleteButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    const id = event.target.getAttribute("data-id");

    // Mostrar un mensaje de confirmación
    const confirmarBorrado = confirm("¿Estás seguro que deseas borrar este elemento?");

    // Verificar si se confirmó el borrado
    if (confirmarBorrado) {
      // Eliminar el elemento seleccionado
      remove(ref(database, `${collection}/${id}`))
        .then(() => {
          // Mostrar mensaje de éxito
          console.log("Elemento ha sido borrado exitosamente.");
          // Actualizar la visualización de los datos
          mostrarDatos();
        })
        .catch((error) => {
          console.error("Error al borrar el elemento:", error);
        });
    } else {
      // Si se cancela el borrado, mostrar un mensaje de cancelación
      console.log("Borrado cancelado.");
    }
  });
});