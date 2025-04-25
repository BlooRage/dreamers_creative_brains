function showLogin() {
  document.querySelector(".login-box").style.display = "block";
  document.querySelector(".register-box").style.display = "none";
  document.querySelector(".forgot-box").style.display = "none";
}

function showRegister() {
  document.querySelector(".login-box").style.display = "none";
  document.querySelector(".register-box").style.display = "block";
  document.querySelector(".forgot-box").style.display = "none";
}

function showForgotPassword() {
  document.querySelector(".login-box").style.display = "none";
  document.querySelector(".register-box").style.display = "none";
  document.querySelector(".forgot-box").style.display = "block";
}
