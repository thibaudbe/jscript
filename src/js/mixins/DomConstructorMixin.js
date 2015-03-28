'use strict';


var DomConstructorMixin = {

	loadStylesheet: function(url, container) {
		var link = container.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', url);
		return container.head.appendChild(link);
	},

	loadScript: function(url, container) {
		var escript = container.createElement('script');
		escript.setAttribute('type', 'text/javascript');
		escript.setAttribute('src', url);
		return container.head.appendChild(escript);
	},

	inlineScript: function(text, container) {
		var iscript = container.createElement('script');
		iscript.setAttribute('type', 'text/javascript');
		iscript.innerHTML = text;
		return container.body.appendChild(iscript);
	},

	inlineStylesheet: function(text, container) {
		var style = container.createElement('style');
		style.setAttribute('type', 'text/css');
		style.innerHTML = text;
		return container.head.appendChild(style);
	},

	inlineHtml: function(html, container) {
		return container.body.insertAdjacentHTML('beforeend', html);
	}

};

module.exports = DomConstructorMixin;
