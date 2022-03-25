/* const { idleCount } = require("../../database"); */

function ir_inicio() {
  $("#selector_contacto").removeClass("active");
  $("#selector_acercaDe").removeClass("active");
  $("#selector_inicio").addClass("active");

  $("#tituloPrincipal").html("Laboratorios Remotos FIEE");

  $("#descripcionPrincipal").html("Acceso Remoto a equipments de los laboratories de la facultad de Ingeniería electrónica, eléctrica y telecomunicaciones.");
}
function ir_acercaDe() {
  $("#selector_contacto").removeClass("active");
  $("#selector_inicio").removeClass("active");
  $("#selector_acercaDe").addClass("active");

  $("#tituloPrincipal").html("Acerca de");

  $("#descripcionPrincipal").html(
    "Relab es un proyecto que busca implementar el acceso remoto a distintos laboratories de la facultad de Ingeniería Electrónica, Eléctrica y Telecomunicaciones de la Universidad Nacional Mayor de San Marcos"
  );
}
function ir_contacto() {
  $("#selector_inicio").removeClass("active");
  $("#selector_acercaDe").removeClass("active");
  $("#selector_contacto").addClass("active");

  $("#tituloPrincipal").html("Contacto");

  $("#descripcionPrincipal").html("Si tienes algún problema con el acceso a tu cuenta puedes enviar un correo a: ");
}

function login() {
  let inputEmail = document.getElementById("input_emailLogin");
  let inputPassword = document.getElementById("input_PasswordLogin");
  let divMessage = document.getElementById("message");
  //console.log(inputEmail.checkValidity().);
  //inputEmail.validity.valid
  if ((inputEmail.checkValidity() && inputPassword.checkValidity()) || inputEmail.value == "administrador" || inputEmail.value == "Administrador") {
    let email = inputEmail.value;
    let password = inputPassword.value;
    $.ajax({
      url: "/signin",
      type: "POST",
      data: { email, password },
      dataType: "json",
      success: function (data, textStatus, jqXHR) {
        if (data.error == 1) {
          divMessage.innerHTML = data.renderedMessage;
        } else {
          window.location.replace("/profile");
        }
      },
    });
  } else if (inputEmail.validity.valueMissing) {
    divMessage.innerHTML = `<div class="alert-block alert-error-soft"> <strong>Error: </strong>Ingrese un correo</div>`;
  } else if (inputEmail.validity.typeMismatch) {
    divMessage.innerHTML = `<div class="alert-block alert-error-soft"> <strong>Error: </strong>Ingrese un correo Válido</div>`;
  } else if (inputPassword.validity.valueMissing) {
    console.log("falta password");
    divMessage.innerHTML = `<div class="alert-block alert-error-soft"> <strong>Error: </strong>Ingrese una contraseña</div>`;
  }
}
