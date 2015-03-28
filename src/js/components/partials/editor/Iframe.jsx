'use strict';

var React = require('react');
var DomConstructorMixin = require('../../../mixins/DomConstructorMixin');


var Iframe = React.createClass({

	mixins: [DomConstructorMixin],
	
	buildFrame: function() {
		var iframe = this.refs.resultIframe.getDOMNode().contentWindow.document;

		// Clean iframe
		iframe.head.innerHTML = '';
		iframe.body.innerHTML = '';

		if (iframe.readyState === 'complete') {
			
			// Import normalize if necessary
			if (this.props.settings.reset) {
				var link = 'http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css';
				this.loadStylesheet(link, iframe);
			}

			// Load external libraries
			var libraries = this.props.settings.libraries;
			if (libraries.length > 0) {
				for (var i = 0; i < libraries.length; i++) {
					var extension = libraries[i].split('.').pop();
					
					if (extension == 'js') {
						this.loadScript(libraries[i], iframe);
					} else if (extension == 'css') {
						this.loadStylesheet(libraries[i], iframe);
					} else {
						console.log('Error file extension...');
						// alertPopup('error', 'Something\'s wrong with your file.');
					}
				};
			}
			
			// Compile to SASS or simply load CSS. default is true
			var style = this.props.settings.sass ? Sass.compile(this.props.editor.style) : this.props.editor.style;
			
			// Html Input
			this.inlineHtml(this.props.editor.html, iframe);
			
			// Append HTML, style and script
			this.inlineStylesheet(style, iframe);
			this.inlineScript(this.props.editor.script, iframe);

		} else {
			setTimeout(this.buildFrame, 0);
		}
	},

	componentDidMount: function() {
		this.buildFrame();
	},

	componentDidUpdate: function() {
		this.buildFrame();
	},

	componentWillUnmount: function() {
		React.unmountComponentAtNode(this.refs.resultIframe.getDOMNode().contentWindow.document.body);
	},	
	
	render: function() {
		return (
			<div className="result">
				<iframe
					ref="resultIframe"
					sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
					frameBorder="0">
				</iframe>
			</div>
		);
	}

});

module.exports = Iframe;
