// Get the needed modules
var fs = require('fs');

// 
// Variables
// 


// 
// Main
// 

// Get the file "app-emoji_list.txt" in ./files/tmp/
fs.readFile('./files/tmp/app-emoji_list', 'utf8', function(err, data) {

    // If error
    if (err) console.log(err);

    // The input is a json file so we need to parse it
    emoji_list = JSON.parse(data);
});