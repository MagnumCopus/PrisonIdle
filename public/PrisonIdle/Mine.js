function resetAnyMine(mine) {
	if (prisoner != null && currentMine.name == mine.name) prisoner.setY(280 - prisoner.getHeight());
    for (var y = 0; y < mine.tileHeight; y++) {
        for (var x = 0; x < mine.tileWidth; x++) {
            var index = (y * mine.tileWidth) + x;
            for (var j = 0; j < tileDetails.length; j++) {
                if (tileDetails[j].name == tiles[index].name) {
                    if (index >= mine.tiles.length) {
                        mine.tiles.push(new Tile(200 + x * 40, 280 + y * 40, index, j));
                    }
                    else {
                        mine.tiles[index].restore();
                        mine.tiles[index].setID(tileDetails[j].id);
                    }
                    mine.tiles[index].setBreakable(false);
                    mine.tiles[index].intact = tiles[index].intact;
                    break;
                }
            }
        }
     }  
     currentlyBreaking = -1;
     saveState();
     mine.lastReset = new Date().getTime();
     mine.resetLength = resetLength;
}