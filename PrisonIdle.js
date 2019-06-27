
var prisoner;
var money = 0;
var lastSelectedTile = -1;
var currentlyBreaking = -1;
var lastFrames = [];

var currentMine;
var shop;
var AMine;

var TILESIZE = 40;
var GRAVITY = .2;

function preload() {
  
}

function setup() {
    createCanvas(1280, 720);
    
    shop = new Shop();
    AMine = new AMine();
    
    console.log(shop);
    shop.setRightRoom(AMine);
    AMine.setLeftRoom(shop);
    
    prisoner = new Prisoner();
    currentMine = shop;
}

function draw() {
    background(0);
    fill(33, 30, 22);
    rect(0, 280, 1280, 440);
    fill(134, 198, 250);
    rect(0, 0, 1290, 280);
    
    fill(34, 34, 34);
    textAlign(CENTER, BASELINE);
    textSize(200);
    text(currentMine.name, 40, 50, 1200, 300);
    
    currentMine.display();
    currentMine.update();
    
    prisoner.display();
    prisoner.update();
    
    fill(255);
    lastFrames.push(frameRate());
    if (lastFrames.length >= 20) { lastFrames.shift(); }
    var frames = 0;
    for (var i = 0; i < lastFrames.length; i++) { frames += lastFrames[i]; }
    textSize(12);
    textAlign(LEFT, BASELINE);
    text(parseInt(frames / lastFrames.length, 10), 1253, 25);
}

function mousePressed() {
    if (lastSelectedTile >= 0) {
        if (currentMine.tiles[lastSelectedTile].getHovering()) {
            currentMine.tiles[lastSelectedTile].destroy();
            currentlyBreaking = lastSelectedTile;
        }
    }
}

function mouseReleased() {
    if (currentlyBreaking >= 0) {
        if (currentMine.tiles[currentlyBreaking].getHovering()) {
            currentMine.tiles[currentlyBreaking].restore();
            currentlyBreaking = -1;
        }
    }
}

function mouseDragged() {
    if (currentlyBreaking >= 0) {
        if (!currentMine.tiles[currentlyBreaking].getHovering()) {
            currentMine.tiles[currentlyBreaking].restore();
            currentlyBreaking = -1;
        }
    }
    if (lastSelectedTile >= 0) {
        if (currentMine.tiles[lastSelectedTile].getHovering()) {
            currentMine.tiles[lastSelectedTile].destroy();
            currentlyBreaking = lastSelectedTile;
        }
    }
}
