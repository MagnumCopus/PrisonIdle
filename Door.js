function Door(xLoc, yLoc, wWidth, wHeight) {
    var loc = createVector(xLoc, yLoc);
    var closed = true;
    
    this.display = function() {
        noStroke();
        //for (var y = 0; y < wHeight; y += 40) {
            //for (var x = 0; x < wWidth; x += 40) {
                //image(wallSprite, loc.x + x, loc.y + y, TILESIZE, TILESIZE);    
            //}
        //}
        fill(34);
        if (closed) rect(loc.x, loc.y, wWidth, wHeight);
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
    
    this.openDoor = function() {
        closed = false;
    }
    
    this.closeDoor = function() {
        closed = true;
    }
    
    this.getClosed = function() {
        return closed;   
    }
}