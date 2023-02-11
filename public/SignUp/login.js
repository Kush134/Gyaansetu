//TODO Firebase Auth Config

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

// Handle the sign up button click
signupButton.addEventListener('click', function () {
    // Toggle the form visibility
    if (signuprect.style.display === 'none') {
        signuprect.style.display = 'block';
    } else {
        signuprect.style.display = 'none';
    }
});

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


