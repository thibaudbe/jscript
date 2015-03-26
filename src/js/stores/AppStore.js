'use strict';

var Reflux = require('reflux');

var AppActions = require('../actions/AppActions');
var Data = require('../models/Data');
var Api = require('../utils/Api');


var AppStore = Reflux.createStore({
	listenables: [AppActions],

	init: function() {
		this.listenTo(AppActions.load, this.fetchData);
	},

	getInitialState: function() {
		return {
			editor: Api.editor,
			settings: Api.settings
		};
	},
	
	fetchData: function(data) {
		if (!data)
	    this.data = new Data(Api.settings, Api.editor);
	  else
	  	this.data = data;
    this.trigger(this.data);
	},
	
	// onSaveData: function(data) {
	// 	console.log('-> onSaveDate', data);
	// },
	
	// onRemoveData: function(key) {
	// 	console.log('-> onRemoveDate');
	// }
	
});


module.exports = AppStore;
