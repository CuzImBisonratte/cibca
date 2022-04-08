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
    "GIF weggelassen",
    "selbstlöschende Nachrichten aktiviert",
    "hat die Telefonnummer gewechselt"
];
var skip_line = false;
var regex_line_begin = /\[\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}:\d{2}\]/;
var emoji_list = {};
var name_split = "";
var current_line_emojis;

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
fs.readFile('./files/input.txt', 'utf8', function(err, data) {

    console.log(data);

    // If error
    if (err) console.log(err);

    // Remove all unicode 200E characters
    data = data.replace(/[\u200E]/g, '');

    // Read line by line
    chat = data.split('\n');

    // Remove last line
    chat.pop();

    // Get number of lines
    var chat_lines = chat.length;

    // Loop through lines
    for (var i = 0; i < chat_lines; i++) {

        // Check if line matches regex
        if (!regex_line_begin.test(chat[i])) {

            // Add the line to the previous line
            chat[i - 1] += ' ' + chat[i];

            // Remove the line
            chat.splice(i, 1);

            // Decrease the number of lines
            chat_lines--;

            // Status message
            console.log('Line ' + i + ' removed');

            // Decrease the index
            i--;

        }
    }

    // Loop through lines
    for (var i = 0; i < chat_lines; i++) {

        // Turn off skip line
        skip_line = false;

        // Get line 
        var line = chat[i];

        // Check if line contains one of the strings in the array "removes"
        for (var j = 0; j < removes.length; j++) {

            // If line contains string
            if (line.indexOf(removes[j]) > -1) {

                // Skip line
                skip_line = true;
            }
        }

        // If line is not skipped
        if (!skip_line) {

            // Reset current line emoji list
            current_line_emojis = null;

            // Print status message
            console.log("Checking message " + (i + 1) + " of " + chat_lines);

            // Check if message contains any emoji
            if (line.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)) {

                // Remove the timestamp from the line
                line = line.replace(regex_line_begin, '');

                // Split the line at the first :
                name_split = line.split(': ')[0];

                // Split the line at the first " "
                name_split = name_split.split(' ')[1];

                // Check if name is not in the emoji list
                if (!emoji_list.hasOwnProperty(name_split)) {

                    // Add name to emoji list
                    emoji_list[name_split] = [];
                }

                // Get the current line emojis
                current_line_emojis = line.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);

                // Loop through emojis
                for (var j = 0; j < current_line_emojis.length; j++) {

                    // Add emoji to emoji list
                    emoji_list[name_split].push(current_line_emojis[j]);
                }
            }
        }
    }

    // Print emoji list
    console.log(emoji_list);

    // Write emoji list to file
    fs.writeFile('./files/emoji_list.txt', JSON.stringify(emoji_list), function(err) {

        // If error
        if (err) console.log(err);

        // Status message
        console.log('Emoji list written');

    });


    // Write chat to file
    fs.writeFile('./files/output.txt', chat.join('\n'), function(err) {

        // If error
        if (err) console.log(err);

        // Status message
        console.log('Chat written to file');

        // Close readline interface
        rl.close();

        // Close the process
        process.exit();

    });
});