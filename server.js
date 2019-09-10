
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
	connectedPlayers[socket.id] = {socket: socket, loc: {x: 100, y: 100}, queuedInputs: [], queuedInputCount: 0, lastInputSequence: -1};
	listOfIds.push(socket.id);
	onlinePlayerCount++;
	console.log('new connection (' + onlinePlayerCount + '): ' + socket.id);

	socket.on('input', function (input) {
		connectedPlayers[socket.id].queuedInputs.push(input);
		//console.log(input);
		connectedPlayers[socket.id].queuedInputCount++;
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
var updatesPerSecond = 10;
setInterval(function () {
	var playerLocations = [];
	for (var i = 0; i < onlinePlayerCount; i++) {
		try {
			var player = connectedPlayers[listOfIds[i]];
			for (var j = 0; j < 10 && player != null && player.queuedInputCount > 0; j++) {
				player.loc = movement.movePlayer(player.queuedInputs[0], 1000 / updatesPerSecond, player.loc);
				player.lastInputSequence = player.queuedInputs[0].sequence;
				player.queuedInputs.shift();
				player.queuedInputCount--;
				//console.log('input processed: ' + player.loc.x + ', ' + player.loc.y);
			}
			playerLocations.push({
				id: player.socket.id,
				lastInputSequence: player.lastInputSequence,
				loc: player.loc
			});
		} catch (err) {};
	}

	// Call this once at the end of the function to update all player locations
	//console.log(playerLocations);
	io.emit('playerLocations', playerLocations);
}, 1000 / updatesPerSecond);