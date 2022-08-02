const u_name_disp = document.getElementById("u-name-display")

var uid = window.sessionStorage.getItem("user")
var u_email = window.sessionStorage.getItem("u-email")

u_name_disp.innerHTML = "Hello, " + u_email + "!";




