'use strict';

var Reflux = require('reflux');
var AppStore = require('../stores/AppStore');


var AppActions = Reflux.createActions([
	'load',
	// 'saveData',
	// 'removeData',
	// 'shareData',
]);

// AppActions.removeData.preEmit = function(id) {
// 	console.log('-> Remove Data');
// };

// AppActions.saveData.preEmit = function(id) {
// 	console.log('-> Save Data');
// };

// AppActions.shareData.preEmit = function(id) {
// 	console.log('-> Share Data');
// };


module.exports = AppActions;
