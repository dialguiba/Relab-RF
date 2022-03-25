const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
//
const { Pool } = require("pg");
const { database } = require("./keys");
const pgPool = new Pool(database);
//
const express = require("express");
const app = express();
//

// initializations

require("./lib/passport");

// settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "private/partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(
  session({
    secret: "nodesessionha",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: pgPool, // Connection pool
    }),
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.error = req.flash("error");
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/links/", require("./routes/links"));
app.use("/labs/", require("./routes/labs"));
app.use("/admin/", require("./routes/admin"));
app.use("/profile/", require("./routes/profile"));

//Public
app.use(express.static(path.join(__dirname, "public")));

//scripts
/* app.use('/webrtcscripts', express.static(path.join(__dirname , '../node_modules/webrtc-adapter/out/'))); */

// Starting the server
app.listen(app.get("port"), () => {
  console.log("Server in port", app.get("port"));
});
