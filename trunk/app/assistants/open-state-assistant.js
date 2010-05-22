function OpenSateAssistant() {
};

OpenSateAssistant.prototype.btnOKModel = {
	label : "OK",
	buttonClass : "palm-button affirmative",
	disabled : false
};
OpenSateAssistant.prototype.btnCancelModel = {
	label : "Cancel",
	buttonClass : "palm-button dismiss",
	disabled : false
};

OpenSateAssistant.prototype.listModel = {
		disabled: false,
		choices: {}
};

OpenSateAssistant.prototype.setup = function() {
	
	openState.init();
	
	game.mainAssistant.controller.setupWidget("openState_list",
			{}, this.listModel);
	
	game.mainAssistant.controller.setupWidget("openState_btnOK", {},
			this.btnOKModel);
	Mojo.Event.listen(game.mainAssistant.controller.get("openState_btnOK"),
			Mojo.Event.tap, function() {
		openState.pressOK();
	}.bind(this));

	game.mainAssistant.controller.setupWidget("openState_btnCancel", {},
			this.btnCancelModel);
	Mojo.Event.listen(game.mainAssistant.controller.get("openState_btnCancel"),
			Mojo.Event.tap, function() {
		openState.closeDialog();
	}.bind(this));

};

OpenSateAssistant.prototype.activate = function() {

};

var openState = {
	
	init : function() {
		game.depot.get("list", openState.processList, game.depotFailed);
	},
	
	processList : function(value) {
		Mojo.Log.info("openState from: " + value);
		if (value != null) {
			var choices = new Array();
			var index;
			for (index = 0; index < value.length; ++index) {
				choices.push({label: value[index], value: value[index]});
			}
			game.openSateAssistant.listModel.choices = choices;
			game.openSateAssistant.listModel.disabled = false;
			if (game.openSateAssistant.listModel.value == null) {
				game.openSateAssistant.listModel.value = value[0];
			}
			game.mainAssistant.controller.modelChanged(game.openSateAssistant.listModel);
		}
	},
	
	closeDialog : function() {
		game.dialog.mojo.close();
		game.dialog = null;
	},
	
	pressOK : function() {
		game.depot.get(game.openSateAssistant.listModel.value + ".cellSize", openState.setCellSize, game.depotFailed);
		game.depot.get(game.openSateAssistant.listModel.value + ".data", openState.setData, game.depotFailed);
	},
	
	setCellSize : function(val) {
		if (val != null) {
			game.cellSize = val;
		} else {
			Mojo.Log.error("setCellSize failed!")
		}
		Mojo.Log.info("Cell Size: " + val);
	},
	
	setData : function(val) {
		if (val != null) {
			game.data = val;
			
			openState.closeDialog();
			game.recalculate();
			game.drawBackground();
			var counter = 0;
			game.data = new Array();
			for (x = 0; x < game.cols; ++x) {
				game.data[x] = new Array();
				for (y = 0; y < game.rows; ++y) {
					game.data[x][y] = val[x][y]; 
					if (val[x][y] == 1) {
						Mojo.Log.info(val[x][y] + " x=" + x + " y=" +y);
						game.drawLive(x, y);
					} else {
						game.drawDead(x, y);
					}
					counter++;
				}
			}
		} else {
			Mojo.Log.error("setData failed!")
		}
	},
	
	
};
