
var socket;

var pingStart;
var latency = 0;
var lastFrames = [];

var loc;
var vel;
var sequenceCount = 0;
var inputHistory = [];
var movementDelayQueue = [];

//var serverLoc;
//var lastInputProcessed;

var players = [];
var serverPlayerLocations = [];

function preload() {
    socket = io.connect(location.origin.replace(/^http/, 'ws'));

    socket.on('playerLocations', function(playerLocations) {
        serverPlayerLocations = playerLocations;
        for (var i = 0; i < playerLocations.length; i++) {
            if (players[playerLocations[i].id] == null && playerLocations[i].id != socket.id) {
                players[playerLocations[i].id] = playerLocations[i];
            }
        }
    });

    // Fetch the ping of the client
    setInterval(function() {
        pingStart = Date.now();
        socket.emit('pinged');
    }, 2000);

    socket.on('ponged', function() {
        latency = Date.now() - pingStart;
    });
}

function setup() {
    createCanvas(1280, 720);
    frameRate(60);

    loc = createVector(100, 100);
    vel = createVector(0, 0);
}

function draw() {
    background(50);
    drawPlayers();

    updatePlayerLocations();
    readInput();

    drawFramerate();
    drawPing();
}

function drawPlayers() {
    noStroke();

    // Draw all the other players
    for (var i = 0; i < serverPlayerLocations.length; i++) {
        var id = serverPlayerLocations[i].id;
        if (id != socket.id) {
            fill(175)
            rect(players[id].loc.x, players[id].loc.y, 32, 67);
        }
    }

    // Draw the main player
    fill(230);
    rect(loc.x, loc.y, 32, 67);
}

function updatePlayerLocations() {
    for (var i = 0; i < serverPlayerLocations.length; i++) {
        var id = serverPlayerLocations[i].id;
        // Main player - Take the location sent by the server and reapply old inputs to calculate if still in the correct position. Corrects if necessary.
        if (id == socket.id) {
            var serverLoc = serverPlayerLocations[i].loc;
            var serverVel = serverPlayerLocations[i].vel;
            var lastInputProcessed = serverPlayerLocations[i].lastInputProcessed;
            if (serverLoc != null && (Math.floor(loc.x) != Math.floor(serverLoc.x) || Math.floor(loc.y) != Math.floor(serverLoc.y))) {
                var newLoc = createVector(serverLoc.x, serverLoc.y);
                var newVel = createVector(serverVel.x, serverVel.y);
                while (inputHistory.length > 0) {
                    if (inputHistory[0].sequence < lastInputProcessed) inputHistory.shift();
                    else break;
                }
                while (lastInputProcessed < frameCount && inputHistory.length > 0) {
                    var calcState = playermovement.applyInput({left: inputHistory[0].left, up: inputHistory[0].up, right: inputHistory[0].right, down: inputHistory[0].down}, inputHistory[i].dtime, {loc: {x: newLoc.x, y: newLoc.y}, vel: {x: newVel.x, y: newVel.y}}, {width: 32, height: 67});
                    inputHistory.shift();
                    newLoc = createVector(calcState.loc.x, calcState.loc.y);
                    newVel = createVector(calcState.vel.x, calcState.vel.y);
                    lastInputProcessed++
                }
                //fill(150);
                //rect(serverLoc.x, serverLoc.y, 32, 67);
                loc = p5.Vector.lerp(loc, newLoc, .1);
                vel = p5.Vector.lerp(vel, newVel, .1);
            }
        } 
        // All other players - Interpolate from current position to where it should be
        else {
            var newLoc = p5.Vector.lerp(
                createVector(players[id].loc.x, players[id].loc.y),
                createVector(serverPlayerLocations[i].loc.x, serverPlayerLocations[i].loc.y), .1);
            players[id].loc.x = newLoc.x;
            players[id].loc.y = newLoc.y;
        }
    }
}

function readInput() {
    // Reads in all of the inputs and sends the inputs to the server
    var dTime = 1000 / frameRate();
    var leftPressed = keyIsDown(65);
    var upPressed = keyIsDown(87);
    var rightPressed = keyIsDown(68);
    var downPressed = keyIsDown(83);
    if (leftPressed || upPressed || rightPressed || downPressed) {
        inputHistory.push({sequence: frameCount, dtime: dTime, left: leftPressed, up: upPressed, right: rightPressed, down: downPressed});
        socket.emit('input', {sequence: frameCount, dtime: dTime, left: leftPressed, up: upPressed, right: rightPressed, down: downPressed})
        // Predict where the player should be
        var newState = playermovement.applyInput({left: leftPressed, up: upPressed, right: rightPressed, down: downPressed}, dTime, {loc: {x: loc.x, y: loc.y}, vel: {x: vel.x, y: vel.y}}, {width: 32, height: 67});
        loc = createVector(newState.loc.x, newState.loc.y);
        vel = createVector(newState.vel.x, newState.vel.y);
    }

    // Apply physics locally
    var newState = playermovement.applyPhysics(dTime, {loc: {x: loc.x, y: loc.y}, vel: {x: vel.x, y: vel.y}}, {width: 32, height: 67});
    loc = createVector(newState.loc.x, newState.loc.y);
    vel = createVector(newState.vel.x, newState.vel.y);
}

function drawFramerate() {
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

function drawPing() {
    // Display the framerate
    fill(255);
    textSize(12);
    textAlign(LEFT, BASELINE);
    text(parseInt(latency / 2, 10) + ' ms', 20, 25);
}