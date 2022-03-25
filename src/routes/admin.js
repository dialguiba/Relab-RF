const hb = require("express-handlebars").create({
  helpers: require("../lib/handlebars"),
});
const path = require("path");
dirViews = path.join(__dirname, "../views");

const express = require("express");
const router = express.Router();
const helpers = require("../lib/helpers");
const pool = require("../database");
const { isAdmin } = require("../lib/auth");
const { exception } = require("console");

router.get("/registro", isAdmin, async (req, res) => {
  const usersroles = (await pool.query("SELECT id,name_userrol FROM usersroles")).rows;
  res.render("private/admin/register/all-content", { usersroles });
});

//registrousuarios

/**
 *
 * @api {post} /registrarusuario Registrar Usuario
 * @apiName Relab
 * @apiGroup admin
 *
 *
 * @apiParam  {String} paramName description
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */

router.post("/registrarusuario", isAdmin, async (req, res) => {
  const text = "INSERT INTO users (email_user, password_user,id_userrol) values ($1,$2,$3)";

  var emails = req.body.emails;
  emails = JSON.parse(emails);
  let id_tipoUsuario = req.body.id_tipoUsuario;
  let duplicatedEmails = [];
  let createdEmails = [];

  for (index = 0, len = emails.length; index < len; ++index) {
    let newUser = new Object();
    newUser.email = emails[index].toLowerCase().trim();
    newUser.password = await helpers.randomPassword(10);
    newUser.tipoUsuario = id_tipoUsuario;
    let literalPassword = newUser.password;
    let literalEmail = newUser.email;
    newUser.password = await helpers.encryptPassword(newUser.password);
    newUser = Object.values(newUser); //convierto a array para insertar
    try {
      await pool.query(text, newUser);
      await helpers.sendEmail(literalEmail, literalPassword);
      createdEmails.push(emails[index].toLowerCase().trim());
    } catch (error) {
      if (error.code == "23505") {
        duplicatedEmails.push(emails[index].toLowerCase().trim());
      }
    }
  }
  if (duplicatedEmails && duplicatedEmails.length) {
    res.send({
      redirect: "/admin/registro",
      state: "error",
      createdEmails,
      duplicatedEmails,
    });
  } else {
    res.send({
      redirect: "/admin/registro",
      state: "success",
      createdEmails: createdEmails,
    });
  }
});

router.get("/alumnos", isAdmin, async (req, res) => {
  const users = (
    await pool.query(
      "Select a1.id,a1.code_user,a1.names_user,a1.surnames_user,a1.email_user,d1.name_userrol from users as a1 Full Join usersroles d1 On a1.id_userrol = d1.id WHERE d1.name_userrol = 'Alumno'"
    )
  ).rows;
  const enrolleds = (
    await pool.query(
      "Select b1.id_user,b1.id_course,c1.name_course,b1.id_module,d1.name_module,b1.id_schedulegroup,e1.name_schedulegroup from users as a1 Right Outer Join enrolleds b1 On a1.id = b1.id_user Full Join courses c1 On b1.id_course = c1.id Full Join modules d1 On b1.id_module = d1.id Full Join schedulesgroups e1 On b1.id_schedulegroup = e1.id"
    )
  ).rows;
  const gruposhorariosydiasyhoras = (await pool.query("Select id_schedulegroup, day_schedule, starttime_schedule, endtime_schedule from schedules")).rows;
  const courses = (await pool.query("Select id, name_course from courses ")).rows;
  res.render("private/admin/alumnos", {
    users,
    enrolleds,
    gruposhorariosydiasyhoras,
    courses,
  });
});

router.get("/fillselectormesabycurso", isAdmin, async (req, res) => {
  const { selectedCurso } = req.query;
  let modules = (
    await pool.query("Select a1.id,b1.name_module,b1.id as id_module from courses as a1 inner join modules b1 On a1.id_laboratory = b1.id_laboratory where a1.id=$1", [
      selectedCurso,
    ])
  ).rows;
  modules = JSON.stringify(modules);
  res.end(modules);
});

router.get("/fillselectorgruposyhorariosbycurso", isAdmin, async (req, res) => {
  const { selectedCurso } = req.query;
  let gruposyhorarios = (
    await pool.query("Select a1.id,b1.name_schedulegroup,b1.id as id_module from courses as a1 inner join schedulesgroups b1 On a1.id = b1.id_course where a1.id=$1", [
      selectedCurso,
    ])
  ).rows;
  gruposyhorarios = JSON.stringify(gruposyhorarios);
  res.end(gruposyhorarios);
});

router.get("/laboratories", isAdmin, async (req, res) => {
  const imagescourses = (await pool.query("select id,name_imagecourse from imagescourses")).rows;

  const modules = (await pool.query("select id,name_module, id_laboratory from modules")).rows;
  const courses = (
    await pool.query("select a1.id,a1.name_course, a1.id_laboratory,b1.name_imagecourse from courses as a1 left outer join imagescourses b1 on a1.id_imagecourse = b1.id")
  ).rows;
  const laboratories = (await pool.query("select a1.id,a1.name_laboratory,b1.name_icon from laboratories as a1 left outer join icons b1 on a1.id_icon = b1.id")).rows;
  const users = (
    await pool.query(
      "select a1.id,a1.id_course,b1.names_user,b1.surnames_user,b1.code_user,c1.name_module,d1.name_schedulegroup from enrolleds as a1 Left Outer Join users b1 On a1.id_user=b1.id Left Outer Join modules c1 On a1.id_module=c1.id Left Outer Join schedulesgroups d1 On a1.id_schedulegroup=d1.id"
    )
  ).rows;
  const schedulesgroups = (await pool.query("select id,id_course,name_schedulegroup from schedulesgroups")).rows;
  const equipments = (
    await pool.query(
      "select a1.id,a1.id_module,a1.name_equipment,a1.ip_equipment,a1.port_equipment,a1.connectionroute_equipment, a1.password_equipment,b1.name_equipmenttype from equipments as a1 Left Outer Join equipmentstypes b1 On a1.id_equipmenttype=b1.id "
    )
  ).rows;
  const equipmentstypes = (await pool.query("select id,name_equipmenttype from equipmentstypes")).rows;
  const daysandtimes = (await pool.query("select id,id_schedulegroup,day_schedule,starttime_schedule,endtime_schedule from schedules")).rows;

  const icons = (await pool.query("select id, name_icon from icons")).rows;

  res.render("private/admin/labs/all-content", {
    modules,
    courses,
    laboratories,
    users,
    schedulesgroups,
    equipments,
    equipmentstypes,
    daysandtimes,
    icons,
    imagescourses,
  });
});

router.get("/alumnosyprofesores", isAdmin, async (req, res) => {
  //req.header("Content-Type", "application/json");
  const { id_course } = req.query;
  //console.log(req.query)
  res.header("Content-Type", "application/json");

  /* let alumnosyprofesores = (await pool.query("select a1.names_user, a1.surnames_user, a1.code_user from users as a1 left outer join usersroles b1 On a1.id_userrol = b1.id where (b1.name_userrol <> 'administrador' and b1.name_userrol <> 'Administrador')")).rows; */

  let alumnosyprofesores = (
    await pool.query(
      "select a1.names_user, a1.surnames_user, a1.code_user from users as a1  left outer join usersroles b1 On a1.id_userrol = b1.id where (b1.name_userrol <> 'administrador' and b1.name_userrol <> 'Administrador') and a1.names_user NOTNULL and a1.surnames_user NOTNULL and a1.code_user NOTNULL and NOT EXISTS (SELECT NULL FROM enrolleds c1 WHERE c1.id_user = a1.id and c1.id_course = $1)",
      [id_course]
    )
  ).rows;
  alumnosyprofesores = JSON.stringify(alumnosyprofesores);

  res.end(alumnosyprofesores);
});

router.get("/equipmentstypes", isAdmin, async (req, res) => {
  const selectStatement1 = "select id,name_connectiontype from connectiontypes";
  const selectStatement2 = "select id,name_imageequipmenttype from imagesequipmentstypes";
  const selectStatement3 =
    "select a1.id,a1.name_equipmenttype,a1.id_connectiontype, b1.name_connectiontype, c1.name_imageequipmenttype from equipmentstypes as a1 left outer join connectiontypes b1 on a1.id_connectiontype = b1.id left outer join imagesequipmentstypes c1 on a1.id_imageequipmenttype = c1.id";
  let connectiontypes = (await pool.query(selectStatement1)).rows;
  let imagesequipmentstypes = (await pool.query(selectStatement2)).rows;
  let equipmentstypes = (await pool.query(selectStatement3)).rows;

  res.render("private/admin/equipmentstypes/entire-content", { connectiontypes, imagesequipmentstypes, equipmentstypes });
});

router.post("/create-equipmenttype", isAdmin, async (req, res) => {
  let { name_equipmenttype, id_connectiontype, id_imageequipmenttype } = req.body;
  let insertStatement = "insert into equipmentstypes (name_equipmenttype,id_connectiontype,id_imageequipmenttype) values ($1,$2,$3) returning id";

  let { id: idNewEquipmentType } = (await pool.query(insertStatement, [name_equipmenttype, id_connectiontype, id_imageequipmenttype])).rows[0];

  let { name_imageequipmenttype } = (await pool.query("select name_imageequipmenttype from imagesequipmentstypes where id = $1", [id_imageequipmenttype])).rows[0];

  let { name_connectiontype } = (await pool.query("select name_connectiontype from connectiontypes where id=$1", [id_connectiontype])).rows[0];

  let success = `Se creó el Tipo de Equipo: ${name_equipmenttype}`;

  hb.render(path.join(dirViews, "private/admin/equipmentstypes/new-equipmenttype.hbs"), {
    idNewEquipmentType,
    name_equipmenttype,
    name_connectiontype,
    name_imageequipmenttype,
  }).then((renderedNewEquipmentTypeContent) => {
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedNewEquipmentTypeContent, renderedMessage });
    });
  });
});

router.post("/delete-equipmenttype", isAdmin, async (req, res) => {
  let { id_equipmenttype } = req.body;

  const deleteQuery = "delete from equipmentstypes where id = $1";

  await pool.query(deleteQuery, [id_equipmenttype]);

  let success = "Se eliminó el tipo de equipo";

  hb.render(path.join(dirViews, "private/partials/message.hbs"), {
    success,
  }).then((renderedMessage) => {
    res.send({ renderedMessage });
  });
});

router.post("/modify-equipmenttype", isAdmin, async (req, res) => {
  let { id_equipmenttype, new_name_equipmenttype, new_id_connectiontype } = req.body;

  const update_query = "update equipmentstypes set name_equipmenttype = $1, id_connectiontype = $2  where id = $3";

  let newData = [new_name_equipmenttype, new_id_connectiontype, id_equipmenttype];

  await pool.query(update_query, newData);

  let success = "Tipo de equipo actualizado";

  hb.render(path.join(dirViews, "private/partials/message.hbs"), {
    success,
  }).then((renderedMessage) => {
    res.send({ renderedMessage });
  });
});

router.post("/creartipousuario", isAdmin, async (req, res) => {
  let nombre_tipoUsuario = req.body.nombre_tipoUsuario;
  const consulta1 = "insert into usersroles (name_userrol) values ($1)";
  await pool.query(consulta1, [nombre_tipoUsuario]);
  req.flash("success", "Se agregó el tipo de usuario");
  res.redirect("/admin/tipos");
});

// @@@@@@@@ PÁGINA ADMINISTRACIÓN USUARIOS @@@@@@@@

router.get("/users", isAdmin, async (req, res) => {
  const users = (
    await pool.query(
      "Select a1.id as id_user,a1.names_user,a1.surnames_user,a1.email_user,a1.code_user,b1.name_userrol from users as a1 inner Join usersroles b1 On a1.id_userrol = b1.id"
    )
  ).rows;
  res.render("private/admin/users/all-content", { users });
});

router.post("/delete-user", isAdmin, async (req, res) => {
  let { id_user } = req.body;
  const delete_query = "delete from users where id=$1";
  let usuario = [id_user];
  try {
    await pool.query(delete_query, usuario);
    success = "Se eliminó el usuario";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/modificarusuario", isAdmin, async (req, res) => {
  let { id_user, nuevo_nombres_usuario, nuevo_apellidos_usuario, nuevo_email_usuario } = req.body;

  const update_query = "update users set names_user = $1, surnames_user = $2, email_user = $3  where id = $4";

  let nuevos_datos = [nuevo_nombres_usuario, nuevo_apellidos_usuario, nuevo_email_usuario, id_user];

  /*  const users = (
    await pool.query(
      "Select a1.id as id_user,a1.names_user,a1.surnames_user,a1.email_user,a1.code_user,b1.name_userrol from users as a1 inner Join usersroles b1 On a1.id_userrol = b1.id"
    )
  ).rows; */

  /* hb.render(path.join(dirViews, "private/admin/users-section.hbs"), {
    users,
  }).then((renderedHtml) => {
    res.send({ html: renderedHtml });
  }); */
  try {
    await pool.query(update_query, nuevos_datos);
    let success = "Se modificó el usuario";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    console.log(e);
  }
});

//@@@@@@@@ FIN PÁGINA DE ADMINISTRACIÓN USUARIOS @@@@@@@@

//@@@@@@@@ PÁGINA DE ADMINISTRACIÓN LABORATORIOS @@@@@@@@

router.post("/create-laboratory", isAdmin, async (req, res) => {
  let { nameLaboratory, numberRow, id_iconlaboratory } = req.body;

  const imagescourses = (await pool.query("select id,name_imagecourse from imagescourses")).rows;

  /* si no esta selected poner el default */
  const insertQuery = "insert into laboratories (name_laboratory, id_icon) values ($1,$2) returning id";

  id_iconlaboratory = id_iconlaboratory == undefined ? 1 : id_iconlaboratory;

  //console.log(id_iconlaboratory);
  const newLaboratory = [nameLaboratory, id_iconlaboratory];

  let { name_icon } = (await pool.query("select name_icon from icons where id = $1", [id_iconlaboratory])).rows[0];
  console.log(name_icon);

  try {
    let idNewLaboratory = (await pool.query(insertQuery, newLaboratory)).rows[0].id;

    let success = `Se creó el laboratorio: ${nameLaboratory}`;

    hb.render(path.join(dirViews, "private/admin/labs/labs-content.hbs"), {
      idNewLaboratory,
      nameLaboratory,
      numberRow,
      name_icon,
      imagescourses,
    }).then((renderedNewLabContent) => {
      hb.render(path.join(dirViews, "private/partials/message.hbs"), {
        success,
      }).then((renderedMessage) => {
        res.send({ renderedNewLabContent, renderedMessage });
      });
    });
  } catch (e) {
    let error = `No se pudo crear el laboratorio`;
    if ((e.code = 23505)) {
      error = `No se pudo crear el laboratorio. Ya existe`;
    }

    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/delete-laboratory", isAdmin, async (req, res) => {
  let { idLaboratory } = req.body;

  const deleteQuery = "delete from laboratories where id = $1";

  await pool.query(deleteQuery, [idLaboratory]);

  let success = "Se eliminó el laboratorio";

  hb.render(path.join(dirViews, "private/partials/message.hbs"), {
    success,
  }).then((renderedMessage) => {
    res.send({ renderedMessage });
  });
});

router.post("/create-course", isAdmin, async (req, res) => {
  let { idLaboratory, nameCourse, numberRow, id_imagecourse } = req.body;
  id_imagecourse = id_imagecourse == undefined ? 1 : id_imagecourse;
  let insertQuery = "insert into courses (name_course,id_laboratory, id_imagecourse) values ($1,$2,$3) returning id";
  console.log("idllega" + id_imagecourse);
  let { name_imagecourse } = (await pool.query("select name_imagecourse from imagescourses where id=$1", [id_imagecourse])).rows[0];
  console.log("aqui" + name_imagecourse);

  try {
    let idNewCourse = (await pool.query(insertQuery, [nameCourse, idLaboratory, id_imagecourse])).rows[0].id;

    let modules = (await pool.query("select id,name_module, id_laboratory from modules where id_laboratory=$1", [idLaboratory])).rows;
    let schedulesGroups = (await pool.query("select id,id_course,name_schedulegroup from schedulesgroups where id_course=$1", [idNewCourse])).rows;

    let success = `Se creó el curso ${nameCourse}`;

    hb.render(path.join(dirViews, "private/admin/labs/courses-content.hbs"), {
      idLaboratory,
      idNewCourse,
      numberRow,
      nameCourse,
      modules,
      schedulesGroups,
      name_imagecourse,
    }).then((renderedNewCourseContent) => {
      hb.render(path.join(dirViews, "private/partials/message.hbs"), {
        success,
      }).then((renderedMessage) => {
        res.send({ renderedNewCourseContent, renderedMessage });
      });
    });
  } catch (error) {
    console.log(error);
    if (error.code == 23505) {
      let error = `Ya existe un curso con el nombre ${nameCourse}`;
      hb.render(path.join(dirViews, "private/partials/message.hbs"), {
        error,
      }).then((renderedMessage) => {
        res.send({ renderedMessage });
      });
    }
  }
});

router.post("/delete-course", isAdmin, async (req, res) => {
  let { idCourse } = req.body;

  const deleteQuery = "delete from courses where id = $1";

  await pool.query(deleteQuery, [idCourse]);

  //req.flash("success", "Se eliminó el laboratorio");
  //res.send({ message: "sucessful" });
  let success = "Se eliminó el curso";
  hb.render(path.join(dirViews, "private/partials/message.hbs"), {
    success,
  }).then((renderedMessage) => {
    res.send({ renderedMessage });
  });
});

//yasta

router.post("/create-module", isAdmin, async (req, res) => {
  const { idLaboratory, nameModule, numberRow } = req.body;

  const insertQuery = "insert into modules (name_module,id_laboratory) values ($1,$2) returning id";

  let idNewModule = (await pool.query(insertQuery, [nameModule, idLaboratory])).rows[0].id;

  const equipmentsTypes = (await pool.query("select id,name_equipmenttype from equipmentstypes")).rows;

  let success = `Se creó la mesa ${nameModule}`;

  console.log(idNewModule);
  hb.render(path.join(dirViews, "private/admin/labs/modules-content.hbs"), {
    idNewModule,
    numberRow,
    nameModule,
    equipmentsTypes,
  }).then((renderedNewModuleContent) => {
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedNewModuleContent, id_module: idNewModule, renderedMessage });
    });
  });
});

router.post("/delete-module", isAdmin, async (req, res) => {
  let { idModule } = req.body;

  const deleteQuery = "delete from modules where id = $1";

  try {
    await pool.query(deleteQuery, [idModule]);
    let success = "Se eliminó la mesa";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo eliminar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/create-equipment", isAdmin, async (req, res) => {
  const { idModule, nameEquipment, ipEquipment, portEquipment, wsRouteEquipment, passwordEquipment, idEquipmentType, numberRow } = req.body;

  const insert_query =
    "insert into equipments (name_equipment,ip_equipment,port_equipment,connectionroute_equipment,password_equipment,id_equipmenttype,id_module) values ($1,$2,$3,$4,$5,$6,$7) returning id";

  let idNewEquipment = (await pool.query(insert_query, [nameEquipment, ipEquipment, portEquipment, wsRouteEquipment, passwordEquipment, idEquipmentType, idModule]))
    .rows[0].id;

  const get_query = "select name_equipmenttype from equipmentstypes where id=$1";

  let nameEquipmentType = (await pool.query(get_query, [idEquipmentType])).rows[0].name_equipmenttype;

  let success = `Se creó el equipo ${nameEquipment}`;

  hb.render(path.join(dirViews, "private/admin/labs/equipment-content.hbs"), {
    idNewEquipment,
    numberRow,
    nameEquipment,
    ipEquipment,
    portEquipment,
    wsRouteEquipment,
    passwordEquipment,
    nameEquipmentType,
  }).then((renderedNewEquipment) => {
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedNewEquipment, renderedMessage });
    });
  });
});

router.post("/delete-equipment", isAdmin, async (req, res) => {
  let { idEquipment } = req.body;

  const delete_query = "delete from equipments where id = $1";

  try {
    await pool.query(delete_query, [idEquipment]);
    let success = "Se eliminó el equipo";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo eliminar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/enroll-user", isAdmin, async (req, res) => {
  const { nombre_usuario, id_module, id_schedulegroup, idCourse, name_module, name_schedulegroup, numero_fila } = req.body;
  const insert_query = "insert into enrolleds (id_user,id_module,id_schedulegroup,id_course) values($1,$2,$3,$4) returning id";
  let code_user = nombre_usuario.indexOf(")");
  code_user = parseInt(nombre_usuario.substring(1, code_user));

  if (Number.isInteger(code_user)) {
    consulta2 = "select id from users where code_user=$1";
    let id_user = (await pool.query(consulta2, [code_user])).rows[0];

    if (id_user) {
      id_user = id_user.id;
      const consulta3 =
        "select a1.id,b1.id_course from users as a1 left outer join enrolleds b1 On b1.id_user=a1.id left outer join usersroles c1 On a1.id_userrol = c1.id where (c1.name_userrol <> 'administrador' and c1.name_userrol <> 'Administrador' and a1.id = $1 and b1.id_course = $2)";
      const asignacion = [id_user, idCourse];
      let usuariomatriculado = (await pool.query(consulta3, asignacion)).rows[0];
      if (!usuariomatriculado) {
        const nuevaMatricula = [id_user, id_module, id_schedulegroup, idCourse];
        let id_matriculaNueva = (await pool.query(insert_query, nuevaMatricula)).rows[0].id;

        let select_query = "select names_user, surnames_user from users where id= $1";
        let nombresyapellidos_usuario = (await pool.query(select_query, [id_user])).rows[0];
        let names_user = nombresyapellidos_usuario.names_user;
        let surnames_user = nombresyapellidos_usuario.surnames_user;
        let success = `Se matriculó al alumno ${nombre_usuario}`;

        hb.render(path.join(dirViews, "private/admin/labs/users-content.hbs"), {
          id_matriculaNueva,
          numero_fila,
          names_user,
          surnames_user,
          code_user,
          name_module,
          name_schedulegroup,
        }).then((renderedNewEnrolledContent) => {
          hb.render(path.join(dirViews, "private/partials/message.hbs"), {
            success,
          }).then((renderedMessage) => {
            res.send({ renderedNewEnrolledContent, renderedMessage });
          });
        });
        /* req.flash("success", "Alumno Asignado");
        res.redirect("/admin/laboratories"); */
      } else {
        req.flash("message", "Alumno ya se encuentra matriculado en el curso");
        res.redirect("/admin/laboratories");
      }
    } else {
      req.flash("message", "El usuario seleccionado no existe");
      res.redirect("/admin/laboratories");
    }
  } else {
    console.log("je");
    req.flash("message", "El usuario seleccionado no existe");
    res.redirect("/admin/laboratories");
  }

  /* const { name_course, id_laboratory } = req.body;
  const text =
    "insert into courses (name_course,id_laboratory,img_course) values ($1,$2,$3)";
  const nuevoCurso = [name_course, id_laboratory, "/img/courses/noimage.jpg"];
  await pool.query(text, nuevoCurso);
  req.flash("success", "Curso Agregado");
  res.redirect("/admin/laboratories"); */

  //res.send({ message: "sucessful" });
});

router.post("/delete-enrolled", isAdmin, async (req, res) => {
  let id_enrolled = [req.body.id_enrolled];

  const delete_query = "delete from enrolleds where id = $1";

  try {
    await pool.query(delete_query, id_enrolled);
    let success = "Se eliminó la matrícula";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo eliminar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/create-schedulegroup", isAdmin, async (req, res) => {
  const { idCourse, name_schedulegroup, numero_fila } = req.body;

  const insert_query = "insert into schedulesgroups (name_schedulegroup,id_course) values ($1,$2) returning id";

  let id_newschedulegroup = (await pool.query(insert_query, [name_schedulegroup, idCourse])).rows[0].id;

  try {
    let success = "Se creó el grupo horario";
    hb.render(path.join(dirViews, "private/admin/labs/schedgroup-content.hbs"), {
      id_newschedulegroup,
      name_schedulegroup,
      numero_fila,
    }).then((renderedNewScheduleGroupContent) => {
      hb.render(path.join(dirViews, "private/partials/message.hbs"), {
        success,
      }).then((renderedMessage) => {
        res.send({ renderedNewScheduleGroupContent, idNewScheduleGroup: id_newschedulegroup, renderedMessage });
      });
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/delete-schedulegroup", isAdmin, async (req, res) => {
  let { idScheduleGroup } = req.body;

  const delete_query = "delete from schedulesgroups where id = $1";

  try {
    await pool.query(delete_query, [idScheduleGroup]);
    let success = "Se eliminó el grupo horario";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo eliminar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/create-schedule", isAdmin, async (req, res) => {
  const { idScheduleGroup, day_schedule, starttime_schedule, endtime_schedule, numero_fila } = req.body;

  const insert_query = "insert into schedules (id_schedulegroup, day_schedule, starttime_schedule, endtime_schedule) values ($1,$2,$3,$4) returning id";

  let id_diayhoraNueva = (await pool.query(insert_query, [idScheduleGroup, day_schedule, starttime_schedule, endtime_schedule])).rows[0].id;

  try {
    let success = "Se creó el horario";
    hb.render(path.join(dirViews, "private/admin/labs/schedules-content.hbs"), {
      id_diayhoraNueva,
      day_schedule,
      starttime_schedule,
      endtime_schedule,
      numero_fila,
    }).then((renderedNewScheduleContent) => {
      hb.render(path.join(dirViews, "private/partials/message.hbs"), {
        success,
      }).then((renderedMessage) => {
        res.send({ renderedNewScheduleContent, renderedMessage });
      });
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/delete-schedule", isAdmin, async (req, res) => {
  let { idSchedule } = req.body;

  const delete_query = "delete from schedules where id = $1";

  try {
    await pool.query(delete_query, [idSchedule]);
    let success = "Se eliminó el horario";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo eliminar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

//@@MODIFICAR@@

router.post("/modify-laboratory", isAdmin, async (req, res) => {
  let { idLaboratory, newLaboratoryName } = req.body;

  const update_query = "update laboratories set name_laboratory = $1  where id = $2";

  let newData = [newLaboratoryName, idLaboratory];

  try {
    await pool.query(update_query, newData);
    let success = "Se actualizó el laboratorio";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo actualizar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/modify-course", isAdmin, async (req, res) => {
  let { idCourse, newCourseName } = req.body;

  const update_query = "update courses set name_course = $1  where id = $2";

  let newData = [newCourseName, idCourse];

  try {
    await pool.query(update_query, newData);
    let success = "Se actualizó el curso";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo actualizar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/modify-module", isAdmin, async (req, res) => {
  let { idModule, newTableName } = req.body;

  const update_query = "update modules set name_module = $1  where id = $2";

  let newData = [newTableName, idModule];

  try {
    await pool.query(update_query, newData);
    let success = "Se actualizó la mesa";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo actualizar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/modify-schedulegroup", isAdmin, async (req, res) => {
  let { idScheduleGroup, newScheduleGroupName } = req.body;

  const update_query = "update schedulesgroups set name_schedulegroup = $1  where id = $2";

  let newData = [newScheduleGroupName, idScheduleGroup];

  try {
    await pool.query(update_query, newData);
    let success = "Se actualizó el grupo horario";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo actualizar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

router.post("/modify-equipment", isAdmin, async (req, res) => {
  let { idEquipment, newEquipmentName, newEquipmentIp, newEquipmentPort, newPasswordEquipment } = req.body;

  const update_query = "update equipments set name_equipment = $1, ip_equipment = $2, port_equipment = $3, password_equipment = $4  where id = $5";

  let newData = [newEquipmentName, newEquipmentIp, newEquipmentPort, newPasswordEquipment, idEquipment];

  try {
    await pool.query(update_query, newData);
    let success = "Se actualizó el equipo";
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      success,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  } catch (e) {
    let error = `No se pudo actualizar (Code:${e.code})`;
    hb.render(path.join(dirViews, "private/partials/message.hbs"), {
      error,
    }).then((renderedMessage) => {
      res.send({ renderedMessage });
    });
  }
});

//@@@@@@@@ FIN PÁGINA DE ADMINISTRACIÓN LABORATORIOS @@@@@@@@

module.exports = router;
