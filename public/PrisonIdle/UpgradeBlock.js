function UpgradeBlock(xLoc, yLoc, id) {
    var loc = createVector(xLoc, yLoc);
    this.displayingInfo = false;
    
    this.display = function() {
        noStroke();
        if (upgradeDetails[id].progression[upgradeDetails[id].current+1] != null) {
            fill(80);
            rect(loc.x, loc.y, TILESIZE, TILESIZE);
            if (id == 1) {
                fill('#fffeee');
                rect(loc.x+4, loc.y+4, TILESIZE-8, TILESIZE-8);
                fill(34);
                textSize(30);
                text(upgradeDetails[id].progression[upgradeDetails[id].current+1].name, loc.x+20, loc.y+19);
            } else {
                var sprite = upgradeDetails[id].progression[upgradeDetails[id].current+1].sprite;
                if (id >= 0 && sprite != null) image(sprite, loc.x, loc.y, TILESIZE, TILESIZE);
            }
        } else {
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
    
    this.exists = function() {
         return upgradeDetails[id].progression[upgradeDetails[id].current+1] != null;
    }
    
    this.displayInfo = function() {
        if (upgradeDetails[id].progression[upgradeDetails[id].current+1] != null) {
            shop.infoText = upgradeDetails[id].progression[upgradeDetails[id].current+1].info;
            this.displayingInfo = true;
        } else {
            shop.infoText = "???";
            this.displayingInfo = true;
        }
    }
    
    this.stopDisplaying = function() {
        if (this.displayingInfo) {
            shop.infoText = "";
            this.displayingInfo = false;
        }
    }
    
    this.upgrade = function() {
        if (upgradeDetails[id].progression[upgradeDetails[id].current+1] != null) {
            // Pickaxe upgrade
            if (id == 0) {
                if (upgradeDetails[id].progression[upgradeDetails[id].current+1].cost != null && money >= upgradeDetails[id].progression[upgradeDetails[id].current+1].cost) {
                    upgradeDetails[id].current += 1;
                    miningSpeed = upgradeDetails[id].progression[upgradeDetails[id].current].miningSpeed;
                    money -= upgradeDetails[id].progression[upgradeDetails[id].current].cost;
                } else if (upgradeDetails[id].progression[upgradeDetails[id].current+1].recipe != null) {
                    var parts = upgradeDetails[id].progression[upgradeDetails[id].current+1].recipe.parts;
                    var canAfford = true;
                    for (var i = 0; i < parts.length; i++) {
                        var partId = parts[i].id;
                        if (tileDetails[partId].count < parts[i].count) canAfford = false;
                    }
                    if (canAfford) {
                        for (var i = 0; i < parts.length; i++) {
                            var partId = parts[i].id;
                            tileDetails[partId].count -= parts[i].count;
                        }
                        upgradeDetails[id].current += 1;
                        miningSpeed = upgradeDetails[id].progression[upgradeDetails[id].current].miningSpeed;
                    }
                }
            } else if (id == 1) {
                console.log("buy door");
                if (money + .01 >= upgradeDetails[id].progression[upgradeDetails[id].current+1].cost) {
                    upgradeDetails[id].current += 1;
                    upgradeDetails[id].progression[upgradeDetails[id].current].door.openDoor();
                    money -= upgradeDetails[id].progression[upgradeDetails[id].current].cost;
                }
            }
            this.stopDisplaying();
        }
    }
}