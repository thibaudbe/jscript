'use strict';

/**
 * Data's API
 */
var data = {
	title: null,
	description: null,
	library: false,
	sass: true,
	preview: false,
	ressources: [],
	view: {
		tab1: true,
		tab2: false,
		tab3: false
	},
	html: '<div class="banner">\n\t<div class="avatar">\n\t\t<div class="img"></div>\n\t</div>\n</div>\n\n<div class="list">\n\t<ul id="wrap"></ul>\n</div>\n',
	script: "var wrap = document.getElementById('wrap');\n\nfor (var i=0; i<30; i++) {\n wrap.innerHTML += '<li>item n°'+ (i+1) +'</li>';\n}",
	style: "$orange: #F8A87C;\n\n*, ::after, ::before {\n\tbox-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n font: 14px 'Lucida Grande',Helvetica,Arial,sans-serif;\n}\n\n.banner {\n\tbackground: $orange;\n\tmargin-bottom: 80px;\n\t\n\t.avatar {\n\t\twidth: 100px;\n\t\theight: 120px;\n\t\tmargin: auto;\n\t\tposition: relative;\n\n\t\t.img {\n\t\t\t\tposition: absolute;\n\t\t\t\tbottom: -45px;\n\t\t\twidth: 100px;\n\t\t\theight: 100px;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tbackground: no-repeat url('http://cdn.collider.com/wp-content/uploads/Dumb-and-Dumber-jim-carrey-1.jpg') center center;\n\t\t\t\tbackground-size: cover;\n\t\t\t\tborder: 3px solid #fff;\n\t\t}\n\t}\n}\n\n.list {\n\tmargin: 20px 20px 80px;\n\t\n\tul {\n\t\tlist-style-type: none;\n\t\tpadding: 0;\n\t\t\n\t\tli {\n\t\t\t\tlist-style-type: none;\n\t\t\t\tpadding: 10px;\n\t\t\t\ttext-align: center;\n\t\t\t\tcolor: #999;\n\t\t\t\t@extend .animate;\n\t\t\t\t\n\t\t\t\t&:nth-child(2n + 1) {\n\t\t\t\tbackground: #efefef;\n\t\t\t\tcolor: #444;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t@for $i from 1 through 30 {\n\t\t\t\t&:nth-of-type(#{$i}) {\n\t\t\t\t\t-webkit-animation-delay: #{$i * 100}ms;\n\t\t\t\t\tanimation-delay: #{$i * 100}ms;\n\t\t\t\t}\n\t\t\t\t}\n\t\t}\n\t}\n}\n\n\n.animate {\n\t-webkit-animation-duration: 400ms;\n\tanimation-duration: 400ms;\n\t-webkit-animation-fill-mode: both;\n\tanimation-fill-mode: both;\n\t-webkit-animation-name: anim;\n\tanimation-name: anim;\n}\n\n@-webkit-keyframes anim {\n\tfrom {\n\t\topacity: 0;\n\t\t-webkit-transform: translate3d(-10px,0,0);\n\t\ttransform: translate3d(-10px,0,0);\n\t}\n\tto {\n\t\topacity: 1;\n\t\t-webkit-transform: translate3d(0,0,0);\n\t\ttransform: translate3d(0,0,0);\n\t}\n}\n\n@keyframes anim {\n\tfrom {\n\t\topacity: 0;\n\t\t-webkit-transform: translate3d(-10px,0,0);\n\t\ttransform: translate3d(-10px,0,0);\n\t}\n\tto {\n\t\topacity: 1;\n\t\t-webkit-transform: translate3d(0,0,0);\n\t\ttransform: translate3d(0,0,0);\n\t}\n}\n"
};
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
			alertPopup('warning', 'Sorry, database is not connected');
			return false;
		});

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