'use strict';


/**
 * Data's API
 */
var data = {
	title: null,
	description: null,
	library: false,
	sass: true,
	preview: true,
	ressources: [],
	view: {
		tab1: true,
		tab2: false,
		tab3: false
	},
	html: '<div class="foo">\n\tHello <b>World</b> !\n</div>\n\n<div id="wrap"></div>',
	script: 'var wrap = document.getElementById(\'wrap\');\n\nfor (var i=0; i<10; i++) {\n\twrap.innerHTML += \'<p>test n°\'+ (i+1) +\'</p>\';\n}',
	style: '$color: #ff6C00;\n\nbody {\n\tcolor: $color;\n}\n\np:nth-child(2n +1) {\n\tbackground: #ddd;\n}'
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

	var inputLibrary = document.querySelector('#inputLibrary');
	var inputSass = document.querySelector('#inputSass');
	var inputPreview = document.querySelector('#inputPreview');

	var tab1 = document.querySelector('#tab1');
	var tab2 = document.querySelector('#tab2');
	var tab3 = document.querySelector('#tab3');

	var tabContent1 = document.querySelector('#tab-content1');
	var tabContent2 = document.querySelector('#tab-content2');
	var tabContent3 = document.querySelector('#tab-content3');

	var btnRun = document.querySelector('#btnRun');
	var btnSave = document.querySelector('#btnSave');
	var btnResult = document.querySelector('#btnResult');


	/**
	 * Get Data from API
	 * @return {object}
	 */
	var getData = function(data) {

		// init form's inputs
		inputHtml.value = data.html;
		inputScript.value = data.script;
		inputStyle.value = data.style;
		inputLibrary.checked = data.library ? true : false;
		inputSass.checked = data.sass ? true : false;
		inputPreview.checked = data.preview ? true : false;

		// init editors
		initEditor(data.html, editorHtml, 'html');
		initEditor(data.script, editorScript, 'javascript');
		initEditor(data.style, editorStyle, 'scss');

		// init iframe
		buildFrame(data);
	};

	var initEditor = function(scope_data, target, mode) {
		var editor = ace.edit(target);
		if (mode == 'html') {
			ace.require('ace/ext/emmet');
			editor.setOption('enableEmmet', true);
		}
		editor.getSession().setUseWorker(false);
		editor.getSession().setMode('ace/mode/'+ mode);
		editor.setValue(scope_data, -1);

		editor.commands.addCommand({
      name: 'Refresh',
      bindKey: { 
        win: 'Ctrl-Enter',
        mac: 'Command-Enter'
      },
      exec: function(editor) {
        actionDispatcher('refresh', data);
      }
    });

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
		};

		// Enable HTML & style live preview
		if (inputPreview.checked) {
			refreshData(data);
		}
	};

	var actionDispatcher = function(type, data) {
		switch(type) {
			case 'save':
				saveDataToServer(data);
				break;
			case 'refresh':
				refreshData(data);
				break;
			default:
				return;
		}
	}

	var refreshData = function(data) {
		data.library = inputLibrary.checked ? true : false;
		data.sass = inputSass.checked ? true : false;
		data.preview = inputPreview.checked ? true : false;
		data.html = inputHtml.value;
		data.script = inputScript.value;
		data.style = inputStyle.value;

		buildFrame(data);
	};

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