'use strict';

var React = require('react');


var Libraries = React.createClass({

	getInitialState: function() {
		return {
			editor: this.props.editor,
			settings: this.props.settings
		}
	},

	onAddRemove: function(type, e) {
		e.preventDefault();
		var state = new Object();
		var this_index = null;
		var this_value = null;
		var p_name = 'settings';
		var t_name = 'libraries'

		// Init sub object
		var parent_name = {};
		parent_name[p_name] = this.state[p_name];

		switch(type) {
			case 'add':
				this_value = this.refs.libraries.getDOMNode().value;
				state[t_name] = this.state[p_name][t_name];
				var extension = this_value.split('.').pop();

				if (extension == 'js' || extension == 'css') {
					state[t_name].push(this_value);
					this.refs.libraries.getDOMNode().value = '';
				} else {
					console.log('UNVALID FILE !');
				}
				break;
			case 'remove':
				state[t_name] = new Array();
				this_index = e.target.dataset.index;

				this.state[p_name][t_name].forEach(function(elem, i) {
					if (this_index != i) {
						state[t_name].push(elem);
					}
				});
				break;
		}

		// Render sub object
		parent_name[p_name][t_name] = state[t_name];
		return this.setState(parent_name);
	},

	render: function() {
		return (
			<li>
				<span className="input-group">
					<form name="libraries" onSubmit={this.onAddRemove.bind(this, 'add')}>
						<input type="text" ref="libraries" placeholder="Import Libraries" />
						<button type="submit" className="add">
							<i className="fa fa-plus"></i>
						</button>
					</form>
				</span>
				<ul id="libraries" className="libraries">
					{this.state.settings.libraries.map(function(elem, i) {
						return (
							<li key={i}>
								<a href={elem} className="link" target="_blank">{elem}</a> 
								<a href="javascript:void(0)" data-index={i} onClick={this.onAddRemove.bind(this, 'remove')} className="remove">
									<i data-index={i} className="fa fa-minus"></i>
								</a>
							</li>
						)
					}, this)}
				</ul>
			</li>
		);
	}

});

module.exports = Libraries;
