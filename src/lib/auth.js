module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      if (
        (req.user[0].names_user === null ||
          req.user[0].surnames_user === null) &&
        req.route.path != "/editprofile" &&
        req.route.path != "/logout" &&
        req.user[0].name_userrol != "Administrador"
      ) {
        return res.redirect("/editprofile");
      } else {
        return next();
      }
    }
    return res.redirect("/signin");
  },

  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/inicio");
  },

  isAdmin(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user[0].name_userrol == "Administrador") {
        return next();
      } else {
        return res.redirect("/inicio");
      }
    } else {
      return res.redirect("/signin");
    }
  },

  isProfesor(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user[0].name_userrol == "¨Profesor") {
        return next();
      } else {
        return res.redirect("/inicio");
      }
    } else {
      return res.redirect("/signin");
    }
  },
};
