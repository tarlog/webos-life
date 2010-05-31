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
		var names = new Array();
		
		var gliderData = this.adjustSize(this.glider, this.gliderRows, this.gliderCellSize);
		if (gliderData != null) {
			names.push("Glider");
			game.depot.add("Glider.cellSize", this.gliderCellSize);
			game.depot.add("Glider.data", gliderData);
			game.depot.add("Glider.liveCellCounter", this.gliderLiveCells);
		}

		var blinkerData = this.adjustSize(this.blinker, this.blinkerRows, this.blinkerCellSize);
		if (blinkerData != null) {
			names.push("Blinker");
			game.depot.add("Blinker.cellSize", this.blinkerCellSize);
			game.depot.add("Blinker.data", blinkerData);
			game.depot.add("Blinker.liveCellCounter", this.blinkerLiveCells);
		}

		var spaceshipData = this.adjustSize(this.spaceship, this.spaceshipRows, this.spaceshipCellSize);
		if (spaceshipData != null) {
			names.push("Spaceship");
			game.depot.add("Spaceship.cellSize", this.spaceshipCellSize);
			game.depot.add("Spaceship.data", spaceshipData);
			game.depot.add("Spaceship.liveCellCounter", this.spaceshipLiveCells);
		}

		var pulsarData = this.adjustSize(this.pulsar, this.pulsarRows, this.pulsarCellSize);
		if (pulsarData != null) {
			names.push("Pulsar");
			game.depot.add("Pulsar.cellSize", this.pulsarCellSize);
			game.depot.add("Pulsar.data", pulsarData);
			game.depot.add("Pulsar.liveCellCounter", this.pulsarLiveCells);
		}

		game.depot.add("list", names, game.depotCreated, game.depotFailed);
	},

	          
	         
};                             