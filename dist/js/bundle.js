'use strict';

var app = function(){

	/**
	 * Data's API
	 */
	var data = {
		html: '<div class="foo">\n\tHello <b>World</b> !\n</div>',
		script: 'function myScript() {\n\tvar x = \'kikou\';\n\treturn x;\n}',
		style: '$color: #333;\n\nbody {\n\tcolor: $color;\n}'
	};

	var init = function(){
		getDataFromServer();
		// run();
		// events();
	};

	var result = document.querySelector('#result');
	var inputStyle = document.querySelector('#inputStyle');
	var inputScript = document.querySelector('#inputScript');
	var inputHtml = document.querySelector('#inputHtml');

	var tab1 = document.querySelector('#tab1');
	var tab2 = document.querySelector('#tab2');
	var tab3 = document.querySelector('#tab3');

	var tabContent1 = document.querySelector('#tab-content1');
	var tabContent2 = document.querySelector('#tab-content2');
	var tabContent3 = document.querySelector('#tab-content3');

	var library = document.querySelector('#library');
	var sass = document.querySelector('#sass');

	var btnRun = document.querySelector('#btnRun');
	var btnSave = document.querySelector('#btnSave');

	/**
	 * Get Data from server
	 * @ {object}
	 */
	var getDataFromServer = function() {
    inputHtml.value = data.html;
    inputScript.value = data.script;
    inputStyle.value = data.style;
    
    var input_data = {
      html: inputHtml.value,
      script: inputScript.value,
      style: inputStyle.value
    }
    return setDataFromInput(input_data);
	};

	var setDataFromInput = function(data) {
		initEditor(data.html, editorHtml, 'html');
		initEditor(data.script, editorScript, 'javascript');
		initEditor(data.style, editorStyle, 'scss');
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
    editor.commands.addCommand({
      name: 'Save',
      bindKey: { 
        win: 'Ctrl-Enter',
        mac: 'Command-Enter'
      },
      exec: function(editor) {
        console.log('Save', editor.getValue());
        // saveDataToInput(cm.getValue());
      }
    });
	};

	var saveDataToInput = function(new_data) {
    inputScript.value = new_data;
    return saveDataToServer(new_data);
	};

	var saveDataToServer = function(new_data) {
		console.log('new_data', new_data);
	};


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

	/**
	 * Events
	 */
	var events = function() {
		btnRun.addEventListener('click', function() {
			run();
			return false;
		});
		btnSave.addEventListener('click', function() {
			console.log('Save', settings());
			return false;
		});
	};

	
	/**
	 * Run code
	 */
	var run = function() {
		var data = settings();

		// Remove iframe if already exists
		var resultFrame = document.querySelector('#resultFrame');
		if (resultFrame) { resultFrame.remove() }

		// // Set default tab visible if true
		// if (data.view.tab2 === true) { tab2.checked = true }
		// else if (data.view.tab3 === true) { tab3.checked = true }
		// else { tab1.checked = true } 

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

		// initCodeMirror(data);
	}

	return {
		init: init
	}

}();

app.init();