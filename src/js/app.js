'use strict';

(function() {

	var result = document.querySelector('#result');
	var styleInput = document.querySelector('#styleInput');
	var scriptInput = document.querySelector('#scriptInput');
	var htmlInput = document.querySelector('#htmlInput');

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
      style: styleInput.value,
      script: scriptInput.value,
      html: htmlInput.value
    };
	};

	var run = function() {
    var output = settings();

    var resultFrame = document.querySelector('#resultFrame');
    if (resultFrame) { resultFrame.remove() }
    
    var newFrame = document.createElement('iframe');
    newFrame.setAttribute('id', 'resultFrame');
    result.appendChild(newFrame);
    
    var html = output.html;
    
    var script = newFrame.contentWindow.document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.text = output.script;
    
    if (output.library === true) {
      var uriLib = 'http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css';
      var link = newFrame.contentWindow.document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', uriLib);
      newFrame.contentWindow.document.head.appendChild(link);
    }
    
    if (output.sass === true) {
      var scss = output.style;
      var css = Sass.compile(scss);
      
      var style = newFrame.contentWindow.document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = css;
    } else {
      var style = newFrame.contentWindow.document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = output.style;
    }
        
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