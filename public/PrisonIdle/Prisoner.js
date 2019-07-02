function Prisoner(session_id) {
    var pWidth = 32;
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
  
    this.session_id = session_id;
    this.current_mine = currentMine.name;
    this.pickaxeLvl = 0;
    this.holdingLeft = false;
    this.holdingRight = false;
    this.holdingUp = false;
    this.holdingDown = false;
    var inputCount = 0;
    //var timer = setInterval(this.emitLocation, 1000);

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
        
        if (this.isLeftDown()) {
            if (!inAir) { vel.x -= horizontalAcceleration; }
            else { vel.x -= horizontalAcceleration/2; }
            horizontalKeyPressed = true;
            direction = "left";
            if (!this.holdingLeft) {
                this.holdingLeft = true;
                var data = {
                    input: 'left',
                    status: 'down'
                };
                socket.emit('inputChanged', data)
            }
        } else if (this.holdingLeft) {
            this.holdingLeft = false;
            inputCount++;
            var data = {
                input: 'left',
                status: 'up'
            };
            socket.emit('inputChanged', data)
        }

        if (this.isRightDown()) {
            if (!inAir) vel.x += horizontalAcceleration;
            else vel.x += horizontalAcceleration/2;
            horizontalKeyPressed = true;
            direction = "right";
            if (!this.holdingRight) {
                this.holdingRight = true;
                var data = {
                    input: 'right',
                    status: 'down'
                };
                socket.emit('inputChanged', data)
            }
        } else if (this.holdingRight) {
            this.holdingRight = false;
            inputCount++;
            var data = {
                input: 'right',
                status: 'up'
            };
            socket.emit('inputChanged', data)
        }

        if (this.isUpDown()) {
            if (!inAir) {
                vel.y -= jumpAcceleration;
                jumpReleased = false;
            }
            if (!this.holdingUp) {
                this.holdingUp = true;
                var data = {
                    input: 'up',
                    status: 'down'
                };
                socket.emit('inputChanged', data)
            }
        } else if (this.holdingUp) {
            this.holdingUp = false;
            inputCount++;
            var data = {
                input: 'up',
                status: 'up'
            };
            socket.emit('inputChanged', data)
            jumpReleased = true; 
        }

        if (this.isDownDown()) {
            if (!this.holdingDown) {
                this.holdingDown = true;
                var data = {
                    input: 'down',
                    status: 'down'
                };
                socket.emit('inputChanged', data)
            }
        } else if (this.holdingDown) {
            this.holdingDown = false;
            inputCount++;
            var data = {
                input: 'down',
                status: 'up'
            };
            socket.emit('inputChanged', data)
        }
        
        vel.y += GRAVITY;
        if (vel.x > maxHorizontalSpeed) vel.x = maxHorizontalSpeed;
        if (vel.x < -maxHorizontalSpeed) vel.x = -maxHorizontalSpeed;
        
        // Check window borders
        if (session_id == prisoner.session_id && loc.x + pWidth < -5) {
            currentMine = currentMine.leftRoom;
            loc.x = width + 5;
            this.emitLocation();
            saveState();
        }
        if (session_id == prisoner.session_id && loc.y + pHeight < -5) {
            this.emitLocation();
        }
        if (session_id == prisoner.session_id && loc.x > width + 5) {
            currentMine = currentMine.rightRoom;
            loc.x = -pWidth - 5;
            this.emitLocation();
            saveState();
        }
        if (session_id == prisoner.session_id && loc.y > height + 5) {
            this.emitLocation();
        }
        
        // Ladder Collisions
        if (currentMine.ladders != null) {
            for (var i = 0; i < currentMine.ladders.length; i++) {
                var ladder = currentMine.ladders[i];
                // Feet inside ladder
                if (loc.y + vel.y + pHeight > ladder.getY() && loc.y + pHeight <= ladder.getY() + ladder.getHeight() && loc.x + pWidth > ladder.getX() && loc.x < ladder.getX() + ladder.getWidth()) {
                    if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                    vel.y = 0;
                    if (this.holdingUp) {
                        vel.y = -4.5; 
                    } else if (this.holdingDown) {
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
                    if (this.holdingLeft) {
                        tile.destroy(session_id);
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
                if (breakingLeft && !this.holdingLeft && currentlyBreaking == tile.getIndex()) {
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
                    if (this.holdingRight) {
                        tile.destroy(session_id);
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
                if (breakingRight && !this.holdingRight && currentlyBreaking == tile.getIndex()) {
                    tile.restore();
                    breakingRight = false;   
                }
                // Floor
                if (loc.y + vel.y + pHeight > tile.getY() && loc.y + vel.y < tile.getY() && (loc.x > tile.getX() - pWidth && loc.x < tile.getX() + TILESIZE)) {
                    if (this.holdingDown) {
                        tile.destroy(session_id);
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
                if (breakingDown && !this.holdingDown && currentlyBreaking == tile.getIndex()) {
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
    
    this.getDirection = function() {
        return direction;
    }

    this.resetLoc = function() {
        if (currentMine.name == mines[0].name) {
            loc = createVector(1166, 280 - pHeight); 
            direction = 'left';
        } else {
            loc = createVector(126, 280 - pHeight); 
            direction = 'right';
        }
        this.emitLocation();
    }

    this.emitLocation = function() {
        if (session_id == prisoner.session_id) {
            console.log('emitting location');
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

    this.setData = function(data) {
        loc.x = data.x;
        loc.y = data.y;
        this.playerColor = data.color;
        this.current_mine = data.mine;
        this.pickaxeLvl = data.pickaxe;
    }

    this.isLeftDown = function() {
        if ((session_id != prisoner.session_id && this.holdingLeft) || (session_id == prisoner.session_id && (keyIsDown(LEFT_ARROW) || keyIsDown(65)))) {
            return true;
        }
        return false;
    }

    this.isRightDown = function() {
        if ((session_id != prisoner.session_id && this.holdingRight) || (session_id == prisoner.session_id && (keyIsDown(RIGHT_ARROW) || keyIsDown(68)))) {
            return true;
        }
        return false;
    }

    this.isUpDown = function() {
        if ((session_id != prisoner.session_id && this.holdingUp) || (session_id == prisoner.session_id && (keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)))) {
            return true;
        }
        return false;
    }

    this.isDownDown = function() {
        if ((session_id != prisoner.session_id && this.holdingDown) || (session_id == prisoner.session_id && (keyIsDown(DOWN_ARROW) || keyIsDown(83)))) {
            return true;
        }
        return false;
    }
}