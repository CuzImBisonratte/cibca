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
var regex_line_begin = /\[\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}:\d{2}\]/;
var emoji_list = [];
var current_line = "";
var number_of_lines = 0;

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

    // Remove all unicode 200E characters
    data = data.replace(/[\u200E]/g, '');

    // Split data into lines
    chat = data.split('\n');

    // Get the number of lines
    number_of_lines = chat.length;

    // Loop through lines
    for (var i = 0; i < number_of_lines; i++) {

        // Get current line
        current_line = chat[i];

        // Check if line contains one of the remove strings
        for (var j = 0; j < removes.length; j++) {

            // If line contains remove string
            if (current_line.indexOf(removes[j]) > -1) {

                // Remove line
                chat.splice(i, 1);

                // Skip next line
                skip_line = true;

                // Break loop
                break;
            }
        }
    }

    // Get the number of lines
    number_of_lines = chat.length;

    // Loop through lines
    for (var i = 0; i < number_of_lines; i++) {

        // Check if the next line starts with the regex stored in "regex_line_begin"
        if (chat[i + 1].match(regex_line_begin)) {

            // Add the next line to the current line
            current_line += chat[i + 1];

            // Remove the next line
            chat.splice(i + 1, 1);

            // Decrease the number of lines
            number_of_lines--;
        }
    }

    // Write the new file
    fs.writeFile('./output/chat.txt', chat.join('\n'), function(err) {

        // If error
        if (err) console.log(err);

        // Close readline interface
        rl.close();
    });
});