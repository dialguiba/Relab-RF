$(".clockpicker").clockpicker({});

//PARA TOOLTIP
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//selectores adminalumnos

/* $("#selectorCurso_adminalumnos").change(function () {   */
function func(user) {
  let selectedCurso = $("#selectorCurso_adminalumnos" + user).prop(
    "selectedIndex"
  );
  //console.log(selectedCurso);
  $.ajax({
    url: "/admin/fillselectormesabycurso",
    type: "GET",
    data: { selectedCurso },
    success: function (data, textStatus, jqXHR) {
      data = JSON.parse(data);
      console.log(data);

      $("#selectorMesa_adminalumnos" + user)
        .find("option")
        .remove();
      $("#selectorMesa_adminalumnos" + user).append(
        $("<option></>").attr("value", 0).text("Mesa")
      );
      data.forEach((element) => {
        console.log(element.name_module);
        $("#selectorMesa_adminalumnos" + user).append(
          $("<option></>")
            .attr("value", element.id_module)
            .text(element.name_module)
        );
      });
    },
  });

  $.ajax({
    url: "/admin/fillselectorgruposyhorariosbycurso",
    type: "GET",
    data: { selectedCurso },
    success: function (data, textStatus, jqXHR) {
      data = JSON.parse(data);
      $("#selectorGrupoHorario_adminalumnos" + user)
        .find("option")
        .remove();
      $("#selectorGrupoHorario_adminalumnos" + user).append(
        $("<option></>").attr("value", 0).text("Grupo Horario")
      );
      data.forEach((element) => {
        //console.log(element.name_module)
        $("#selectorGrupoHorario_adminalumnos" + user).append(
          $("<option></>")
            .attr("value", element.id_schedulegroup)
            .text(element.name_schedulegroup)
        );
      });
    },
  });
}

/* }); */

//SUGERENCIA DE ALUMNOS RESPECTO AL CURSO. SI ES QUE ESTÁ MATRICULADO NO SE MUESTRA AL ALUMNO

function sugerenciaAlumnos(id_input) {
  $("#" + id_input).autocomplete({
    source: alumnosyprofesores,
  });
}

var alumnosyprofesores = [];

function obtenerAlumnos(id_course) {
  alumnosyprofesores = [];
  $.ajax({
    url: "/admin/alumnosyprofesores",
    type: "GET",
    data: { id_course },

    success: function (data, textStatus, jqXHR) {
      //console.log(data)
      //$('#selectorGrupoHorario_adminalumnos'+user).find('option').remove();
      //$('#selectorGrupoHorario_adminalumnos'+user).append($("<option></>").attr("value", 0).text('Grupo Horario'));
      data.forEach((element) => {
        //console.log(element.names_user)
        //countries.push(element.names_user + " " +element.surnames_user + " (" + element.code_user.toString() + ")");
        alumnosyprofesores.push(
          "(" +
            element.code_user.toString() +
            ") " +
            element.names_user +
            " " +
            element.surnames_user
        );
      });
    },
  });
}

/*@FIN@ OBTIENE USUARIOS PARA AGREGAR EL FOMULARIO DE AGREGAR USUARIOS DEL MÓDULO "LABORATORIOS" */

//ACA EMPEZÓ EL CAMBIO
function createLaboratory() {
  let name_laboratory = $("#input_nombre_laboratorio").val();
  let numero_fila = $(".fila_tabla_laboratorios").length + 1;

  //console.log(name_laboratory);

  $.ajax({
    url: "/admin/crearlaboratorio",
    type: "POST",
    data: { name_laboratory, numero_fila },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      //$("#lista-users").fadeOut(500).fadeIn(500);

      $("#body_tabla_laboratorios")
        .append(data.html)
        .append(() => {
          $("#input_nombre_laboratorio").val("");
        });
    },
  });
}

function deleteLaboratory(id_laboratory) {
  $.ajax({
    url: "/admin/eliminarlaboratorio",
    type: "POST",
    data: { id_laboratory },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_laboratorios = "#fila_tabla_laboratorios" + id_laboratory;
      tabla_cursos = ".tabla_cursos" + id_laboratory;
      tabla_mesas = ".tabla_mesas" + id_laboratory;
      $(tabla_laboratorios).fadeOut(250, () => {
        $(tabla_laboratorios).remove();
      });
      $(tabla_cursos).fadeOut(250, () => {
        $(tabla_cursos).remove();
      });
      $(tabla_mesas).fadeOut(250, () => {
        $(tabla_mesas).remove();
      });
    },
  });
}

function crear_curso(id_laboratory) {
  let name_course = $("#input_nombre_curso" + id_laboratory).val();
  let numero_fila = $(".fila_tabla_cursos").length + 1;
  $.ajax({
    url: "/admin/crearcurso",
    type: "POST",
    data: { id_laboratory, name_course, numero_fila },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body_tabla_cursos" + id_laboratory)
        .append(data.html)
        .append(() => {
          $("#input_nombre_curso" + id_laboratory).val("");
        });
    },
  });
}

function eliminar_curso(id_course) {
  $.ajax({
    url: "/admin/eliminarcurso",
    type: "POST",
    data: { id_course },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_cursos = "#fila_tabla_cursos" + id_course;
      tabla_usuarios = "#tabla_usuarios" + id_course;
      tabla_gruposhorarios = "#tabla_gruposhorarios" + id_course;
      tabla_mesas = "#tabla_mesas" + id_course;
      $(tabla_cursos).fadeOut(250, () => {
        $(tabla_cursos).remove();
      });
      $(tabla_usuarios).fadeOut(250, () => {
        $(tabla_usuarios).remove();
      });
      $(tabla_gruposhorarios).fadeOut(250, () => {
        $(tabla_gruposhorarios).remove();
      });
      $(tabla_mesas).fadeOut(250, () => {
        $(tabla_mesas).remove();
      });
    },
  });
}

function crear_mesa(id_laboratory) {
  let name_module = $("#input_nombre_mesa" + id_laboratory).val();
  let numero_fila = $(".fila_tabla_mesas").length + 1;
  $.ajax({
    url: "/admin/crearmesa",
    type: "POST",
    data: { id_laboratory, name_module, numero_fila },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body_tabla_mesas" + id_laboratory)
        .append(data.html)
        .append(() => {
          $("#input_nombre_mesa" + id_laboratory).val("");
          $(".selector_id_mesa").append(
            "<option value=" + data.id_module + ">" + name_module + "</option>"
          );
        });
    },
  });
}

function deleteModule(id_module) {
  $.ajax({
    url: "/admin/eliminarmesa",
    type: "POST",
    data: { id_module },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_mesas = "#fila_tabla_mesas" + id_module;
      tabla_equipos = ".tabla_equipos" + id_module;
      $(tabla_mesas).fadeOut(250, () => {
        $(tabla_mesas).remove();
      });
      $(tabla_equipos).fadeOut(250, () => {
        $(tabla_equipos).remove();
      });
    },
  });
}

function createEquipment(id_module) {
  let name_equipment = $("#input_nombre_equipo" + id_module).val();
  let ip_equipment = $("#input_ip_equipo" + id_module).val();
  let port_equipment = $("#input_puerto_equipo" + id_module).val();
  let wsroute_equipment = $("#input-wsroute-equipment-" + id_module).val();
  let id_equipmenttype = $("#selector_id_tipoequipo" + id_module).val();

  let numero_fila = $(".fila_tabla_equipos").length + 1;
  $.ajax({
    url: "/admin/crearequipo",
    type: "POST",
    data: {
      id_module,
      name_equipment,
      ip_equipment,
      port_equipment,
      wsroute_equipment,
      id_equipmenttype,
      numero_fila,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body_tabla_equipos" + id_module)
        .append(data.html)
        .append(() => {
          $("#input_nombre_equipo" + id_module).val("");
          $("#input_ip_equipo" + id_module).val("");
          $("#input_puerto_equipo" + id_module).val("");
          $("#input-wsroute-equipment-" + id_module).val("");
          $("#selector_id_tipoequipo" + id_module).val(0);
        });
    },
  });
}

function deleteEquipment(id_equipment) {
  $.ajax({
    url: "/admin/eliminarequipo",
    type: "POST",
    data: { id_equipment },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_equipos = "#fila_tabla_equipos" + id_equipment;
      $(tabla_equipos).fadeOut(250, () => {
        $(tabla_equipos).remove();
      });
    },
  });
}

function asignar_usuario(id_course) {
  let nombre_usuario = $("#input_datos_usuario" + id_course).val();
  let id_module = $("#selector_id_mesa" + id_course).val();
  let id_schedulegroup = $("#selector_id_grupohorario" + id_course).val();
  let name_module = $(
    "#selector_id_mesa" + id_course + " option:selected"
  ).text();
  let name_schedulegroup = $(
    "#selector_id_grupohorario" + id_course + " option:selected"
  ).text();

  let numero_fila = $(".fila_tabla_usuarios").length + 1;
  $.ajax({
    url: "/admin/asignarusuario",
    type: "POST",
    data: {
      nombre_usuario,
      id_module,
      id_schedulegroup,
      id_course,
      name_module,
      name_schedulegroup,
      numero_fila,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body_tabla_usuarios" + id_course)
        .append(data.html)
        .append(() => {
          $("#input_datos_usuario" + id_course).val("");
          $("#selector_id_mesa" + id_course).val(0);
          $("#selector_id_grupohorario" + id_course).val(0);
        });
    },
  });
}

function desasignar_usuario(id_enrolled) {
  $.ajax({
    url: "/admin/desasignarusuario",
    type: "POST",
    data: { id_enrolled },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_usuarios = "#fila_tabla_usuarios" + id_enrolled;
      $(tabla_usuarios).fadeOut(250, () => {
        $(tabla_usuarios).remove();
      });
    },
  });
}

function crear_grupohorario(id_course) {
  let name_schedulegroup = $("#input_nombre_grupohorario" + id_course).val();
  let numero_fila = $(".fila_tabla_gruposhorarios").length + 1;

  $.ajax({
    url: "/admin/creargrupohorario",
    type: "POST",
    data: {
      id_course,
      name_schedulegroup,
      numero_fila,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body_tabla_gruposhorarios" + id_course)
        .append(data.html)
        .append(() => {
          $("#input_nombre_grupohorario" + id_course).val("");
          $(".selector_id_grupohorario").append(
            "<option value=" +
              data.id_schedulegroup +
              ">" +
              name_schedulegroup +
              "</option>"
          );
        });
    },
  });
}

function eliminar_grupohorario(id_schedulegroup) {
  $.ajax({
    url: "/admin/eliminargrupohorario",
    type: "POST",
    data: { id_schedulegroup },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_gruposhorarios = "#fila_tabla_gruposhorarios" + id_schedulegroup;
      tabla_horarios = ".tabla_horarios" + id_schedulegroup;
      $(tabla_gruposhorarios).fadeOut(250, () => {
        $(tabla_gruposhorarios).remove();
      });
      $(tabla_horarios).fadeOut(250, () => {
        $(tabla_horarios).remove();
      });
    },
  });
}

function crear_diayhora(id_schedulegroup) {
  let day_dayandtime = $(
    "#selector_dia_grupoydiayhora" + id_schedulegroup
  ).val();
  let starttime_dayandtime = $(
    "#input_horainicio_grupoydiayhora" + id_schedulegroup
  ).val();
  let endtime_dayandtime = $(
    "#input_horafin_grupoydiayhora" + id_schedulegroup
  ).val();
  let numero_fila = $(".fila_tabla_grupoydiasyhoras").length + 1;

  $.ajax({
    url: "/admin/creardiayhora",
    type: "POST",
    data: {
      id_schedulegroup,
      day_dayandtime,
      starttime_dayandtime,
      endtime_dayandtime,
      numero_fila,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body_tabla_diasyhoras" + id_schedulegroup)
        .append(data.html)
        .append(() => {
          $("#selector_dia_grupoydiayhora" + id_schedulegroup).val(0);
          $("#input_horainicio_grupoydiayhora" + id_schedulegroup).val("00:00");
          $("#input_horafin_grupoydiayhora" + id_schedulegroup).val("00:00");
        });
    },
  });
}

function eliminar_diayhora(id_diayhora) {
  $.ajax({
    url: "/admin/eliminardiayhora",
    type: "POST",
    data: { id_diayhora },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_diasyhoras = "#fila_tabla_diasyhoras" + id_diayhora;
      $(tabla_diasyhoras).fadeOut(250, () => {
        $(tabla_diasyhoras).remove();
      });
    },
  });
}

/* MODIFICAR LABORATORIO */

function modifyLaboratory(id_laboratory) {
  let laboratoryName = document.getElementById(
    "laboratoryName" + id_laboratory
  );
  laboratoryName.innerHTML =
    '<input id="inputLaboratoryName' +
    id_laboratory +
    '" value="' +
    laboratoryName.innerText +
    '">';
  let modify_button = document.getElementById(
    "buttonModifyLaboratory" + id_laboratory
  );
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute(
    "onClick",
    "updateLaboratoryModification(" + id_laboratory + ");"
  );
}

function updateLaboratoryModification(id_laboratory) {
  let laboratoryName = document.getElementById(
    "laboratoryName" + id_laboratory
  );

  let buttonModify = document.getElementById(
    "buttonModifyLaboratory" + id_laboratory
  );

  let inputLaboratoryName = document.getElementById(
    "inputLaboratoryName" + id_laboratory
  );

  let newLaboratoryName = inputLaboratoryName.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-laboratory",
    data: {
      id_laboratory,
      newLaboratoryName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      /* elemento = "#" + fila_usuario;
      $(elemento).fadeOut(500, () => {
        $(elemento).remove();
      }); */
    },
  });

  laboratoryName.innerText = newLaboratoryName;

  inputLaboratoryName.remove();

  buttonModify.className = "far fa-edit";

  buttonModify.setAttribute(
    "onClick",
    "modifyLaboratory(" + id_laboratory + ");"
  );
}

/* MODIFICAR CURSO */

function modifyCourse(id_course) {
  let courseName = document.getElementById("courseName" + id_course);
  courseName.innerHTML =
    '<input id="inputCourseName' +
    id_course +
    '" value="' +
    courseName.innerText +
    '">';
  let modify_button = document.getElementById("buttonModifyCourse" + id_course);
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute(
    "onClick",
    "updateCourseModification(" + id_course + ");"
  );
}

function updateCourseModification(id_course) {
  let courseName = document.getElementById("courseName" + id_course);

  let buttonModify = document.getElementById("buttonModifyCourse" + id_course);

  let inputCourseName = document.getElementById("inputCourseName" + id_course);

  let newCourseName = inputCourseName.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-course",
    data: {
      id_course,
      newCourseName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      /* elemento = "#" + fila_usuario;
      $(elemento).fadeOut(500, () => {
        $(elemento).remove();
      }); */
    },
  });

  courseName.innerText = newCourseName;

  inputCourseName.remove();

  buttonModify.className = "far fa-edit";

  buttonModify.setAttribute("onClick", "modifyCourse(" + id_course + ");");
}

/* MODIFICAR MESA */

function modifyModule(id_table) {
  let tableName = document.getElementById("tableName" + id_table);
  tableName.innerHTML =
    '<input id="inputTableName' +
    id_table +
    '" value="' +
    tableName.innerText +
    '">';
  let modify_button = document.getElementById("buttonModifyModule" + id_table);
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute(
    "onClick",
    "updateTableModification(" + id_table + ");"
  );
}

function updateTableModification(id_table) {
  let tableName = document.getElementById("tableName" + id_table);

  let buttonModify = document.getElementById("buttonModifyModule" + id_table);

  let inputTableName = document.getElementById("inputTableName" + id_table);

  let newTableName = inputTableName.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-table",
    data: {
      id_table,
      newTableName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      /* elemento = "#" + fila_usuario;
      $(elemento).fadeOut(500, () => {
        $(elemento).remove();
      }); */
    },
  });

  tableName.innerText = newTableName;

  inputTableName.remove();

  buttonModify.className = "far fa-edit";

  buttonModify.setAttribute("onClick", "modifyModule(" + id_table + ");");
}

/* MODIFICAR GRUPO HORARIO */

function modifyScheduleGroup(id_scheduleGroup) {
  let scheduleGroupName = document.getElementById(
    "scheduleGroupName" + id_scheduleGroup
  );
  scheduleGroupName.innerHTML =
    '<input id="inputScheduleGroupName' +
    id_scheduleGroup +
    '" value="' +
    scheduleGroupName.innerText +
    '">';
  let modify_button = document.getElementById(
    "buttonModifyScheduleGroup" + id_scheduleGroup
  );
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute(
    "onClick",
    "updateScheduleGroupModification(" + id_scheduleGroup + ");"
  );
}

function updateScheduleGroupModification(id_scheduleGroup) {
  let scheduleGroupName = document.getElementById(
    "scheduleGroupName" + id_scheduleGroup
  );

  let buttonModify = document.getElementById(
    "buttonModifyScheduleGroup" + id_scheduleGroup
  );

  let inputScheduleGroupName = document.getElementById(
    "inputScheduleGroupName" + id_scheduleGroup
  );

  let newScheduleGroupName = inputScheduleGroupName.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-schedulegroup",
    data: {
      id_scheduleGroup,
      newScheduleGroupName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      /* elemento = "#" + fila_usuario;
      $(elemento).fadeOut(500, () => {
        $(elemento).remove();
      }); */
    },
  });

  scheduleGroupName.innerText = newScheduleGroupName;

  inputScheduleGroupName.remove();

  buttonModify.className = "far fa-edit";

  buttonModify.setAttribute(
    "onClick",
    "modifyScheduleGroup(" + id_scheduleGroup + ");"
  );
}

/* MODIFICAR EQUIPO */

function modifyEquipment(id_equipment) {
  let equipmentName = document.getElementById("equipmentName" + id_equipment);
  let equipmentIp = document.getElementById("equipmentIp" + id_equipment);
  let equipmentPort = document.getElementById("equipmentPort" + id_equipment);
  equipmentName.innerHTML =
    '<input id="inputEquipmentName' +
    id_equipment +
    '" value="' +
    equipmentName.innerText +
    '">';
  equipmentIp.innerHTML =
    '<input id="inputEquipmentIp' +
    id_equipment +
    '" value="' +
    equipmentIp.innerText +
    '">';
  equipmentPort.innerHTML =
    '<input id="inputEquipmentPort' +
    id_equipment +
    '" value="' +
    equipmentPort.innerText +
    '">';
  let modify_button = document.getElementById(
    "buttonModifyEquipments" + id_equipment
  );
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute(
    "onClick",
    "updateEquipmentModification(" + id_equipment + ");"
  );
}

function updateEquipmentModification(id_equipment) {
  let equipmentName = document.getElementById("equipmentName" + id_equipment);
  let equipmentIp = document.getElementById("equipmentIp" + id_equipment);
  let equipmentPort = document.getElementById("equipmentPort" + id_equipment);

  let buttonModify = document.getElementById(
    "buttonModifyEquipments" + id_equipment
  );

  let inputEquipmentName = document.getElementById(
    "inputEquipmentName" + id_equipment
  );
  let inputEquipmentIp = document.getElementById(
    "inputEquipmentIp" + id_equipment
  );
  let inputEquipmentPort = document.getElementById(
    "inputEquipmentPort" + id_equipment
  );

  let newEquipmentName = inputEquipmentName.value;
  let newEquipmentIp = inputEquipmentIp.value;
  let newEquipmentPort = inputEquipmentPort.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-equipment",
    data: {
      id_equipment,
      newEquipmentName,
      newEquipmentIp,
      newEquipmentPort,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      /* elemento = "#" + fila_usuario;
      $(elemento).fadeOut(500, () => {
        $(elemento).remove();
      }); */
    },
  });

  equipmentName.innerText = newEquipmentName;
  equipmentIp.innerText = newEquipmentIp;
  equipmentPort.innerText = newEquipmentPort;

  inputEquipmentName.remove();
  inputEquipmentIp.remove();
  inputEquipmentPort.remove();

  buttonModify.className = "far fa-edit";

  buttonModify.setAttribute(
    "onClick",
    "modifyEquipment(" + id_equipment + ");"
  );
}

function collapseCard(id) {
  let x = document.getElementById(id);
  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
}

function collapseTable(id) {
  let x = document.getElementById(id);
  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "table-row";
  } else {
    x.style.display = "none";
  }
}
