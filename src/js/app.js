'use strict';

(function() {

	var result = document.querySelector('#result');
	var styleInput = document.querySelector('#styleInput');
	var scriptInput = document.querySelector('#scriptInput');
	var htmlInput = document.querySelector('#htmlInput');

	var tab1 = document.querySelector('#tab1');
	var tab2 = document.querySelector('#tab2');
	var tab3 = document.querySelector('#tab3');

	var library = document.querySelector('#library');
	var sass = document.querySelector('#sass');

	var btnRun = document.querySelector('#btnRun');
	var btnSave = document.querySelector('#btnSave');

	/**
	 * Values
	 */

	var settings = function() {
		return {
			title: null,
			description: null,
			library: library.checked ? true : false,
			sass: sass.checked ? true : false,
			ressources: [],
			view: {
				tab1: tab1.checked ? true: false,
				tab2: tab2.checked ? true: false,
				tab3: tab3.checked ? true: false
			},
			style: styleInput.value,
			script: scriptInput.value,
			html: htmlInput.value
		};
	};

	var run = function() {
		var data = settings();

		// Remove iframe if already exists
		var resultFrame = document.querySelector('#resultFrame');
		if (resultFrame) { resultFrame.remove() }

		// Set default tab visible if true
		if (data.view.tab2 === true) { tab2.checked = true }
		else if (data.view.tab3 === true) { tab3.checked = true }
		else { tab1.checked = true }
		
		// Create new iframe
		var newFrame = document.createElement('iframe');
		newFrame.setAttribute('id', 'resultFrame');
		result.appendChild(newFrame);
		
		// Html Input
		var html = data.html;
		
		// Script Input
		var script = newFrame.contentWindow.document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = data.script;
		
		// Import normalize if necessary
		if (data.library === true) {
			var uriLib = 'http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css';
			var link = newFrame.contentWindow.document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', uriLib);
			newFrame.contentWindow.document.head.appendChild(link);
		}
		
		// Compile to SASS or simply load CSS. default is true
		if (data.sass === true) {
			var scss = data.style;
			var css = Sass.compile(scss);
			
			var style = newFrame.contentWindow.document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = css;
		} else {
			var style = newFrame.contentWindow.document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = data.style;
		}
		
		// Append HTML, CSS and Script
		newFrame.contentWindow.document.body.insertAdjacentHTML('beforeend', html);
		newFrame.contentWindow.document.head.appendChild(style);
		newFrame.contentWindow.document.body.appendChild(script);
	}
	run();


	/**
	 * Events
	 */

	btnRun.addEventListener('click', function() {
		run();
		return false;
	});

	btnSave.addEventListener('click', function() {
		console.log('Save', settings());
		return false;
	});

})();