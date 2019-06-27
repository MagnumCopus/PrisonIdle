var tileDetails = [
    {name:'dirt',    id: 0, breakTime: 500, tColor: '#735A37', price: .1, count: 0},
    {name:'stone',   id: 1, breakTime: 1000, tColor: '#939393', price: .3, count: 0},
    {name:'coal',    id: 2, breakTime: 3000, tColor: '#2C2925', price: 1.0, count: 0}
];

function Tile(xLoc, yLoc, index, id) {
  var loc = createVector(xLoc, yLoc);
  var mouseHovering = false;
  var breakable = false;
  var inReach = false;
  var breaking = false;
  var intact = true;
  
  var breakStart = 0;
  var breakState = 0;
  var details = tileDetails[id];
  var tColor = color(details.tColor);
  var breakTime = details.breakTime;
  
  this.display = function() {
    if (intact) { 
      noStroke();
      var size = ((breakTime / miningSpeed) - breakState) / (breakTime / miningSpeed) * TILESIZE;
      var offset = map(size, 0, TILESIZE, TILESIZE/2, 0);
      if (mouseHovering && breakable) {
          stroke(0);
          strokeWeight(1);
          size -= 1;
      }
      if (breakable) fill(tColor);
      else fill(0);
      if (size > 2) rect(xLoc + offset, yLoc + offset, size, size);
    }
  }
  
  this.update = function() {
    if (intact && breaking) {
      breakState = millis() - breakStart;
      //tColor = map(breakState, breakTime, 0, 0, 255);
      if (breakState > (breakTime / miningSpeed)) {
        intact = false;
        tileDetails[id].count++;
      }
    }
    
    // Check if tile is exposed to air
    var tileHeight = currentMine.tileHeight;
    var tileWidth = currentMine.tileWidth;
    if (index < tileWidth || index % tileWidth == 0 || (index + 1) % tileWidth == 0) breakable = true;
    else {
      if (!currentMine.tiles[index-tileWidth].getIntact()) breakable = true;
      else if (index + tileWidth < tileHeight * tileWidth && !currentMine.tiles[index+tileWidth].getIntact()) breakable = true;
      else if (index % tileWidth != 0 && !currentMine.tiles[index-1].getIntact()) breakable = true;
      else if (index+1 < tileWidth * tileHeight && index+1 % tileWidth != 0 && !currentMine.tiles[index+1].getIntact()) breakable = true;
      else breakable = false;
    }
    
    // Check if tile is in reach
    var pLoc = createVector(prisoner.getX() + prisoner.getWidth()/2, prisoner.getY() + prisoner.getHeight()/2);
    if (dist(pLoc.x, pLoc.y, xLoc + TILESIZE/2, yLoc + TILESIZE/2) > 100) inReach = false;
    else inReach = true;
  }
  
  this.checkMouse = function() {
    if (breakable && inReach && mouseX >= loc.x && mouseX < loc.x + 40 && mouseY >= loc.y && mouseY < loc.y + 40) {
      lastSelectedTile = index;
      mouseHovering = true;
    }
    else { mouseHovering = false; }
  }
  
  this.getHovering = function() {
    return mouseHovering; 
  }
  
  this.destroy = function() {
    if (!breaking && intact && breakable && inReach) {
      breaking = true;
      breakStart = millis();
    }
  }
  
  this.restore = function() {
    if (breaking && intact) {
      breaking = false;
      breakState = 0;
      breakStart = 0;
    }
  }
  
  this.getIntact = function() {
    return intact; 
  }
  
  this.getX = function() {
      return loc.x;   
  }
    
  this.getY = function() {
      return loc.y;   
  }
}
