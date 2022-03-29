// 
// Get modules
// 
fs = require('fs');
readline = require('readline');

// 
// Variables
// 
var chat;
var removes = [
    "Nachrichten und Anrufe sind Ende-zu-Ende-verschlüsselt.",
    "Tippe, um mehr zu erfahren.",
    "Audio weggelassen",
    "Video weggelassen",
    "Verpasster Gruppen-",
    "Verpasster Videoanruf",
    "Verpasster Sprachanruf",
    "Du hast diese Nachricht gelöscht.",
    "Du hast diesen Anruf gelöscht.",
    "Bild weggelassen",
    "Sticker weggelassen",
    "Diese Nachricht wurde gelöscht.",
    "Dokument weggelassen",
    "GIF weggelassen"
];
var skip_line = false;

// 
// Functions
//


// 
// Main
//

// Create readline interface
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read file
fs.readFile('./input/chat.txt', 'utf8', function(err, data) {

    // If error
    if (err) console.log(err);

    // Read line by line
    chat = data.split('\n');

    // Remove last line
    chat.pop();


});