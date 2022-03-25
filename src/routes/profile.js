const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");
const pool = require("../database");
const helpers = require("../lib/helpers");

//! EDITAR PERFIL (POST)
router.post("/editprofile", isLoggedIn, async (req, res) => {
  const { names_user, surnames_user, code_user } = req.body;
  const editUser = [req.user[0].id];
  if (
    code_user.trim() !== "" &&
    names_user.trim() !== "" &&
    surnames_user.trim() !== ""
  ) {
    editUser.push(names_user.trim(), surnames_user.trim(), code_user.trim());
    let consulta =
      "update users set names_user = $2, surnames_user = $3, code_user = $4 WHERE id = $1";
    await pool.query(consulta, editUser);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else if (code_user.trim() !== "" && names_user.trim() !== "") {
    editUser.push(names_user.trim(), code_user.trim());
    let consulta =
      "update users set names_user = $2, code_user = $3 WHERE id = $1";
    await pool.query(consulta, editUser);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else if (code_user.trim() !== "" && surnames_user.trim() !== "") {
    editUser.push(surnames_user.trim(), code_user.trim());
    let consulta =
      "update users set surnames_user = $2, code_user = $3 WHERE id = $1";
    await pool.query(consulta, editUser);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else if (names_user.trim() !== "" && surnames_user.trim() !== "") {
    editUser.push(names_user.trim(), surnames_user.trim());
    let consulta =
      "update users set names_user = $2, surnames_user = $3 WHERE id = $1";
    await pool.query(consulta, editUser);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else if (names_user.trim() !== "") {
    editUser.push(names_user.trim());
    let consulta = "update users set names_user = $2 WHERE id = $1";
    await pool.query(consulta, editUser);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else if (surnames_user.trim() !== "") {
    editUser.push(surnames_user.trim());
    let consulta = "update users set surnames_user = $2 WHERE id = $1";
    await pool.query(consulta, editUser);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else if (code_user.trim() !== "") {
    editUser.push(code_user.trim());
    let consulta = "update users set code_user = $2 WHERE id = $1";
    await pool.query(consulta, editUser);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else {
    req.flash("message", "Ningún dato insertado");
    res.redirect("/editprofile");
  }
});

//! CAMBIAR CONTRASEÑA (POST)
router.post("/changepassword", isLoggedIn, async (req, res) => {
  const text = "update users set password_user = $1 WHERE id = $2";
  let { password_user, passwordconfirm_usuario } = req.body;

  if (password_user == passwordconfirm_usuario) {
    password_user = await helpers.encryptPassword(password_user);

    const editPassword = [password_user, req.user[0].id];
    await pool.query(text, editPassword);
    req.flash("success", "Cambios Guardados");
    res.redirect("/editprofile");
  } else {
    req.flash("error", "Las contrasseñas no coinciden");
    res.redirect("/editprofile");
  }
});

module.exports = router;
