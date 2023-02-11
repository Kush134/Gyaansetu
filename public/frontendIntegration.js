//TODO if a query answer already exists in the db, fetch it instead of routing to the API


// Get a reference to the form and input elements
const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');

/* Displaying output in the result block */
const container = document.getElementById('tree-view');
const sumPreview = document.getElementById('Summary-Preview');

var userId = "my_user"; //TODO: add user configurations with google oauth service

var isAsked = 0;
var isAnswered = 0;
var isSummarized = 0;

container.innerHTML = "Your notes will show here!";

var jsonData;
var searchTerm;

// Add an event listener to the form that listens for the submit event
form.addEventListener('submit', async (event) => {
    // Prevent the form from submitting (which would refresh the page)
    event.preventDefault();

    // Get the value of the input element
    searchTerm = input.value;



    //Send data to the db
    //writeQuery(userId, searchTerm);


    isAsked = 1;

    if (isAsked == 1) {
        /* Animation */
        let dots = 0;

        const intervalId = setInterval(() => {
            dots = (dots + 1) % 4;
            container.innerHTML = `Please wait while we fetch your results${'.'.repeat(dots)}`;
        }, 1000);

        //send query to API
        const result = await apiComm(searchTerm);
        const data = result.data;
        jsonData = JSON.parse(data);
        isAnswered = result.isAnswered;
        if (isAnswered == 1) {
            clearInterval(intervalId);
            container.innerHTML = "";
            //console.log(jsonData);
            createTreeView(jsonData, container);
            sumPreview.innerHTML = "The content summary is being generated, please hold while Azure Cognitive Services does its magic!";
            const summaryResult = await summarize();
            const summary = summaryResult.data;
            const jsonSum = JSON.parse(summary);
            isSummarized = summaryResult.isSummarized;
            if (isSummarized == 1) {
                sumPreview.innerHTML = "";
                container.innerHTML = "";
                console.log(jsonSum);
                createTreeView(jsonSum, container);
            }


        }
    } else {
        container.innerHTML = "Your notes will show here!";
    }
});






function writeQuery(userId, query) {
    firebase.database().ref("Users/" + userId + "/").set({
        query: query,
        querySent: true,
        answerRecieved: false
    });
}


//Has the query been sent? 
// var isQuery = firebase.database().ref("Users/" + userId + "/querySent");

// isQuery.on('value', (snapshot) => {
//     const isAsked = snapshot.val();
//     if (isAsked == false) { //If no query is entered
//         container.innerHTML = "Your notes will show here!";
//     }
//     else { //If query has been sent 
//         //Is query answered variable reading from firebase realitime database
//         var isQanswered = firebase.database().ref("Users/" + userId + "/answerRecieved");

//         isQanswered.on('value', (snapshot) => {
//             const isAnswered = snapshot.val();
//             console.log(isAnswered);
//             if (isAnswered == false) { //If query hasn't been answered yet (result not formulated yet)
//                 /* Animation */
//                 let dots = 0;

//                 const intervalId = setInterval(() => {
//                     dots = (dots + 1) % 4;
//                     container.innerHTML = `Please wait while we fetch the results${'.'.repeat(dots)}`;
//                 }, 1);

//                 isQanswered.on('value', (snapshot) => {
//                     if (snapshot.val() === true) {
//                         clearInterval(intervalId);
//                     }
//                 });
//                 isQuery.on('value', (snapshot) => {
//                     if (snapshot.val() === false) {
//                         clearInterval(intervalId);
//                     }
//                 });
//             } else if (isAnswered == true) { //After result recieved
//                 container.innerHTML = '';
//                 //clearInterval(intervalId);
//                 createTreeView(json, container);
//             }
//         });
//     }
// });



async function apiComm(query) {
    // Call the query_input function
    try {
        const response = await fetch('https://gyaan-setu-webapp.azurewebsites.net/api/function', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                function: 'query_input',
                value: query,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            isAnswered = 1;
            const jsonData = JSON.stringify(data)
            //console.log(jsonData);
            return { data: jsonData, isAnswered: isAnswered };
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
    }
}

/* async function summarize() {
    // Call the query_input function
    try {
        const response = await fetch('https://gyaan-setu-webapp.azurewebsites.net/api/extract_and_summarize', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors',
        });
        if (response.ok) {
            const data = await response.json();
            isSummarized = 1;
            const jsonData = JSON.stringify(data)
            //console.log(jsonData);
            return { data: jsonData, isSummarized: isSummarized };
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
    }
}
 */

async function summarize() {
    const controller = new AbortController();
    const signal = controller.signal;

    setTimeout(() => {
        controller.abort();
    }, 5 * 60 * 1000);  // 5 minutes in milliseconds

    try {
        const response = await fetch('https://gyaan-setu-webapp.azurewebsites.net/api/extract_and_summarize', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: signal,
        });
        if (response.ok) {
            const data = await response.json();
            isSummarized = 1;
            const jsonData = JSON.stringify(data)
            //console.log(jsonData);
            return { data: jsonData, isSummarized: isSummarized };
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
    }
}

var userID;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // The user is signed in. You can access the user's ID.
        console.log(user.uid);
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