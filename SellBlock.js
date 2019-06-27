function SellBlock(xLoc, yLoc, id) {
    var loc = createVector(xLoc, yLoc);
    
    this.display = function() {
        noStroke();
        fill(color(tileDetails[id].tColor));
        rect(loc.x, loc.y, TILESIZE, TILESIZE);
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(tileDetails[id].count, loc.x, loc.y, TILESIZE*1.12, TILESIZE*1.12);
    }
    
    this.getX = function() {
        return loc.x;   
    }
    
    this.getY = function() {
        return loc.y;   
    }
    
    this.sell = function() {
        if (tileDetails[id].count > 0) {
            tileDetails[id].count--;
            money += tileDetails[id].price;
        } 
    }
}
