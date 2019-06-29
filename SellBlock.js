var sellQuantity = 1;

function SellBlock(xLoc, yLoc, id) {
    var loc = createVector(xLoc, yLoc);
    this.displayingInfo = false;
    
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
    
    this.displayInfo = function() {
        if (id >= 0) {
            shop.infoText = tileDetails[id].info;
            this.displayingInfo = true;
        } else {
            shop.infoText = "Change the amount of minerals bulk sold to the store";
            this.displayingInfo = true;
        }
    }
    
    this.stopDisplaying = function() {
        if (this.displayingInfo) {
            shop.infoText = "";
            this.displayingInfo = false;
        }
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
        //saveState();
    }
}