/**
 * The main game object, where all the action is!
 */
var game = {

	/**
	 * A reference to the main scene assistant.
	 */
	mainAssistant : null,

	/**
	 * Flag set to true when a game is in progress (used for pausing).
	 */
	gameInProgress : false,

	/**
	 * The 2D context of the canvas.
	 */
	ctx : null,

	/**
	 * The height of the screen. Used throughout to deal with 400 versus 480
	 * screen heights.
	 */
	screenHeight : null,

	/**
	 * This is a reference to the main game loop bound to the context of the
	 * game object. This is necessary to provide the proper execution context
	 * when the main game loop is executed form the interval.
	 */
	mainLoopBind : null,

	/**
	 * Binds for the key, screen, orientation change and stage event handlers.
	 */
	tapHandlerBind : null,

	/**
	 * Reference to the interval that runs the main game loop.
	 */
	mainLoopInterval : null,

	/**
	 * actual data
	 */
	data : null,
	
	liveCellCounter : 0,
	cols : 0,
	rows : 0,
	
	/**
	 * X/Y values to adjust all coordinates so things are drawn in the
	 * playfield.
	 */
	xAdj : 11,
	yAdj : 11,
	cellSize : 11,

	/**
	 * The game background image and its height.
	 */
	background : null,
	backgroundHeight : null,
	backgroundWidth : null,
	liveCell : null,
	deadCell : null,

	/**
	 * Reference to the currently opened dialog, if any.
	 */
	dialog : null,

	/**
	 * Initialize the game. This is called once at application startup.
	 */
	init : function() {

		Mojo.Log.info("game.init - started");

		var i = null;

		// Use screen height to calculate dimensions for various assets.
		this.screenHeight = Mojo.Environment.DeviceInfo.screenHeight;
		this.backgroundHeight = this.screenHeight - 80;
		this.backgroundWidth = Mojo.Environment.DeviceInfo.screenWidth - 22;
// this.gameConsole.frameHeight = this.screenHeight - 80;

		// init data
		this.data = new Array();
		this.cols = Math.floor(this.backgroundWidth / this.cellSize);
		this.rows = Math.floor(this.backgroundHeight / this.cellSize);
		for (x = 0;  x < this.cols; ++x) {
			this.data[x] = new Array();
			for (y = 0; y < this.rows; ++y) {
				this.data[x][y] = 0;
			}
		}
		
		// Bind and tapHandler() context.
		this.tapHandlerBind = this.tapHandler.bind(this);

		// Preload all images.
		this.background = new Image();
		this.background.src = "images/background-" + this.screenHeight + ".png";

		this.liveCell = new Image();
		this.liveCell.src = "images/live-cell.png";

		this.deadCell = new Image();
		this.deadCell.src = "images/dead-cell.png";
		
		
		this.mainLoopBind = this.step.bind(this);
		
	}, /* End init(). */

	/**
	 * draws the background. Currently it draws the images of background, but
	 * later it may be changed to make drawing cell-by-cell
	 */
	drawBackground : function() {
		game.ctx.drawImage(game.background, game.xAdj, game.yAdj);
	},
	
	clear : function() {
		this.drawBackground();
		this.liveCellCounter = 0;
		for (x = 0;  x < this.cols; ++x) {
			for (y = 0; y < this.rows; ++y) {
				this.data[x][y] = 0;
			}
		}
		this.mainAssistant.btnRunModel.disabled = true;
		this.mainAssistant.btnClearModel.disabled = true;
		this.mainAssistant.btnStepModel.disabled = true;
		this.mainAssistant.updateButtons();
	},
	
	step : function() {
		var newData = new Array();
		for (x = 0;  x < this.cols; ++x) {
			newData[x] = new Array();
			for (y = 0; y < this.rows; ++y) {
				var neighbours = this.getNeighbours(x,y);
				if (this.data[x][y] == 1) { 
					Mojo.Log.info("Live cell at x=" + x + "; y="
							+ y + " Neighbours: " + neighbours);
					
					if (neighbours < 2 || neighbours > 3) {
						newData[x][y] = 0;
						this.drawDead(x,y);
					} else {
						newData[x][y] = 1;
					}
					
				} else {
					if (neighbours == 3) {
						newData[x][y] = 1;
						this.drawLive(x,y);
					} else {
						newData[x][y] = 0;
					}
				}
			}
		}
		this.data = newData;
	},
	
	getNeighbours : function(x,y) {
		var left = (x > 0) ? x-1 : this.cols - 1;
		var top = (y > 0) ? y-1 : this.rows - 1;
		var right = (x < this.cols - 1) ? x+1 : 0;
		var bottom = (y < this.rows - 1) ? y+1 : 0;
		
		return this.data[left][top] + this.data[left][y] + this.data[left][bottom] + this.data[x][top] + this.data[x][bottom] + this.data[right][top] + this.data[right][y] + this.data[right][bottom];  
	},
	
	run : function() {
		this.gameInProgress = true;
	    this.mainLoopInterval = setInterval(this.mainLoopBind, 500);
	},
	
	pause : function() {
		this.gameInProgress = false;
		clearInterval(this.mainLoopInterval);
	},
	

	/**
	 * Handle screen tap events.
	 * 
	 * @param inEvent
	 *            The generated event object.
	 */
	tapHandler : function(inEvent) {

		Mojo.Log.info("tap event: x=" + inEvent.down.x + "; y="
				+ inEvent.down.y);
		if (inEvent.down.x > this.xAdj && inEvent.down.y > this.yAdj
				&& inEvent.down.y < this.backgroundHeight + this.yAdj - 1
				&& inEvent.down.x < this.backgroundWidth + this.xAdj - 1) {
			x = inEvent.down.x - this.xAdj;
			y = inEvent.down.y - this.yAdj;
			xcell = Math.floor(x / this.cellSize);
			ycell = Math.floor(y / this.cellSize);

			if (this.data[xcell][ycell] == 1) {
				// cell was live, die!
				this.liveCellCounter--;
				if (this.liveCellCounter == 0) {
					this.mainAssistant.btnRunModel.disabled = true;
					this.mainAssistant.btnClearModel.disabled = true;
					this.mainAssistant.btnStepModel.disabled = true;
					this.mainAssistant.updateButtons();
				}
				this.data[xcell][ycell] = 0;
				this.drawDead(xcell, ycell);
				
			} else {
				if (this.liveCellCounter == 0) {
					this.mainAssistant.btnRunModel.disabled = false;
					this.mainAssistant.btnClearModel.disabled = false;
					this.mainAssistant.btnStepModel.disabled = false;
					this.mainAssistant.updateButtons();
				}
				// cell was dead, live!
				this.liveCellCounter++;
				this.data[xcell][ycell] = 1;
				this.drawLive(xcell, ycell);
			}
		}
	}, /* End tapHandler(). */

	drawLive : function(x,y) {
		this.drawCell(this.liveCell, x, y);

	},
	
	drawDead : function(x,y) {
		this.drawCell(this.deadCell, x, y);
	},

	drawCell : function(cell, xcell,ycell) {
		this.ctx.drawImage(cell, 1 + this.xAdj + xcell
				* this.cellSize, 1 + this.yAdj + ycell * this.cellSize);
	},

}; /* End game object. */