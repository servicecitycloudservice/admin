import {
  push,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Initialize Firebase
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { app } from "../../environment/firebaseConfig.js";

// Import Modules
import { changeSelectEvent } from "../../modules/tabla/changeSelectEvent.js";
import { deleteRow } from "../../modules/tabla/deleteRow.js";

const database = getDatabase(app);
const collection = "libreria-de-conductores";
const tabla = document.getElementById("tablero");

let itemsPerPage = 10; // Número de elementos por página
let totalPages;
let currentPage = 1;

//-------------------------------------------------------------------------------------------------------
// Función para mostrar los datos en la tabla
function mostrarDatos() {
  // Vacía la tabla antes de agregar los nuevos datos
  tabla.innerHTML = "";

  // Obtén los datos de la base de datos
  onValue(ref(database, collection), (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Ordena los datos por la columna "Unidad" de forma descendente
    data.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Calcular totalPages
    totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    // Inicializa el contador de fila
    let filaNumero = startIndex + 1;

    // Mostrar datos de la página actual
    for (let i = startIndex; i < endIndex; i++) {
      const childData = data[i];
      const row = `
<tr>
  <td class="text-center">${filaNumero++}</td>
  <td class="text-center">${childData.nombre}</td>
  <td class="text-center">${childData.cedula}</td>
  <td class="text-center">${childData.whatsapp}</td>
  <td class="text-center">${childData.estado}</td>
  <td>
    <select class="form-select estado-select" data-id="${childData.id}">
      <option value="Activo" ${childData.estado === "Activo" ? "selected" : ""}>Activo</option>
      <option value="Activo sin carro" ${childData.estado === "Activo sin carro" ? "selected" : ""}>Activo sin carro</option>
      <option value="Suspendido" ${childData.estado === "Suspendido" ? "selected" : ""}>Suspendido</option>
      <option value="Expulsado" ${childData.estado === "Expulsado" ? "selected" : ""}>Expulsado</option>
    </select>
  </td>
  <td class="text-center width-auto">${childData.hora}</td>
  <td>
    <button class="btn btn-danger delete-user-button" data-id="${childData.id}">Eliminar</button>
  </td>
</tr>
                `;
      tabla.innerHTML += row;
    }
    // Actualizar la paginación pasando totalPages como argumento
    updatePagination(totalPages);

    deleteRow(database, collection);
  });
}

//-------------------------------------------------------------------------------------------------------------
// Escuchar el evento submit del formulario modal
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página

    // Obtener valores de los campos del formulario modal
    const nombreInput = document.getElementById(
      "validationCustomNombreModal"
    ).value;
    const cedulaInput = document.getElementById(
      "validationCustomCedulaModal"
    ).value;
    const whatsappInput = document.getElementById(
      "validationCustomWhatsappModal"
    ).value;
    const estadoInput = document.getElementById(
      "validationCustomEstadoModal"
    ).value;

    // Verificar que los campos no estén vacíos
    if (nombreInput.trim() !== "" && estadoInput.trim() !== "") {
      // Obtener la fecha y hora actual en la zona horaria de Panamá
      const now = new Date();
      const options = { timeZone: "America/Panama" };
      const formattedDateTime = now
        .toLocaleString("es-PA", options)
        .replace(/\./, "")
        .replace(/T/, " ")
        .replace(/\s([ap])\./, " $1.m.")
        .replace(/(\d+)\/(\d+)\/(\d+),/, "$3-$1-$2,");

      // Crear un nuevo objeto con los datos del formulario modal
      const nuevoRegistro = {
        nombre: nombreInput,
        cedula: cedulaInput,
        whatsapp: whatsappInput,
        estado: estadoInput,
        hora: formattedDateTime,
      };

      // Obtener una referencia a la ubicación en la base de datos donde se guardarán los datos
      const referenciaUnidades = ref(database, collection);

      // Agregar datos a la base de datos
      push(referenciaUnidades, nuevoRegistro)
        .then(() => {
          // Limpiar los campos del formulario modal
          document.getElementById("registerForm").reset();
          // Cerrar el modal
          const myModal = new bootstrap.Modal(
            document.getElementById("myModal")
          );
          myModal.hide();
          // Mostrar mensaje de éxito o recargar la página, según lo prefieras
          alert("Registro exitoso");
          // Recargar la página después de enviar el formulario (opcional)
          setTimeout(() => {
            location.reload();
          }, 100);
        })
        .catch((error) => {
          console.error("Error al enviar datos a la base de datos:", error);
          alert("Error al enviar datos a la base de datos");
        });
    } else {
      alert("Por favor completa todos los campos.");
    }
  });

// Función para mostrar el modal
function mostrarModal() {
  const myModal = new bootstrap.Modal(document.getElementById("myModal"));
  myModal.show();
}

//--------------------------------------------------------------------------------------------------------
// Función para buscar y filtrar los datos de la tabla
function findAndSearch() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = tabla.querySelectorAll("tr");

  rows.forEach((row) => {
    const nombre = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    if (nombre.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Evento para ejecutar la búsqueda cuando se haga clic en el botón de búsqueda
document
  .getElementById("searchButton")
  .addEventListener("click", findAndSearch);

// Evento para ejecutar la búsqueda cuando se presione Enter en el campo de entrada
document
  .getElementById("searchInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      findAndSearch();
    }
  });

//-----------------------------------------------------------------------------------------------------------
// Función para actualizar la paginación
function updatePagination(totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  const prevPageBtn = paginationContainer.querySelector("#prevPage");
  const nextPageBtn = paginationContainer.querySelector("#nextPage");

  // Actualizar estado de botones prev y next
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  // Eliminar números de página existentes
  paginationContainer
    .querySelectorAll(".pageNumber:not(.prev-page):not(.next-page)")
    .forEach((page) => {
      page.remove();
    });

  // Determinar las páginas a mostrar
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  // Asegurarse de que siempre haya tres páginas visibles si es posible
  if (startPage === 1 && totalPages > 2) {
    endPage = 3;
  } else if (endPage === totalPages && totalPages > 2) {
    startPage = totalPages - 2;
  }

  // Agregar números de página actualizados
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("pageNumber");
    if (i === currentPage) {
      pageItem.classList.add("active");
    }
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    pageItem.appendChild(pageLink);

    // Insertar pageItem antes del botón de la página siguiente
    nextPageBtn.parentElement.before(pageItem);

    (function (index) {
      pageLink.addEventListener("click", (e) => {
        e.preventDefault();

        currentPage = index;
        mostrarDatos();
        updatePagination(totalPages);
      });
    })(i);
  }

  // Evento para el botón de página anterior
  prevPageBtn.removeEventListener("click", handlePrevPage); // Remover el evento anterior
  prevPageBtn.addEventListener("click", handlePrevPage); // Agregar el evento

  // Evento para el botón de página siguiente
  nextPageBtn.removeEventListener("click", handleNextPage); // Remover el evento anterior
  nextPageBtn.addEventListener("click", handleNextPage); // Agregar el evento

  // Actualiza itemsPerPage con el valor seleccionado
  document
    .getElementById("itemsPerPageSelect")
    .addEventListener("change", function () {
      itemsPerPage = parseInt(this.value);
      currentPage = 1;
      mostrarDatos();
      updatePagination(totalPages);
    });
}

// Evento para el botón de página anterior
function handlePrevPage() {
  if (currentPage > 1) {
    currentPage--;
    mostrarDatos();
    updatePagination(totalPages);
  }
}

// Evento para el botón de página siguiente
function handleNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    mostrarDatos();
    updatePagination(totalPages);
  }
}

//*** -----------------------------------------------------------------------------
// Accion de Desplazamiento ===========================
// Botón de desplazamiento hacia Arriba/Abajo
const scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Evento de clic en el botón de desplazamiento hacia abajo
scrollToBottomBtn.addEventListener("click", function () {
  const lastRow = tabla.rows[tabla.rows.length - 1];
  lastRow.scrollIntoView({ behavior: "smooth", block: "end" });
});

// Evento de clic en el botón de desplazamiento hacia arriba
scrollToTopBtn.addEventListener("click", function () {
  const firstRow = tabla.rows[0];
  firstRow.scrollIntoView({ behavior: "smooth", block: "start" });
});

//*** --------------------------------------------------
// Descargar a Excel
// Función para descargar datos y convertirlos en Excel
function downloadToExcel() {
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
        // Filtrar las columnas que deseas incluir en el archivo Excel
        const { nombre, cedula, whatsapp, estado, hora } = childSnapshot.val();
        data.push({ nombre, cedula, whatsapp, estado, hora });
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

//------------------------------------------------------------------------------
// Evitar duplicidad de datos
// Suscribirse a eventos en tiempo real para actualizar la tabla automáticamente
onValue(ref(database), (snapshot) => {
  mostrarDatos();
  setTimeout(mostrarDatos, 200);
});

changeSelectEvent(tabla, database, collection);

console.log(database);
