function YourRegex(item, index) {
  // This function add colors, bold, whatever you want.
  document.getElementById("view").innerHTML = index + ":" + item + "<br>";
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var emails = [];

function borraremail(indice) {
  emails.splice(indice, 1);
  //imprime nuevamente
  document.getElementById("view").innerHTML = "";
  for (var indice in emails) {
    document.getElementById("view").innerHTML +=
      "<b>" + emails[indice] + " </b><i style='color:red' class='fas fa-times-circle' onclick='borraremail(" + indice + ")'></i><br>";
  }
}

var emailstextarea = document.getElementById("email");
var pre = document.getElementById("view");
var verificaemail = document.getElementById("verificaemail");
var indiceinicial = 0;
var indicefinal = 0;

if (typeof emailstextarea != "undefined" && emailstextarea != null) {
  if (emailstextarea.addEventListener) {
    emailstextarea.addEventListener(
      "input",
      function (data) {
        // event handling code for sane browsers

        if (data.data == ",") {
          var indicefinal = emailstextarea.value.indexOf(",");

          var val = emailstextarea.value.substring(0, indicefinal);
          //console.log(val);
          if (validateEmail(val)) {
            //Añadiendo elementos al arreglo emails
            emails.push(val);

            document.getElementById("view").innerHTML = "";
            for (var indice in emails) {
              document.getElementById("view").innerHTML +=
                "<b>" + emails[indice] + " </b><i style='color:red' class='fas fa-times-circle' onclick='borraremail(" + indice + ")'></i><br>";
            }

            emailstextarea.value = ""; //Borra textarea al escribir una coma
            verificaemail.innerHTML = ""; //Borra el "error" en caso haya si ya se ha ingresado un correo correcto
          } else {
            verificaemail.innerHTML = '<p style="font-size:smaller;">El correo ingresado no es correcto<p>';
          }
        }
      },
      false
    );
  } else if (emailstextarea.attachEvent) {
    emailstextarea.attachEvent("onpropertychange", function () {
      // IE-specific event handling code
      //console.log("chau"); //arreglar esto
    });
  }
}

$("#buttonRegistrarUsuario").click(function () {
  if (emails.length != 0) {
    emails = JSON.stringify(emails);
    let id_tipoUsuario = $("#selector_TipoUsuario").val();

    $.ajax({
      url: "/admin/registrarusuario",
      type: "POST",
      data: { emails, id_tipoUsuario },
      success: function (data, textStatus, jqXHR) {
        if ((data.state = "error")) {
          if (data.createdEmails && data.createdEmails.length) {
            console.log(data.createdEmails);

            $("#modal-registeredusers").append("<div class='alert-block alert-success'> Se crearon los siguientes correos:</div><ul>");

            data.createdEmails.forEach((email) => {
              $("#modal-registeredusers").append("<li>" + email + "</li>");
            });

            $("#modal-registeredusers").append("</ul></br>");
          }
          //!INICIO DUPLICADOS

          if (data.duplicatedEmails) {
            data.duplicatedEmails.forEach((email) => {
              $("#modal-registeredusers").append("<div class='alert-block alert-error'> Los siguientes correos no pudieron ser creados (Duplicados) </div><ul>");
              $("#modal-registeredusers").append("<li>" + email + "</li>");
            });
          }

          $("#modal-registeredusers").append("</ul>");
          //!FIN DUPLICADOS
        } else if ((data.state = "success")) {
          $("#modal-registeredusers").append("<div style=background-color:green> Se crearon los siguientes correos:<ul>");

          data.createdEmails.forEach((email) => {
            $("#modal-registeredusers").append("<li>" + email + "</li>");
          });

          $("#modal-registeredusers").append("</ul></div>");
        }

        $("#exampleModalCenter").modal("show");
        $("#exampleModalCenter").on("hidden.bs.modal", function () {
          // do something…
          if (typeof data.redirect == "string") window.location = data.redirect;
        });
      },
    });
  } else {
    verificaemail.innerHTML = '<p style="font-size:smaller;background-color:red">No se ha ingresado ningún email<p>';
  }
});
