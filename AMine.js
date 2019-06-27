function AMine() {
     this.walls = [];
     this.tiles = [];
     this.sellBlocks = [];
     
     this.walls.push(new Wall(0, 0, 40, 280));
     this.walls.push(new Wall(0, 280, 160, 40));
     this.walls.push(new Wall(120, 320, 40, 400));
     this.walls.push(new Wall(160, 680, 960, 40));
     this.walls.push(new Wall(1120, 320, 40, 400));
     this.walls.push(new Wall(1120, 280, 160, 40));
     this.walls.push(new Wall(1240, 0, 40, 280));
     
     for (var y = 0; y < 10; y++) {
         for (var x = 0; x < 24; x++) {
             var id = random(100);
             if (id < 70) { id = 0; }
             else if (id < 95) { id = 1; }
             else { id = 2; }
             this.tiles.push(new Tile(160 + x * 40, 280 + y * 40, (y * 24) + x, id));
         }
     }
     
     this.sellBlocks.push(new SellBlock(80, 160, 0));
     this.sellBlocks.push(new SellBlock(160, 160, 1));
     this.sellBlocks.push(new SellBlock(240, 160, 2));
     
     this.display = function() {
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
}
