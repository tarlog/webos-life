function MainAssistant() {
	/*
	 * this is the creator function for your scene assistant object. It will be
	 * passed all the additional parameters (after the scene name) that were
	 * passed to pushScene. The reference to the scene controller
	 * (this.controller) has not be established yet, so any initialization that
	 * needs the scene controller should be done in the setup function below.
	 */
}

MainAssistant.prototype.setup = function() {
	this.controller.enableFullScreenMode(true);
	game.mainAssistant = this;
};

MainAssistant.prototype.activate = function(event) {
	
	game.init();
	
	if (game.screenHeight == 400) {
		$("mainCanvas400").style.display = "block";
		game.ctx = $("mainCanvas400").getContext("2d");
	} else if (game.screenHeight == 480) {
		$("mainCanvas480").style.display = "block";
		game.ctx = $("mainCanvas480").getContext("2d");
	}
	
	Mojo.Event.listen(this.controller.document, Mojo.Event.keydown,
			game.keyDownBind, true);
	Mojo.Event.listen(this.controller.document, Mojo.Event.keyup,
			game.keyUpBind, true);
	Mojo.Event.listen(this.controller.document, Mojo.Event.tap,
			game.tapHandlerBind, true);
	
	this.controller.listen(this.controller.document, "orientationchange",
			game.orientationChangeBind, true);
	this.controller.listen(this.controller.document, Mojo.Event.stageActivate,
			game.stageActivateBind, true);
	this.controller.listen(this.controller.document,
			Mojo.Event.stageDeactivate, game.stageDeactivateBind, true);
	
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
