//TODO read saved notes from firebase student account db with note id

// Get a reference to the database
var database = firebase.database();
var userID;
var db = firebase.firestore();



firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // The user is signed in. You can access the user's ID.
    console.log(user.uid);
    userID = user.uid;
    displayProfile(userID);

    createNoteBlock();

  } else {
    // The user is not signed in. You should prompt the user to sign in.
    console.error('Error: User is not signed in');
  }
});
// Read the data at the specified location
// var dataID;








function createNoteBlock() {
  database.ref('users/' + userID + '/notes').once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var titleVal = childSnapshot.key;
        var note = childSnapshot.val();
        var id = note.id;


        // Create a new div element
        var div = document.createElement('div');
        div.classList.add('col');

        // Create the HTML for the div element
        div.innerHTML = `
        <div class="card-fluid mb-4 rounded-3 shadow-sm">
          <div class="saved-notes"></div>
          <div class="card-body-notes-fluid" style="cursor: pointer;">
            <h1 class="card-title-fluid pricing-card-title"></h1>
            <div class="ReadNotes" id="ReadNotes"></div>
          </div>
        </div>
      `;
        var row = document.querySelector('.row.row-cols-1.row-cols-md-4.mb-3.text-center');
        // Select the h1 element
        var h1 = div.querySelector('.card-title-fluid.pricing-card-title');

        // Set the id attribute of the h1 element to the value of titleVal
        h1.setAttribute('id', titleVal);

        h1.innerHTML = titleVal;

        var blockRedirID = div.querySelector('.card-body-notes-fluid');

        blockRedirID.setAttribute('id', id);

        // Append the div element to the body of the document
        // document.body.appendChild(div);
        row.appendChild(div);
      });
    });
}



$(document).on('click', '.card-body-notes-fluid', function () {
  var id = $(this).attr('id');
  console.log(id);
  //redirect to new page
  window.location.href = "../index.html?id=" + id;
});
