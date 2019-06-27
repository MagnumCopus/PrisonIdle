function Ladder(xLoc, yLoc, wWidth, wHeight) {
    var loc = createVector(xLoc, yLoc);
    
    this.display = function() {
        noStroke();
        fill('#953403');
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
