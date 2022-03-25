//Encriptar Pass
const bcrypt = require("bcryptjs");
//Encriptar Pass

//Enviar Correo
const nodemailer = require("nodemailer");
/* const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2; */

/* const oauth2Client = new OAuth2(
  "462215909773-bpe4qtranvopvh4qtq8so62poaa3vk28.apps.googleusercontent.com", 
  "pCZrz9UNIbuAlHtvINi6Uo7A", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
     refresh_token: "Your Refresh Token Here"
});
const accessToken = oauth2Client.getAccessToken() */
//Enviar Correo

//Crea la const helpers a exportar
const helpers = {};
//Crea la const helpers a exportar

//Configuración NodeMailer
let transporter = nodemailer.createTransport({
  service: "gmail.com",
  secure: false,
  auth: {
    user: "correodeprueba19931@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});
//Configuración NodeMailer

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch {
    console.log(e);
  }
};

helpers.sendEmail = async (email, password) => {
  let mailOptions = {
    from: "correodeprueba19931@gmail.com",
    to: email,
    subject: "Contraseña Relab",
    html:
      '<h1 style="text-align: center; margin-right: 1rem; border-bottom: 1px solid;">Bienvenido a RELAB</h1><p>Se encuentra registrado en la plataforma ReLab con los siguientes datos:<br /><br /><b>Email:</b><span style="margin-left: 1rem;padding: 0.2rem;border-radius: 4px;box-shadow: 1px 1px;background-color: rgba(147, 150, 148, 0.36);">' +
      email +
      '</span><br /><br /><b>Contraseña:</b><span style="margin-left: 1rem;padding: 0.2rem;border-radius: 4px;box-shadow: 1px 1px;background-color: rgba(147, 150, 148, 0.36);">' +
      password +
      '</span></p><p style="background-color: rgba(184, 188, 126, 0.74);display: inline-block;padding: 0.3rem;border-radius: 3px;">Recuerde que al iniciar sesión por primera vez deberá llenar sus datos personales para ingresar a la plataforma<br />Una vez ingresada su información personal el administrador de la plataforma le asignará los courses que le corresponda.</p>',
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email Sent!");
    }
  });
};

helpers.randomPassword = (length) => {
  var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
  var pass = "";
  for (var x = 0; x < length; x++) {
    var i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  console.log(pass);
  return pass;
};

module.exports = helpers;
