let password = document.getElementById("password"),
  confirm_password = document.getElementById("password-confirmation");

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Las contraseñas no coinciden");
  } else {
    confirm_password.setCustomValidity("");
  }
}
