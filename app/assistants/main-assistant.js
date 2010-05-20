function MainAssistant() {
	/*
	 * this is the creator function for your scene assistant object. It will be
	 * passed all the additional parameters (after the scene name) that were
	 * passed to pushScene. The reference to the scene controller
	 * (this.controller) has not be established yet, so any initialization that
	 * needs the scene controller should be done in the setup function below.
	 */
}

MainAssistant.prototype.btnClearModel = {
	label : "Clear",
	buttonClass : "palm-button affirmative",
	disabled : true
};

MainAssistant.prototype.btnStepModel = {
	label : "Step",
	buttonClass : "palm-button affirmative",
	disabled : true
};

MainAssistant.prototype.btnRunModel = {
	label : "Run",
	buttonClass : "palm-button affirmative",
	disabled : true
};

MainAssistant.prototype.setup = function() {
	this.controller.enableFullScreenMode(true);
	game.mainAssistant = this;

	var screenHeight = Mojo.Environment.DeviceInfo.screenHeight;
	if (screenHeight == 400) {
		$("mainButtonsRow").style.top = "330px";
		$("mainCanvas400").style.display = "inline";
		game.ctx = $("mainCanvas400").getContext("2d");
	} else if (screenHeight == 480) {
		$("mainButtonsRow").style.top = "410px";
		$("mainCanvas480").style.display = "inline";
		game.ctx = $("mainCanvas480").getContext("2d");
	}

	// Set up Clear button.
	this.controller.setupWidget("main_btnClear", {},
			this.btnClearModel);
	Mojo.Event.listen(this.controller.get("main_btnClear"), Mojo.Event.tap,
			this.clearPressed.bind(this));

	// Set up Step button.
	this.controller.setupWidget("main_btnStep", {},
			this.btnStepModel);
	Mojo.Event.listen(this.controller.get("main_btnStep"), Mojo.Event.tap,
			this.stepPressed.bind(this));

	// Set up Run button.
	this.controller.setupWidget("main_btnRun", {},
			this.btnRunModel);
	Mojo.Event.listen(this.controller.get("main_btnRun"), Mojo.Event.tap,
			this.runPressed.bind(this));
};

MainAssistant.prototype.clearPressed = function(event) {
	Mojo.Log.info("Clear pressed");
	game.clear();
};

MainAssistant.prototype.stepPressed = function(event) {
	Mojo.Log.info("Step pressed");
	game.step();
};

MainAssistant.prototype.runPressed = function(event) {
	if (this.btnRunModel.label == "Run") {
		this.btnClearModel.disabled = true;
		this.btnStepModel.disabled = true;
		this.btnRunModel.label = "Pause";
		game.run();
	} else {
		this.btnClearModel.disabled = false;
		this.btnStepModel.disabled = false;
		this.btnRunModel.label = "Run";
		game.pause();
	}
	this.updateButtons();
};

MainAssistant.prototype.updateButtons = function() {
	game.mainAssistant.controller.modelChanged(this.btnRunModel);
	game.mainAssistant.controller.modelChanged(this.btnClearModel);
	game.mainAssistant.controller.modelChanged(this.btnStepModel);
};

MainAssistant.prototype.activate = function(event) {

	Mojo.Log.info("MainAssistant.prototype.activate - started");

	game.init();
	game.drawBackground();

	Mojo.Event.listen(this.controller.document, Mojo.Event.tap,
			game.tapHandlerBind, true);

	this.helpPressed();
};

MainAssistant.prototype.helpPressed = function() {
	game.dialog = game.mainAssistant.controller.showDialog( {
		template : "instructions-dialog",
		assistant : new InstructionsAssistant(),
		preventCancel : true
	});
};

MainAssistant.prototype.deactivate = function(event) {
	/*
	 * remove any event handlers you added in activate and do any other cleanup
	 * that should happen before this scene is popped or another scene is pushed
	 * on top
	 */
};

MainAssistant.prototype.cleanup = function(event) {
	/*
	 * this function should do any cleanup needed before the scene is destroyed
	 * as a result of being popped off the scene stack
	 */
};
