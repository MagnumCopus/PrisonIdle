
var prisoner;
var walls = [];
var tiles = [];
var lastSelectedTile = -1;
var currentlyBreaking = -1;
var lastFrames = []

var TILESIZE = 40;
var GRAVITY = .2;

function preload() {
  
}

function setup() {
    createCanvas(1280, 720);
    
    prisoner = new Prisoner();
    walls.push(new Wall(0, 0, 40, 280));
    walls.push(new Wall(0, 280, 160, 40));
    walls.push(new Wall(120, 320, 40, 400));
    walls.push(new Wall(160, 680, 960, 40));
    walls.push(new Wall(1120, 320, 40, 400));
    walls.push(new Wall(1120, 280, 160, 40));
    walls.push(new Wall(1240, 0, 40, 280));
    for (var y = 0; y < 10; y++) {
        for (var x = 0; x < 24; x++) {
            var id = random(100);
            if (id < 70) id = 0;
            else if (id < 95) id = 1;
            else id = 2;
            tiles.push(new Tile(160 + x * 40, 280 + y * 40, (y * 24) + x, id, 2000));
        }
    }
}

function draw() {
    background(0);
    fill(33, 30, 22);
    rect(0, 280, 1280, 440);
    fill(134, 198, 250);
    rect(40, 0, 1200, 280);
    
    fill(34, 34, 34);
    textSize(200);
    text("A", 575, 200);
    
    for (var i = 0; i < walls.length; i++) {
        walls[i].display();
    }
    
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].checkMouse();
        tiles[i].update();
        tiles[i].display();
    }
    
    prisoner.display();
    prisoner.update();
    
    fill(255);
    lastFrames.push(frameRate());
    if (lastFrames.length >= 20) lastFrames.shift();
    var frames = 0;
    for (var i = 0; i < lastFrames.length; i++) frames += lastFrames[i];
    textSize(12);
    text(parseInt(frames / lastFrames.length, 10), 1253, 25);
}

function Prisoner() {
    var pWidth = TILESIZE * (9/10);
    var pHeight = (2*TILESIZE) * (5/6);
    
    var loc = createVector(width/2 - TILESIZE/2, 100);
    var vel = createVector(0, 0);
    var horizontalAcceleration = .5;
    var jumpAcceleration = 4.5;
    var maxHorizontalSpeed = 4;
    var inAir = true;
    var jumpReleased = true;
  
    this.display = function() {
        push();
        translate(loc.x, loc.y);
        noStroke();
        fill(250, 164, 78); // orange
        rect(0, 0, pWidth, pHeight);
        pop();
    }
    
    this.update = function() {
        var horizontalKeyPressed = false;
        var onFloor = false;
        
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            if (!inAir) vel.x -= horizontalAcceleration;
            else vel.x -= horizontalAcceleration/2;
            horizontalKeyPressed = true;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            if (!inAir) vel.x += horizontalAcceleration;
            else vel.x += horizontalAcceleration/2;
            horizontalKeyPressed = true;
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            if (jumpReleased && !inAir) {
                vel.y -= jumpAcceleration;
                jumpReleased = false;
            }
        } else {
            jumpReleased = true;   
        }
        
        vel.y += GRAVITY;
        if (vel.x > maxHorizontalSpeed) vel.x = maxHorizontalSpeed;
        if (vel.x < -maxHorizontalSpeed) vel.x = -maxHorizontalSpeed;
        
        // Check window borders
        if (loc.x + vel.x < 0) {
            loc.x = 0;
            vel.x = 0;
        }
        if (loc.y + vel.y < 0) {
            loc.y = 0;
            vel.y = 0;
        }
        if (loc.x + vel.x + pWidth > width) {
            loc.x = width - pWidth;
            vel.x = 0;
        }
        if (loc.y + vel.y + pHeight > height) {
            loc.y = height - pHeight;
            vel.y = 0;
            if (!horizontalKeyPressed) vel.x = vel.x/1.3;
            onFloor = true;
        }
        
        // Barrier Collisions
        for (var i = 0; i < walls.length; i++) {
            // Right Wall
            if (loc.x + vel.x < walls[i].getX() + walls[i].getWidth() && loc.x + vel.x > walls[i].getX() && loc.y + pHeight > walls[i].getY() && loc.y < walls[i].getY() + walls[i].getHeight()) {
                loc.x = walls[i].getX() + walls[i].getWidth();
                vel.x = 0;
                //console.log("1");
            }
            // Ceiling
            if (loc.y + vel.y < walls[i].getY() + walls[i].getHeight() && loc.y + vel.y > walls[i].getY() && (loc.x > walls[i].getX() - pWidth && loc.x < walls[i].getX() + walls[i].getWidth())) {
                loc.y = walls[i].getY() + walls[i].getHeight();
                vel.y = 0;
                //console.log("2");
            }
            // Left Wall
            if (loc.x + vel.x + pWidth > walls[i].getX() && loc.x + vel.x < walls[i].getX() && (loc.y > walls[i].getY() - pHeight && loc.y < walls[i].getY() + walls[i].getHeight())) {
                loc.x = walls[i].getX() - pWidth;
                vel.x = 0;
                //console.log("3");
            }
            // Floor
            if (loc.y + vel.y + pHeight > walls[i].getY() && loc.y + vel.y < walls[i].getY() && (loc.x > walls[i].getX() - pWidth && loc.x < walls[i].getX() + walls[i].getWidth())) {
                loc.y = walls[i].getY() - pHeight;
                vel.y = 0;
                if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                onFloor = true;
                //console.log("4");
            }
        }
        
        // Tile Collisions
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].getIntact() && dist(loc.x, loc.y, tiles[i].getX(), tiles[i].getY()) < 100) {
                // Right Wall
                if (loc.x + vel.x < tiles[i].getX() + TILESIZE && loc.x + vel.x > tiles[i].getX() && loc.y + pHeight > tiles[i].getY() && loc.y < tiles[i].getY() + TILESIZE) {
                    loc.x = tiles[i].getX() + TILESIZE;
                    vel.x = 0;
                    //console.log("1");
                }
                // Ceiling
                if (loc.y + vel.y < tiles[i].getY() + TILESIZE && loc.y + vel.y > tiles[i].getY() && (loc.x > tiles[i].getX() - pWidth && loc.x < tiles[i].getX() + TILESIZE)) {
                    loc.y = tiles[i].getY() + TILESIZE;
                    vel.y = 0;
                    //console.log("2");
                }
                // Left Wall
                if (loc.x + vel.x + pWidth > tiles[i].getX() && loc.x + vel.x < tiles[i].getX() && (loc.y > tiles[i].getY() - pHeight && loc.y < tiles[i].getY() + TILESIZE)) {
                    loc.x = tiles[i].getX() - pWidth;
                    vel.x = 0;
                    //console.log("3");
                }
                // Floor
                if (loc.y + vel.y + pHeight > tiles[i].getY() && loc.y + vel.y < tiles[i].getY() && (loc.x > tiles[i].getX() - pWidth && loc.x < tiles[i].getX() + TILESIZE)) {
                    loc.y = tiles[i].getY() - pHeight;
                    vel.y = 0;
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    onFloor = true;
                    //console.log("4");
                }
            }
        }
        
        //console.log("vel.x = " + vel.x + "   vel.y = " + vel.y);
        if (!onFloor) inAir = true;
        else inAir = false;
        loc.x += vel.x;
        loc.y += vel.y;
    }
    
    this.getX = function() {
        return loc.x;
    }
    
    this.getY = function() {
        return loc.y;
    }
    
    this.getWidth = function() {
        return pWidth;
    }
    
    this.getHeight = function() {
        return pHeight;
    }
}

function Wall(xLoc, yLoc, wWidth, wHeight) {
    var loc = createVector(xLoc, yLoc);
    
    this.display = function() {
        push();
        translate(loc.x, loc.y);
        noStroke();
        fill(34, 34, 34);
        rect(0, 0, wWidth, wHeight);
        pop();
    }
    
    this.getX = function() {
        return loc.x;   
    }
    
    this.getY = function() {
        return loc.y;   
    }
    
    this.getWidth = function() {
        return wWidth;   
    }
    
    this.getHeight = function() {
        return wHeight;   
    }
}

function Tile(xLoc, yLoc, index, id) {
  var loc = createVector(xLoc, yLoc);
  var mouseHovering = false;
  var tColor;
  var breakable = false;
  var breakTime;
  var breaking = false;
  var intact = true;
  var breakStart = 0;
  switch(id) {
      case 0:
          tColor = color(115, 90, 55);
          breakTime = 1000;
          break;
      case 1:
          tColor = color(147, 147, 147);
          breakTime = 2000;
          break;
      case 2:
          tColor = color(44, 41, 37);
          breakTime = 5000;
          break;
  }
  var breakState = 0;
  
  this.display = function() {
    if (intact) { 
      noStroke();
      if (mouseHovering && breakable) fill(255, 0, 0);
      else fill(tColor);
      var size = (breakTime - breakState) / breakTime * TILESIZE;
      var offset = map(size, 0, TILESIZE, TILESIZE/2, 0);
      rect(xLoc + offset, yLoc + offset, size, size);
      fill(tColor);
      if (size > 2) rect(xLoc + offset + 1, yLoc + offset + 1, size-2, size-2);
    }
  }
  
  this.update = function() {
    if (intact && breaking) {
      breakState = millis() - breakStart;
      //tColor = map(breakState, breakTime, 0, 0, 255);
      if (breakState > breakTime) {
        intact = false;
      }
    }
    
    // Check if tile is exposed to air
    if (index < 24) breakable = true;
    else {
      if (!tiles[index-24].getIntact()) breakable = true;
      else if (index + 24 < 240 && !tiles[index+24].getIntact()) breakable = true;
      else if (index % 24 != 0 && !tiles[index-1].getIntact()) breakable = true;
      else if (index+1 < 240 && index+1 % 24 != 0 && !tiles[index+1].getIntact()) breakable = true;
    }
    
    // Check if tile is in reach
    var pLoc = createVector(prisoner.getX() + prisoner.getWidth()/2, prisoner.getY() + prisoner.getHeight()/2);
    if (dist(pLoc.x, pLoc.y, xLoc + TILESIZE/2, yLoc + TILESIZE/2) > 100) breakable = false;
  }
  
  this.checkMouse = function() {
    if (mouseX >= loc.x && mouseX < loc.x + 40 && mouseY >= loc.y && mouseY < loc.y + 40) {
      lastSelectedTile = index;
      mouseHovering = true;
    }
    else mouseHovering = false;
  }
  
  this.getHovering = function() {
    return mouseHovering; 
  }
  
  this.destroy = function() {
    if (!breaking && intact && breakable) {
      breaking = true;
      breakStart = millis();
    }
  }
  
  this.restore = function() {
    if (breaking && intact) {
      breaking = false;
      breakState = 0;
      breakStart = 0;
    }
  }
  
  this.getIntact = function() {
    return intact; 
  }
  
  this.getX = function() {
        return loc.x;   
    }
    
    this.getY = function() {
        return loc.y;   
    }
}

function mousePressed() {
  if (lastSelectedTile >= 0) {
      if (tiles[lastSelectedTile].getHovering()) {
          tiles[lastSelectedTile].destroy();
          currentlyBreaking = lastSelectedTile;
      }
  }
}

function mouseReleased() {
    if (currentlyBreaking >= 0) {
        if (tiles[currentlyBreaking].getHovering()) {
            tiles[currentlyBreaking].restore();
            currentlyBreaking = -1;
        }
    }
}

function mouseDragged() {
    if (currentlyBreaking >= 0) {
        if (!tiles[currentlyBreaking].getHovering()) {
            tiles[currentlyBreaking].restore();
            currentlyBreaking = -1;
        }
    }
    if (lastSelectedTile >= 0) {
        if (tiles[lastSelectedTile].getHovering()) {
            tiles[lastSelectedTile].destroy();
            currentlyBreaking = lastSelectedTile;
        }
    }
}