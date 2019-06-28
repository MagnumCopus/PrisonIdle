function UpgradeBlock(xLoc, yLoc, id) {
    var loc = createVector(xLoc, yLoc);
    
    this.display = function() {
        noStroke();
        if (id >= 0) fill(color(tileDetails[id].tColor));
        else fill(80);
        if (id >= 0 && tileDetails[id].sprite != null) image(tileDetails[id].sprite, loc.x, loc.y, TILESIZE, TILESIZE);
        else rect(loc.x, loc.y, TILESIZE, TILESIZE);
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        if (id >= 0) text(tileDetails[id].count, loc.x, loc.y, TILESIZE*1.12, TILESIZE);
        else text(sellQuantity, loc.x, loc.y, TILESIZE*1.12, TILESIZE);
    }
    
    this.getX = function() {
        return loc.x;   
    }
    
    this.getY = function() {
        return loc.y;   
    }
    
    this.upgrade = function() {
        // Pickaxe upgrade
        if (id == 0) {
            
        }
        //saveState();
    }
}