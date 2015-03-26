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
				var libUrl = 'http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css';
				var link = iframe.createElement('link');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('href', libUrl);
				iframe.head.appendChild(link);
			}

			// Load external libraries
			if (this.props.settings.libraries.length > 0) {
				this.props.settings.libraries.forEach(function(el, i, arr) {
					var extension = el.split('.').pop();
					
					if (extension == 'js') {
						var scriptLib = iframe.createElement('script');
						scriptLib.setAttribute('type', 'text/javascript');
						scriptLib.setAttribute('src', el);
						iframe.body.appendChild(scriptLib);
					} else if (extension == 'css') {
						var linkLib = iframe.createElement('link');
						linkLib.setAttribute('rel', 'stylesheet');
						linkLib.setAttribute('href', el);
						iframe.head.appendChild(link);
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
