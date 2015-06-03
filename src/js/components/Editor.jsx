'use strict';

var React = require('react');

var Iframe     = require('./partials/editor/Iframe.jsx');
var AceEditor  = require('./partials/editor/AceEditor.jsx');

var AppActions = require('../actions/AppActions');
var AppStore   = require('../stores/AppStore');


var Editor = React.createClass({

	getInitialState: function() {
		return {
			settings: this.props.settings,
			editor: this.props.editor
		}
	},

	onChange: function(name, value) {
		var this_value = value;
		var state = {};
		var parent = {};
		var p_name = 'editor';
		
		parent[p_name] = this.state[p_name];
		state[name] = this_value;
		parent[p_name][name] = state[name];

		// if Live preview editor is enable
		if (this.state.settings.preview) {
			return this.setState(parent);
		} else {
			return;
		}
	},

	onUpdate: function() {
		// console.log('onUpdate')
		return AppStore.fetchData(this.state);
	},

	render: function() {
		return (
			<div className="main">
				<div className="infos">
					<a href="http://thibaudb.com/jscript/" target="_blank" title="Thibaud B. post and repository">
						<i className="fa fa-info-circle"></i>
					</a>
				</div>
				<ul className="tabs">
					<li>
						<input type="radio" name="tabs" id="tab1" defaultChecked />
						<label htmlFor="tab1">HTML</label>
						<div id="tab-content1" className="tab-content tab-editor">
							<AceEditor 
								name="html"
								mode="html"
								onChange={this.onChange} 
								value={this.state.editor.html}
							/>
						</div>
					</li>
					<li>
						<input type="radio" name="tabs" id="tab2" />
						<label htmlFor="tab2">Style</label>
						<div id="tab-content2" className="tab-content tab-editor">
							<AceEditor 
								name="style"
								mode="scss"
								onChange={this.onChange} 
								value={this.state.editor.style}
							/>
						</div>
					</li>
					<li>
						<input type="radio" name="tabs" id="tab3" />
						<label htmlFor="tab3">Script</label>
						<div id="tab-content3" className="tab-content tab-editor">
							<AceEditor 
								name="script"
								mode="javascript"
								onChange={this.onChange} 
								value={this.state.editor.script}
							/>
						</div>
					</li>
					<li>
						<input type="radio" name="tabs" id="tab4" />
						<label htmlFor="tab4" className="result-label" style={{'display': 'none'}}>Result</label>
						<div id="tab-content4" className="tab-content tab-result">
							<Iframe {...this.state} />
						</div>
					</li>
				</ul>
			</div>
		);
	}

});

module.exports = Editor;
