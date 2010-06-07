function SaveSateAssistant() {
};

SaveSateAssistant.prototype.btnOKModel = {
	label : "OK",
	buttonClass : "palm-button affirmative",
	disabled : true
};
SaveSateAssistant.prototype.btnCancelModel = {
	label : "Cancel",
	buttonClass : "palm-button dismiss",
	disabled : false
};

SaveSateAssistant.prototype.attr = {
		changeOnKeyPress : true,
};

SaveSateAssistant.prototype.saveStateModel = {
		value : ""
};

SaveSateAssistant.prototype.setup = function() {
	
	game.mainAssistant.controller.setupWidget("saveState_name",
			this.attr, this.saveStateModel);
	Mojo.Event.listen(game.mainAssistant.controller.get("saveState_name"), 
			Mojo.Event.propertyChange, function(value) {
		if (value.value.trim() != "") {
			this.btnOKModel.disabled = false;
		} else {
			this.btnOKModel.disabled = true;
		}
		game.mainAssistant.controller.modelChanged(this.btnOKModel);
	}.bind(this));
	
	game.mainAssistant.controller.setupWidget("saveState_btnOK", {},
			this.btnOKModel);
	Mojo.Event.listen(game.mainAssistant.controller.get("saveState_btnOK"),
			Mojo.Event.tap, function() {
				saveState.pressOK();
			}.bind(this));

	game.mainAssistant.controller.setupWidget("saveState_btnCancel", {},
			this.btnCancelModel);
	Mojo.Event.listen(game.mainAssistant.controller.get("saveState_btnCancel"),
			Mojo.Event.tap, function() {
		saveState.closeDialog();
	}.bind(this));

};

var saveState = {

	listArray : null,
		
	pressOK : function() {
		game.depot.get("list", saveState.processList, game.depotFailed);
	},
		
	processList : function(val) {
		saveState.listArray = val;
		var stateName = game.saveSateAssistant.saveStateModel.value.trim();
		Mojo.Log.info("val: " + val + " name: " + stateName);
		if (saveState.listArray == null) {
			saveState.listArray = new Array();
		}
		// check that element with the same key doesn't exist yet
		for (x in saveState.listArray) {
			if (saveState.listArray[x] == stateName) {
					saveState.closeDialog();
					game.dialog = game.mainAssistant.controller.showAlertDialog({
					onChoose: saveState.processListAlert,
				    title: $L("State Already Exists"),
				    message: $L("The state with name '" + stateName + "' already exists."),
				    choices:[
				         {label:$L("Cancel"), value:"cancel", type:'affirmative'},  
				         {label:$L("Overwrite"), value:"overwrite", type:'negative'},    
				    ]});	
				return;
			}
		}
		saveState.save(false);
		saveState.closeDialog();
		
	},

	save : function(overwrite) {
		var stateName = game.saveSateAssistant.saveStateModel.value.trim();
		if (!overwrite) {
			saveState.listArray.push(stateName);
			game.depot.add("list", saveState.listArray, game.depotCreated, game.depotFailed);
		}
		game.depot.add(stateName + ".cellSize", game.cellSize);
		game.depot.add(stateName + ".data", game.data);
		game.depot.add(stateName + ".liveCellCounter", game.liveCellCounter);
	},
	
	processListAlert : function(val) {
		if (val == "cancel") {
			game.dialog.mojo.close();
			game.openSaveStateDialog();
		}
		if (val == "overwrite") {
			saveState.save(true);
			saveState.closeDialog();
		}
	},
	
	closeDialog : function() {
		game.dialog.mojo.close();
		game.dialog = null;
	},
	
};




SaveSateAssistant.prototype.activate = function() {

};
