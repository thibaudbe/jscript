'use strict';

var api = require('api');


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
	var alertBox = document.querySelector('#alertBox');

	var inputStyle = document.querySelector('#inputStyle');
	var inputScript = document.querySelector('#inputScript');
	var inputHtml = document.querySelector('#inputHtml');

	var inputTitle = document.querySelector('#inputTitle');
	var inputDescription = document.querySelector('#inputDescription');
	var inputReset = document.querySelector('#inputReset');
	var inputSass = document.querySelector('#inputSass');
	var inputPreview = document.querySelector('#inputPreview');
	var libraries = document.querySelector('#libraries');

	var tab1 = document.querySelector('#tab1');
	var tab2 = document.querySelector('#tab2');
	var tab3 = document.querySelector('#tab3');

	var tabContent1 = document.querySelector('#tab-content1');
	var tabContent2 = document.querySelector('#tab-content2');
	var tabContent3 = document.querySelector('#tab-content3');

	var btnRun = document.querySelector('#btnRun');
	var btnSave = document.querySelector('#btnSave');
	var btnShare = document.querySelector('#btnShare');


	/**
	 * Get Data from API
	 * @return {object}
	 */
	var getData = function(data) {

		// init form's inputs
		inputHtml.value = data.html;
		inputScript.value = data.script;
		inputStyle.value = data.style;
		inputTitle.value = data.title;
		inputDescription.value = data.description;
		inputReset.checked = data.reset ? true : false;
		inputSass.checked = data.sass ? true : false;
		inputPreview.checked = data.preview ? true : false;
		document.title = 'JScript | '+ inputTitle.value;

		if (data.libraries.length > 0) {
			data.libraries.forEach(function(el, i, arr) {
				var name = el.split('/').pop();
				var li = document.createElement('li');
				var link = document.createElement('a');
				link.setAttribute('href', el);
				link.setAttribute('target', '_blank');
				link.innerHTML = name;
				li.appendChild(link);

				var del = document.createElement('a');
				del.setAttribute('class', 'delete');
				del.setAttribute('href', '#');
				del.innerHTML = '<i class="fa fa-minus"></i>';
				li.appendChild(del);
				libraries.appendChild(li);
			});
		}

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
		document.title = 'JScript | '+ inputTitle.value;
		data.title = inputTitle.value;
	  data.description = inputDescription.value;
		data.reset = inputReset.checked ? true : false;
		data.sass = inputSass.checked ? true : false;
		data.preview = inputPreview.checked ? true : false;
		data.html = inputHtml.value;
		data.script = inputScript.value;
		data.style = inputStyle.value;

		// if (data.libraries.length > 0) {
		// 	data.libraries.forEach(function(el, i, arr) {
		// 		var li = document.createElement('li');
		// 		var link = document.createElement('a');
		// 		link.setAttribute('href', el);
		// 		link.setAttribute('target', '_blank');
		// 		li.appendChild(link);
		// 		libraries.appendChild(li);
		// 	});
		// }

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
			alertPopup('warning', 'Sorry, database is not connected');
			return false;
		});

		btnShare.addEventListener('click', function() {
			alertPopup('warning', 'Sorry, You can\'t share for now, because database is not connected');
			return false;
		});

		// A prompt message if you're leaving the app w/ save
		window.onbeforeunload = function() {
			if (data.html !== inputHtml.value || data.script !== inputScript.value || data.style !== inputStyle.value) {
				return 'You are going to lost your unsave data.';
			} else {
				return;
			}
		};

	};

	var alertPopup = function(type, message) {
		var alert = document.createElement('div');
		alert.setAttribute('class', 'animated2 slideDown alert alert-'+ type);
		alert.innerHTML = message;
		var button = document.createElement('button');
		button.setAttribute('class', 'alert__close');
		alert.appendChild(button);
		alertBox.appendChild(alert);

		var anim_out;
		var startTimer = function() {
			anim_out = setTimeout(function() { 
				removeAlert();
			}, 8000);
		};
		startTimer();

		var removeAlert = function() {
			alert.className = 'animated2 fadeOut2 alert alert-'+ type;
			var timer = setTimeout(function() { 
				alert.remove();
			}, 400);
		};

		var stopTimer = function() {
    	clearTimeout(anim_out);
		};

		button.addEventListener('click', function() {
			stopTimer();
			removeAlert();
			return false;
		});

		if (alertBox.children.length > 3) {
			alertBox.children[0].remove();
		}
	}

	
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
		if (data.reset === true) {
			var libUrl = 'http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css';
			var link = newFrame.contentWindow.document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', libUrl);
			newFrame.contentWindow.document.head.appendChild(link);
		}

		// Load external libraries
		if (data.libraries.length > 0) {
			data.libraries.forEach(function(el, i, arr) {
				var extension = el.split('.').pop();
				if (extension == 'js') {
					var scriptLib = newFrame.contentWindow.document.createElement('script');
					scriptLib.setAttribute('type', 'text/javascript');
					scriptLib.setAttribute('src', el);
					newFrame.contentWindow.document.body.appendChild(scriptLib);
				} else if (extension == 'css') {
					var linkLib = newFrame.contentWindow.document.createElement('link');
					linkLib.setAttribute('rel', 'stylesheet');
					linkLib.setAttribute('href', el);
					newFrame.contentWindow.document.head.appendChild(link);
				} else {
					// console.log('Error file extension...');
					alertPopup('error', 'Something\'s wrong with your file.');
				}
			});
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