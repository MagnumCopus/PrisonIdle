function Shop() {
     this.walls = [];
     this.tiles = [];
     this.sellBlocks = [];
     this.ladders = [];
     this.name = "Shop";
     
     this.leftRoom;
     this.rightRoom;
     this.downRoom;
     
     this.walls.push(new Wall(0, 0, 40, 680));
     this.walls.push(new Wall(0, 680, 1200, 40));
     this.walls.push(new Wall(1160, 280, 160, 40));
     this.walls.push(new Wall(40, 280, 1040, 40));
     this.walls.push(new Wall(1240, 0, 40, 200));
     this.walls.push(new Wall(1160, 280, 40, 400));
     //this.walls.push(new Wall(40, 0, 1200, 40));
     
     this.sellBlocks.push(new SellBlock(80, 160, 0));
     this.sellBlocks.push(new SellBlock(160, 160, 1));
     this.sellBlocks.push(new SellBlock(240, 160, 2));
     this.sellBlocks.push(new SellBlock(960, 160, -1));
     
     this.ladders.push(new Ladder(1150, 280, 12, 400, "right"));
     
     this.display = function() {
         fill(134, 198, 250);
         rect(0, 0, 1280, 720);
         fill(33, 30, 22);
         rect(1200, 280, 80, 440);
         
         fill(34, 34, 34);
         textAlign(CENTER, BASELINE);
         textSize(200);
         //text("Shop", 62, 60, 1200, 300);
          
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