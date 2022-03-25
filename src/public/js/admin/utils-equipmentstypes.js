function createEquipmentType() {
  /* console.log($("input[name=radioName]:checked", "#imagesequipmenttype-selector").val()); */
  let idImageEquipmentType = $("input[name=radioName]:checked", "#selector-image-equipmenttype").val();
  if (idImageEquipmentType !== undefined) {
    let nameEquipmentType = document.getElementById("input-name-equipmenttype").value;
    let connectionType = document.getElementById("selector-connectiontype").value;

    $.ajax({
      url: "/admin/create-equipmenttype",
      type: "POST",
      data: { name_equipmenttype: nameEquipmentType, id_connectiontype: connectionType, id_imageequipmenttype: idImageEquipmentType },
      dataType: "json",
      success: function (data, textStatus, jqXHR) {
        let tableEquipmentsTypes = document.getElementById("body-table-equipmentstypes");
        tableEquipmentsTypes.innerHTML += data.renderedNewEquipmentTypeContent;

        let divMessage = document.getElementById("message");
        divMessage.innerHTML = data.renderedMessage;
      },
    });
  } else {
    console.log("seleccione una imagen");
  }
}

function deleteEquipmentType(idEquipmentType) {
  $.ajax({
    url: "/admin/delete-equipmenttype",
    type: "POST",
    data: { id_equipmenttype: idEquipmentType },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let rowEquipmentsTypesTable = $(`#row-table-equipmentstypes-${idEquipmentType}`);

      rowEquipmentsTypesTable.fadeOut(250, () => {
        rowEquipmentsTypesTable.remove();
      });
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;
    },
  });
}

function modifyEquipmentType(idEquipmentType) {
  let equipmentTypeName = document.getElementById("name-equipmenttype-" + idEquipmentType);
  equipmentTypeName.innerHTML = '<input id="input-name-equipmenttype-' + idEquipmentType + '" value="' + equipmentTypeName.innerText + '">';
  /* CAMBIA VISIBILIDAD SELECTOR */
  let selectorConnectionType = document.getElementById("selector-connectiontype-" + idEquipmentType);
  selectorConnectionType.style.display = "block";
  let nameConnectionType = document.getElementById(`name-connectiontype-${idEquipmentType}`);
  nameConnectionType.style.display = "none";
  /* CAMBIA VISIBILIDAD SELECTOR */

  let modify_button = document.getElementById("button-modify-equipmenttype-" + idEquipmentType);

  modify_button.className = "fas fa-check-circle";
  modify_button.setAttribute("onClick", "updateEquipmentTypeModification(" + idEquipmentType + ");");
}

function updateEquipmentTypeModification(idEquipmentType) {
  let equipmentTypeName = document.getElementById("name-equipmenttype-" + idEquipmentType);

  let buttonModify = document.getElementById("button-modify-equipmenttype-" + idEquipmentType);

  let inputEquipmentTypeName = document.getElementById("input-name-equipmenttype-" + idEquipmentType);

  let newEquipmentTypeName = inputEquipmentTypeName.value;

  let selectorConnectionType = document.getElementById(`selector-connectiontype-${idEquipmentType}`);

  let idConnectionType = selectorConnectionType.value;

  $.ajax({
    type: "POST",
    url: "/admin/modify-equipmenttype",
    data: {
      id_equipmenttype: idEquipmentType,
      new_name_equipmenttype: newEquipmentTypeName,
      new_id_connectiontype: idConnectionType,
    },
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = data.renderedMessage;

      equipmentTypeName.innerText = newEquipmentTypeName;

      inputEquipmentTypeName.remove();

      buttonModify.className = "far fa-edit";

      buttonModify.setAttribute("onClick", "modifyEquipmentType(" + idEquipmentType + ");");

      selectorConnectionType.style.display = "none";

      let nameConnectionType = document.getElementById(`name-connectiontype-${idEquipmentType}`);

      nameConnectionType.innerText = selectorConnectionType.options[selectorConnectionType.selectedIndex].text;

      nameConnectionType.style.display = "block";
    },
  });
}
