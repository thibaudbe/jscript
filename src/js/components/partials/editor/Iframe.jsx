'use strict';

var React = require('react');


var Iframe = React.createClass({
	
	buildFrame: function() {
		var iframe = this.refs.resultIframe.getDOMNode().contentWindow.document;

		// Clean iframe
		iframe.head.innerHTML = '';
		iframe.body.innerHTML = '';

		if (iframe.readyState === 'complete') {
			
			// Html Input
			var html = this.props.editor.html;
			
			// Script Input
			var script = iframe.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.text = this.props.editor.script;
			
			// Import normalize if necessary
			if (this.props.settings.reset) {
				var linkReset = iframe.createElement('link');
				linkReset.setAttribute('rel', 'stylesheet');
				linkReset.setAttribute('href', 'http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css');
				iframe.head.appendChild(linkReset);
			}

			// Load external libraries
			if (this.props.settings.libraries.length > 0) {
				this.props.settings.libraries.forEach(function(elem, i, arr) {
					var extension = elem.split('.').pop();
					
					if (extension == 'js') {
						var scriptLib = iframe.createElement('script');
						scriptLib.setAttribute('type', 'text/javascript');
						scriptLib.setAttribute('src', elem);
						iframe.head.appendChild(scriptLib);
					} else if (extension == 'css') {
						var linkLib = iframe.createElement('link');
						linkLib.setAttribute('rel', 'stylesheet');
						linkLib.setAttribute('href', elem);
						iframe.head.appendChild(linkLib);
					} else {
						console.log('Error file extension...');
						// alertPopup('error', 'Something\'s wrong with your file.');
					}
				});
			}
			
			// Compile to SASS or simply load CSS. default is true
			var style = iframe.createElement('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = this.props.settings.sass ? Sass.compile(this.props.editor.style) : this.props.editor.style;
			
			// Append HTML, style and script
			iframe.body.insertAdjacentHTML('beforeend', html);
			iframe.head.appendChild(style);
			iframe.body.appendChild(script);

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
