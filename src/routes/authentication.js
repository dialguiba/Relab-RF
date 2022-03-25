const express = require("express");
const router = express.Router();
const pool = require("../database");

const passport = require("passport");
const { isLoggedIn, isNotLoggedIn, isAdmin } = require("../lib/auth");

const hb = require("express-handlebars").create({
  helpers: require("../lib/handlebars"),
});
const path = require("path");
dirViews = path.join(__dirname, "../views");

router.get("/signup", isAdmin, async (req, res) => {
  const usersroles = (await pool.query("SELECT name_userrol FROM usersroles")).rows;
  res.render("auth/signup", { usersroles });
});

router.post(
  "/signup",
  isAdmin,
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

//registrousuarios

router.get("/signin", isNotLoggedIn, (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.signin", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      let error = "Email y/o Contraseña incorrecto(s)";
      //return res.render("auth/signin.hbs");
      hb.render(path.join(dirViews, "public/message.hbs"), {
        error,
      }).then((renderedMessage) => {
        res.send({ error: 1, renderedMessage });
      });
      return;
      //return res.send({ message: "error" });
      //console.log("no se puede logear");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.json({ error: 0, detail: info });
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect("/signin");
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("private/profile/profile");
});

router.get("/editprofile", isLoggedIn, (req, res) => {
  res.render("private/profile/editprofile");
});

router.get("/signupback", isAdmin, async (req, res) => {
  const usersroles = (await pool.query("SELECT name_userrol FROM usersroles")).rows;
  res.render("auth/signin", { usersroles });
});

module.exports = router;
