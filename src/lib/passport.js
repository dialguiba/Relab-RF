const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const pool = require("../database");
const helpers = require("../lib/helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const text = "Select id,names_user,surnames_user,email_user,password_user,id_userrol from users where email_user=$1";

      const rows = (await pool.query(text, [email.trim().toLowerCase()])).rows;

      if (rows.length > 0) {
        const user = rows[0];
        if (user.email_user == "administrador" && user.password_user == password) {
          done(null, user, req.flash("success", "Bienvenido " + user.email_user));
        } else {
          const validPassword = await helpers.matchPassword(password, user.password_user);
          if (validPassword) {
            done(null, user, req.flash("success", "Bienvenido " + user.email_user));
          } else {
            done(null, false, req.flash("message", "Contraseña Incorrecta"));
          }
        }
      } else {
        return done(null, false, req.flash("message", "El correo no está registrado"));
      }
    }
  )
);

/* ESTA PARTE DEL CÓDIGO ERA PARA CUANDO UN USUARIO SE PODÍA RESTRINGIR A EL MISMO (ACTUALMENTE NO SE USA) */
passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      //const { fullname } = req.body;
      var newUser = {
        email,
        password,
        //,fullname
      };
      //const text = 'INSERT INTO users (username,password,fullname) values ($1,$2,$3) returning "id"';
      const text = 'INSERT INTO users (email, password) values ($1,$2) returning "id"';

      newUser.password = await helpers.encryptPassword(password);
      newUser = Object.values(newUser); //convierto a array para insertar
      const result = await pool.query(text, newUser);

      newUser = Object.assign({ email: newUser[0], password: newUser[1] }, []); //convierto a object nuevamente

      newUser.id = result.rows[0].id; //para acceder al id que retorna

      return done(null, newUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const consulta = id;
  /* const rows = (await pool.query('SELECT * FROM users WHERE id = $1', [id])).rows; */

  const rows = (
    await pool.query(
      "SELECT DISTINCT a1.id,a1.names_user,a1.surnames_user, a1.code_user,a1.email_user,c1.id_laboratory,d1.name_laboratory, d1.id_icon, e1.name_userrol, f1.name_icon FROM users as a1 left outer join enrolleds b1 On a1.id = b1.id_user left outer join courses c1 On b1.id_course = c1.id left outer join laboratories d1 On c1.id_laboratory = d1.id left outer join usersroles e1 On a1.id_userrol = e1.id left outer join icons f1 On f1.id = d1.id_icon WHERE a1.id = $1",
      [id]
    )
  ).rows;
  /* console.log(rows[1]) */
  done(null, rows);
});
