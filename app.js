// 
// Get modules
// 
fs = require('fs');
var exec = require('child_process').exec;

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
var android_line_begin = /\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}/;
var ios_line_begin = /\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}/;
var emoji_list = {};
var name_split = "";
var current_line_emojis;
var input_arg_index = 0;
var input_file = "";

// 
// Functions
//


// 
// Main
//


// Check if input argument is given
if (process.argv.indexOf('--input') > -1) {

    // Get the number of the input argument
    input_arg_index = process.argv.indexOf('--input');

    // Set the input file path
    input_file = process.argv[input_arg_index + 1];

} else {

    // Set the default input file path
    input_file = "./files/input.txt";

}

// Read file
fs.readFile(input_file, 'utf8', function(err, data) {

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
        if (!android_line_begin.test(chat[i])) {

            // Check if line matches regex
            if (!ios_line_begin.test(chat[i])) {

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
                line = line.replace(ios_line_begin, '');
                line = line.replace(android_line_begin, '');

                // Split the line at the first :
                name_split = line.split(': ')[0];

                console.log(name_split);

                // Split the line at the first " "
                name_split = name_split.split(':')[0];

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
    fs.writeFile('./files/tmp/app-emoji_list', JSON.stringify(emoji_list), function(err) {

        // If error
        if (err) console.log(err);

        // Status message
        console.log('Emoji list written');

        // Start output script
        var appjs_childprocess = exec('node output.js');
        appjs_childprocess.stdout.pipe(process.stdout)
        appjs_childprocess.on('exit', function() {
            setTimeout(function() {
                process.exit();
            }, 1000);
        })

    });


    // Write chat to file
    fs.writeFile('./files/output.txt', chat.join('\n'), function(err) {

        // If error
        if (err) console.log(err);

        // Status message
        console.log('Chat written to file');

        // Close the process
        process.exit();

    });
});