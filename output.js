// Get the needed modules
var fs = require('fs');

// 
// Variables
// 
var emoji_list = {}
var numbered_emoji_list = {}

// 
// Main
// 

// Get the file "app-emoji_list.txt" in ./files/tmp/
fs.readFile('./files/tmp/app-emoji_list', 'utf8', function(err, data) {

    // If error
    if (err) console.log(err);

    // The input is a json file so we need to parse it
    emoji_list = JSON.parse(data);

    // Loop through the list of users
    for (var user in emoji_list) {

        // Create the user objects in the numbered_emoji_list
        if (numbered_emoji_list[user] == undefined) {
            numbered_emoji_list[user] = {};
        }

        // Get the list of emojis
        var emojis = emoji_list[user];


        // Loop through the list of emojis
        for (var i = 0; i < emojis.length; i++) {

            // Get the emoji
            var emoji = emojis[i];

            // If the emoji is not in the numbered_emoji_list of the user
            if (!numbered_emoji_list[user][emoji]) {

                // Add the emoji to the numbered_emoji_list to the right user
                numbered_emoji_list[user][emoji] = 1;

            } else {

                // Add 1 to the number of times the emoji is used
                numbered_emoji_list[user][emoji]++;

            }

        }
    }



    // Read the file "output_sample.html"
    fs.readFile('./output_sample', 'utf8', function(err, data) {

        // If error
        if (err) console.log(err);

        // Replace the placeholder "<!--THISISREPLACEDBYSCRIPT-->" with the numbered_emoji_list with every user as a h1 and the emoji as a li with ":" and the number of times the emoji is used
        var output = data.replace("<!--THISISREPLACEDBYSCRIPT-->", function(match) {

            // Create the output
            var output = "";

            // Loop through the users
            for (var user in numbered_emoji_list) {

                // Add the user as a h1
                output += "<h1>" + user + "</h1>";

                // Add the emojis as a li
                output += "<ul>";
                for (var emoji in numbered_emoji_list[user]) {
                    output += "<li>" + emoji + ": " + numbered_emoji_list[user][emoji] + "</li>";
                }
                output += "</ul>";

            }

            // Return the output
            return output;

        });

        // Replace "<!--THISISREPLACEDBYSCRIPT1-->" with the json of the numbered_emoji_list
        output = output.replace("<!--THISISREPLACEDBYSCRIPT1-->", function(match) {

            // Return the json of the numbered_emoji_list
            return JSON.stringify(numbered_emoji_list);

        });

        // Write the output to the file "output.html"
        fs.writeFile('./output.html', output, function(err) {

            // If error
            if (err) console.log(err);

        });

    });


});