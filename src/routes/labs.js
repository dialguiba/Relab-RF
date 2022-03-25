const express = require("express");
const router = express.Router();
const hb = require("express-handlebars").create({
  helpers: require("../lib/handlebars"),
});
const path = require("path");
dirViews = path.join(__dirname, "../views");
const pool = require("../database");
const { isLoggedIn, isProfesor } = require("../lib/auth");

router.get("/courses/:id_laboratory", isLoggedIn, async (req, res) => {
  const { id_laboratory } = req.params;
  const parametros = [req.user[0].id, id_laboratory];

  const consulta_detallesCursos =
    "select b1.id,b1.name_course,d1.name_schedulegroup,e1.day_schedule,e1.starttime_schedule, e1.endtime_schedule from laboratories as a1 left outer join courses b1 On b1.id_laboratory = a1.id right outer join enrolleds c1 On c1.id_course = b1.id left outer join schedulesgroups d1 On c1.id_schedulegroup = d1.id left outer join schedules e1 On c1.id_schedulegroup = e1.id_schedulegroup where c1.id_user = $1 and a1.id = $2";
  const consulta_cursos =
    "select b1.id_laboratory,c1.id as id_enrolled,c1.id_course,f1.name_imagecourse,b1.name_course,d1.id as id_schedulegroup ,d1.name_schedulegroup,e1.name_module,e1.id as id_module from laboratories as a1 left outer join courses b1 On b1.id_laboratory = a1.id right outer join enrolleds c1 On c1.id_course = b1.id left outer join schedulesgroups d1 On d1.id = c1.id_schedulegroup left outer join modules e1 On e1.id=c1.id_module left outer join imagescourses f1 On f1.id = b1.id_imagecourse where c1.id_user = $1 and a1.id = $2";
  const detallesCursos = (await pool.query(consulta_detallesCursos, parametros)).rows;
  const courses = (await pool.query(consulta_cursos, parametros)).rows;
  res.render("private/labs/courses", { detallesCursos, courses });
});

router.get("/redesyconectividad/:id_laboratory", isLoggedIn, async (req, res) => {
  res.render("private/labs/radiofrecuencia");
});

router.get("/mesaporcurso", isLoggedIn, async (req, res) => {
  const { id_module, id_enrolled, id_laboratory, id_schedulegroup, id_course } = req.query; //Se le está pasando id matrícula para mandarlo al siguiente get y comprobar horario

  let isProfesor = false;
  //console.log(id_enrolled)
  //console.log(id_course);
  let equipments, alumnosyprofesores, users;
  res.header("Content-Type", "application/json");

  let modules;

  if (req.user[0].name_userrol == "Alumno") {
    modules = (await pool.query("select id,name_module from modules where id=$1", [id_module])).rows;

    users = (
      await pool.query(
        "select a1.id as id_enrolled,b1.names_user,b1.surnames_user,a1.id_module,c1.name_userrol from enrolleds as a1 left outer join users b1 On b1.id = a1.id_user left outer join usersroles c1 On c1.id=b1.id_userrol where a1.id_course = $1 and a1.id_module=$2 and a1.id_schedulegroup=$3",
        [id_course, id_module, id_schedulegroup]
      )
    ).rows;

    equipments = (
      await pool.query(
        "select a1.id,a1.name_equipment, a1.id_module,a1.connectionroute_equipment, b1.name_equipmenttype, c1.name_imageequipmenttype, d1.name_connectiontype, e1.id_enrolled from equipments as a1 left outer join equipmentstypes b1 on b1.id = a1.id_equipmenttype left outer join imagesequipmentstypes c1 on c1.id = b1.id_imageequipmenttype left outer join connectiontypes d1 on d1.id = b1.id_connectiontype left outer join equipmentscontrol e1 on e1.id_equipment = a1.id where a1.id_module = $1",
        [id_module]
      )
    ).rows;
  } else if (req.user[0].name_userrol == "Profesor") {
    isProfesor = true;

    modules = (await pool.query("select id,name_module from modules where id_laboratory=$1", [id_laboratory])).rows;

    users = (
      await pool.query(
        "select a1.id as id_enrolled,b1.id,b1.names_user,b1.surnames_user,a1.id_module,c1.name_userrol from enrolleds as a1 left outer join users b1 On b1.id = a1.id_user left outer join usersroles c1 On c1.id = b1.id_userrol where a1.id_course = $1 and a1.id_schedulegroup = $2",
        [id_course, id_schedulegroup]
      )
    ).rows;

    //Obtiene los equipos
    equipments = (
      await pool.query(
        "select a1.id,a1.name_equipment,a1.connectionroute_equipment, a1.id_module, c1.name_equipmenttype, f1.name_imageequipmenttype, e1.name_connectiontype, d1.id_enrolled, e1.name_connectiontype from equipments as a1 left outer join modules b1 on b1.id = a1.id_module left outer join equipmentstypes c1 on c1.id = a1.id_equipmenttype left outer join equipmentscontrol d1 on d1.id_equipment = a1.id left outer join connectiontypes e1 On e1.id = c1.id_connectiontype left outer join imagesequipmentstypes f1 On f1.id = c1.id_imageequipmenttype where b1.id_laboratory = $1",
        [id_laboratory]
      )
    ).rows;
  }

  hb.render(path.join(dirViews, "private/modules/treemodules.hbs"), {
    isProfesor,
    modules,
    users,
    equipments,
    id_enrolled,
  }).then((renderedHtml) => {
    res.send({ html: renderedHtml });
  });
});

router.get("/functionality", isLoggedIn, async (req, res) => {
  const { name_connectiontype, id_enrolled, id_equipment } = req.query;

  const consulta_horario =
    "select * from enrolleds a1 left outer join schedulesgroups b1 On a1.id_schedulegroup = b1.id left outer join schedules c1 On c1.id_schedulegroup = b1.id where a1.id = $1";
  let horarios = (await pool.query(consulta_horario, [id_enrolled])).rows;

  var actualtime = new Date(); // for now
  const now = actualtime.getHours() * 60 + actualtime.getMinutes();
  var dia = new Array(7);
  dia[0] = "Domingo";
  dia[1] = "Lunes";
  dia[2] = "Martes";
  dia[3] = "Miércoles";
  dia[4] = "Jueves";
  dia[5] = "Viernes";
  dia[6] = "Sábado";

  let horarioCorrecto = false;
  /*   console.log(id_enrolled);
  console.log(horarios); */

  if (horarios.length == 1 && horarios[0].day_schedule === null) {
    console.log("INCORRECTO");
    console.log("no tiene horario");
    req.flash("message", "No se encuentra en su horario de clase");
    res.redirect(req.get("referer"));
  } else {
    horarios.forEach((element) => {
      let primerdospuntos = element.starttime_schedule.indexOf(":");
      let horaInicio = element.starttime_schedule.substring(0, element.starttime_schedule.indexOf(":"));
      let restoprimerdospuntos = element.starttime_schedule.substring(primerdospuntos + 1);
      let segundodospuntos = restoprimerdospuntos.indexOf(":");
      let minutosInicio = restoprimerdospuntos.substring(0, segundodospuntos);

      let primerdospuntosFin = element.endtime_schedule.indexOf(":");
      let horaFin = element.endtime_schedule.substring(0, primerdospuntosFin);
      let restoprimerdospuntosFin = element.endtime_schedule.substring(primerdospuntosFin + 1);
      let segundodospuntosFin = restoprimerdospuntosFin.indexOf(":");
      let minutosFin = restoprimerdospuntosFin.substring(0, segundodospuntosFin);

      const start = parseInt(horaInicio) * 60 + parseInt(minutosInicio);
      const end = parseInt(horaFin) * 60 + parseInt(minutosFin);

      if (element.day_schedule == dia[actualtime.getDay()] && start <= now && now <= end) {
        horarioCorrecto = true;
      }
    });
    if (horarioCorrecto) {
      const consulta_controlequipos = "select id from equipmentscontrol where id_equipment = $1 and id_enrolled = $2";
      let equipmentscontrol = (await pool.query(consulta_controlequipos, [id_equipment, id_enrolled])).rows;

      let viewOnly = true;
      if ((typeof equipmentscontrol !== "undefined" && equipmentscontrol.length > 0) || req.user[0].name_userrol == "Profesor") {
        viewOnly = false;
      }

      let { connectionroute_equipment, password_equipment } = (
        await pool.query("select connectionroute_equipment, password_equipment from equipments where id = $1", [id_equipment])
      ).rows[0];
      console.log(connectionroute_equipment);
      /* ME QUEDÉ ACÁ */
      if (name_connectiontype == "Novnc") {
        res.render("private/equiposapps/pc-vnc", { connectionroute_equipment, password_equipment, viewOnly });
      } else if (name_connectiontype == "Shell") {
        res.render("private/equiposapps/shell");
      }
    } else {
      console.log("INCORRECTO");
      console.log("no se encuentra en su horario de clase");
      req.flash("message", "No se encuentra en su horario de clase");
      res.redirect(req.get("referer"));
    }
  }
});

/* CREAR UNO QUE ALTERE Y OTRO QUE CREE */
router.post("/editcontrol", isLoggedIn, async (req, res) => {
  const { id_equipment, id_enrolled, id_beforeEnrolled } = req.body;

  console.log(id_equipment);
  console.log(id_beforeEnrolled);
  console.log(id_enrolled);
  if (id_beforeEnrolled !== "undefined") {
    /* TRAER LOS DATOS ANTERIORES Y BORRARLO DE LA TABLA CONTROLEQUIPOS. */
    const delete_controlanterior = "delete from equipmentscontrol where id_equipment = $1 and id_enrolled = $2";
    await pool.query(delete_controlanterior, [id_equipment, id_beforeEnrolled]);
  }

  /* CREAR UNA NUEVA ENTRADA PARA EL ID DE MATRICULA Y EQUIPO EN LA TABLA CONTROLEQUIPOS */
  const insert_control = "insert into equipmentscontrol (id_equipment,id_enrolled) values ($1, $2)";
  await pool.query(insert_control, [id_equipment, id_enrolled]);

  req.flash("success", "Updated Succesfully");
  res.redirect("back");
});

module.exports = router;
