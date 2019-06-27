function Shop() {
     this.walls = [];
     this.tiles = [];
     this.sellBlocks = [];
     this.name = "Shop";
     
     this.leftRoom;
     this.rightRoom;
     this.downRoom;
     
     this.walls.push(new Wall(0, 0, 40, 280));
     this.walls.push(new Wall(-40, 280, 1360, 40));
     this.walls.push(new Wall(1240, 0, 40, 200));
     
     this.sellBlocks.push(new SellBlock(80, 160, 0));
     this.sellBlocks.push(new SellBlock(160, 160, 1));
     this.sellBlocks.push(new SellBlock(240, 160, 2));
     
     this.display = function() {
         fill(255);
         textSize(20);
         textAlign(LEFT, BASELINE);
         text("$ " + money.toFixed(2), 82, 140);
          
         for (var i = 0; i < this.sellBlocks.length; i++) {
             this.sellBlocks[i].display();
         }
          
         for (var i = 0; i < this.walls.length; i++) {
             this.walls[i].display();
         }
          
         for (var i = 0; i < this.tiles.length; i++) {
             this.tiles[i].display();
         } 
     }
     
     this.update = function() {
         for (var i = 0; i < this.tiles.length; i++) {
             this.tiles[i].checkMouse();
             this.tiles[i].update();
         } 
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
