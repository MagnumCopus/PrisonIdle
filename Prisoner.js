function Prisoner() {
    var pWidth = TILESIZE * .7;
    var pHeight = (2*TILESIZE) * (5/6);
    
    var loc = createVector(width/2 - TILESIZE/2, 100);
    var vel = createVector(0, 0);
    var horizontalAcceleration = .5;
    var jumpAcceleration = 4.5;
    var maxHorizontalSpeed = 4;
    var inAir = true;
    var jumpReleased = true;
  
    this.display = function() {
        noStroke();
        fill(250, 164, 78); // orange
        rect(loc.x, loc.y, pWidth, pHeight);
        fill('#FFE0C4');
        rect(loc.x, loc.y, pWidth, pHeight/3);
    }
    
    this.update = function() {
        var horizontalKeyPressed = false;
        var onFloor = false;
        
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            if (!inAir) { vel.x -= horizontalAcceleration; }
            else { vel.x -= horizontalAcceleration/2; }
            horizontalKeyPressed = true;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            if (!inAir) vel.x += horizontalAcceleration;
            else vel.x += horizontalAcceleration/2;
            horizontalKeyPressed = true;
        }
        if (keyIsDown(32) || keyIsDown(UP_ARROW) || keyIsDown(87)) {
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
                        vel.y = -2; 
                    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
                        vel.y = 4; 
                    }
                    inAir = true;
                    jumpReleased = false;
                }
            }
        }
        
        // Barrier Collisions
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
                console.log(loc.y);
                loc.y = wall.getY() - pHeight;
                vel.y = 0;
                if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                onFloor = true;
                //console.log("4");
            }
        }
        
        // Tile Collisions
        for (var i = 0; i < currentMine.tiles.length; i++) {
            var tile = currentMine.tiles[i];
            if (tile.getIntact() && dist(loc.x, loc.y, tile.getX(), tile.getY()) < 100) {
                // Right Wall
                if (loc.x + vel.x < tile.getX() + TILESIZE && loc.x + vel.x > tile.getX() && loc.y + pHeight > tile.getY() && loc.y < tile.getY() + TILESIZE) {
                    loc.x = tile.getX() + TILESIZE;
                    vel.x = 0;
                    //console.log("1");
                }
                // Ceiling
                if (loc.y + vel.y < tile.getY() + TILESIZE && loc.y + vel.y > tile.getY() && (loc.x > tile.getX() - pWidth && loc.x < tile.getX() + TILESIZE)) {
                    loc.y = tile.getY() + TILESIZE;
                    vel.y = 0;
                    //console.log("2");
                }
                // Left Wall
                if (loc.x + vel.x + pWidth > tile.getX() && loc.x + vel.x < tile.getX() && loc.y + pHeight > tile.getY() && loc.y < tile.getY() + TILESIZE) {
                    loc.x = tile.getX() - pWidth;
                    vel.x = 0;
                    //console.log("3");
                }
                // Floor
                if (loc.y + vel.y + pHeight > tile.getY() && loc.y + vel.y < tile.getY() && (loc.x > tile.getX() - pWidth && loc.x < tile.getX() + TILESIZE)) {
                    loc.y = tile.getY() - pHeight;
                    vel.y = 0;
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    onFloor = true;
                    //console.log("4");
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
}
