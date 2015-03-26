'use strict';

var React = require('react');


var AceEditor = React.createClass({

	onChange: function() {
		var value = this.editor.getValue();

		if (this.props.onChange)
			this.props.onChange(this.props.name, value);
	},

	componentDidMount: function() {
		var self = this;
		this.editor = ace.edit(this.props.name);

		if (this.editor == 'html') {
			ace.require('ace/ext/emmet');
			this.editor.setOption('enableEmmet', true);
		}
		this.editor.getSession().setUseWorker(false);
		this.editor.getSession().setMode('ace/mode/'+ this.props.mode);
		this.editor.setValue(this.props.value, -1);
		this.editor.on('change', this.onChange);

		// this.editor.commands.addCommand({
		// 	name: 'Refresh',
		// 	bindKey: { 
		// 		win: 'Ctrl-Enter',
		// 		mac: 'Command-Enter'
		// 	},
		// 	exec: function(editor) {
		// 		console.log('update data');
		// 	}
		// });

		if (this.props.onLoad)
			this.props.onLoad(this.editor);
	},
	
	componentWillReceiveProps: function(nextProps) {
		this.editor = ace.edit(nextProps.name);
		this.editor.getSession().setMode('ace/mode/'+ nextProps.mode);

		if (this.editor.getValue() !== nextProps.value)
			this.editor.setValue(nextProps.value);

		if (nextProps.onLoad)
			nextProps.onLoad(this.editor);	
	},

	render: function() {
		return (
			<div 
				id={this.props.name}
				onChange={this.onChange} 
				className="ace-spacegray">
			</div>
		);
	}

});

module.exports = AceEditor;
