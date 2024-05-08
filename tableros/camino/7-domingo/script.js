import { push, ref, remove, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Initialize Firebase
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { app } from "../../../environment/firebaseConfig.js"
const database = getDatabase(app);

const form = document.querySelector("form");
const tabla = document.getElementById("tableroChorrera");
let itemsPerPage = 25; // Número de elementos por página
let totalPages;
let currentPage = 1;
let isSubmitting = false;
// const submitBtn = document.getElementById("submitForm-btn");

// Función para mostrar los datos en la tabla
function mostrarDatos() {
    // Vacía la tabla antes de agregar los nuevos datos
    tabla.innerHTML = "";

    // Obtén los datos de la base de datos
    onValue(ref(database, "tablero-panama-camino-7-domingo"), (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
            data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        // Calcular totalPages
        totalPages = Math.ceil(data.length / itemsPerPage);

        // Calcular índices de inicio y fin
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
                            <td class="text-center">${childData.hora}</td>
                            <td class="text-center">${childData.unidad}</td>
                            <td class="text-center">${childData.estado}</td>
                            <td>
                            <select class="form-select estado-select" data-id="${childData.id}">
                            <option value="---" ${childData.estado === "---" ? "selected" : ""}>---</option>
                            <option value="Lleno" ${childData.estado === "Lleno" ? "selected" : ""}>Lleno</option>
                            <option value="En pesa" ${childData.estado === "En pesa" ? "selected" : ""}>En pesa</option>
                            <option value="A pesa" ${childData.estado === "A pesa" ? "selected" : ""}>A pesa</option>
                            <option value="Pendiente" ${childData.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                            <option value="Permiso" ${childData.estado === "Permiso" ? "selected" : ""}>Permiso</option>
                            <option value="Apoyo" ${childData.estado === "Apoyo" ? "selected" : ""}>Apoyo</option>
                            <option value="Taller" ${childData.estado === "Taller" ? "selected" : ""}>Taller</option>
                            <option value="X" ${childData.estado === "Revision X" ? "selected" : ""}>X</option>
                            <option value="X X" ${childData.estado === "X X" ? "selected" : ""}>X X</option>
                        </select>
                            </td>
                        </tr>
                          `;
            tabla.innerHTML += row;
        }
        // Agregar el event listener al nuevo select generado
        const selectElements = document.querySelectorAll('.estado-select');
        selectElements.forEach((selectElement) => {
            selectElement.addEventListener('change', function () {
                // Obtener el valor seleccionado
                var selectedValue = this.value;

                // Si el valor seleccionado es "Lleno", desactivar el select y cambiar el color del texto a azul
                if (selectedValue === 'Lleno') {
                    this.disabled = true;
                    this.parentNode.previousElementSibling.style.color = 'blue';
                }
                // Si el valor seleccionado es "X X", desactivar el select y cambiar el color del texto a rojo
                else if (selectedValue === 'X X') {
                    this.disabled = true;
                    this.parentNode.previousElementSibling.style.color = 'red';
                }
                // Si el valor seleccionado no es "Lleno" ni "X X", habilitar el select y cambiar el color del texto a negro
                else {
                    this.disabled = false;
                    this.parentNode.previousElementSibling.style.color = 'black';
                }
            });

            // Actualizar el estado del select al inicio
            var selectedValue = selectElement.value;
            selectElement.disabled = (selectedValue === 'Lleno' || selectedValue === 'X X');
            if (selectedValue === 'Lleno') {
                selectElement.parentNode.previousElementSibling.style.color = 'green';
            } else if (selectedValue === 'X X') {
                selectElement.parentNode.previousElementSibling.style.color = 'red';
            }
        });

        // Actualizar la paginación pasando totalPages como argumento
        updatePagination(totalPages);
    });
};


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

//---------------------------------------------------------------------------------------------------
// Evento para enviar el formulario
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario

    console.log("Evento submit está funcionando"); // Agregar este console.log

    if (!isSubmitting) {
        isSubmitting = true; // Bloquea el formulario

        const unidadInput = document.getElementById("validationCustom01").value;
        const estadoInput = document.getElementById("validationCustom04").value;

        // Verifica que los campos no estén vacíos
        if (unidadInput.trim() !== "" && estadoInput.trim() !== "") {
            // Obtener la fecha y hora actual en la zona horaria de Panamá
            const now = new Date();
            const options = { timeZone: "America/Panama" };
            const formattedDateTime = now
                .toLocaleString("es-PA", options)
                .replace(/\./, "")
                .replace(/T/, " ")
                .replace(/\s([ap])\./, " $1.m.")
                .replace(/(\d+)\/(\d+)\/(\d+),/, "$3-$1-$2,")
                .toUpperCase(); // Convertir a mayúsculas

            console.log("Fecha y hora actual en Panamá:", formattedDateTime);

            // Crear un nuevo objeto con los datos a guardar
            const nuevoRegistro = {
                hora: formattedDateTime, // Obtener la fecha y hora actual del cliente
                unidad: unidadInput,
                estado: estadoInput,
            };

            // Obtener una referencia a la ubicación en la base de datos donde se guardarán los datos
            const referenciaUnidades = ref(database, "tablero-panama-camino-7-domingo");

            // Agregar datos a la base de datos
            push(referenciaUnidades, nuevoRegistro)
                .then(() => {
                    // Limpia los campos del formulario
                    form.reset();
                    // Desbloquea el formulario después de 1 segundos
                    setTimeout(() => {
                        isSubmitting = false;
                    }, 1000);
                    // Recarga la página después de enviar el formulario
                    setTimeout(() => {
                        location.reload();
                    }, 100);
                })
                .catch((error) => {
                    console.error("Error al enviar datos a la base de datos:", error);
                });
        } else {
            alert("Por favor completa todos los campos.");
        }
    } else {
        alert(
            "Ya se está enviando un formulario. Por favor espera unos momentos antes de intentar de nuevo."
        );
    }
});

// Suscribirse a eventos en tiempo real para actualizar la tabla automáticamente
onValue(ref(database, "tablero-panama-camino-7-domingo"), (snapshot) => {
    mostrarDatos(); // Mostrar los datos actualizados en la tabla
    setTimeout(mostrarDatos, 200); // Actualizar la tabla automáticamente después de 1 segundo
});

//***-----------------------------------------------------------------------------
// Evento para actualizar el estado al cambiar el select
tabla.addEventListener("change", function (event) {
    if (event.target.classList.contains("estado-select")) {
        const confirmar = confirm("¿Estás seguro de que deseas cambiar el estado?");
        if (confirmar) {
            const id = event.target.getAttribute("data-id");
            const nuevoEstado = event.target.value;

            console.log("ID:", id);
            console.log("Nuevo estado:", nuevoEstado);
            update(ref(database, `tablero-panama-camino-7-domingo/${id}`), { estado: nuevoEstado })
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
}); // Accion de Desplazamiento ===========================

//*** -----------------------------------------------------------------------
// Borrar Tablero completo
// Botón de borrado
const deleteButton = document.getElementById("delete-board-button");

// Modal de confirmación
const confirmationModal = document.getElementById("confirmationModal");
const confirmDeleteButton = document.getElementById("confirm-delete");
const cancelDeleteButton = document.getElementById("cancel-delete");

// Mostrar modal de confirmación al hacer clic en el botón de borrado
deleteButton.addEventListener("click", function () {
    confirmationModal.style.display = "block";
});

// Confirmar el borrado
confirmDeleteButton.addEventListener("click", function () {
    // Ubicación de los datos a borrar en la base de datos
    remove(ref(database, "tablero-panama-camino-7-domingo"));

    alert("El tablero ha sido borrado exitosamente.");

    // Cierra el modal de confirmación
    var confirmationModal = document.getElementById("confirmationModal");
    confirmationModal.style.display = "none"; // Oculta el modal estableciendo su estilo de visualización en 'none'
});

// Cancelar el borrado
cancelDeleteButton.addEventListener("click", function () {
    confirmationModal.style.display = "none";
});

//*** --------------------------------------------------
// Descargar a Excel
// Función para descargar datos y convertirlos en Excel
function downloadToExcel() {

    // Mostrar una confirmación antes de descargar el archivo
    const confirmDownload = confirm("¿Estás seguro de que deseas descargar el archivo Excel?");

    // Verificar si el usuario confirmó la descarga
    if (confirmDownload) {

        // Obtén los datos de la base de datos Firebase
        onValue(ref(database, "tablero-panama-camino-7-domingo"), (snapshot) => {
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

console.log(database);
