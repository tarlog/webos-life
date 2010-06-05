var patterns = {
	
	gliderCellSize : 20,
	gliderLiveCells : 5,
	gliderRows : 3,
	glider : [[0, 0, 1], 
	          [1, 0, 1], 
	          [0, 1, 1]],

	          
	blinkerCellSize : 20,
	blinkerLiveCells : 3,
	blinkerRows : 3,
  	blinker : [[0, 1, 0], 
	           [0, 1, 0], 
	           [0, 1, 0]],

	// Spaceship
	spaceshipCellSize : 20,
	spaceshipLiveCells : 12,
	spaceshipRows : 5,
    spaceship : [[ 0, 1, 1, 0, 0], 
                 [ 0, 1, 1, 1, 0], 
                 [ 1, 0, 1, 1, 0], 
                 [ 1, 1, 1, 0, 0], 
                 [ 0, 1, 0, 0, 0]],

 	// Small Exploder
 	smallExploderCellSize : 16,
 	smallExploderLiveCells : 7,
 	smallExploderRows : 5,
 	smallExploder :  [[ 0, 0, 0, 0, 0], 
	                  [ 0, 1, 1, 0, 0], 
	                  [ 1, 1, 0, 1, 0], 
	                  [ 0, 1, 1, 0, 0], 
	                  [ 0, 0, 0, 0, 0]],
                 
    // Pulsar
    pulsarCellSize : 16,
    pulsarLiveCells : 48,
    pulsarRows : 13,
	pulsar : [[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0], 
	          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
	          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1], 
	          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1], 
	          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1], 
	          [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0], 
	          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
	          [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0], 
	          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1], 
	          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1], 
	          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1], 
	          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
	          [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]],

    // Line
    lineCellSize : 14,
    lineLiveCells : 10,
    lineRows : 10,
  	line :   [[0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  	          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]],
	          
	          
    adjustSize : function(pattern, patternRows, cellSize) {
		var cols = Math.floor(game.backgroundWidth / cellSize);
		var rows = Math.floor(game.backgroundHeight / cellSize);
		var colsLeft = Math.floor( (cols - patternRows) / 2);
		var rowsLeft = Math.floor( (rows - patternRows) / 2);
		
		if (cols < patternRows || rows < patternRows) {
			Mojo.Log.error("Cannot adjust size of patter, since it's too big: " + patternRows);
			return;
		}
		var data = new Array();
		for (x = 0; x < cols; ++x) {
			data[x] = new Array();
			for (y = 0; y < rows; ++y) {
				if (x >= colsLeft && x < colsLeft + patternRows && y >= rowsLeft && y < rowsLeft + patternRows) {
					data[x][y] = pattern[x-colsLeft][y-rowsLeft];
				} else {
					data[x][y] = 0;
				}
			}
		}
		return data;
	},
	
	save : function() {
		game.depot.get("list", this.processList, game.depotFailed);
	},

	nameExists : function(list, name) {
		if (list == null || name == null) {
			return false;
		}
		return list.indexOf(name) != -1;
	},
	
	processList : function(list) {
		var names = new Array();

		var blinkerData = patterns.adjustSize(patterns.blinker, patterns.blinkerRows, patterns.blinkerCellSize);
		if (patterns.nameExists(list, "Blinker") == false && blinkerData != null) {
			names.push("Blinker");
			game.depot.add("Blinker.cellSize", patterns.blinkerCellSize);
			game.depot.add("Blinker.data", blinkerData);
			game.depot.add("Blinker.liveCellCounter", patterns.blinkerLiveCells);
			Mojo.Log.info("Blinker added");
		}
		
		var gliderData = patterns.adjustSize(patterns.glider, patterns.gliderRows, patterns.gliderCellSize);
		if (patterns.nameExists(list, "Glider") == false && gliderData != null) {
			names.push("Glider");
			game.depot.add("Glider.cellSize", patterns.gliderCellSize);
			game.depot.add("Glider.data", gliderData);
			game.depot.add("Glider.liveCellCounter", patterns.gliderLiveCells);
			Mojo.Log.info("Glider added");
		}
		
		var smallExploderData = patterns.adjustSize(patterns.smallExploder, patterns.smallExploderRows, patterns.smallExploderCellSize);
		if (patterns.nameExists(list, "Exploder") == false && smallExploderData != null) {
			names.push("Exploder");
			game.depot.add("Exploder.cellSize", patterns.smallExploderCellSize);
			game.depot.add("Exploder.data", smallExploderData);
			game.depot.add("Exploder.liveCellCounter", patterns.smallExploderLiveCells);
			Mojo.Log.info("Exploder added");
		}
		
		var lineData = patterns.adjustSize(patterns.line, patterns.lineRows, patterns.lineCellSize);
		if (patterns.nameExists(list, "Line") == false && lineData != null) {
			names.push("Line");
			game.depot.add("Line.cellSize", patterns.lineCellSize);
			game.depot.add("Line.data", lineData);
			game.depot.add("Line.liveCellCounter", patterns.lineLiveCells);
			Mojo.Log.info("Line added");
		}
		
		var pulsarData = patterns.adjustSize(patterns.pulsar, patterns.pulsarRows, patterns.pulsarCellSize);
		if (patterns.nameExists(list, "Pulsar") == false && pulsarData != null) {
			names.push("Pulsar");
			game.depot.add("Pulsar.cellSize", patterns.pulsarCellSize);
			game.depot.add("Pulsar.data", pulsarData);
			game.depot.add("Pulsar.liveCellCounter", patterns.pulsarLiveCells);
			Mojo.Log.info("Pulsar added");
		}
		
		var spaceshipData = patterns.adjustSize(patterns.spaceship, patterns.spaceshipRows, patterns.spaceshipCellSize);
		if (patterns.nameExists(list, "Spaceship") == false && spaceshipData != null) {
			names.push("Spaceship");
			game.depot.add("Spaceship.cellSize", patterns.spaceshipCellSize);
			game.depot.add("Spaceship.data", spaceshipData);
			game.depot.add("Spaceship.liveCellCounter", patterns.spaceshipLiveCells);
			Mojo.Log.info("Spaceship added");
		}
		
		if (list != null) {
			names = list.concat(names);
		}
		
		game.depot.add("list", names, game.depotCreated, game.depotFailed);
	},
	// more patterns available at http://www.bitstorm.org/gameoflife/
	          
	         
};                             