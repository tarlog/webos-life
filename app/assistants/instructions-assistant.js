function InstructionsAssistant() {
};

/**
 * Which page of instructions is currently showing.
 */
InstructionsAssistant.prototype.instructionsPage = null;

/**
 * Models for the Prev and Next buttons (so we can enable/disabled them).
 */
InstructionsAssistant.prototype.btnPrevModel = {
	label : "<< Prev",
	buttonClass : "palm-button affirmative",
	disabled : true
};
InstructionsAssistant.prototype.btnNextModel = {
	label : "Next >>",
	buttonClass : "palm-button affirmative",
	disabled : false
};

InstructionsAssistant.prototype.btnStartModel = {
	label : "Start",
	buttonClass : "palm-button negative"
};

/**
 * Set up the scene.
 */
InstructionsAssistant.prototype.setup = function() {

	this.instructionsPage = 1;

	// Set up Prev button.
	game.mainAssistant.controller.setupWidget("instructions_btnPrevious", {},
			this.btnPrevModel);
	Mojo.Event.listen(game.mainAssistant.controller
			.get("instructions_btnPrevious"), Mojo.Event.tap, function() {
		// Move back a page.
			if (this.instructionsPage > 1) {
				this.instructionsPage = this.instructionsPage - 1;
			}
			this.doCommonButtonWork();
		}.bind(this));

	// Set up Next button.
	game.mainAssistant.controller.setupWidget("instructions_btnNext", {},
			this.btnNextModel);
	Mojo.Event.listen(
			game.mainAssistant.controller.get("instructions_btnNext"),
			Mojo.Event.tap, function() {
				// Move forward a page.
			if (this.instructionsPage < 5) {
				this.instructionsPage = this.instructionsPage + 1;
			}
			this.doCommonButtonWork();
		}.bind(this));

	// Set up Start button.
	game.mainAssistant.controller.setupWidget("instructions_btnStart", {},
			this.btnStartModel);
	Mojo.Event.listen(game.mainAssistant.controller
			.get("instructions_btnStart"), Mojo.Event.tap, function() {
		game.dialog.mojo.close();
		game.dialog = null;
		this.btnStartModel.buttonClass = "palm-button dismiss"; 
		this.btnStartModel.label = "Close"; // only first time it's called
											// "start", next time it's called
											// "close"
		}.bind(this));

}; // End setup().

/**
 * Activate the scene.
 */
InstructionsAssistant.prototype.activate = function() {

}; // End activate().

/**
 * Do work common to both nav buttons.
 */
InstructionsAssistant.prototype.doCommonButtonWork = function() {

	// By default, enable both nav buttons.
	this.btnPrevModel.disabled = false;
	this.btnNextModel.disabled = false;

	// Disable Prev if necessary.
	if (this.instructionsPage == 1) {
		this.btnPrevModel.disabled = true;
	}

	// Disable Next if necessary.
	if (this.instructionsPage == 5) {
		this.btnNextModel.disabled = true;
	}

	// Update button models.
	game.mainAssistant.controller.modelChanged(this.btnPrevModel);
	game.mainAssistant.controller.modelChanged(this.btnNextModel);

	// Hide all pages, then show the appropriate one.
	$("instructions_divPage1").style.display = "none";
	$("instructions_divPage2").style.display = "none";
	$("instructions_divPage3").style.display = "none";
	$("instructions_divPage4").style.display = "none";
	$("instructions_divPage5").style.display = "none";
	$("instructions_divPage" + this.instructionsPage).style.display = "";

};