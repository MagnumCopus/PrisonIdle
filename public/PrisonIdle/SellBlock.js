var sellQuantity = 1;

function SellBlock(xLoc, yLoc, id) {
    var loc = createVector(xLoc, yLoc);
    this.displayingInfo = false;
    
    this.display = function() {
        if (this.minimumMineMet()) {
            noStroke();
            if (id >= 0) fill(color(tileDetails[id].tColor));
            else fill(80);
            if (id >= 0 && tileDetails[id].sprite != null) image(tileDetails[id].sprite, loc.x, loc.y, TILESIZE, TILESIZE);
            else rect(loc.x, loc.y, TILESIZE, TILESIZE);
            fill(0, 0, 0, 65);
            rect(loc.x, loc.y, TILESIZE, TILESIZE);
            fill(255);
            textSize(15);
            textAlign(CENTER, CENTER);
            if (id >= 0) {
                var count = tileDetails[id].count;
                if (count > 999 && count < 10000) {
                    count = (count/1000).toFixed(1) + "K";
                } else if (count > 9999 && count < 1000000) {
                    count = (count/1000).toFixed(0) + "K";
                } else if (count > 999999 && count < 950000000) {
                    count = (count/1000000).toFixed(0) + "M";
                } else if (count > 949999999 && count < 1000000000) {
                    count = "999M";
                } else if (count > 999999999) {
                    count = "no u";
                }
                text(count, loc.x, loc.y, TILESIZE*1.12, TILESIZE);
            }
            else text(sellQuantity, loc.x, loc.y, TILESIZE*1.12, TILESIZE);
        } else {
            noStroke();
            fill(36);
            rect(loc.x, loc.y, TILESIZE, TILESIZE);
        }
    }
    
    this.getX = function() {
        return loc.x;   
    }
    
    this.getY = function() {
        return loc.y;   
    }
    
    this.displayInfo = function() {
        if (id >= 0 && tileDetails[id] && this.minimumMineMet()) {
            mines[0].infoText = tileDetails[id].info;
            this.displayingInfo = true;
        } else if (id == -1) {
            mines[0].infoText = "Change the amount of minerals bulk sold to the store";
            this.displayingInfo = true;
        } else {
            mines[0].infoText = "???";
            this.displayingInfo = true;
        }
    }
    
    this.stopDisplaying = function() {
        if (this.displayingInfo) {
            mines[0].infoText = "";
            this.displayingInfo = false;
        }
    }
    
    this.sell = function() {
        if (id == -1 || tileDetails[id] != null) {
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
        }
    }
    
    this.minimumMineMet = function() {
        if (id == -1 || tileDetails[id] != null) {
            if (id >= 0) return upgradeDetails[1].current >= tileDetails[id].minimumMine;
            return true;
        } else {
            return false;
        }
    }
}