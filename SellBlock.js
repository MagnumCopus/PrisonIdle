var sellQuantity = 1;

function SellBlock(xLoc, yLoc, id) {
    var loc = createVector(xLoc, yLoc);
    
    this.display = function() {
        noStroke();
        if (id >= 0) fill(color(tileDetails[id].tColor));
        else fill(80);
        rect(loc.x, loc.y, TILESIZE, TILESIZE);
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        if (id >= 0) text(tileDetails[id].count, loc.x, loc.y, TILESIZE*1.12, TILESIZE*1.12);
        else text(sellQuantity, loc.x, loc.y, TILESIZE*1.12, TILESIZE*1.12);
    }
    
    this.getX = function() {
        return loc.x;   
    }
    
    this.getY = function() {
        return loc.y;   
    }
    
    this.sell = function() {
        if (id >= 0) {
            if (sellQuantity == "All" || tileDetails[id].count < sellQuantity) {
                money += tileDetails[id].count * tileDetails[id].price;
                tileDetails[id].count = 0;
            }
            else {
                tileDetails[id].count -= sellQuantity;
                money += tileDetails[id].price * sellQuantity;
            }
        } else {
            if (sellQuantity == 1) sellQuantity = 5;
            else if (sellQuantity == 5) sellQuantity = 25;
            else if (sellQuantity == 25) sellQuantity = "All";
            else if (sellQuantity == "All") sellQuantity = 1;
        }
        saveState();
    }
}
