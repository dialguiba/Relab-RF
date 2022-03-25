$(".clockpicker").clockpicker({});

//PARA TOOLTIP
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//selectores adminalumnos

//SUGERENCIA DE ALUMNOS RESPECTO AL CURSO. SI ES QUE ESTÁ MATRICULADO NO SE MUESTRA AL ALUMNO

function suggestUsers(id_input) {
  $("#" + id_input).autocomplete({
    source: alumnosyprofesores,
  });
}

var alumnosyprofesores = [];

function obtainUsers(id_course) {
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
        alumnosyprofesores.push("(" + element.code_user.toString() + ") " + element.names_user + " " + element.surnames_user);
      });
    },
  });
}

/*@FIN@ OBTIENE USUARIOS PARA AGREGAR EL FOMULARIO DE AGREGAR USUARIOS DEL MÓDULO "LABORATORIOS" */

function openPopupIconLaboratory() {
  let modal = document.getElementById("popup-icons-laboratory");
  modal.classList.add("popup-show");
  modal.classList.remove("popup-hide");
}

function closePopupIconLaboratory() {
  let modal = document.getElementById("popup-icons-laboratory");
  modal.classList.add("popup-hide");
  modal.classList.remove("popup-show");
}

//ACA EMPEZÓ EL CAMBIO
function createLaboratory() {
  let nameLaboratory = document.getElementById("input-name-laboratory").value;
  let numberRow = document.getElementsByClassName("rows-table-laboratories").length + 1;
  /*  */
  let idIconLaboratory = $("input[name=radioName]:checked", "#selector-icon-laboratory").val();

  $.ajax({
    url: "/admin/create-laboratory",
    type: "POST",
    data: { nameLaboratory, numberRow, id_iconlaboratory: idIconLaboratory },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let bodyTableLaboratory = document.getElementById("body-table-laboratories");
      let inputNameLaboratory = document.getElementById("input-name-laboratory");
      if (data.renderedNewLabContent) {
        bodyTableLaboratory.innerHTML += data.renderedNewLabContent;
      }
      inputNameLaboratory.value = "";
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function deleteLaboratory(idLaboratory) {
  $.ajax({
    url: "/admin/delete-laboratory",
    type: "POST",
    data: { idLaboratory },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let laboratoriesTable = $(`#row-table-laboratories-${idLaboratory}`);
      let modulesTable = $(`#table-courses-${idLaboratory}`);
      let coursesTable = $(`#table-modules-${idLaboratory}`);
      /* faltan remover childs? */
      laboratoriesTable.fadeOut(250, () => {
        laboratoriesTable.remove();
      });
      coursesTable.fadeOut(250, () => {
        coursesTable.remove();
      });
      modulesTable.fadeOut(250, () => {
        modulesTable.remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function createCourse(idLaboratory) {
  let nameCourse = document.getElementById(`input-name-course-${idLaboratory}`).value;
  let numberRow = document.getElementsByClassName("rows-table-courses").length + 1;
  //obtener el id del curso creado.
  let idImageCourse = $("input[name=radioName]:checked", `#selector-image-course-${idLaboratory}`).val();

  //console.log(nameCourse, numberRow, idImageCourse);

  $.ajax({
    url: "/admin/create-course",
    type: "POST",
    data: { idLaboratory, nameCourse, numberRow, id_imagecourse: idImageCourse },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let divMessage = document.getElementById("message");
      let inputNameCourse = document.getElementById(`input-name-course-${idLaboratory}`);
      if (data.renderedNewCourseContent) {
        let bodyTableCourses = document.getElementById(`body-table-courses-${idLaboratory}`);
        bodyTableCourses.innerHTML += data.renderedNewCourseContent;
      }
      divMessage.innerHTML = data.renderedMessage;
      inputNameCourse.value = "";
    },
  });
}

function deleteCourse(idCourse) {
  $.ajax({
    url: "/admin/delete-course",
    type: "POST",
    data: { idCourse },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let tableCourses = `#row-table-courses-${idCourse}`;
      let tableEnrolleds = `#table-enrolleds-${idCourse}`;
      let tableSchedulesGroups = `#table-schedulesgroups-${idCourse}`;
      let tableModules = `#table-modules-${idCourse}`;
      $(tableCourses).fadeOut(250, () => {
        $(tableCourses).remove();
      });
      $(tableEnrolleds).fadeOut(250, () => {
        $(tableEnrolleds).remove();
      });
      $(tableSchedulesGroups).fadeOut(250, () => {
        $(tableSchedulesGroups).remove();
      });
      $(tableModules).fadeOut(250, () => {
        $(tableModules).remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function createModule(idLaboratory) {
  let nameModule = $("#input-name-module-" + idLaboratory).val();

  let numberRow = $(".row-table-modules").length + 1;
  $.ajax({
    url: "/admin/create-module",
    type: "POST",
    data: { idLaboratory, nameModule, numberRow },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let divMessage = document.getElementById("message");
      $("#body-table-modules-" + idLaboratory)
        .append(data.renderedNewModuleContent)
        .append(() => {
          $("#input-name-module-" + idLaboratory).val("");
          //le añade a todos los cursos de ese labo.
          $(".selector-module-enrolled-" + idLaboratory).append("<option value=" + data.id_module + ">" + nameModule + "</option>");
        });
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function deleteModule(idModule) {
  $.ajax({
    url: "/admin/delete-module",
    type: "POST",
    data: { idModule },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_mesas = "#row-table-modules-" + idModule;
      tabla_equipos = ".table-equipments-" + idModule;
      $(tabla_mesas).fadeOut(250, () => {
        $(tabla_mesas).remove();
      });
      $(tabla_equipos).fadeOut(250, () => {
        $(tabla_equipos).remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function createEquipment(idModule) {
  let nameEquipment = $("#input-name-equipment-" + idModule).val();
  let ipEquipment = $("#input-ip-equipment-" + idModule).val();
  let portEquipment = $("#input-port-equipment-" + idModule).val();
  let wsRouteEquipment = $("#input-wsroute-equipment-" + idModule).val();
  let passwordEquipment = $("#input-password-equipment-" + idModule).val();
  let idEquipmentType = $("#selector-id-equipmenttype-" + idModule).val();

  let numberRow = $(".row-table-equipments").length + 1;
  $.ajax({
    url: "/admin/create-equipment",
    type: "POST",
    data: {
      idModule,
      nameEquipment,
      ipEquipment,
      portEquipment,
      wsRouteEquipment,
      passwordEquipment,
      idEquipmentType,
      numberRow,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body-table-equipments-" + idModule)
        .append(data.renderedNewEquipment)
        .append(() => {
          $("#input-name-equipment-" + idModule).val("");
          $("#input-ip-equipment-" + idModule).val("");
          $("#input-port-equipment-" + idModule).val("");
          $("#input-wsroute-equipment-" + idModule).val("");
          $("#input-password-equipment-" + idModule).val("");
          $("#selector-id-equipmenttype-" + idModule).val(0);
        });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function deleteEquipment(idEquipment) {
  $.ajax({
    url: "/admin/delete-equipment",
    type: "POST",
    data: { idEquipment },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      rowTableEquipments = "#row-table-equipments-" + idEquipment;
      $(rowTableEquipments).fadeOut(250, () => {
        $(rowTableEquipments).remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function enrollUser(idCourse) {
  let nombre_usuario = $("#input-name-enrolled-" + idCourse).val();
  let id_module = $("#selector-module-enrolled-" + idCourse).val();
  let id_schedulegroup = $("#selector-schedulegroup-enrolled-" + idCourse).val();
  let name_module = $("#selector-module-enrolled-" + idCourse + " option:selected").text();
  let name_schedulegroup = $("#selector-schedulegroup-enrolled-" + idCourse + " option:selected").text();

  let numero_fila = $(".row-table-enrolleds").length + 1;
  $.ajax({
    url: "/admin/enroll-user",
    type: "POST",
    data: {
      nombre_usuario,
      id_module,
      id_schedulegroup,
      idCourse,
      name_module,
      name_schedulegroup,
      numero_fila,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body-table-enrolleds-" + idCourse)
        .append(data.renderedNewEnrolledContent)
        .append(() => {
          $("#input-name-enrolled-" + idCourse).val("");
          $("#selector-module-enrolled-" + idCourse).val(0);
          $("#selector-schedulegroup-enrolled-" + idCourse).val(0);
        });

      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function deleteEnrolled(id_enrolled) {
  $.ajax({
    url: "/admin/delete-enrolled",
    type: "POST",
    data: { id_enrolled },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_usuarios = "#row-table-enrolleds-" + id_enrolled;
      $(tabla_usuarios).fadeOut(250, () => {
        $(tabla_usuarios).remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function createScheduleGroup(idCourse) {
  let name_schedulegroup = $("#input-name-schedulegroup-" + idCourse).val();
  let numero_fila = $(".row-table-schedulesgroups").length + 1;

  $.ajax({
    url: "/admin/create-schedulegroup",
    type: "POST",
    data: {
      idCourse,
      name_schedulegroup,
      numero_fila,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body-table-schedulesgroups-" + idCourse)
        .append(data.renderedNewScheduleGroupContent)
        .append(() => {
          $("#input-name-schedulegroup-" + idCourse).val("");
          //solo para ese curso.
          $("#selector-schedulegroup-enrolled-" + idCourse).append("<option value=" + data.idNewScheduleGroup + ">" + name_schedulegroup + "</option>");
          let divMessage = document.getElementById("message");
          divMessage.innerHTML = data.renderedMessage;
        });
    },
  });
}

function deleteScheduleGroup(idScheduleGroup) {
  $.ajax({
    url: "/admin/delete-schedulegroup",
    type: "POST",
    data: { idScheduleGroup },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_gruposhorarios = "#row-table-schedulesgroups-" + idScheduleGroup;
      tabla_horarios = ".table-schedules-" + idScheduleGroup;
      $(tabla_gruposhorarios).fadeOut(250, () => {
        $(tabla_gruposhorarios).remove();
      });
      $(tabla_horarios).fadeOut(250, () => {
        $(tabla_horarios).remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function createSchedule(idScheduleGroup) {
  let day_schedule = $("#selector-day-schedule-" + idScheduleGroup).val();
  let starttime_schedule = $("#input-starttime-schedule-" + idScheduleGroup).val();
  let endtime_schedule = $("#input-endtime-schedule-" + idScheduleGroup).val();
  let numero_fila = $(".row-table-schedules-").length + 1;

  $.ajax({
    url: "/admin/create-schedule",
    type: "POST",
    data: {
      idScheduleGroup,
      day_schedule,
      starttime_schedule,
      endtime_schedule,
      numero_fila,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      $("#body-table-schedules-" + idScheduleGroup)
        .append(data.renderedNewScheduleContent)
        .append(() => {
          $("#selector-day-schedule-" + idScheduleGroup).val(0);
          $("#input-starttime-schedule-" + idScheduleGroup).val("00:00");
          $("#input-endtime-schedule-" + idScheduleGroup).val("00:00");
        });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function deleteSchedule(idSchedule) {
  $.ajax({
    url: "/admin/delete-schedule",
    type: "POST",
    data: { idSchedule },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tabla_diasyhoras = "#row-table-schedules-" + idSchedule;
      $(tabla_diasyhoras).fadeOut(250, () => {
        $(tabla_diasyhoras).remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

/* MODIFICAR LABORATORIO */

function modifyLaboratory(idLaboratory) {
  let laboratoryName = document.getElementById("name-laboratory-" + idLaboratory);
  laboratoryName.innerHTML = '<input id="input-modify-name-laboratory-' + idLaboratory + '" value="' + laboratoryName.innerText + '">';
  let modify_button = document.getElementById("button-modify-laboratory-" + idLaboratory);
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute("onClick", "updateLaboratoryModification(" + idLaboratory + ");");
}

function updateLaboratoryModification(idLaboratory) {
  let laboratoryName = document.getElementById("name-laboratory-" + idLaboratory);

  let buttonModify = document.getElementById("button-modify-laboratory-" + idLaboratory);

  let inputLaboratoryName = document.getElementById("input-modify-name-laboratory-" + idLaboratory);

  let newLaboratoryName = inputLaboratoryName.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-laboratory",
    data: {
      idLaboratory,
      newLaboratoryName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      laboratoryName.innerText = newLaboratoryName;
      inputLaboratoryName.remove();
      buttonModify.className = "far fa-edit";
      buttonModify.setAttribute("onClick", "modifyLaboratory(" + idLaboratory + ");");
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

/* MODIFICAR CURSO */

function modifyCourse(idCourse) {
  let courseNameCell = document.getElementById(`name-course-${idCourse}`);
  let courseNameText = courseNameCell.innerText;
  courseNameCell.innerHTML = `<input id="input-modify-name-course-${idCourse}" value="${courseNameText}"/>`;
  let modify_button = document.getElementById(`button-modify-course-${idCourse}`);
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute("onClick", `updateCourseModification(${idCourse})`);
}

function updateCourseModification(idCourse) {
  let buttonModify = document.getElementById(`button-modify-course-${idCourse}`);
  let inputNameCourse = document.getElementById(`input-modify-name-course-${idCourse}`);
  let newCourseName = inputNameCourse.value;
  $.ajax({
    type: "POST",
    url: "/admin/modify-course",
    data: {
      idCourse,
      newCourseName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let courseName = document.getElementById("name-course-" + idCourse);
      courseName.innerText = newCourseName;
      inputNameCourse.remove();
      buttonModify.className = "far fa-edit";
      buttonModify.setAttribute("onClick", "modifyCourse(" + idCourse + ");");
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

/* MODIFICAR MESA */

function modifyModule(idModule) {
  let tableName = document.getElementById("name-module-" + idModule);
  tableName.innerHTML = '<input id="input-modify-name-module-' + idModule + '" value="' + tableName.innerText + '">';
  let modify_button = document.getElementById("button-modify-module-" + idModule);
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute("onClick", "updateTableModification(" + idModule + ");");
}

function updateTableModification(idModule) {
  let tableName = document.getElementById("name-module-" + idModule);

  let buttonModify = document.getElementById("button-modify-module-" + idModule);

  let inputTableName = document.getElementById("input-modify-name-module-" + idModule);

  let newTableName = inputTableName.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-module",
    data: {
      idModule,
      newTableName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      tableName.innerText = newTableName;
      inputTableName.remove();
      buttonModify.className = "far fa-edit";
      buttonModify.setAttribute("onClick", "modifyModule(" + idModule + ");");
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

/* MODIFICAR GRUPO HORARIO */

function modifyScheduleGroup(idScheduleGroup) {
  let scheduleGroupName = document.getElementById("name-schedulegroup-" + idScheduleGroup);
  scheduleGroupName.innerHTML = '<input id="input-modify-name-schedulegroup-' + idScheduleGroup + '" value="' + scheduleGroupName.innerText + '">';
  let modify_button = document.getElementById("button-modify-schedulegroup-" + idScheduleGroup);
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute("onClick", "updateScheduleGroupModification(" + idScheduleGroup + ");");
}

function updateScheduleGroupModification(idScheduleGroup) {
  let scheduleGroupName = document.getElementById("name-schedulegroup-" + idScheduleGroup);

  let buttonModify = document.getElementById("button-modify-schedulegroup-" + idScheduleGroup);

  let inputScheduleGroupName = document.getElementById("input-modify-name-schedulegroup-" + idScheduleGroup);

  let newScheduleGroupName = inputScheduleGroupName.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-schedulegroup",
    data: {
      idScheduleGroup,
      newScheduleGroupName,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      scheduleGroupName.innerText = newScheduleGroupName;
      inputScheduleGroupName.remove();
      buttonModify.className = "far fa-edit";
      buttonModify.setAttribute("onClick", "modifyScheduleGroup(" + idScheduleGroup + ");");
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

/* MODIFICAR EQUIPO */

function modifyEquipment(idEquipment) {
  let equipmentName = document.getElementById("name-equipment-" + idEquipment);
  let equipmentIp = document.getElementById("ip-equipment-" + idEquipment);
  let equipmentPort = document.getElementById("port-equipment-" + idEquipment);
  let passwordEquipment = document.getElementById("password-equipment-" + idEquipment);
  equipmentName.innerHTML = '<input id="input-modify-name-equipment-' + idEquipment + '" value="' + equipmentName.innerText + '">';
  equipmentIp.innerHTML = '<input id="input-modify-ip-equipment-' + idEquipment + '" value="' + equipmentIp.innerText + '">';
  equipmentPort.innerHTML = '<input id="input-modify-port-equipment-' + idEquipment + '" value="' + equipmentPort.innerText + '">';
  passwordEquipment.innerHTML = '<input id="input-modify-password-equipment-' + idEquipment + '" value="' + passwordEquipment.innerText + '">';
  let modify_button = document.getElementById("button-modify-equipment-" + idEquipment);
  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute("onClick", "updateEquipmentModification(" + idEquipment + ");");
}

function updateEquipmentModification(idEquipment) {
  let equipmentName = document.getElementById("name-equipment-" + idEquipment);
  let equipmentIp = document.getElementById("ip-equipment-" + idEquipment);
  let equipmentPort = document.getElementById("port-equipment-" + idEquipment);
  let passwordEquipment = document.getElementById("password-equipment-" + idEquipment);

  let buttonModify = document.getElementById("button-modify-equipment-" + idEquipment);

  let inputEquipmentName = document.getElementById("input-modify-name-equipment-" + idEquipment);
  let inputEquipmentIp = document.getElementById("input-modify-ip-equipment-" + idEquipment);
  let inputEquipmentPort = document.getElementById("input-modify-port-equipment-" + idEquipment);
  let inputPasswordEquipment = document.getElementById("input-modify-password-equipment-" + idEquipment);

  let newEquipmentName = inputEquipmentName.value;
  let newEquipmentIp = inputEquipmentIp.value;
  let newEquipmentPort = inputEquipmentPort.value;
  let newPasswordEquipment = inputPasswordEquipment.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-equipment",
    data: {
      idEquipment,
      newEquipmentName,
      newEquipmentIp,
      newEquipmentPort,
      newPasswordEquipment,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      equipmentName.innerText = newEquipmentName;
      equipmentIp.innerText = newEquipmentIp;
      equipmentPort.innerText = newEquipmentPort;
      passwordEquipment.innerText = newPasswordEquipment;

      inputEquipmentName.remove();
      inputEquipmentIp.remove();
      inputEquipmentPort.remove();
      inputPasswordEquipment.remove();

      buttonModify.className = "far fa-edit";

      buttonModify.setAttribute("onClick", "modifyEquipment(" + idEquipment + ");");

      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
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

function showPopupImageCourse(idCourse, event) {
  event.preventDefault();
  let modal = document.getElementById(`popup-image-course-${idCourse}`);
  modal.classList.add("popup-show");
  modal.classList.remove("popup-hide");
}
function closePopupImageCourse(idCourse) {
  let modal = document.getElementById(`popup-image-course-${idCourse}`);
  modal.classList.add("popup-hide");
  modal.classList.remove("popup-show");
}
function showPopupSelectImageCourse(idCourse, event) {
  event.preventDefault();
  let modal = document.getElementById(`popup-images-course-${idCourse}`);
  modal.classList.add("popup-show");
  modal.classList.remove("popup-hide");
}
function closePopupSelectImageCourse(idCourse) {
  let modal = document.getElementById(`popup-images-course-${idCourse}`);
  modal.classList.add("popup-hide");
  modal.classList.remove("popup-show");
}
