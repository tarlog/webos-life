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
		var cols = Math.floor(this.backgroundWidth / this.cellSize);
		var rows = Math.floor(this.backgroundHeight / this.cellSize);
		for (x=0;  x<cols; ++x) {
			this.data[x] = new Array();
			for (y=0; y<rows; ++y) {
				this.data[x][y] = 0;
			}
		}
		
		// Bind mainLoop() context.
// this.mainLoopBind = this.mainLoop.bind(this);

		// Bind and tapHandler() context.
		this.tapHandlerBind = this.tapHandler.bind(this);

		// Preload all images.
		this.background = new Image();
		this.background.src = "images/background-" + this.screenHeight + ".png";

		this.liveCell = new Image();
		this.liveCell.src = "images/live-cell.png";

		this.deadCell = new Image();
		this.deadCell.src = "images/dead-cell.png";
	}, /* End init(). */

	drawBackground : function() {
		game.ctx.drawImage(game.background, game.xAdj, game.yAdj);
	},
	
	/**
	 * Start a new game. Called any time the game is restarted.
	 */
	startNewGame : function() {

		this.ctx.fillStyle = "rgb(255,255,255)";
		this.ctx.font = "normal normal bold 12pt arial";


		// Draw the hands.
		// this.drawHands();

		// Start the main game loop.
		// this.gameInProgress = true;
		// this.mainLoopInterval = setInterval(this.mainLoopBind, 33);

	}, /* End startNewGame(). */

	clear : function() {
		this.drawBackground();
	},
	
	step : function() {
	},
	
	run : function() {
	},
	
	pause : function() {
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
				this.data[xcell][ycell] = 0;
				this.ctx.drawImage(this.deadCell, 1 + this.xAdj + xcell
						* this.cellSize, 1 + this.yAdj + ycell * this.cellSize);
			} else {
				this.data[xcell][ycell] = 1;
				this.ctx.drawImage(this.liveCell, 1 + this.xAdj + xcell
						* this.cellSize, 1 + this.yAdj + ycell * this.cellSize);
			}
		}
	}, /* End tapHandler(). */


}; /* End game object. */