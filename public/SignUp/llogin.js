var profilePic = document.getElementById('profile-pic');
var liLogin = document.getElementById('li-login');

liLogin.style.display = 'none';

// Check if an account is signed in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in
        liLogin.style.display = 'none';
        profilePic.style.display = 'block';
        console.log('Signed in as:', user.email);
    } else {
        // No user is signed in
        liLogin.style.display = 'block';
        profilePic.style.display = 'none';
        console.log('Not signed in');
    }
});

// Get the sign up button
var signupButton = document.getElementById('signup-button');

//Get the rectangle div
var signuprect = document.getElementById('sign-up-rect');
signuprect.style.display = 'none';

var signinrect = document.getElementById('sign-in-rect');
signinrect.style.display = 'none';

var signinredirect = document.getElementById('signinredirect');
var signupredirect = document.getElementById('signupredirect');
var closeLogin = document.getElementById('close-form-button');




// Handle the sign up button click
signupButton.addEventListener('click', function () {
    // Toggle the form visibility
    if (signinrect.style.display == 'none') {
        signinrect.style.display = 'block';
    } else {
        signinrect.style.display = 'none';
    }

});


signupredirect.addEventListener('click', function (event) {
    // Toggle the form visibility
    event.preventDefault();
    if (signuprect.style.display === 'none') {
        signuprect.style.display = 'block';
        signinrect.style.display = 'none';
    } else if(closeLogin) {
        closeLogSign();
    } else {
        signuprect.style.display = 'none';
        signinrect.style.display = 'block';  
    }

});

signinredirect.addEventListener('click', function (event) {
    event.preventDefault();
    if (signinrect.style.display === 'none') {
        signinrect.style.display = 'block';
        signuprect.style.display = 'none';
    } else if(closeLogin) {
        closeLogSign();
    } else {
        signinrect.style.display = 'none';
        signuprect.style.display = 'block';
    }

});

function closeLogSign(){
 closeLogin.addEventListener('click', function(){
    signinrect.style.display = 'none';
    signuprect.style.display = 'none';
    console.log("close");
});
};


// Get the form element
var signupform = document.getElementById('signup-form');


// Handle the form submission
signupform.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the email and password values
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Create a new user account with the email and password
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function () {
            // Sign up successful, get the current user
            var user = firebase.auth().currentUser;

            // Get the additional details from the form
            var username = document.getElementById('username').value;
            var school = document.getElementById('school').value;
            var course = document.getElementById('course').value;
            var department = document.getElementById('department').value;

            // Save the additional details to the database
            firebase.database().ref('users/' + user.uid).set({
                username: username,
                school: school,
                course: course,
                department: department
            });


            signuprect.style.display = 'none';
        })
        .catch(function (error) {
            // An error occurred, handle it here
        });
});

document.getElementById("signin-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email-si").value;
    var password = document.getElementById("password-si").value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
        // Sign in successful, redirect user to the desired page
        //TODO: disappear form div if successful
    signinrect.style.display = 'none';
    signuprect.style.display = 'none';

    }).catch(function (error) {
        // Handle errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
    });
});

