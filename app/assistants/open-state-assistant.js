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
OpenSateAssistant.prototype.btnDeleteModel = {
		label : "Delete",
		buttonClass : "palm-button negative",
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
	
	game.mainAssistant.controller.setupWidget("openState_btnDelete", {},
			this.btnDeleteModel);
	Mojo.Event.listen(game.mainAssistant.controller.get("openState_btnDelete"),
			Mojo.Event.tap, function() {
		openState.pressDelete();
	}.bind(this));
	
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
			if (game.openSateAssistant.listModel.value == null || choices.indexOf(game.openSateAssistant.listModel.value) == -1) {
				game.openSateAssistant.listModel.value = value[0];
			}
			game.mainAssistant.controller.modelChanged(game.openSateAssistant.listModel);
		}
	},
	
	closeDialog : function() {
		game.dialog.mojo.close();
		game.dialog = null;
	},
	
	pressDelete : function() {
		var todelete = game.openSateAssistant.listModel.value;
		openState.closeDialog();
		game.dialog = game.mainAssistant.controller.showAlertDialog( {
			onChoose : function(value) {
				if (value == "delete") {
					game.depot.discard(game.openSateAssistant.listModel.value + ".cellSize", game.depotCreated, game.depotFailed);
					game.depot.discard(game.openSateAssistant.listModel.value + ".data",  game.depotCreated, game.depotFailed);
					game.depot.discard(game.openSateAssistant.listModel.value + ".liveCellCounter",  game.depotCreated, game.depotFailed);
					game.depot.get("list", openState.processDelete, game.depotFailed);
				} else {
					game.openOpenStateDialog();
				}
			},
			message : $L("Are you sure you want to delete '" + todelete +
					"'?"),
			choices : [ {
				label : $L('No'),
				value : "no",
				type : 'affirmative'
			}, {
				label : $L("Delete!"),
				value : "delete",
				type : 'negative'
			}, {
				label : $L("Nevermind"),
				value : "cancel",
				type : 'dismiss'
			} ]
		});
	},

	processDelete : function(list) {
		var newList = new Array();
		for (index = 0; index < list.length; ++index) {
			if (list[index] != game.openSateAssistant.listModel.value) {
				newList.push(list[index]);
			}
		}
		game.depot.add("list", newList, game.depotCreated, game.depotFailed);
		game.openOpenStateDialog();
	},
	
	pressOK : function() {
		game.depot.get(game.openSateAssistant.listModel.value + ".cellSize", openState.setCellSize, game.depotFailed);
		game.depot.get(game.openSateAssistant.listModel.value + ".data", openState.setData, game.depotFailed);
		game.depot.get(game.openSateAssistant.listModel.value + ".liveCellCounter", openState.setLiveCellCounter, game.depotFailed);
		game.mainAssistant.btnRunModel.disabled = false;
		game.mainAssistant.btnClearModel.disabled = false;
		game.mainAssistant.btnStepModel.disabled = false;
		game.mainAssistant.updateButtons();
	},
	
	setCellSize : function(val) {
		if (val != null) {
			game.cellSize = val;
		} else {
			Mojo.Log.error("cellSize null")
		}
	},

	setLiveCellCounter : function(val) {
		if (val != null) {
			game.liveCellCounter = val;
		} else {
			Mojo.Log.error("liveCellCounter null!")
		}
	},

	
	setData : function(val) {
		if (val != null) {
			game.data = val;
			openState.closeDialog();
			game.ctx.fillStyle = "rgb(0,0,0)";
			game.ctx.fillRect(game.xAdj, game.yAdj, game.backgroundWidth,
					game.backgroundHeight);
			game.recalculate();
			game.drawBackground();
			var counter = 0;
			game.data = new Array();
			for (x = 0; x < game.cols; ++x) {
				game.data[x] = new Array();
				for (y = 0; y < game.rows; ++y) {
					game.data[x][y] = val[x][y]; 
					if (val[x][y] == 1) {
						game.drawLive(x, y);
					} else {
						game.drawDead(x, y);
					}
					counter++;
				}
			}
		} else {
			Mojo.Log.error("data null!")
		}
	},
	
	
};
