
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

var tileDetails;
var inventory = [];

var TILESIZE = 40;
var GRAVITY = .2;

var wallSprite;
var ladderLeftSprite;
var ladderRightSprite;
var breakAnimation
var dirtSprite;
var stoneSprite;
var coalSprite;

function preload() {
  
}

function setup() {
    createCanvas(1280, 720);
    
    wallSprite = loadImage('Resources/wall.png');
    ladderLeftSprite = loadImage('Resources/ladderLeft.png');
    ladderRightSprite = loadImage('Resources/ladderRight.png');
    breakAnimation = loadImage('Resources/breakAnimation.png');
    dirtSprite = loadImage('Resources/dirt.png');
    stoneSprite = loadImage('Resources/stone.png');
    coalSprite = loadImage('Resources/coal.png');
    
    tileDetails = [
        {name:'dirt',    id: 0, breakTime: 500, tColor: '#735A37', price: .1, count: 0, sprite: dirtSprite},
        {name:'stone',   id: 1, breakTime: 1000, tColor: '#939393', price: .3, count: 0, sprite: stoneSprite},
        {name:'coal',    id: 2, breakTime: 3000, tColor: '#2C2925', price: 1.0, count: 0, sprite: coalSprite}
    ];
    
    this.inventory.push(new SellBlock(80, 120, 0));
    this.inventory.push(new SellBlock(160, 120, 1));
    this.inventory.push(new SellBlock(240, 120, 2));
    
    shop = new Shop();
    AMine = new AMine();
    BMine = new BMine();
    
    //console.log(shop);
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
    
    currentMine.display();
    currentMine.update();
    
    fill(34);
    //rect(80, 40, 120, 40);
    //fill(255);
    textSize(20);
    textAlign(LEFT, BASELINE);
    text("$ " + money.toFixed(2), 90, 67);
    
    if (currentMine.name != "Shop") {
        for (var i = 0; i < inventory.length; i++) {
            //this.inventory[i].display();
        }  
    }
    
    AMine.checkReset();
    BMine.checkReset();
    
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
    
    if (frameCount % 360 == 0) saveState();
}

function saveState() {
    console.log("Saved.");
    localStorage.setItem('money', JSON.stringify(money));
    localStorage.setItem('currentMine', JSON.stringify(currentMine.name));
    localStorage.setItem('ATiles', JSON.stringify(AMine.tiles));
    //console.log(AMine.lastReset);
    localStorage.setItem('AReset', JSON.stringify(AMine.lastReset));
    localStorage.setItem('BTiles', JSON.stringify(BMine.tiles));
    localStorage.setItem('BReset', JSON.stringify(BMine.lastReset));
    localStorage.setItem('sellQuantity', JSON.stringify(sellQuantity));
    localStorage.setItem('dirtCount', JSON.stringify(tileDetails[0].count));
    localStorage.setItem('stoneCount', JSON.stringify(tileDetails[1].count));
    localStorage.setItem('coalCount', JSON.stringify(tileDetails[2].count));
}

function loadState() {
    //localStorage.removeItem('AReset');
    if (JSON.parse(localStorage.getItem('money')) != null) money = parseFloat(JSON.parse(localStorage.getItem('money')));
    if (JSON.parse(localStorage.getItem('currentMine')) != null) var mineName = JSON.parse(localStorage.getItem('currentMine'));
    switch(mineName) {
        case "Shop":
            currentMine = shop;
            break;
        case "A":
            currentMine = AMine;
            break;
        case "B":
            currentMine = BMine;
            break;
        default:
            currentMine = AMine;
            break;
    }
    if (JSON.parse(localStorage.getItem('ATiles')) != null) {
        var tmpTiles = JSON.parse(localStorage.getItem('ATiles'));
        for (var i = 0; i < AMine.tiles.length; i++) {
            AMine.tiles[i].setID(tmpTiles[i].id);
            AMine.tiles[i].intact = tmpTiles[i].intact;
        }
    }
    if (JSON.parse(localStorage.getItem('AReset')) != null) AMine.lastReset = parseFloat(JSON.parse(localStorage.getItem('AReset')));
    if (JSON.parse(localStorage.getItem('BTiles')) != null) {
        var tmpTiles = JSON.parse(localStorage.getItem('BTiles'));
        for (var i = 0; i < BMine.tiles.length; i++) {
            BMine.tiles[i].setID(tmpTiles[i].id);
            BMine.tiles[i].intact = tmpTiles[i].intact;
        }
    }
    if (JSON.parse(localStorage.getItem('BReset')) != null) BMine.lastReset = parseFloat(JSON.parse(localStorage.getItem('BReset')));
    if (JSON.parse(localStorage.getItem('sellQuantity')) != null) {
        if (JSON.parse(localStorage.getItem('sellQuantity')) == "All") sellQuantity = "All";
        else sellQuantity = parseInt(JSON.parse(localStorage.getItem('sellQuantity')));
    }
    if (JSON.parse(localStorage.getItem('dirtCount')) != null) tileDetails[0].count = parseInt(JSON.parse(localStorage.getItem('dirtCount')));
    if (JSON.parse(localStorage.getItem('stoneCount')) != null) tileDetails[1].count = parseInt(JSON.parse(localStorage.getItem('stoneCount')));
    if (JSON.parse(localStorage.getItem('coalCount')) != null) tileDetails[2].count = parseInt(JSON.parse(localStorage.getItem('coalCount')));
    //console.log(currentMine.tiles);
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