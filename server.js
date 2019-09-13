
// Server startup code
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 5000);

app.use(express.static('public'));

console.log("My socket server is running!");

var socket = require('socket.io');
var io = socket(server);

var movement = require('./public/shared/playermovement');

var onlinePlayerCount = 0;
var listOfIds = [];
var connectedPlayers = [];

// Setup a new connection (DOESNT SEND ANY DATA)
io.sockets.on('connection', function (socket) {
	connectedPlayers[socket.id] = {socket: socket, state: {loc: {x: 100, y: 100}, vel: {x: 0, y: 0}}, queuedInputs: [], queuedInputCount: 0, lastInputProcessed: -1};
	listOfIds.push(socket.id);
	onlinePlayerCount++;
	console.log('new connection (' + onlinePlayerCount + '): ' + socket.id);

	socket.on('input', function (input) {
		connectedPlayers[socket.id].queuedInputs.push(input);
		//console.log(input);
		connectedPlayers[socket.id].queuedInputCount++;
	});

	socket.on('pinged', function () {
    	socket.emit('ponged');
  	});

	socket.on('disconnect', function () {
		connectedPlayers.splice(socket.id);
		for (var i = 0; i < listOfIds.length; i++) {
			if (listOfIds[i] == socket.id) {
				listOfIds.splice(i);
				break;
			}
		}
		onlinePlayerCount--;
		console.log('disconnected (' + onlinePlayerCount + '): ' + socket.id);
	});
});

// Core update loop
var updatesPerSecond = 20;
setInterval(function () {
	var playerStates = [];
	for (var i = 0; i < onlinePlayerCount; i++) {
		try {
			var player = connectedPlayers[listOfIds[i]];

			// Apply any queued inputs
			while (player.queuedInputCount > 0) {
				player.state = movement.applyInput(player.queuedInputs[0], player.queuedInputs[0].dtime, player.state, {width: 32, height: 67});
				player.lastInputProcessed = player.queuedInputs[0].sequence;
				player.queuedInputs.shift();
				player.queuedInputCount--;
			}

			// Prep the updated player object to be sent out
			playerStates.push({
				id: player.socket.id,
				lastInputProcessed: player.lastInputProcessed,
				loc: player.state.loc,
				vel: player.state.vel
			});
		} catch (err) {};
	}

	// Call this once at the end of the function to update all player locations
	io.emit('playerLocations', playerStates);
}, 1000 / updatesPerSecond);