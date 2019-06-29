function Tile(xLoc, yLoc, index, id) {
  var loc = createVector(xLoc, yLoc);
  var mouseHovering = false;
  var breakable = false;
  var inReach = false;
  var breaking = false;
  this.intact = true;
  this.id = id;
  
  var breakStart = 0;
  var breakState = 0;
  var details = tileDetails[id];
  var tColor = color(details.tColor);
  var breakTime = details.breakTime;
  
  this.display = function() {
    if (this.intact) { 
      noStroke();
      
      var size = TILESIZE;
      var offset = 0;
      if (breakable) {
          fill(tColor);
          if (details.sprite != null) image(details.sprite, xLoc, yLoc, TILESIZE, TILESIZE);
          else rect(xLoc + offset, yLoc + offset, size, size);
          if (mouseHovering) {
              fill(0);
              rect(xLoc, yLoc, 1, TILESIZE);
              rect(xLoc, yLoc, TILESIZE, 1);
              rect(xLoc+TILESIZE-1, yLoc, 1, TILESIZE);
              rect(xLoc, yLoc+TILESIZE-1, TILESIZE, 1);
          }
      }
      else {
          fill(0);
          rect(xLoc, yLoc, TILESIZE, TILESIZE);
      }
      
      var percentBroken = ((breakTime / miningSpeed) - breakState) / (breakTime / miningSpeed);
      //console.log(percentBroken);
      var animationIndex = percentBroken / 1.255 * 10;
      animationIndex = parseInt(map(animationIndex, 8, 0, 0, 8));
      if (animationIndex != 0) {
          var aY = parseInt(animationIndex / 3);
          var aX = animationIndex % 3;
          //console.log(aX + " " + aY);
          var crop = breakAnimation.get(aX * 40, aY * 40, 40, 40);
          image(crop, xLoc, yLoc);
      }
    }
  }
  
  this.update = function() {
    if (this.intact && breaking) {
      breakState = millis() - breakStart;
      //tColor = map(breakState, breakTime, 0, 0, 255);
      if (breakState > (breakTime / miningSpeed)) {
        this.intact = false;
        tileDetails[id].count++;
        console.log(miningSpeed);
        //saveState();
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
      //console.log(this.id);
      lastSelectedTile = index;
      mouseHovering = true;
    }
    else { mouseHovering = false; }
  }
  
  this.getHovering = function() {
    return mouseHovering; 
  }
  
  this.destroy = function() {
    if (!breaking && this.intact && breakable && inReach) {
      breaking = true;
      breakStart = millis();
    }
  }
  
  this.restore = function() {
    if (breaking && this.intact) {
      breaking = false;
      breakState = 0;
      breakStart = 0;
    }
  }
  
  this.getIntact = function() {
    return this.intact; 
  }
  
  this.getX = function() {
      return loc.x;   
  }
    
  this.getY = function() {
      return loc.y;   
  }
  
  this.setID = function(id) {
      this.id = id;
      details = tileDetails[id];
      tColor = color(details.tColor);
      breakTime = details.breakTime;
  }
}