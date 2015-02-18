'use strict';


/**
 * Data's API
 */
var data = {
	title: null,
	description: null,
	library: false,
	sass: true,
	ressources: [],
	view: {
		tab1: true,
		tab2: false,
		tab3: false
	},
	html: '<div class="foo">\n\tHello <b>World</b> !\n</div>',
	script: 'function myScript() {\n\tvar x = \'kikou\';\n\treturn x;\n}',
	style: '$color: #ff6C00;\n\nbody {\n\tcolor: $color;\n}'
};


var app = function() {

	var init = function() {
		getData(data);
		initTabs();
		events();
	};

	/**
	 * Selectors
	 */
	var result = document.querySelector('#result');
	var inputStyle = document.querySelector('#inputStyle');
	var inputScript = document.querySelector('#inputScript');
	var inputHtml = document.querySelector('#inputHtml');

	var inputLibrary = document.querySelector('#library');
	var inputSass = document.querySelector('#sass');

	var tab1 = document.querySelector('#tab1');
	var tab2 = document.querySelector('#tab2');
	var tab3 = document.querySelector('#tab3');

	var tabContent1 = document.querySelector('#tab-content1');
	var tabContent2 = document.querySelector('#tab-content2');
	var tabContent3 = document.querySelector('#tab-content3');

	var btnRun = document.querySelector('#btnRun');
	var btnSave = document.querySelector('#btnSave');


	/**
	 * Get Data from API
	 * @return {object}
	 */
	var getData = function(data) {
		inputHtml.value = data.html;
		inputScript.value = data.script;
		inputStyle.value = data.style;

		initEditor(data.html, editorHtml, 'html');
		initEditor(data.script, editorScript, 'javascript');
		initEditor(data.style, editorStyle, 'scss');
		buildFrame(data);
	};

	var initEditor = function(data, target, mode) {
		var editor = ace.edit(target);
		if (mode == 'html') {
    	ace.require('ace/ext/emmet');
    	editor.setOption('enableEmmet', true);
    }
		editor.getSession().setUseWorker(false);
		editor.getSession().setMode('ace/mode/'+ mode);
		editor.setValue(data);

		editor.on('change', function() {
			refreshInput(mode, editor.getValue());
		});
	};

	var refreshInput = function(mode, scope_data) {
		switch(mode) {
			case 'html':
				inputHtml.value = scope_data;
				break;
			case 'javascript':
				inputScript.value = scope_data;
				break;
			case 'scss':
				inputStyle.value = scope_data;
				break;
			default:
				return;
		}
	};

	var actionDispatcher = function(type, data) {
		data.library = inputLibrary.checked ? true : false;
		data.sass = inputSass.checked ? true : false;
		data.html = inputHtml.value;
		data.script = inputScript.value;
		data.style = inputStyle.value;

		console.log('data', data);

		switch(type) {
			case 'save':
				saveDataToServer(data);
				break;
			case 'refresh':
				buildFrame(data);
				break;
			default:
				return;
		}
	}

	var saveDataToServer = function(data) {
		console.log('Data post to server', data);
	};


	/**
	 * Init tabs
	 */
	var initTabs = function() {
		if (data.view.tab2 === true) { 
			tab2.checked = true 
		} else if (data.view.tab3 === true) { 
			tab3.checked = true 
		} else { 
			tab1.checked = true 
		} 
	};


	/**
	 * Events
	 */
	var events = function() {

		btnRun.addEventListener('click', function() {
			actionDispatcher('refresh', data);
			return false;
		});
		
		btnSave.addEventListener('click', function() {
			actionDispatcher('save', data);
			return false;
		});
	};

	
	/**
	 * Build an iframe with editor values
	 */
	var buildFrame = function(data) {

		// Remove iframe if already exists
		var resultFrame = document.querySelector('#resultFrame');
		if (resultFrame) { resultFrame.remove() }

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
			var libUrl = 'http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css';
			var link = newFrame.contentWindow.document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', libUrl);
			newFrame.contentWindow.document.head.appendChild(link);
		}
		
		// Compile to SASS or simply load CSS. default is true
		var style = newFrame.contentWindow.document.createElement('style');
		style.setAttribute('type', 'text/css');

		if (data.sass === true) {
			var scss = data.style;
			var css = Sass.compile(scss);
			style.innerHTML = css;
		} else {
			style.innerHTML = data.style;
		}
		
		// Append HTML, style and script
		newFrame.contentWindow.document.body.insertAdjacentHTML('beforeend', html);
		newFrame.contentWindow.document.head.appendChild(style);
		newFrame.contentWindow.document.body.appendChild(script);
	};

	return {
		init: init
	};

}();

app.init();