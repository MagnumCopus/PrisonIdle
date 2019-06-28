
var prisoner;
var money = 0;
var lastSelectedTile = -1;
var currentlyBreaking = -1;
var lastFrames = [];
var miningSpeed = 1;

var currentMine;
var shop;
var AMine;
var BMine;

var TILESIZE = 40;
var GRAVITY = .2;

function preload() {
  
}

function setup() {
    createCanvas(1280, 720);
    
    shop = new Shop();
    AMine = new AMine();
    BMine = new BMine();
    
    console.log(shop);
    shop.setRightRoom(AMine);
    AMine.setLeftRoom(shop);
    AMine.setRightRoom(BMine);
    BMine.setLeftRoom(AMine);
    
    prisoner = new Prisoner();
    currentMine = AMine;
    
    loadState();
}

function draw() {
    background(0);
    fill(33, 30, 22);
    rect(0, 280, 1280, 440);
    fill(134, 198, 250);
    rect(0, 0, 1290, 280);
    
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

function saveState() {
    localStorage.setItem('money', JSON.stringify(money));
    localStorage.setItem('mine', JSON.stringify(AMine.tiles));
    localStorage.setItem('xLoc', JSON.stringify(prisoner.getX()));
    localStorage.setItem('yLoc', JSON.stringify(prisoner.getY()));
    localStorage.setItem('dirtCount', JSON.stringify(tileDetails[0].count));
    localStorage.setItem('stoneCount', JSON.stringify(tileDetails[1].count));
    localStorage.setItem('coalCount', JSON.stringify(tileDetails[2].count));
}

function loadState() {
    localStorage.removeItem('mine');
    if (JSON.parse(localStorage.getItem('money')) != null) money = parseFloat(JSON.parse(localStorage.getItem('money')));
    if (JSON.parse(localStorage.getItem('mine')) != null) AMine.tiles = JSON.parse(localStorage.getItem('mine'));
    if (JSON.parse(localStorage.getItem('xLoc')) != null) prisoner.setX(JSON.parse(localStorage.getItem('xLoc')));
    if (JSON.parse(localStorage.getItem('yLoc')) != null) prisoner.setY(JSON.parse(localStorage.getItem('yLoc')));
    if (JSON.parse(localStorage.getItem('dirtCount')) != null) tileDetails[0].count = parseInt(JSON.parse(localStorage.getItem('dirtCount')));
    if (JSON.parse(localStorage.getItem('stoneCount')) != null) tileDetails[1].count = parseInt(JSON.parse(localStorage.getItem('stoneCount')));
    if (JSON.parse(localStorage.getItem('coalCount')) != null) tileDetails[2].count = parseInt(JSON.parse(localStorage.getItem('coalCount')));
    console.log(AMine.tiles);
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