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

	depot : null,

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
	keyDownBind : null,

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
	xAdj : 7,
	yAdj : 7,
	cellSize : 20,

	/**
	 * The game background image and its height.
	 */
	// background : null,
	backgroundHeight : null,
	backgroundWidth : null,
	liveCell : null,
	deadCell : null,

	/**
	 * Reference to the currently opened dialog, if any.
	 */
	dialog : null,
	adminMode : false,
	saveSateAssistant : null,
	openSateAssistant : null,

	/**
	 * Initialize the game. This is called once at application startup.
	 */
	init : function() {

		Mojo.Log.info("Version: " + Mojo.Controller.appInfo.version);

		this.depot = new Mojo.Depot( {
			name : "com.hpalm.weboslife.1.0.0",
			replace : false
		}, this.depotCreated, this.depotFailed);
		this.depot.get("version", this.firstTimeRun, this.depotFailed);

		this.saveSateAssistant = new SaveSateAssistant();
		this.openSateAssistant = new OpenSateAssistant();

		// Use screen height to calculate dimensions for various assets.
		this.screenHeight = Mojo.Environment.DeviceInfo.screenHeight;
		this.backgroundHeight = this.screenHeight - 80;
		this.backgroundWidth = Mojo.Environment.DeviceInfo.screenWidth
				- (this.xAdj * 2);
		// this.gameConsole.frameHeight = this.screenHeight - 80;

		// init data
		this.recalculate();
		this.resetData(false);
		
		// Bind events
		this.tapHandlerBind = this.tapHandler.bind(this);
		this.keyDownBind = this.keyDown.bind(this);
		
		// Preload all images.
		this.liveCell = new Image();
		this.liveCell.src = "images/live-cell.png";

		this.deadCell = new Image();
		this.deadCell.src = "images/dead-cell.png";

		this.mainLoopBind = this.step.bind(this);

	}, /* End init(). */

	firstTimeRun : function(result) {
		var currentVersion = Mojo.Controller.appInfo.version;
		if (result == null) {
			// it's first time, when running 1.0.3+
			Mojo.Log.info("Depot: First time run of " + currentVersion);
			game.depot.add("version", currentVersion, this.depotCreated,
					this.depotFailed);
			patterns.save();
		} else {
			if (result != currentVersion) {
				Mojo.Log.info("Depot: Replacing " + result + " with " + currentVersion);
				game.depot.add("version", currentVersion, this.depotCreated,
						this.depotFailed);
				patterns.save();
			}
		}
	},
	
	depotCreated : function() {
	},

	depotFailed : function(code) {
		Mojo.Log.error("depot failed:" + code);
	},

	/**
	 * 
	 */
	recalculate : function() {
		this.data = new Array();
		this.cols = Math.floor(this.backgroundWidth / this.cellSize);
		this.rows = Math.floor(this.backgroundHeight / this.cellSize);
		// adjust xAdj to make cells centered
		this.xAdj = Math
				.floor((Mojo.Environment.DeviceInfo.screenWidth - this.cols
						* this.cellSize) / 2);
//		Mojo.Log.info("cols: " + this.cols);
//		Mojo.Log.info("rows: " + this.rows);
//		Mojo.Log.info("xAdj: " + this.xAdj);
	},
	
	resetData : function() {
		for (x = 0; x < this.cols; ++x) {
			this.data[x] = new Array();
			for (y = 0; y < this.rows; ++y) {
				this.data[x][y] = 0;
			}
		}
	},

	/**
	 * draws the background. Currently it draws the images of background, but
	 * later it may be changed to make drawing cell-by-cell
	 */
	drawBackground : function() {
		// game.ctx.drawImage(game.background, game.xAdj, game.yAdj);
		for (x = 0; x < this.cols; ++x) {
			for (y = 0; y < this.rows; ++y) {
				this.drawDead(x, y);

			}
		}
	},

	clear : function() {
		this.drawBackground();
		for (x = 0; x < this.cols; ++x) {
			for (y = 0; y < this.rows; ++y) {
				this.data[x][y] = 0;
			}
		}
		this.liveCellCounter = 0;
		this.mainAssistant.btnRunModel.disabled = true;
		this.mainAssistant.btnClearModel.disabled = true;
		this.mainAssistant.btnStepModel.disabled = true;
		this.mainAssistant.updateButtons();
	},

	step : function() {
		var cellsChanged = 0;
		var newData = new Array();
		for (x = 0; x < this.cols; ++x) {
			newData[x] = new Array();
			for (y = 0; y < this.rows; ++y) {
				var neighbours = this.getNeighbours(x, y);
				if (this.data[x][y] == 1) {
					if (neighbours < 2 || neighbours > 3) {
						newData[x][y] = 0;
						this.drawDead(x, y);
						this.decreaseCellCounter();
						++cellsChanged;
					} else {
						newData[x][y] = 1;
					}
				} else {
					if (neighbours == 3) {
						newData[x][y] = 1;
						this.drawLive(x, y);
						this.increaseCellCounter();
						++cellsChanged;
					} else {
						newData[x][y] = 0;
					}
				}
			}
		}
		this.data = newData;
		if (cellsChanged == 0 && this.gameInProgress == true
				&& this.liveCellCounter > 0) {
			this.gameInProgress = false;
			clearInterval(this.mainLoopInterval);
			this.mainAssistant.btnClearModel.disabled = false;
			this.mainAssistant.btnStepModel.disabled = false;
			this.mainAssistant.btnRunModel.label = "Run";
			this.mainAssistant.updateButtons();
		}
	},

	getNeighbours : function(x, y) {
		var left = (x > 0) ? x - 1 : this.cols - 1;
		var top = (y > 0) ? y - 1 : this.rows - 1;
		var right = (x < this.cols - 1) ? x + 1 : 0;
		var bottom = (y < this.rows - 1) ? y + 1 : 0;

		return this.data[left][top] + this.data[left][y]
				+ this.data[left][bottom] + this.data[x][top]
				+ this.data[x][bottom] + this.data[right][top]
				+ this.data[right][y] + this.data[right][bottom];
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
		if (this.dialog != null) {
			return;
		}

		if (inEvent.down.x > this.xAdj && inEvent.down.y > this.yAdj
				&& inEvent.down.y < this.backgroundHeight + this.yAdj - 1
				&& inEvent.down.x < this.backgroundWidth + this.xAdj - 1) {
			x = inEvent.down.x - this.xAdj;
			y = inEvent.down.y - this.yAdj;
			xcell = Math.floor(x / this.cellSize);
			ycell = Math.floor(y / this.cellSize);

			if (this.data[xcell][ycell] == 1) {
				// cell was live, die!
				this.decreaseCellCounter();
				this.data[xcell][ycell] = 0;
				this.drawDead(xcell, ycell);

			} else {
				// cell was dead, live!
				this.increaseCellCounter();
				this.data[xcell][ycell] = 1;
				this.drawLive(xcell, ycell);
			}
		}
	}, /* End tapHandler(). */

	decreaseCellCounter : function() {
		this.liveCellCounter--;
		if (this.liveCellCounter == 0) {
			this.mainAssistant.btnRunModel.disabled = true;
			this.mainAssistant.btnClearModel.disabled = true;
			this.mainAssistant.btnStepModel.disabled = true;
			if (this.gameInProgress == true) {
				this.gameInProgress = false;
				clearInterval(this.mainLoopInterval);
				this.mainAssistant.btnRunModel.label = "Run";
			}
			this.mainAssistant.updateButtons();
		}
	},

	increaseCellCounter : function() {
		if (this.liveCellCounter == 0) {
			this.mainAssistant.btnRunModel.disabled = false;
			this.mainAssistant.btnClearModel.disabled = false;
			this.mainAssistant.btnStepModel.disabled = false;
			this.mainAssistant.updateButtons();
		}
		this.liveCellCounter++;
	},

	drawLive : function(x, y) {
		this.drawCell(this.liveCell, x, y);

	},

	drawDead : function(x, y) {
		this.drawCell(this.deadCell, x, y);
	},

	drawCell : function(cell, xcell, ycell) {
		this.ctx.drawImage(cell, 1 + this.xAdj + xcell * this.cellSize, 1
				+ this.yAdj + ycell * this.cellSize, this.cellSize - 1,
				this.cellSize - 1);
	},

	keyDown : function(inEvent) {
		if (!this.gameInProgress && this.dialog == null) {
				switch (inEvent.originalEvent.ctrlKey) {
				case true:
					switch (inEvent.originalEvent.keyCode) {
					case Mojo.Char.h: // help
						this.mainAssistant.helpPressed();
						break;
				
					case Mojo.Char.a: // adjust cell's size
						game.dialog = game.mainAssistant.controller.showDialog( {
							template : "input-cell-size-dialog",
							assistant : new InputCellAssistant(),
							preventCancel : true
						});
						break;
					case Mojo.Char.s: // save current state
						if (this.liveCellCounter > 0) {
							this.openSaveStateDialog();
						}
						break;
					case Mojo.Char.o: // open saved states
							this.openOpenStateDialog();
						break;
					case Mojo.Char.r:
						if (game.adminMode) {
						// reset depot
						game.dialog = game.mainAssistant.controller.showAlertDialog( {
							onChoose : function(value) {
								if (value == "reset") {
									game.depot.removeAll(game.depotCreated, game.depotFailed);
									game.firstTimeRun(null);
								}
								game.dialog = null;
							},
							title : $L("Reset Depot"),
							message : $L("Do you really want to reset depot?"),
							choices : [ {
								label : $L('No'),
								value : "no",
								type : 'affirmative'
							}, {
								label : $L("Reset!!!"),
								value : "reset",
								type : 'negative'
							}, {
								label : $L("Nevermind"),
								value : "cancel",
								type : 'dismiss'
							} ]
						});
						}
						break;
					case Mojo.Char.q:
						if (game.adminMode == true) {
							Mojo.Log.info("Admin mode off");
							game.adminMode = false;
						} else {
							Mojo.Log.info("Admin mode on");
							game.adminMode = true;
						}
						break;
					}
				}
				if ( Mojo.Char.o == inEvent.originalEvent.keyCode) {
					if (game.adminMode == true) {
						Mojo.Log.info(Object.toJSON(this.data));
					}
				}
		}
	},

openSaveStateDialog : function() {
	game.dialog = game.mainAssistant.controller.showDialog( {
	template : "save-state-dialog",
	assistant : this.saveSateAssistant,
	preventCancel : true
	});
},
	
openOpenStateDialog : function() {
	Mojo.Log.info("openOpenStateDialog");
	game.dialog = game.mainAssistant.controller.showDialog( {
		template : "open-state-dialog",
		assistant : this.openSateAssistant,
		preventCancel : true
	});
}

}; /* End game object. */