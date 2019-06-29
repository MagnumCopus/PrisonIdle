
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
var CMine;
var DMine;

var tileDetails;
var pickaxeDetails;
var doorDetails;
var upgradeDetails;
var inventory = [];
var doors = [];
var recipes = [];

var TILESIZE = 40;
var GRAVITY = .2;

var font;
var wallSprite;
var ladderLeftSprite;
var ladderRightSprite;
var breakAnimation
var dirtSprite;
var stoneSprite;
var coalSprite;
var ironSprite;

var woodenPickaxeSprite;
var stonePickaxeSprite;
var ironPickaxeSprite;

function preload() {
  font = loadFont('Resources/Pixellari.ttf');
}

function setup() {
    createCanvas(1280, 720);
    
    textFont(font);
    wallSprite = loadImage('Resources/wall.png');
    ladderLeftSprite = loadImage('Resources/ladderLeft.png');
    ladderRightSprite = loadImage('Resources/ladderRight.png');
    breakAnimation = loadImage('Resources/breakAnimation.png');
    dirtSprite = loadImage('Resources/dirt.png');
    stoneSprite = loadImage('Resources/stone.png');
    coalSprite = loadImage('Resources/coal.png');
    ironSprite = loadImage('Resources/iron.png');
    
    woodenPickaxeSprite = loadImage('Resources/woodenPickaxe.png');
    stonePickaxeSprite = loadImage('Resources/stonePickaxe.png');
    ironPickaxeSprite = loadImage('Resources/ironPickaxe.png');
    
    tileDetails = [
        {name: 'dirt',    id: 0, breakTime: 500, tColor: '#735A37', price: .1, count: 0, info: "Name: Dirt    Sell For: $0.10    Locations: A, B    Description: Diggy diggy hole", minimumMine: 0, sprite: dirtSprite},
        {name: 'stone',   id: 1, breakTime: 1000, tColor: '#939393', price: .3, count: 0, info: "Name: Stone    Sell For: $0.30    Locations: A, B, C, D    Description: ", minimumMine: 0, sprite: stoneSprite},
        {name: 'coal',    id: 2, breakTime: 2000, tColor: '#2C2925', price: 1.0, count: 0, info: "Name: Coal    Sell For: $1.00    Locations: A, B, C, D, E    Description: Almost like diamonds", minimumMine: 0, sprite: coalSprite},
        {name: 'iron',    id: 3, breakTime: 5000, tColor: '#F0D4B5', price: 3.0, count: 0, info: "Name: Iron    Sell For: $3.00    Locations: C, D, E    Description: ", minimumMine: 2, sprite: ironSprite}
    ];
    
    recipes = [
        {name: 'stonePickaxe', id: 0, parts: [
            {id: 1, count: 50}
        ]},
        {name: 'ironPickaxe', id: 1, parts: [
            {id: 2, count: 100},
            {id: 3, count: 50}
        ]}
    ];
    
    pickaxeDetails = [
        {name: 'default', id: 0, miningSpeed: 1, cost: 0, info: 'Name: Wooden Pickaxe    Cost: $0.00    Speed: 1.0x', sprite: woodenPickaxeSprite},
        {name: 'stone', id: 1, miningSpeed: 1.5, recipe: recipes[0], info: 'Name: Stone Pickaxe    Cost: 50 Stone    Speed: 1.5x', sprite: stonePickaxeSprite},
        {name: 'iron', id: 2, miningSpeed: 2, recipe: recipes[1], info: 'Name: Iron Pickaxe    Cost: 50 Iron and 100 Coal    Speed: 2x', sprite: ironPickaxeSprite}
    ];
    
    doors = [
        new Door(1240, 200, 12, 80, "BMineEntrance"),
        new Door(1240, 200, 12, 80, "CMineEntrance"),
        new Door(1240, 200, 12, 80, "DMineEntrance")
    ];
    
    doorDetails = [
        {name: 'A', id: 0, cost: 0, info: "Name: A-Mine Entrance    Cost: $0.00    Description: You shouldn't be reading this."},
        {name: 'B', id: 1, cost: 100, info: 'Name: B-Mine Entrance    Cost: $100.00    Description: To finity and beyond...', door: doors[0]},
        {name: 'C', id: 2, cost: 250, info: 'Name: C-Mine Entrance    Cost: $250.00    Description: Iron > Stone', door: doors[1]},
        {name: 'D', id: 3, cost: 500, info: 'Name: D-Mine Entrance    Cost: $500.00    Description: ', door: doors[2]}
    ];
    
    upgradeDetails = [
        {name: 'pickaxe', id: 0, progression: pickaxeDetails, current: 0},
        {name: 'doors', id: 1, progression: doorDetails, current: 0}
    ];
    
    this.inventory.push(new SellBlock(80, 120, 0));
    this.inventory.push(new SellBlock(160, 120, 1));
    this.inventory.push(new SellBlock(240, 120, 2));
    
    shop = new Shop();
    AMine = new AMine();
    BMine = new BMine();
    CMine = new CMine();
    DMine = new DMine();
    
    //console.log(shop);
    shop.setRightRoom(AMine);
    AMine.setLeftRoom(shop);
    AMine.setRightRoom(BMine);
    BMine.setLeftRoom(AMine);
    BMine.setRightRoom(CMine);
    CMine.setLeftRoom(BMine);
    CMine.setRightRoom(DMine);
    DMine.setLeftRoom(CMine);
    
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
    CMine.checkReset();
    DMine.checkReset();
    
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
    localStorage.setItem('pickaxe', JSON.stringify(upgradeDetails[0].current));
    localStorage.setItem('doors', JSON.stringify(upgradeDetails[1].current));
    localStorage.setItem('currentMine', JSON.stringify(currentMine.name));
    localStorage.setItem('ATiles', JSON.stringify(AMine.tiles));
    //console.log(AMine.lastReset);
    localStorage.setItem('AReset', JSON.stringify(AMine.lastReset));
    localStorage.setItem('BTiles', JSON.stringify(BMine.tiles));
    localStorage.setItem('BReset', JSON.stringify(BMine.lastReset));
    localStorage.setItem('CTiles', JSON.stringify(CMine.tiles));
    localStorage.setItem('CReset', JSON.stringify(CMine.lastReset));
    localStorage.setItem('DTiles', JSON.stringify(DMine.tiles));
    localStorage.setItem('DReset', JSON.stringify(DMine.lastReset));
    localStorage.setItem('sellQuantity', JSON.stringify(sellQuantity));
    localStorage.setItem('dirtCount', JSON.stringify(tileDetails[0].count));
    localStorage.setItem('stoneCount', JSON.stringify(tileDetails[1].count));
    localStorage.setItem('coalCount', JSON.stringify(tileDetails[2].count));
    localStorage.setItem('ironCount', JSON.stringify(tileDetails[3].count));
}

function loadState() {
    //localStorage.removeItem('AReset');
    if (JSON.parse(localStorage.getItem('money')) != null) money = parseFloat(JSON.parse(localStorage.getItem('money')));
    if (JSON.parse(localStorage.getItem('doors')) != null) {
        upgradeDetails[1].current = parseInt(JSON.parse(localStorage.getItem('doors')));
        for (var i = 1; i < upgradeDetails[1].current+1; i++) {
             upgradeDetails[1].progression[i].door.openDoor();
        }
    }
    if (JSON.parse(localStorage.getItem('pickaxe')) != null) {
        upgradeDetails[0].current = parseInt(JSON.parse(localStorage.getItem('pickaxe')));
        miningSpeed = upgradeDetails[0].progression[upgradeDetails[0].current].miningSpeed;   
    }
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
        case "C":
            currentMine = CMine;
            break;
        case "D":
            currentMine = DMine;
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
    if (JSON.parse(localStorage.getItem('CTiles')) != null) {
        var tmpTiles = JSON.parse(localStorage.getItem('CTiles'));
        for (var i = 0; i < CMine.tiles.length; i++) {
            CMine.tiles[i].setID(tmpTiles[i].id);
            CMine.tiles[i].intact = tmpTiles[i].intact;
        }
    }
    if (JSON.parse(localStorage.getItem('CReset')) != null) CMine.lastReset = parseFloat(JSON.parse(localStorage.getItem('CReset')));
    if (JSON.parse(localStorage.getItem('DTiles')) != null) {
        var tmpTiles = JSON.parse(localStorage.getItem('DTiles'));
        for (var i = 0; i < DMine.tiles.length; i++) {
            DMine.tiles[i].setID(tmpTiles[i].id);
            DMine.tiles[i].intact = tmpTiles[i].intact;
        }
    }
    if (JSON.parse(localStorage.getItem('DReset')) != null) DMine.lastReset = parseFloat(JSON.parse(localStorage.getItem('DReset')));
    if (JSON.parse(localStorage.getItem('sellQuantity')) != null) {
        if (JSON.parse(localStorage.getItem('sellQuantity')) == "All") sellQuantity = "All";
        else sellQuantity = parseInt(JSON.parse(localStorage.getItem('sellQuantity')));
    }
    if (JSON.parse(localStorage.getItem('dirtCount')) != null) tileDetails[0].count = parseInt(JSON.parse(localStorage.getItem('dirtCount')));
    if (JSON.parse(localStorage.getItem('stoneCount')) != null) tileDetails[1].count = parseInt(JSON.parse(localStorage.getItem('stoneCount')));
    if (JSON.parse(localStorage.getItem('coalCount')) != null) tileDetails[2].count = parseInt(JSON.parse(localStorage.getItem('coalCount')));
    if (JSON.parse(localStorage.getItem('ironCount')) != null) tileDetails[3].count = parseInt(JSON.parse(localStorage.getItem('ironCount')));
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