export function setMaxLength() {
    const nombreInput = document.getElementById("validationCustomNombreModal");
    const cedulaInput = document.getElementById("validationCustomCedulaModal");
    const whatsappInput = document.getElementById("validationCustomWhatsappModal");
  
    // Verificar el maxlength para el campo nombre
    nombreInput.setAttribute("maxlength", "20");
  
    // Verificar el maxlength para el campo cedula
    cedulaInput.setAttribute("maxlength", "12");
  
    // Verificar el maxlength para el campo whatsapp
    whatsappInput.setAttribute("maxlength", "9");
  }
  