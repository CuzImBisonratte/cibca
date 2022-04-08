// Get the modules
var readline = require('readline');
var exec = require('child_process').exec;


// Create the interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask the user for the command
rl.question("Was möchtest du machen?\n1 - Emojinutzung pro Person analysieren\n2 - Hilfe\n> ", function(answer) {

    // Switch the answer
    switch (answer) {
        case "1":
            var appjs_childprocess = exec('node app.js --input ./files/input.txt');
            appjs_childprocess.stdout.pipe(process.stdout)
            appjs_childprocess.on('exit', function() {
                process.exit()
            })
            break;
        case "2":
            console.log("Hilfe");
            console.log("=====");
            break;
        default:
            console.log("Keine gültige Eingabe");
            process.exit(1);
            break;
    }
});