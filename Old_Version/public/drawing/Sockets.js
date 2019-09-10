var socket;

function setup() {
	createCanvas(400, 400);
	background(51);

	socket = io.connect(location.origin.replace(/^http/, 'ws'));
	socket.on('mouse', newDrawing);
	socket.on('reset', reset)
}

function newDrawing(data) {
	noStroke();
	fill(255, 0, 100);
	ellipse(data.x, data.y, 10, 10);
}

function mouseClicked() {
	if (mouseX >= 340 && mouseX <= 390 && mouseY >= 370 && mouseY <= 390) {
		reset();
		socket.emit('reset');
	}
}

function mouseDragged() {
	console.log('sending: {' + mouseX + ',' + mouseY + '}');

	var data = {
		x: mouseX,
		y: mouseY
	};
	socket.emit('mouse', data);

	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, 10, 10);
}

function reset() {
	console.log('reset');
	background(51);
}

function draw() {
	stroke(0);
	strokeWeight(2);
	fill(255);
	rect(340, 370, 50, 20);
	fill(0);
	strokeWeight(0);
	text('Reset', 348, 375, 50, 20);
}