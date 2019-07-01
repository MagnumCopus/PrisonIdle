function Prisoner() {
    var pWidth = TILESIZE * .7;
    var pHeight = (2*TILESIZE) * (5/6);
    this.playerColor = '#ffffff';

    var loc = createVector(width/2 - TILESIZE/2, 280 - pHeight);
    var vel = createVector(0, 0);
    var horizontalAcceleration = .5;
    var jumpAcceleration = 4.5;
    var maxHorizontalSpeed = 4;
    var inAir = true;
    var jumpReleased = true;
    var direction = "right";
  
    var breakingLeft = false;
    var breakingRight = false;
    var breakingDown = false;
  
    this.display = function() {
        noStroke();
        fill(this.playerColor); // shirt color
        rect(loc.x, loc.y  + pHeight/3, pWidth, 2*pHeight/3);
        fill('#FFE0C4'); // skin color
        rect(loc.x, loc.y, pWidth, pHeight/3);
        var pickaxe = upgradeDetails[0].progression[upgradeDetails[0].current].sprite;
        if (pickaxe != null) {
            push();
            if (direction == "right") {
                translate(loc.x + 30, loc.y + 5);
                rotate(PI/4);
            } else {
                translate(loc.x - 30, loc.y + 34);
                rotate(-PI/4);
            }
            image(pickaxe, 0, 0, TILESIZE, TILESIZE);
            pop();
        }
    }
    
    this.update = function() {
        var horizontalKeyPressed = false;
        var onFloor = false;
        
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            if (!inAir) { vel.x -= horizontalAcceleration; }
            else { vel.x -= horizontalAcceleration/2; }
            horizontalKeyPressed = true;
            direction = "left";
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            if (!inAir) vel.x += horizontalAcceleration;
            else vel.x += horizontalAcceleration/2;
            horizontalKeyPressed = true;
            direction = "right";
        }
        if (keyIsDown(32) || keyIsDown(UP_ARROW) || keyIsDown(87)) {
            if (!inAir) {
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
        if (loc.x + pWidth < -5) {
            currentMine = currentMine.leftRoom;
            loc.x = width + 5;
            saveState();
        }
        if (loc.y + pHeight < -5) {
          
        }
        if (loc.x > width + 5) {
            currentMine = currentMine.rightRoom;
            loc.x = -pWidth - 5;
            saveState();
        }
        if (loc.y > height + 5) {
            
        }
        
        // Ladder Collisions
        if (currentMine.ladders != null) {
            for (var i = 0; i < currentMine.ladders.length; i++) {
                var ladder = currentMine.ladders[i];
                // Feet inside ladder
                if (loc.y + vel.y + pHeight > ladder.getY() && loc.y + pHeight <= ladder.getY() + ladder.getHeight() && loc.x + pWidth > ladder.getX() && loc.x < ladder.getX() + ladder.getWidth()) {
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    vel.y = 0;
                    if (keyIsDown(32) || keyIsDown(UP_ARROW) || keyIsDown(87)) {
                        vel.y = -4.5; 
                    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
                        vel.y = 6; 
                    }
                    inAir = true;
                    jumpReleased = false;
                }
            }
        }
        
        // Wall Collisions
        for (var i = 0; i < currentMine.walls.length; i++) {
            var wall = currentMine.walls[i];
            // Right Wall
            if (loc.x + vel.x < wall.getX() + wall.getWidth() && loc.x + vel.x > wall.getX() && loc.y + pHeight > wall.getY() && loc.y < wall.getY() + wall.getHeight()) {
                loc.x = wall.getX() + wall.getWidth();
                vel.x = 0;
                //console.log("1");
            }
            // Ceiling
            if (loc.y + vel.y < wall.getY() + wall.getHeight() && loc.y + vel.y > wall.getY() && (loc.x > wall.getX() - pWidth && loc.x < wall.getX() + wall.getWidth())) {
                loc.y = wall.getY() + wall.getHeight();
                vel.y = 0;
                //console.log("2");
            }
            // Left Wall
            if (loc.x + vel.x + pWidth > wall.getX() && loc.x + vel.x < wall.getX() && loc.y + pHeight > wall.getY() && loc.y < wall.getY() + wall.getHeight()) {
                loc.x = wall.getX() - pWidth;
                vel.x = 0;
                //console.log("3");
            }
            // Floor
            if (loc.y + vel.y + pHeight > wall.getY() && loc.y + vel.y < wall.getY() && (loc.x > wall.getX() - pWidth && loc.x < wall.getX() + wall.getWidth())) {
                loc.y = wall.getY() - pHeight;
                vel.y = 0;
                if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                onFloor = true;
                //console.log("4");
            }
        }
        
        // Door Collisions
        for (var i = 0; currentMine.doors != null && i < currentMine.doors.length; i++) {
            var door = currentMine.doors[i];
            if (door.getClosed()) {
                // Right Wall
                if (loc.x + vel.x < door.getX() + door.getWidth() && loc.x + vel.x > door.getX() && loc.y + pHeight > door.getY() && loc.y < door.getY() + door.getHeight()) {
                    loc.x = door.getX() + door.getWidth();
                    vel.x = 0;
                    //console.log("1");
                }
                // Ceiling
                if (loc.y + vel.y < door.getY() + door.getHeight() && loc.y + vel.y > door.getY() && (loc.x > door.getX() - pWidth && loc.x < door.getX() + door.getWidth())) {
                    loc.y = door.getY() + door.getHeight();
                    vel.y = 0;
                    //console.log("2");
                }
                // Left Wall
                if (loc.x + vel.x + pWidth > door.getX() && loc.x + vel.x < door.getX() && loc.y + pHeight > door.getY() && loc.y < door.getY() + door.getHeight()) {
                    loc.x = door.getX() - pWidth;
                    vel.x = 0;
                    //console.log("3");
                }
                // Floor
                if (loc.y + vel.y + pHeight > door.getY() && loc.y + vel.y < door.getY() && (loc.x > door.getX() - pWidth && loc.x < door.getX() +door.getWidth())) {
                    loc.y = door.getY() - pHeight;
                    vel.y = 0;
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    onFloor = true;
                    //console.log("4");
                }
            }
        }
        
        // Tile Collisions
        for (var i = 0; i < currentMine.tiles.length; i++) {
            var tile = currentMine.tiles[i];
            if (tile.getIntact() && dist(loc.x, loc.y, tile.getX(), tile.getY()) < 100) {
                // Right Wall
                if (loc.x + vel.x < tile.getX() + TILESIZE && loc.x + vel.x > tile.getX() && loc.y + pHeight > tile.getY() && loc.y < tile.getY() + TILESIZE) {
                    console.log(onFloor);
                    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
                        tile.destroy();
                        breakingLeft = true;
                    }
                    loc.x = tile.getX() + TILESIZE;
                    vel.x = 0;
                    //console.log("1");
                }
                else if (breakingLeft && currentlyBreaking == tile.getIndex()) {
                    tile.restore();
                    breakingLeft = false;  
                }
                if (breakingLeft && !(keyIsDown(LEFT_ARROW) || keyIsDown(65)) && currentlyBreaking == tile.getIndex()) {
                    tile.restore();
                    breakingLeft = false;   
                }
                //console.log(currentlyBreaking);
                // Ceiling
                if (loc.y + vel.y < tile.getY() + TILESIZE && loc.y + vel.y > tile.getY() && (loc.x > tile.getX() - pWidth && loc.x < tile.getX() + TILESIZE)) {
                    loc.y = tile.getY() + TILESIZE;
                    vel.y = 0;
                    //console.log("2");
                }
                // Left Wall
                if (loc.x + vel.x + pWidth > tile.getX() && loc.x + vel.x < tile.getX() && loc.y + pHeight > tile.getY() && loc.y < tile.getY() + TILESIZE) {
                    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
                        tile.destroy();
                        breakingRight = true;   
                    }
                    loc.x = tile.getX() - pWidth;
                    vel.x = 0;
                    //console.log("3");
                }
                else if (breakingRight && currentlyBreaking == tile.getIndex()) {
                    tile.restore();
                    breakingRight = false;  
                }
                if (breakingRight && !(keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && currentlyBreaking == tile.getIndex()) {
                    tile.restore();
                    breakingRight = false;   
                }
                // Floor
                if (loc.y + vel.y + pHeight > tile.getY() && loc.y + vel.y < tile.getY() && (loc.x > tile.getX() - pWidth && loc.x < tile.getX() + TILESIZE)) {
                    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
                        tile.destroy();
                        breakingDown = true;
                    }
                    loc.y = tile.getY() - pHeight;
                    vel.y = 0;
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    onFloor = true;
                    //console.log("4");
                }
                else if (breakingDown && currentlyBreaking == tile.getIndex()) {
                    tile.restore();
                    breakingDown = false;  
                }
                if (breakingDown && !(keyIsDown(DOWN_ARROW) || keyIsDown(83)) && currentlyBreaking == tile.getIndex()) {
                    tile.restore();
                    breakingDown = false;   
                }
            }
        }
        
        // SellBlock Collisions
        for (var i = 0; i < currentMine.sellBlocks.length; i++) {
            var sellBlock = currentMine.sellBlocks[i];
            if (dist(loc.x, loc.y, sellBlock.getX(), sellBlock.getY()) < 100) {
                // Right Wall
                if (loc.x + vel.x < sellBlock.getX() + TILESIZE && loc.x + vel.x > sellBlock.getX() && loc.y + pHeight > sellBlock.getY() && loc.y < sellBlock.getY() + TILESIZE) {
                    loc.x = sellBlock.getX() + TILESIZE;
                    vel.x = 0;
                    //console.log("1");
                }
                // Ceiling
                if (loc.y + vel.y < sellBlock.getY() + TILESIZE && loc.y + vel.y > sellBlock.getY() && (loc.x > sellBlock.getX() - pWidth && loc.x < sellBlock.getX() + TILESIZE)) {
                    currentMine.sellBlocks[i].sell();
                    loc.y = sellBlock.getY() + TILESIZE;
                    vel.y = 0;
                    //console.log("2");
                }
                // Left Wall
                if (loc.x + vel.x + pWidth > sellBlock.getX() && loc.x + vel.x < sellBlock.getX() && loc.y + pHeight > sellBlock.getY() && loc.y < sellBlock.getY() + TILESIZE) {
                    loc.x = sellBlock.getX() - pWidth;
                    vel.x = 0;
                    //console.log("3");
                }
                // Floor
                if (loc.y + vel.y + pHeight > sellBlock.getY() && loc.y + vel.y < sellBlock.getY() && (loc.x > sellBlock.getX() - pWidth && loc.x < sellBlock.getX() + TILESIZE)) {
                    loc.y = sellBlock.getY() - pHeight;
                    vel.y = 0;
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    onFloor = true;
                    //console.log("4");
                }
                // Info
                if (loc.y + pHeight <= sellBlock.getY() + 120 && loc.y >= sellBlock.getY() && (loc.x > sellBlock.getX() - pWidth && loc.x < sellBlock.getX() + TILESIZE)) {
                    sellBlock.displayInfo();
                } else {
                    sellBlock.stopDisplaying();   
                }
            }
        }
        
        // Upgrade Block Collisions
        for (var i = 0; currentMine.upgradeBlocks != null && i < currentMine.upgradeBlocks.length; i++) {
            var upgradeBlock = currentMine.upgradeBlocks[i];
            if (dist(loc.x, loc.y, upgradeBlock.getX(), upgradeBlock.getY()) < 100) {
                // Right Wall
                if (loc.x + vel.x < upgradeBlock.getX() + TILESIZE && loc.x + vel.x > upgradeBlock.getX() && loc.y + pHeight > upgradeBlock.getY() && loc.y < upgradeBlock.getY() + TILESIZE) {
                    loc.x = upgradeBlock.getX() + TILESIZE;
                    vel.x = 0;
                    //console.log("1");
                }
                // Ceiling
                if (loc.y + vel.y < upgradeBlock.getY() + TILESIZE && loc.y + vel.y > upgradeBlock.getY() && (loc.x > upgradeBlock.getX() - pWidth && loc.x < upgradeBlock.getX() + TILESIZE)) {
                    currentMine.upgradeBlocks[i].upgrade();
                    loc.y = upgradeBlock.getY() + TILESIZE;
                    vel.y = 0;
                    //console.log("2");
                }
                // Left Wall
                if (loc.x + vel.x + pWidth > upgradeBlock.getX() && loc.x + vel.x < upgradeBlock.getX() && loc.y + pHeight > upgradeBlock.getY() && loc.y < upgradeBlock.getY() + TILESIZE) {
                    loc.x = upgradeBlock.getX() - pWidth;
                    vel.x = 0;
                    //console.log("3");
                }
                // Floor
                if (loc.y + vel.y + pHeight > upgradeBlock.getY() && loc.y + vel.y < upgradeBlock.getY() && (loc.x > upgradeBlock.getX() - pWidth && loc.x < upgradeBlock.getX() + TILESIZE)) {
                    loc.y = upgradeBlock.getY() - pHeight;
                    vel.y = 0;
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    onFloor = true;
                    //console.log("4");
                }
                // Info
                if (loc.y + pHeight <= upgradeBlock.getY() + 120 && loc.y >= upgradeBlock.getY() && (loc.x > upgradeBlock.getX() - pWidth && loc.x < upgradeBlock.getX() + TILESIZE)) {
                    upgradeBlock.displayInfo();
                } else {
                    upgradeBlock.stopDisplaying();   
                }
            }
        }
        
        //console.log("vel.x = " + vel.x + "   vel.y = " + vel.y);
        if (!onFloor) inAir = true;
        else inAir = false;
        loc.x += vel.x;
        loc.y += vel.y;
        if (Math.abs(vel.x) > 0.1 || Math.abs(vel.y) > 0.1) {
            this.emitLocation();
        }
    }
    
    this.getX = function() {
        return loc.x;
    }
    
    this.getY = function() {
        return loc.y;
    }
    
    this.setX = function(x) {
        loc.x = x;
    }
    
    this.setY = function(y) {
        loc.y = y;
    }
    
    this.getWidth = function() {
        return pWidth;
    }
    
    this.getHeight = function() {
        return pHeight;
    }
    
    this.resetLoc = function() {
        loc = createVector(width/2 - TILESIZE/2, 280 - pHeight); 
        this.emitLocation();
    }

    this.emitLocation = function() {
        var data = {
            x: loc.x,
            y: loc.y,
            color: this.playerColor,
            mine: currentMine.name,
            pickaxe: upgradeDetails[0].current,
            direction: direction,
            id: -1
        };
        socket.emit('playerMoved', data);
    }
}