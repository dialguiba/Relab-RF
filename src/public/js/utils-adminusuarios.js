function eliminar_usuario(id_user) {
  $.ajax({
    type: "POST",
    url: "/admin/delete-user",
    data: { id_user },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      elemento = "#fila_usuario" + id_user;
      $(elemento).fadeOut(500, () => {
        $(elemento).remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function modificar_usuario(id_user) {
  let names_user = document.getElementById("names_user" + id_user);
  let surnames_user = document.getElementById("surnames_user" + id_user);
  let email_user = document.getElementById("email_user" + id_user);
  let boton_modificar = document.getElementById("boton_modificar" + id_user);
  names_user.innerHTML = '<input id="inputNombres_usuario' + id_user + '" value="' + names_user.innerText + '">';
  surnames_user.innerHTML = '<input id="inputApellidos_usuario' + id_user + '" value="' + surnames_user.innerText + '">';
  email_user.innerHTML = '<input id="inputEmail_usuario' + id_user + '" value="' + email_user.innerText + '">';
  /* boton_modificar.innerHTML =
    '<i id="boton_modificar{{counter @index}}" style="color:green" class="fas fa-check-circle" onclick="modificar_usuario({{counter @index}})"></i>'; */
  boton_modificar.className = "fas fa-check-circle";
  boton_modificar.setAttribute("onClick", "actualizar_modificacion(" + id_user + ");");
}

function actualizar_modificacion(id_user) {
  let names_user = document.getElementById("names_user" + id_user);
  let surnames_user = document.getElementById("surnames_user" + id_user);
  let email_user = document.getElementById("email_user" + id_user);
  let boton_modificar = document.getElementById("boton_modificar" + id_user);

  let input_nombres_usuario = document.getElementById("inputNombres_usuario" + id_user);
  let input_apellidos_usuario = document.getElementById("inputApellidos_usuario" + id_user);

  let input_email_usuario = document.getElementById("inputEmail_usuario" + id_user);

  let nuevo_nombres_usuario = input_nombres_usuario.value;
  let nuevo_apellidos_usuario = input_apellidos_usuario.value;
  let nuevo_email_usuario = input_email_usuario.value;

  $.ajax({
    type: "POST",
    url: "/admin/modificarusuario",
    data: {
      id_user,
      nuevo_nombres_usuario,
      nuevo_apellidos_usuario,
      nuevo_email_usuario,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      names_user.innerText = nuevo_nombres_usuario;
      surnames_user.innerText = nuevo_apellidos_usuario;
      email_user.innerText = nuevo_email_usuario;

      input_nombres_usuario.remove();
      input_apellidos_usuario.remove();
      input_email_usuario.remove();

      boton_modificar.className = "far fa-edit";

      boton_modificar.setAttribute("onClick", "modificar_usuario(" + id_user + ");");

      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}
