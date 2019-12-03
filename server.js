
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 5000);

app.use(express.static('public'));

console.log("My socket server is running!");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

var pg = require('pg');
var connectionString = "postgres://xiaugxggeulqec:dd8d182d239965355bf8f2470e0447ff6f40d760a7f2f9991c1321ef818eef7f@ec2-107-20-243-220.compute-1.amazonaws.com:5432/d5biffl9ngurdf?ssl=true";
var pgClient = new pg.Client(connectionString);
pgClient.connect();

var mineData = [];
var playerColors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8a2be2'];
var nextColorIndex = 0;
var onlinePlayers = 0;

// Fill in all the mines once and set their timers
pgClient.query("SELECT COUNT(*) FROM mines", function(exc, res) {
	for (var i = 0; i < res.rows[0].count; i++) {
		mineData.push({});
		resetMine(i);
	}
});

function resetMine(i) {
	if (mineData[i]['timer'] != null) clearInterval(mineData[i]['timer']);
	// Get new mine information and send it out
	pgClient.query("SELECT * FROM mines WHERE ID=" + i, function(exc, res) {
		//console.log(res);
		var row = res.rows[0];
		var i = row.id;
		mineData[i]['name'] = row.name;
	    mineData[i]['resetLength'] = row.resetlength;
	    mineData[i]['lastReset'] = new Date().getTime();
	    mineData[i]['composition'] = [];
	    mineData[i]['tiles'] = [];
	    var comp = row.composition.trim().split(' ');
	    for (var j = 0; j < comp.length; j++) {
	    	var data = comp[j].split(':');
	    	mineData[i].composition.push({
	    		name: data[0],
	    		percent: parseInt(data[1])
	    	});
	    }
	    //console.log(mineData[i]);

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

		var timer = setInterval(resetMine, mineData[i].resetLength * 60000, i);
		mineData[i]['timer'] = timer;
	});
}

function newConnection(socket) {
	console.log('new connection: ' + socket.id);
	onlinePlayers++;

	// PrisonIdle
	socket.on('gameLoaded', function (savekey) {
		if (savekey == null) {
			savekey = generateSaveKey(50);
			pgClient.query("INSERT INTO users (savekey) VALUES ('" + savekey + "')", function(exc, res) {
				if (exc != null) console.log(exc);
				else console.log('user successfully added');
			});
		}

		pgClient.query("SELECT * FROM users WHERE savekey='" + savekey + "'", function(exc, res) {
			var row = res.rows[0];
			var d = new Date().getTime();
			var connectionData = {
				savekey: savekey,
				savedata: {
					money: row.money,
					pickaxe: row.pickaxe,
					door: row.door,
					currentMine: row.currentroom,
					sellQuantity: row.sellquantity,
					dirt: row.dirt,
					stone: row.stone,
					coal: row.coal,
					copper: row.copper,
					iron: row.iron
				},
				color: playerColors[(nextColorIndex++) % playerColors.length],
				onlinePlayers: onlinePlayers,
				mines: []
			};
			for (var i = 0; i < mineData.length; i++) {
				connectionData.mines.push({
					name: mineData[i].name,
					timeSinceReset: d - mineData[i].lastReset,
					resetLength: mineData[i].resetLength * 60000,
					tiles: mineData[i].tiles
				});
			}
			socket.emit('connectInfo', connectionData)
			//console.log(connectionData);

			var newPlayerData = {
				onlinePlayers: onlinePlayers
			};
			socket.broadcast.emit('playerConnected', newPlayerData)
		});
	});

	socket.on('saveGame', function (data) {
		console.log('trying to save...');
		var query = "UPDATE users SET money = " + data.money
			+ ", pickaxe = " + data.pickaxe
	        + ", door = " + data.doors
	        + ", currentroom = '" + data.currentMine
	        + "', sellquantity = " + data.sellQuantity
	        + ", dirt = " + data.dirt
	        + ", stone = " + data.stone
	        + ", coal = " + data.coal
	        + ", copper = " + data.copper
	        + ", iron = " + data.iron
	        + " WHERE savekey='" + data.savekey + "'";
		pgClient.query(query, function(exc, res) {
			if (exc != null) console.log(exc);
			else console.log('player successfully saved');
		});
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

function generateSaveKey(length) {
	var result           = '';
   	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   	var charactersLength = characters.length;
   	for ( var i = 0; i < length; i++ ) {
    	result += characters.charAt(Math.floor(Math.random() * charactersLength));
   	}
   	return result;
}