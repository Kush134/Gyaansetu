/*Importing the packages we need*/
const express = require('express');
const path = require('path');


//TODO hours spent on site


let initial_path = path.join(__dirname, "public"); //Store the public folder path inside a variable

const app = express(); //creating express.js server
app.use(express.static(initial_path)); //set public folder path to static path

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "index.html")); //Entry point index.html file in public folder
})

/*Running the server on port 8080*/
app.listen("8080", () => {
    console.log('listening.....');
})