
//TODO write notes to firestore and save noteid and subject name to firebase db 
var db = firebase.firestore();

var User;

// Get a reference to the Realtime Database
var database = firebase.database();

// Listen for changes to the user's sign-in status
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // The user is signed in. You can access the user's ID.
        console.log(user.uid);
        User = user.uid;
    } else {
        // The user is not signed in. You should prompt the user to sign in.
        console.error('Error: User is not signed in');
    }
});

const savePromptButton = document.getElementById('save-prompt-button');
const saveForm = document.getElementById('save-in-rect');
const closeFormBtm = document.getElementById('close-save-form-button');

var noteTitle = document.getElementById('save-title');

savePromptButton.addEventListener('click', function () {
    if (isAnswered == 0) {
        alert('No notes generated yet!');
    }
    else {
        saveForm.style.display = 'block';
        noteTitle.setAttribute('value', searchTerm);

        console.log(noteTitle);
    }
});

closeFormBtm.addEventListener('click', function () {
    saveForm.style.display = 'none';
});


var saveNoteForm = document.getElementById('savenote-form');



saveNoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var titleVal = noteTitle.value;
    var noteSubject = document.getElementById('save-subject').value;

    // Convert the data to a string
    var dataString = JSON.stringify(jsonData);

    // Save the data to a new document in Cloud Firestore
    db.collection('notes').add({ data: dataString })
        .then(function (docRef) {
            console.log('Data saved with ID:', docRef.id);

            // Save the Cloud Firestore document ID to the Realtime Database
            database.ref('users/' + User + '/notes').child(titleVal).set({
                id: docRef.id,
                subject: noteSubject
            });

            // Get the user information from the 'users/{unique_id}' node
            var userRef = database.ref('users/' + User);
            userRef.once('value', function (snapshot) {
                var userInfo = snapshot.val();

                // Set the data in the 'community' node
                database.ref('community/' + userInfo.school + '/' + userInfo.course + '/' + userInfo.department + '/' + noteSubject + '/' + docRef.id).set({
                    userid: User,
                    title: titleVal
                });
            });

            // Save the document ID in the 'notes' node
            database.ref('notes').child(searchTerm).set(docRef.id);
        })
        .catch(function (error) {
            console.error('Error saving data:', error);
        });
    saveForm.style.display = 'none';
});


