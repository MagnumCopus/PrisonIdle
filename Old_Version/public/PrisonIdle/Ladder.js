function Ladder(xLoc, yLoc, wWidth, wHeight, direction) {
    var loc = createVector(xLoc, yLoc);

    this.display = function() {
        noStroke();
        fill('#953403');
        for (var y = 0; y < wHeight; y += 40) {
            if (direction == "right") image(ladderRightSprite, loc.x, loc.y + y, wWidth, TILESIZE);
            else image(ladderLeftSprite, loc.x, loc.y + y, wWidth, TILESIZE);
        }
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