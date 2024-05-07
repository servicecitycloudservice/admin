import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


// Exporta la función para que pueda ser utilizada en otros archivos
  export { downloadToExcel };


// Función para descargar a Excel
function downloadToExcel(database, collection) {
    // Mostrar una confirmación antes de descargar el archivo
    const confirmDownload = confirm(
      "¿Estás seguro de que deseas descargar el archivo Excel?"
    );
  
    // Verificar si el usuario confirmó la descarga
    if (confirmDownload) {
      // Obtén los datos de la base de datos Firebase
      onValue(ref(database, collection), (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
  
        // Convierte los datos a un formato compatible con Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  
        // Crea un archivo Excel y lo descarga
        XLSX.writeFile(workbook, "datos.xlsx");
        // Muestra el mensaje de éxito después de completar la descarga
        alert("Se ha descargado un excel con los datos del tablero", "success");
      });
    } else {
      // El usuario canceló la descarga, no hacer nada
      alert("Descarga cancelada");
    }
  }
  
  // Asigna la función downloadToExcel al evento click del botón
  document
    .getElementById("downloadToExcel")
    .addEventListener("click", downloadToExcel);
  

  