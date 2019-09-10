
var socket;

var lastFrames = [];

var loc;
var sequenceCount = 0;
var inputHistory = [];
var movementDelayQueue = [];

var serverLoc;
var lastInputProcessed;

var localPlayerLocations = [];
var serverPlayerLocations = [];

function preload() {
    socket = io.connect(location.origin.replace(/^http/, 'ws'));

    socket.on('playerLocations', function(playerLocations) {
        serverPlayerLocations = [];
        //console.log(playerLocations.length);
        for (var i = 0; i < playerLocations.length; i++) {
            //console.log(playerLocations[i].id);
            if (playerLocations[i].id == socket.id) {
                serverLoc = playerLocations[i].loc;
                lastInputProcessed = playerLocations[i].lastInputSequence;
            } else {
                serverPlayerLocations.push(playerLocations[i]);
            }
        }
    });
}

function setup() {
    createCanvas(1280, 720);

    loc = createVector(100, 100);
}

function draw() {
    background(50);

    // Draw all of the other players
    for (var i = 0; i < serverPlayerLocations.length; i++) {
        fill(175);
        ellipse(serverPlayerLocations[i].loc.x, serverPlayerLocations[i].loc.y, 50, 50);
    }

    // Draw the main player
    fill(230);
    noStroke();
    ellipse(loc.x, loc.y, 50, 50);

    // Take the location sent by the server and reapply old inputs to calculate if still in the correct position. Corrects if necessary.
    if (serverLoc != null && (Math.floor(loc.x) != Math.floor(serverLoc.x) || Math.floor(loc.y) != Math.floor(serverLoc.y))) {
        var newLoc = createVector(serverLoc.x, serverLoc.y);
        while (inputHistory.length > 0) {
            if (inputHistory[0].sequence <= lastInputProcessed) inputHistory.shift();
            else break;
        }
        for (var i = 0; i < inputHistory.length; i++) {
            var calcLoc = playermovement.movePlayer({left: inputHistory[i].left, up: inputHistory[i].up, right: inputHistory[i].right, down: inputHistory[i].down}, 1000 / frameRate(), {x: newLoc.x, y: newLoc.y});
            newLoc.x = calcLoc.x;
            newLoc.y = calcLoc.y;
        }
        loc = p5.Vector.lerp(loc, newLoc, .1);
    }

    // Reads in all of the inputs, makes client side predictions and sends the inputs to the server
    if (keyIsDown(65) || keyIsDown(87) || keyIsDown(68) || keyIsDown(83)) {
        var newLoc = playermovement.movePlayer({left: keyIsDown(65), up: keyIsDown(87), right: keyIsDown(68), down: keyIsDown(83)}, 1000 / frameRate(), {x: loc.x, y: loc.y});
        loc.x = newLoc.x;
        loc.y = newLoc.y;
        //console.log('client location: ' + loc.x + ', ' + loc.y);
        inputHistory.push({sequence: sequenceCount, left: keyIsDown(65), up: keyIsDown(87), right: keyIsDown(68), down: keyIsDown(83)});
        //movementDelayQueue.push({sequence: sequenceCount, frame: frameCount, left: keyIsDown(65), up: keyIsDown(87), right: keyIsDown(68), down: keyIsDown(83)});
        socket.emit('input', {sequence: sequenceCount, left: keyIsDown(65), up: keyIsDown(87), right: keyIsDown(68), down: keyIsDown(83)})
        sequenceCount++
    }

    // Used to fake a high ping
    var ping = 0;
    if (movementDelayQueue.length > 0) {
        var movement = movementDelayQueue[0];
        if (frameCount - movement.frame >= ping / 1000 * frameRate()) {
            socket.emit('input', {sequence: movement.sequence, left: movement.left, up: movement.up, right: movement.right, down: movement.down});
            movementDelayQueue.shift();
        }
    }

    // Display the framerate
    fill(255);
    lastFrames.push(frameRate());
    if (lastFrames.length >= 60) { lastFrames.shift(); }
    var frames = 0;
    for (var i = 0; i < lastFrames.length; i++) { frames += lastFrames[i]; }
    textSize(12);
    textAlign(LEFT, BASELINE);
    text(parseInt(frames / lastFrames.length, 10), 1253, 25);
}