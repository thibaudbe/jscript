'use strict';

var React    = require('react');
var Addons   = require('react/addons');

var Libraries = require('./settings/Libraries.jsx');
// var AppStore = require('../../stores/AppStore');
// var AppActions = require('../../actions/AppActions');


var Settings = React.createClass({

	getInitialState: function() {
		return {
			editor: this.props.editor,
			settings: this.props.settings
		}
	},

	onChange: function(name, e) {
		var state = new Object();
		var this_index = null;
		var type = e.target.type;
		var this_value = e.target.value;
		var p_name = 'settings';

		// Init sub object
		var parent = new Object();
		parent[p_name] = this.state[p_name];
		
		// if type is a checkbox
		if (type == 'checkbox') {
			state[name] = this.state[p_name][name] ? false : true;

		// if type is a single selectbox or a radio
		} else if (type == 'select-one' || type == 'radio') {
			this.state[p_name][name].forEach(function(elem, i) {
				if (elem.value == this_value)
					this_index = i;
			});
			
			var this_select = this.state[p_name][name][this_index].selected;
			state[name] = this.state[p_name][name];
			
			if (this_select == false) {
				this.state[p_name][name].forEach(function(elem, i) {
					state[name][i].selected = this_index == i ? true : false;
				});
			}

		// if type is a multiple select
		} else if (type == 'select-multiple') {
			var dom_value = this.refs[name].getDOMNode();
			
			state[name] = this.state[p_name][name];
			state[name].forEach(function(elem, i) {
				elem.selected = false;
			});
			
			this_value = [].map.call(dom_value, function(elem, i, arr) {
				return elem.selected ? elem.value : null;
			});
			
			this_value.forEach(function(elem, i) {
				var that = elem;
				state[name].forEach(function(elem, j) {
					if (that == elem.value && !elem.selected) {
						elem.selected = true;
					}
				})
			});

		// if type is just text
		} else {
			state[name] = this_value;
		}

		// Render sub object
		parent[p_name][name] = state[name];
		return this.setState(parent);
	},

	singleSelect: function(name) {
		var default_value = null;
		var options = this.state[name].map(function(elem, i) {
			if (elem.selected == true) default_value = elem.value;
			return <option value={elem.value} key={i}>{elem.label}</option>
		}, this);

		return (
			<select 
				name={name}
				value={default_value} 
				onChange={this.onChange.bind(this, name)}>
					{options}
			</select>
		)
	},

	render: function() {
		return (
			<li className="dropdown">
				<a href="javascript:void(0)">
					<i className="fa fa-cog"></i>
					<span>Settings</span>
				</a>
				<ul>
					<li>
						<input 
							type="text" 
							name="title" 
							placeholder="Title" 
							value={this.state.settings.title} 
							onChange={this.onChange.bind(this, 'title')} 
						/>
						<textarea 
							name="description" 
							placeholder="Description" 
							value={this.state.settings.description} 
							onChange={this.onChange.bind(this, 'description')} 
						/>
					</li>

					<li className="sep"></li>
					
					<Libraries {...this.state} />	

					<li className="sep"></li>
					<li>
						<label htmlFor="reset">
							Normalized CSS 
							<input 
								name="reset" 
								type="checkbox" 
								value={this.state.settings.reset} 
								onChange={this.onChange.bind(this, 'reset')} 
								checked={this.state.settings.reset} 
							/>
						</label>
					</li>
					<li>
						<label htmlFor="sass">
							Sass support 
							<input 
								name="sass" 
								type="checkbox" 
								value={this.state.settings.sass} 
								onChange={this.onChange.bind(this, 'sass')} 
								checked={this.state.settings.sass} 
							/>
						</label>
					</li>
					<li>
						<label htmlFor="preview">
							Live preview 
							<input 
								name="preview" 
								type="checkbox" 
								value={this.state.settings.preview} 
								onChange={this.onChange.bind(this, 'preview')} 
								checked={this.state.settings.preview} 
							/>
						</label>
					</li>
				</ul>
			</li>
		);
	}

});

module.exports = Settings;
