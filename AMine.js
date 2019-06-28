function AMine() {
     this.walls = [];
     this.tiles = [];
     this.tileHeight = 10;
     this.tileWidth = 22;
     this.sellBlocks = [];
     this.ladders = [];
     this.name = "A";
     this.resetLength = 60000 * 3;
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
     this.walls.push(new Wall(1240, 0, 40, 200));
     
     this.ladders.push(new Ladder(160, 280, 10, 400));
     this.ladders.push(new Ladder(1110, 280, 10, 400));
     
     for (var y = 0; y < this.tileHeight; y++) {
         for (var x = 0; x < this.tileWidth; x++) {
             var id = random(100);
             if (id < 70) { id = 0; }
             else if (id < 95) { id = 1; }
             else { id = 2; }
             this.tiles.push(new Tile(200 + x * 40, 280 + y * 40, (y * this.tileWidth) + x, id));
         }
     }
     
     this.display = function() {
         //console.log(this.lastReset);
         fill(34, 34, 34);
         textAlign(CENTER, BASELINE);
         textSize(200);
         text("A", 62, 50, 1200, 300);
         
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
         fill(255);
         text(formattedHours + ":" + formattedMins + ":" + formattedSecs, 1180, 30);
         
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
     }
     
     this.update = function() {
         for (var i = 0; i < this.tiles.length; i++) {
             this.tiles[i].checkMouse();
             this.tiles[i].update();
         } 
         
         this.checkReset();
     }
     
     this.checkReset = function() {
         var d = new Date();
         //console.log(this.lastReset + this.resetLength - d.getTime());
         if ((this.lastReset + this.resetLength) - d.getTime() < 0) {
             if (currentMine.name == this.name) prisoner.setY(280 - prisoner.getHeight());
             this.resetTiles();   
             saveState();
         }
     }
     
     this.resetTiles = function() {
         this.tiles = [];
         for (var y = 0; y < this.tileHeight; y++) {
             for (var x = 0; x < this.tileWidth; x++) {
                 var id = random(100);
                 if (id < 70) { id = 0; }
                 else if (id < 95) { id = 1; }
                 else { id = 2; }
                 this.tiles.push(new Tile(200 + x * 40, 280 + y * 40, (y * this.tileWidth) + x, id));
             }
         }
         
         var d = new Date();
         this.lastReset = d.getTime();
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