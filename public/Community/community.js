//TODO read notes of college from community db using note id and subject name 

const container = document.getElementById("Community-data");

var communityRef = firebase.database().ref("community");
communityRef.on("value", function (snapshot) {
    var communityData = snapshot.val();
    var communityDataJSON = JSON.stringify(communityData);
    //console.log(communityDataJSON);
    container.innerHTML = "";

    createTreeView(communityData, container);
}, function (error) {
    console.log("Error: " + error.code);
});

var database = firebase.database();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // The user is signed in. You can access the user's ID.
        //console.log(user.uid);
        userID = user.uid;
        displayProfile(userID);

    } else {
        // The user is not signed in. You should prompt the user to sign in.
        console.error('Error: User is not signed in');
    }
});

function displayProfile(userID) {
    // Reference to the users/user_id node in the database
    var userRef = database.ref('users/' + userID);

    // Get the data for the user
    userRef.once('value').then(function (snapshot) {
        // Get the data for the user
        var userData = snapshot.val();
        generateProfilePicture(userData.username);
    });
}

// Function to generate new profile picture
function generateProfilePicture(username) {
    const size = '200x200';
    const bgset = 'bg2';
    const url = `https://robohash.org/${username}?size=${size}&bgset=${bgset}`;
    // Use the URL to set the src attribute of an img element
    document.querySelector('.profilephoto').src = url;
}

console.log(document.querySelector('.profilephoto').src);