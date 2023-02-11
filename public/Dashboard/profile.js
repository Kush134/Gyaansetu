//TODO read profile from firebase student account db: acc no., name, course, dept., college

function displayProfile(userID) {
    // Reference to the users/user_id node in the database
    var userRef = database.ref('users/' + userID);

    // Get the data for the user
    userRef.once('value').then(function (snapshot) {
        // Get the data for the user
        var userData = snapshot.val();
        // Get the values for each id
        document.getElementById('username').innerHTML = userData.username;
        document.getElementById('course').innerHTML = userData.course;
        document.getElementById('Department').innerHTML = userData.department;
        document.getElementById('school').innerHTML = userData.school;
        generateProfilePicture(userData.username);
    });
}

// Function to generate new profile picture
function generateProfilePicture(username) {
    const size = '200x200';
    const bgset = 'bg2';
    const url = `https://robohash.org/${username}?size=${size}&bgset=${bgset}`;
    // Use the URL to set the src attribute of an img element
    document.querySelector('.infophoto').src = url;
    document.querySelector('.profilephoto').src = url;
}

console.log(document.querySelector('.profilephoto').src);

document.getElementById("log-out-btn").addEventListener("click", function () {
    firebase.auth().signOut().then(function () {
        console.log("sign out success");
        window.location.href = "../index.html";
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
});
