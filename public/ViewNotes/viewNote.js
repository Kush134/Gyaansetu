// Get the id from the url
var url_string = window.location.href;
var url = new URL(url_string);
var id = url.searchParams.get("id");

// fetch the data from firestore
if (id) {
    container.innerHTML = "";
    firebase.firestore().collection("notes").doc(id).get().then(function (doc) {
        if (doc.exists) {
            var data = doc.data();
            var obj = JSON.parse(data.data);
            //container.innerHTML = data.content;
            createTreeView(obj, container);
            console.log(obj);
            // display the data on the page
        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}