function SaveSateAssistant() {
};

SaveSateAssistant.prototype.btnOKModel = {
	label : "OK",
	buttonClass : "palm-button affirmative",
	disabled : false
};
SaveSateAssistant.prototype.btnCancelModel = {
	label : "Cancel",
	buttonClass : "palm-button dismiss",
	disabled : false
};

SaveSateAssistant.prototype.attr = {
		textFieldName: 'username',
		hintText: 'Enter Your Username',
};

SaveSateAssistant.prototype.saveStateModel = {
		value : ""
};

SaveSateAssistant.prototype.setup = function() {
	
	game.mainAssistant.controller.setupWidget("saveState_name",
			this.attr, this.saveStateModel);

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
		Mojo.Log.info("val: " + val + " modelValue: " + game.saveSateAssistant.saveStateModel.value);
		if (saveState.listArray == null) {
			saveState.listArray = new Array();
		}
		// check that element with the same key doesn't exist yet
		for (x in saveState.listArray) {
			if (saveState.listArray[x] == game.saveSateAssistant.saveStateModel.value) {
					saveState.closeDialog();
					game.dialog = game.mainAssistant.controller.showAlertDialog({
					onChoose: saveState.processListAlert,
				    title: $L("State Already Exists"),
				    message: $L("The state with name '" + game.saveSateAssistant.saveStateModel.value + "' already exists."),
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
		if (!overwrite) {
			saveState.listArray.push(game.saveSateAssistant.saveStateModel.value);
			game.depot.add("list", saveState.listArray, game.depotCreated, game.depotFailed);
		}
		game.depot.add(game.saveSateAssistant.saveStateModel.value + ".cellSize", game.cellSize);
		game.depot.add(game.saveSateAssistant.saveStateModel.value + ".data", game.data);
		game.depot.add(game.saveSateAssistant.saveStateModel.value + ".liveCellCounter", game.liveCellCounter);
	},
	
	processListAlert : function(val) {
		Mojo.Log.info("processListAlert: " + val)
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
