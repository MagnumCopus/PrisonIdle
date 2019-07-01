
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 5000);

app.use(express.static('public'));

console.log("My socket server is running!");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

var playerColors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8a2be2'];
var nextColorIndex = 0;
var onlinePlayers = 0;

// Mines
var mineData = [
	{
		name: 'AMine',
		resetLength: 3,
		lastReset: new Date().getTime(),
		timer: null,
		composition: [
			{
				name: 'dirt',
				percent: 70
			},
			{
				name: 'stone',
				percent: 25
			},
			{
				name: 'coal',
				percent: 5
			}
		],
		tiles: null
	},
	{
		name: 'BMine',
		resetLength: 4,
		lastReset: new Date().getTime(),
		timer: null,
		composition: [
			{
				name: 'dirt',
				percent: 45
			},
			{
				name: 'stone',
				percent: 45
			},
			{
				name: 'coal',
				percent: 10
			}
		],
		tiles: null
	},
	{
		name: 'CMine',
		resetLength: 5,
		lastReset: new Date().getTime(),
		timer: null,
		composition: [
			{
				name: 'stone',
				percent: 70
			},
			{
				name: 'coal',
				percent: 25
			},
			{
				name: 'copper',
				percent: 5
			}
		],
		tiles: null
	},
	{
		name: 'DMine',
		resetLength: 6,
		lastReset: new Date().getTime(),
		timer: null,
		composition: [
			{
				name: 'stone',
				percent: 45
			},
			{
				name: 'coal',
				percent: 45
			},
			{
				name: 'copper',
				percent: 10
			}
		],
		tiles: null
	},
	{
		name: 'EMine',
		resetLength: 7,
		lastReset: new Date().getTime(),
		timer: null,
		composition: [
			{
				name: 'coal',
				percent: 70
			},
			{
				name: 'copper',
				percent: 25
			},
			{
				name: 'iron',
				percent: 5
			}
		],
		tiles: null
	},
	{
		name: 'FMine',
		resetLength: 8,
		lastReset: new Date().getTime(),
		timer: null,
		composition: [
			{
				name: 'coal',
				percent: 45
			},
			{
				name: 'copper',
				percent: 45
			},
			{
				name: 'iron',
				percent: 10
			}
		],
		tiles: null
	}
];

for (var i = 0; i < mineData.length; i++) {
	resetMine(i);
	var timer = setInterval(resetMine, mineData[i].resetLength * 60000, i);
	mineData[i].timer = timer;
}

function resetMine(i) {
	var tiles = [];
	for (var j = 0; j < 220; j++) {
		var num = Math.random() * 100;
		var sum = 0;
		for (var k = 0; k < mineData[i].composition.length; k++) {
			if (num < mineData[i].composition[k].percent + sum) {
				var tile = {
					name: mineData[i].composition[k].name,
					intact: true
				};
				tiles.push(tile);
				break;
			}
			sum += mineData[i].composition[k].percent;
		}
	}
	mineData[i].tiles = tiles;
	mineData[i].lastReset = new Date().getTime();
	var data = {
		mine: mineData[i].name,
		resetLength: (mineData[i].resetLength * 60000),
		tiles: tiles
	};
	console.log('resetting mine: ' + mineData[i].name);
	io.emit('resetMine', data);
}

function newConnection(socket) {
	console.log('new connection: ' + socket.id);
	onlinePlayers++;

	// drawing
	socket.on('mouse', mouseMsg);
	socket.on('reset', resetMsg);

	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
		//console.log(data);
	}

	function resetMsg() {
		socket.broadcast.emit('reset');
	}

	// PrisonIdle
	socket.on('gameLoaded', function () {
		var d = new Date().getTime();
		var connectionData = {
			color: playerColors[(nextColorIndex++) % playerColors.length],
			onlinePlayers: onlinePlayers,
			mines: {
				AMine: {
					timeSinceReset: d - mineData[0].lastReset,
					resetLength: mineData[0].resetLength * 60000,
					tiles: mineData[0].tiles
				},
				BMine: {
					timeSinceReset: d - mineData[1].lastReset,
					resetLength: mineData[1].resetLength * 60000,
					tiles: mineData[1].tiles
				},
				CMine: {
					timeSinceReset: d - mineData[2].lastReset,
					resetLength: mineData[2].resetLength * 60000,
					tiles: mineData[2].tiles
				},
				DMine: {
					timeSinceReset: d - mineData[3].lastReset,
					resetLength: mineData[3].resetLength * 60000,
					tiles: mineData[3].tiles
				},
				EMine: {
					timeSinceReset: d - mineData[4].lastReset,
					resetLength: mineData[4].resetLength * 60000,
					tiles: mineData[4].tiles
				},
				FMine: {
					timeSinceReset: d - mineData[5].lastReset,
					resetLength: mineData[5].resetLength * 60000,
					tiles: mineData[5].tiles
				}
			}
		};
		socket.emit('connectInfo', connectionData)
		//console.log(connectionData);

		var newPlayerData = {
			onlinePlayers: onlinePlayers
		};
		socket.broadcast.emit('playerConnected', newPlayerData)
	});

	socket.on('playerMoved', function (data) {
		data.id = socket.id;
		socket.broadcast.emit('playerMoved', data);
		//console.log(data);
	});

	socket.on('breakBlock', function (data) {
		for (var i = 0; i < mineData.length; i++) {
			console.log(data.mine);
			if (mineData[i].name == data.mine) {
				mineData[i].tiles[data.index].intact = false;
				break;
			}
		}
		socket.broadcast.emit('breakBlock', data);
	});

	socket.on('disconnect', function () {
		var data = {
			id: socket.id,
			playerCount: onlinePlayers-1
		};
		socket.broadcast.emit('playerDisconnected', data);
		console.log('disconnected: ' + socket.id);
		onlinePlayers--;
	});
}