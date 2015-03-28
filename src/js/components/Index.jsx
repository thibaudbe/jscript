'use strict';

var React           = require('react');
var Reflux          = require('reflux');
var DocumentTitle   = require('react-document-title');

var AppStore        = require('../stores/AppStore');
var AppActions      = require('../actions/AppActions');
var Navbar          = require('../components/Navbar.jsx');
var Editor          = require('../components/Editor.jsx');
// var Alerts          = require('../partials/components/Alerts.jsx');


var Index = React.createClass({

  mixins: [Reflux.connect(AppStore)],

	getInitialState: function() {
		return AppStore.fetchData();
	},
	
	render: function() {
		if (typeof(this.state) == undefined)
			return <div>Loading</div>;

		return (
			<DocumentTitle title={'JScript • '+ this.state.settings.title}>
				<div id="form">
					<Navbar {...this.state} />
					<Editor {...this.state} />
				</div>
			</DocumentTitle>
		);
	}

});

module.exports = Index;
