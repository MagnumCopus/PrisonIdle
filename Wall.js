function Wall(xLoc, yLoc, wWidth, wHeight) {
    var loc = createVector(xLoc, yLoc);
    
    this.display = function() {
        noStroke();
        fill(80);
        rect(loc.x, loc.y, wWidth, wHeight);
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
