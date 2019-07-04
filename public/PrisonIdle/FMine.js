function FMine() {
     this.walls = [];
     this.tiles = [];
     this.tileHeight = 10;
     this.tileWidth = 22;
     this.sellBlocks = [];
     this.ladders = [];
     this.doors = [];
     this.name = "FMine";
     this.index = 5;
     this.resetLength = 60000 * 6;
     var d = new Date();
     this.lastReset = d.getTime();
     
     this.leftRoom;
     this.rightRoom;
     this.downRoom;
     
     this.walls.push(new Wall(0, 0, 40, 200));
     this.walls.push(new Wall(-40, 280, 200, 40));
     this.walls.push(new Wall(120, 320, 40, 400));
     this.walls.push(new Wall(160, 680, 960, 40));
     this.walls.push(new Wall(1120, 320, 40, 400));
     this.walls.push(new Wall(1120, 280, 200, 40));
     this.walls.push(new Wall(1240, 0, 40, 280));
     
     this.ladders.push(new Ladder(160, 280, 12, 400, "left"));
     this.ladders.push(new Ladder(1110, 280, 12, 400, "right"));
     
     //this.doors.push(doors[this.index]);
     
     this.sellBlocks.push(new SellBlock(1000, 40, 2));
     this.sellBlocks.push(new SellBlock(1080, 40, 3));
     this.sellBlocks.push(new SellBlock(1160, 40, 4));
     
     this.display = function() {
         fill(33, 30, 22);
         rect(0, 280, 1280, 440);
         fill(134, 198, 250);
         rect(0, 0, 1290, 280);
         
         fill(34, 34, 34);
         textAlign(CENTER, BASELINE);
         textSize(200);
         text("F", 62, 50, 1200, 300);
         
         var d = new Date();
         var timeLeft = (this.lastReset + this.resetLength) - d.getTime();
         var hours = parseInt(timeLeft / 3600000);
         var formattedHours = ("0" + hours).slice(-2);
         timeLeft -= hours * 3600000;
         var mins = parseInt(timeLeft / 60000);
         var formattedMins = ("0" + mins).slice(-2);
         timeLeft -= mins * 60000;
         var secs = parseInt(timeLeft / 1000);
         var formattedSecs = ("0" + secs).slice(-2);
         textSize(20);
         fill(34, 34, 34);
         text(formattedHours + ":" + formattedMins + ":" + formattedSecs, 633, 235);
         
         for (var i = 0; i < this.sellBlocks.length; i++) {
             this.sellBlocks[i].display();
         }
          
         for (var i = 0; i < this.walls.length; i++) {
             this.walls[i].display();
         }
          
         for (var i = 0; i < this.tiles.length; i++) {
             this.tiles[i].display();
         } 
         
         for (var i = 0; i < this.ladders.length; i++) {
             this.ladders[i].display();
         }
         
         for (var i = 0; i < this.doors.length; i++) {
             this.doors[i].display();
         }
     }
     
     this.update = function() {
         for (var i = 0; i < this.tiles.length; i++) {
             this.tiles[i].checkMouse();
             this.tiles[i].update();
         } 
     }
     
     this.resetMine = function(resetLength, tiles) {
         if (prisoner != null && currentMine.name == this.name) prisoner.setY(280 - prisoner.getHeight());
         //this.resetTiles();
         for (var y = 0; y < this.tileHeight; y++) {
            for (var x = 0; x < this.tileWidth; x++) {
                var index = (y * this.tileWidth) + x;
                for (var j = 0; j < tileDetails.length; j++) {
                    if (tileDetails[j].name == tiles[index].name) {
                        if (index >= this.tiles.length) {
                            this.tiles.push(new Tile(200 + x * 40, 280 + y * 40, index, j));
                        }
                        else {
                            this.tiles[index].restore();
                            this.tiles[index].setID(tileDetails[j].id);
                        }
                        this.tiles[index].setBreakable(false);
                        this.tiles[index].intact = tiles[index].intact;
                        break;
                    }
                }
            }
         }  
         currentlyBreaking = -1;
         //saveState();
         this.lastReset = new Date().getTime();
         console.log(resetLength);
         this.resetLength = resetLength;
     }
     
     this.setLeftRoom = function(leftRoom) {
         this.leftRoom = leftRoom; 
     }
     
     this.setRightRoom = function(rightRoom) {
         this.rightRoom = rightRoom; 
     }
     
     this.setDownRoom = function(downRoom) {
         this.downRoom = downRoom; 
     }
}