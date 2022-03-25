function ir_mesa(
  id_module,
  id_enrolled,
  id_laboratory,
  id_schedulegroup,
  id_course
) {
  courses = $("#content-cards").html();
  $.ajax({
    url: "/labs/mesaporcurso",
    type: "GET",
    data: {
      id_module,
      id_enrolled,
      id_laboratory,
      id_schedulegroup,
      id_course,
    },
    success: function (data, textStatus, jqXHR) {
      console.log(data.alumnocontrol);

      $("#nav-courses").removeClass("active-breadCrumb");
      $("#nav-courses").addClass("inactive-breadCrumb");
      $("#nav-equipments").removeClass("hide-breadCrumb");
      $("#nav-equipments").addClass("active-breadCrumb");
      $("#content-cards").empty();
      var html = "";

      var alumnosYProfesoresGroupedByMesa = groupBy(
        data.alumnosyprofesores,
        "name_module"
      );

      var groupedByMesa = groupBy(data.equipments, "name_module");

      for (let k in groupedByMesa) {
        html +=
          '<div class="table-container">' +
          '<div class="table-containerHeader">' +
          k;

        html +=
          "<div style='color:rgba(112, 107, 103, 0.80);border: 1px rgba(112, 107, 103, 0.08) solid;box-shadow: 1px 1px 1px 1px rgba(112, 107, 103, 0.08);padding-left:50px; background-color:rgba(112, 107, 103, 0.08);padding-top:0.5rem;padding-bottom:0.1rem;border-radius:1rem;'><ul style='font-size:smaller;list-style-type:none;'>";
        for (let k2 in alumnosYProfesoresGroupedByMesa) {
          /* LISTA DE ALUMNOS POR MESA */
          Object.keys(alumnosYProfesoresGroupedByMesa[k2]).map(function (
            objectKey,
            index
          ) {
            let element = alumnosYProfesoresGroupedByMesa[k2][objectKey];

            if (k == k2)
              html +=
                "<li>" + element.names_user + element.surnames_user + "</li>";
          });
        }
        html += "</ul></div>";

        html += "</div>";

        html += '<div class="courses-cards">';
        Object.keys(groupedByMesa[k]).map(function (objectKey1, index) {
          let element = groupedByMesa[k][objectKey1];

          html += '<div class="course-card">';
          html +=
            '<div class="machine-cardHeader">' +
            element.name_equipment +
            "</div>";
          html +=
            '<div class="machine-cardBody">Tipo: ' + element.name_equipmenttype;

          let existalumnocontrol = false;
          let id_matriculacontrol;
          data.alumnocontrol.forEach((element4) => {
            if (element4.id_equipment === element.id_equipment) {
              html +=
                "<br> Control: " + element4.names_user + element4.surnames_user;
              existalumnocontrol = true;
              id_matriculacontrol = element4.id_enrolled;
            }
          });
          if (existalumnocontrol === false) {
            html += "<br> Control: Sin Designar";
          }

          if (data.isProfesor) {
            html += '<form action="/labs/editcontrol" method="post">';
            html +=
              '<input type="hidden" id="custId" name="id_equipment" value=' +
              element.id_equipment +
              ">";
            html +=
              '<input type="hidden" id="custId" name="id_matriculaanterior" value=' +
              id_matriculacontrol +
              ">";

            html +=
              "<label for='controlselector'" +
              objectKey1 +
              ">Designar Control a:</label>";
            html +=
              "<select name='id_enrolled' id='controlselector" +
              objectKey1 +
              "' required onchange='enableButton(\"controlselector" +
              objectKey1 +
              '","controlbutton' +
              objectKey1 +
              "\")'>";
            html += "<option value=''>Seleccione Alumno</option>";

            for (let k2 in alumnosYProfesoresGroupedByMesa) {
              /* LISTA DE ALUMNOS POR MESA */
              Object.keys(alumnosYProfesoresGroupedByMesa[k2]).map(function (
                objectKey,
                index
              ) {
                let element = alumnosYProfesoresGroupedByMesa[k2][objectKey];
                if (k == k2)
                  html +=
                    "<option value=" +
                    element.id_enrolled +
                    ">" +
                    element.names_user +
                    element.surnames_user +
                    "</option>";
              });
            }

            html += "</select>";
            html += "<br><br>";
            html +=
              '<input type="submit" disabled id="controlbutton' +
              objectKey1 +
              '" value="Submit">';
            html += "</form>";
          }

          html +=
            '<a href="/labs/' +
            element.approute_equipmenttype +
            "?wss_equipo=" +
            element.websocketroute_equipment +
            "&id_enrolled=" +
            element.id_enrolled +
            "&id_equipment=" +
            element.id_equipment +
            '">';

          html += "<div>Ingresar</div>";
          html += "</a>";
          html += "</div>";
          html += "</div>";
        });
        html += "</div>";
        html += "</div>";
      }
      $("#content-cards").append(html);
    },
  });
}
