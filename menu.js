// Get the modules
var readline = require('readline');
var exec = require('child_process').exec;
var fs = require('fs');

// Startup
console.log("Loading CIBCA");
console.log("Checking folder structure");
// Check if folder "files" exists
if (!fs.existsSync('files')) {
    console.log("Creating folder 'files'");
    fs.mkdirSync('files');
}
// Check if folder "tmp" exists in "files"
if (!fs.existsSync('files/tmp')) {
    console.log("Creating folder 'files/tmp'");
    fs.mkdirSync('files/tmp');
}
console.log("CIBCA loaded!");
console.clear();

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
                setTimeout(function() {
                    exec('start "" "./output.html"');
                    setTimeout(function() {
                        process.exit();
                    }, 1000);
                }, 500);
            });
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