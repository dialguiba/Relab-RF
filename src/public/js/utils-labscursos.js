let courses = document.getElementById("content-cards").innerHTML;

function ir_mesa(id_module, id_enrolled, id_laboratory, id_schedulegroup, id_course) {
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
      $("#nav-courses").removeClass("active-breadCrumb");
      $("#nav-courses").addClass("inactive-breadCrumb");
      $("#nav-equipments").removeClass("hide-breadCrumb");
      $("#nav-equipments").addClass("active-breadCrumb");
      $("#content-cards").empty();

      $("#content-cards").append(data.html);
    },
  });
}

function ir_cursos() {
  $("#nav-courses").removeClass("inactive-breadCrumb");
  $("#nav-courses").addClass("active-breadCrumb");

  $("#nav-equipments").removeClass("active-breadCrumb");
  $("#nav-equipments").addClass("hide-breadCrumb");

  $("#content-cards").html(courses);
}

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function enableButton(selectorid, buttonid) {
  var selectelem = document.getElementById(selectorid);
  var btnelem = document.getElementById(buttonid);
  btnelem.disabled = !selectelem.value;
}

function updateUserControl(id_enrolled, id_beforeEnrolled, id_equipment) {
  $.ajax({
    url: "/labs/editcontrol",
    type: "POST",
    data: {
      id_beforeEnrolled,
      id_enrolled,
      id_equipment,
    },
    success: function (data, textStatus, jqXHR) {
      /* $("#nav-courses").removeClass("active-breadCrumb");
      $("#nav-courses").addClass("inactive-breadCrumb");
      $("#nav-equipments").removeClass("hide-breadCrumb");
      $("#nav-equipments").addClass("active-breadCrumb");
      $("#content-cards").empty();

      $("#content-cards").append(data.html); */
    },
  });
}

function setUserControl(id_enrolled, id_equipment) {
  $.ajax({
    url: "/labs/editcontrol",
    type: "POST",
    data: {
      id_enrolled,
      id_equipment,
    },
    success: function (data, textStatus, jqXHR) {
      /* $("#nav-courses").removeClass("active-breadCrumb");
      $("#nav-courses").addClass("inactive-breadCrumb");
      $("#nav-equipments").removeClass("hide-breadCrumb");
      $("#nav-equipments").addClass("active-breadCrumb");
      $("#content-cards").empty();

      $("#content-cards").append(data.html); */
    },
  });
}

function select() {
  console.log("selected");
}
