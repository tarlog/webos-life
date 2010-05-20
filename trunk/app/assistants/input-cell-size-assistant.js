function InputCellAssistant() {
};

InputCellAssistant.prototype.btnOKModel = {
	label : "OK",
	buttonClass : "palm-button affirmative",
	disabled : false
};
InputCellAssistant.prototype.btnCanceltModel = {
	label : "Cancel",
	buttonClass : "palm-button affirmative",
	disabled : false
};
InputCellAssistant.prototype.cellSizeAttr = {
	min : 10,
	max : 40
};
InputCellAssistant.prototype.cellSizeModel = {
	value : 30
};

InputCellAssistant.prototype.setup = function() {

	this.cellSizeModel.value = game.cellSize;
	game.mainAssistant.controller.setupWidget("inCellSize_picker",
			this.cellSizeAttr, this.cellSizeModel);

	game.mainAssistant.controller.setupWidget("inCellSize_btnOK", {},
			this.btnOKModel);
	Mojo.Event.listen(game.mainAssistant.controller.get("inCellSize_btnOK"),
			Mojo.Event.tap, function() {
				// clean old
			game.ctx.fillStyle = "rgb(0,0,0)";
			game.ctx.fillRect(game.xAdj, game.yAdj, game.backgroundWidth,
					game.backgroundHeight);
			game.cellSize = this.cellSizeModel.value;
			game.dialog.mojo.close();
			game.recalculate();
			game.drawBackground();
			game.dialog = null;
		}.bind(this));

	// Set up Next button.
	game.mainAssistant.controller.setupWidget("inCellSize_btnCancel", {},
			this.btnCanceltModel);
	Mojo.Event.listen(
			game.mainAssistant.controller.get("inCellSize_btnCancel"),
			Mojo.Event.tap, function() {
				game.dialog.mojo.close();
				game.dialog = null;
			}.bind(this));

};

InputCellAssistant.prototype.activate = function() {

};
