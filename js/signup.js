import { createUserWithEmailAndPassword, getAuth } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js';


$(function() {
    $("#signup_button").click(signUp);
})

function getAuthInfo(callback) {
    $.ajax({
        type: 'GET',
        url: '../config',
        contentType: 'application/json',
        dataType: 'json',
        success: function (result) {
            callback(result);
        }
    });
}

function signUp() {
    getAuthInfo(function (result) {
    
        var app = initializeApp(result);
        var auth = getAuth(app);
    
        var u_email = document.getElementById("uemail").value;
        //console.log(u_email);
        var password = document.getElementById("upassword").value;
        var cpassword = document.getElementById("cpassword").value;
        if (password && (password === cpassword)) {
            createUserWithEmailAndPassword(auth, u_email, password)
                .then((userCredential) => {
                    // Signed in 
                    let user = userCredential.user;
                    let uid = user.uid;
                    let data = { "uid": uid };
                    sessionStorage.setItem("u-email", u_email)
                    console.log(user.email, "successfully created with [ID]:", uid);
    
                    $.ajax({
                        type: "POST",
                        url: "../api/v1/signup",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(data),
                        success: function (result) {
                            if (result != null && result.success) {
                                consolde.log(result.responseText);
                            } else {
                                console.log("Could not login");
                            }
                        }
                    });

                    window.sessionStorage.setItem("user", uid)
                    window.location.replace("../html/projects.html")
    
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + ": " + errorMessage);
                    alert(errorMessage)
                })
        } else {
            alert("Passwords must match");
        }
        })
}