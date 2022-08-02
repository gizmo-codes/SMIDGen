// Firebase Sign-Up Function
// For now errors are displayed in console only (CTRL+Shift+i)

// TODO: Display errors to user such as ->
// 1. Email already taken
// 2. Passwork too weak (Firebase requires [recommends?] 6 characters)
// 3. Invalid login

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
//const loginNav = document.getElementById("login-nav");
const logoutNav = document.getElementById("logout-nav");

// Firebase Login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Grab input from user.
        let userEmail = document.getElementById("login-email").value;
        let userPassword = document.getElementById("login-pw").value;

        // Sign in user with firebase.
        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
            .then((userCredential) => {
                // Signed in

                // Display/hide auth buttons.
                //document.getElementById('login-nav').style.display = 'none';
                document.getElementById('logout-nav').style.display = 'block';

                // Debugging.
                const user = userCredential.user;
                console.log(user);

                // Reset form inputs.
                document.forms[0].reset();

                // Redirect to home.
                window.location = '/projects';
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                // Display error if login is incorrect.
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong email or password.');
                } else {
                    alert(errorMessage);
                }
            });
    })
};

// Firebase Registration
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Used for shorthand below.
        const auth = firebase.auth();

        // Sign-up form variables
        var userEmail = document.getElementById("signup-email").value;
        var userPassword = document.getElementById("signup-pw").value;
        var confirmPass = document.getElementById("signup-confirm-pw").value;

        if (userPassword === confirmPass) {
            auth.createUserWithEmailAndPassword(userEmail, userPassword)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    //document.getElementById('login-nav').style.display = 'none';
                    //document.getElementById('logout-nav').style.display = 'block';

                    // Create a collection that is linked to the unique user ID that is logged in.
                    return db.collection('users').doc(userCredential.user.uid).set({
                            email: userEmail
                        }).then(() => {
                            // Debugging code, remove from production.
                            console.log("Document written with ID: ", userCredential.user.uid);
                            document.forms[0].reset();
                            //signupForm.reset();
                            window.location = '/search';
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        })
                });
        } else {
            // Untested
            document.getElementById("pass-match-alert").style.display = "block";
            // Change this later, alerts are terrible.
            window.alert("Passwords must match!");
        }
    })
}


// Real Time Listener (Logout)
if (logoutNav) {
    logoutNav.addEventListener("click", (e) => {
        e.preventDefault();
        // Sign user out.
        firebase.auth().signOut();

        // Display/hide appropriate auth buttons on banner.
        //document.getElementById('login-nav').style.display = 'block';
        document.getElementById('logout-nav').style.display = 'none';

        // Reidrect to login page.
        //window.location = '/';
        //console.log("LOGOUT BUTTON CLICKED");
    })
}

// Swap login/registration display when user clicks "Sign In" or "Register" links at the bottom of auth forms. 
function showSignUpForm() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}


// Display/Hide nav buttons based on users current auth state.
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        // Grab documents to hide/show.
        if(logoutNav)
        {
            logoutNav.style.display = 'block';
        }

    } else {
        // Debugging
        //console.log(window.location.pathname);

        // If the user is not logged in, redirect to the login page.
        /*
        if(window.location.pathname != "/auth")
        {
            window.location = 'auth';
        }
        */

        // Grab documents to hide/show
        if(loginForm)
        {
            loginForm.style.display = 'block';
        }
        //loginNav.style.display = 'block';
    }
});
