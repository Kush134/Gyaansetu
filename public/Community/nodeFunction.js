function createTreeView(json, parentNode, level = 1) {
    // iterate through the keys in the JSON object
    for (const key in json) {
        // create a new list item for the key
        let li;


        li = document.createElement('li');

        // create a div element to hold the key and delete icon
        const div = document.createElement('div');
        div.style.display = 'inline-block';

        // create a span element to hold the key
        const span = document.createElement('span');
        span.innerHTML = key;
        span.style.color = 'white';

        // append the span element to the div
        div.appendChild(span);

        // append the div element to the list item
        li.appendChild(div);

        li.style.listStyleType = 'none';

        // create a new unordered list for the child nodes
        const ul = document.createElement('ul');

        // if the value of the key is an object, recursively create a tree view for it
        if (typeof json[key] === 'object' && json[key] !== null) {
            if (level === 5) {
                //console.log('Key of 5th level node:', key);

                createNoteBlock(key, parentNode);
            }
            if (level >= 5) {
                ul.style.display = 'none';
                li.style.display = 'none';
            }
            createTreeView(json[key], ul, level + 1);
        }

        // if the value of the key is not an object, append it to the unordered list
        else {
            const li = document.createElement("li");
            li.innerHTML = json[key];
            ul.appendChild(li);
        }

        // append the unordered list to the list item
        li.appendChild(ul);

        // hide the child nodes by default
        ul.style.display = 'none';

        // if the unordered list has child nodes, create a collapse/expand icon
        if (ul.childNodes.length > 0 && key !== 'paragraphs' && key !== 'url') {
            const icon = document.createElement('i');
            icon.className = 'collapse-icon';
            icon.innerHTML = '<i class="fa fa-thin fa-caret-right"></i> ';
            li.insertBefore(icon, div);

            // add an event listener to the icon to toggle the visibility of the child nodes
            icon.addEventListener('click', function () {
                // toggle the visibility of the child nodes
                if (ul.style.display === 'none') {
                    ul.style.display = 'block';
                    icon.innerHTML = '<i class="fa fa-thin fa-caret-down"></i> ';
                } else {
                    ul.style.display = 'none';
                    icon.innerHTML = '<i class="fa fa-thin fa-caret-right"></i> ';
                }
            });
        }

        // append the list item to the parent node
        parentNode.appendChild(li);
    }
}
// Get a reference to the Realtime Database
var database = firebase.database();

function createNoteBlock(noteId, parentNode) {
    // retrieve data for the specific note from the database
    var ref = database.ref('community/');
    ref.once("value", function (snapshot) {
        findNote(snapshot, noteId, parentNode);
    });
}


function findNote(snapshot, noteId, parentNode) {
    snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().hasOwnProperty(noteId)) {
            var userid = childSnapshot.val()[noteId].userid;
            var titleVal = childSnapshot.val()[noteId].title;
            var id = noteId;
            // create a new div element
            var noteBlock = document.createElement('div');
            noteBlock.id = id;
            noteBlock.className = "note-block";
            // set the background color and text color
            noteBlock.style.backgroundColor = 'black';
            noteBlock.style.color = 'white';

            // add some additional styling
            noteBlock.style.padding = '10px';
            noteBlock.style.margin = '10px';
            noteBlock.style.borderRadius = '5px';

            //console.log("User ID: " + userid + " Title: " + titleVal);
            var userref = database.ref("users/" + userid);
            userref.once("value", function (snapshot) {
                var userdata = snapshot.val();
                var username = userdata.username;
                //console.log("Username: " + username);
                var a = document.createElement('a');
                a.innerHTML = username;
                a.className = 'user_redir';
                a.id = userid;
                noteBlock.innerHTML = titleVal + " by ";
                noteBlock.appendChild(a);
            });

            // append the div element to the parent node
            parentNode.appendChild(noteBlock);
        } else {
            findNote(childSnapshot, noteId, parentNode);
        }
    });
}

$(document).on('click', '.note-block', function () {
    var id = $(this).attr('id');
    console.log(id);
    //redirect to new page
    window.location.href = "../index.html?id=" + id;
});

$(document).on('click', '.user_redir', function () {
    var userid = $(this).attr('id');
    console.log(userid);
    //redirect to new page
    //window.location.href = "../Dashboard/dashboard.html?userid=" + userid;
});