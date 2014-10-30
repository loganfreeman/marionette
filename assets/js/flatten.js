"use strict"
var config = {
	baseUrl : "assets/js",
	paths : {
		backbone : "vendor/backbone",
		"backbone.picky" : "vendor/backbone.picky",
		"backbone.syphon" : "vendor/backbone.syphon",
		jquery : "vendor/jquery",
		"jquery-ui" : "vendor/jquery-ui",
		json2 : "vendor/json2",
		localstorage : "vendor/backbone.localstorage",
		marionette : "vendor/backbone.marionette",
		spin : "vendor/spin",
		"spin.jquery" : "vendor/spin.jquery",
		tpl : "vendor/tpl",
		underscore : "vendor/underscore",
		bootstrap : "vendor/bootstrap",
		'jquery.autocomplete' : "vendor/jquery.backbone.widgets",
		floating : 'vendor/floating',
		backgrid : 'vendor/backgrid/backgrid',
		"backgrid/select-all" : 'vendor/backgrid/extensions/select-all/backgrid-select-all',
		transitionregion : 'vendor/marionette/marionette.transitionregion',
		async : 'lib/require/async',
		font : 'vendor/require/font',
		goog : 'vendor/require/goog',
		image : 'vendor/require/image',
		json : 'vendor/require/json',
		noext : 'vendor/require/noext',
		mdown : 'vendor/require/mdown',
		propertyParser : 'vendor/require/propertyParser',
		carouFredSel : 'vendor/jquery.carouFredSel-6.2.1-packed',
		qTip : "vendor/jquery.qtip.min",
		slade : 'vendor/slade',
		react : 'vendor/react',
		JSXTransformer : 'vendor/JSXTransformer',
		lodash : "vendor/lodash.compat",
		jsx : "vendor/jsx",
		codemirror : 'vendor/codemirror/codemirror',
		javascript : 'vendor/codemirror/javascript',
		formatting : 'vendor/codemirror/formatting',
		svg : 'vendor/svg',
		'svg.easing' : 'vendor/svg.easing.min',
		'svg.clock' : 'apps/svg/svg.clock.min',
		'svg.filter' : 'vendor/svg.filter',
		zepto : 'vendor/zepto',
		knockout : 'vendor/knockout',
		acorn : 'vendor/acorn',
		escope : 'vendor/escope',
		estraverse : 'vendor/estraverse',
		'escodegen.browser' : 'vendor/escodegen.browser',
		'jquery.layout' : 'vendor/jquery.layout.min',
		'jquery.swfobject' : 'vendor/jquery.swfobject.1-1-1.min',
		'jquery.youtube' : 'vendor/youTubeEmbed/youTubeEmbed-jquery-1.0',
		'interface' : 'vendor/interface',
		'pqueue' : 'algorithm/pqueue',
		'beautify' : 'vendor/beautify/beautify',
		'beautify-html' : 'vendor/beautify/beautify-html',
		'beautify-css' : 'vendor/beautify/beautify-css',
		'jquery.albumPreview' : 'vendor/albumPreviews',
		'jquery.blueimp-gallery' : 'vendor/jquery.blueimp-gallery',
		'blueimp-gallery' : 'vendor/blueimp-gallery/blueimp-gallery',
		'blueimp-helper' : 'vendor/blueimp-gallery/blueimp-helper',
		'blueimp-gallery-video' : 'vendor/blueimp-gallery/blueimp-gallery-video',
		'jquery.swipebox' : 'vendor/swipebox/jquery.swipebox',
		'jquery.loadImage' : 'vendor/jquery.loadImage',
		'jquery.easing' : 'vendor/jquery.easing',
		'waterfall' : 'vendor/waterfall',
		'mootools' : 'vendor/mootools-core-1.4.5-full-compat',
		'raphael' : 'vendor/raphael.min',
		'neural_net' : 'apps/sweeper/neural_net',
		'sweepers' : 'apps/sweeper/sweepers',
		'backbone.marionette.handlebars' : 'vendor/backbone.marionette.handlebars',
		'handlebars' : 'vendor/handlebars',
		hbs : 'vendor/hbs',
		'i18nprecompile' : 'vendor/i18nprecompile',
		'bubble' : 'apps/imdb/converted',
		'd3' : 'apps/imdb/d3.v2',
		'marionette.progressview' : 'vendor/marionette.progressview',
		'marionette.mmv' : 'vendor/marionette.mmv',
		mustache : 'vendor/mustache',
		text : 'vendor/text',
		stache : 'vendor/stache',
		stickit : 'vendor/backbone.stickit',
		'jquery.mosaicflow' : 'vendor/jquery.mosaicflow',
		'jquery.textcomplete' : 'vendor/jquery.textcomplete',
		'jquery.overlay' : 'vendor/jquery.overlay',
		'shCore' : 'vendor/shCore',
		'shBrushJScript' : 'vendor/shBrushJScript',
		'emoji' : 'vendor/emoji',
		'gmaps' : 'vendor/gmaps',
		'jquery.hotkeys' : 'vendor/jquery.hotkeys',
		'chosen' : 'vendor/chosen/chosen.jquery',
		'prettify' : 'vendor/prettify',
		'responsive-tabs' : 'vendor/responsive-tabs',
		'expressionBuilder' : 'vendor/expressionBuilder',
		'select2' : 'vendor/select2/select2',
		'jquery.bootstrap.wizard' : 'vendor/jquery.bootstrap.wizard',
		'jquery.validate' : 'vendor/jquery.validate.min',
		'canvas-game' : 'vendor/canvasgame/js/combined',
		'bootstrap-tree' : 'vendor/bootstrap-tree',
		'dropzone' : 'vendor/dropzone-amd-module',
		'jquery.drapdrop' : 'vendor/jquery.dragdrop',
		'drap-drop' : 'vendor/drag-drop',
		'jquery.jcarousel' : 'vendor/jquery.jcarousel',
		'jcarousel.basic' : 'vendor/jcarousel/jcarousel.basic',
		'backbone.paginator' : 'vendor/backbone.paginator',
		'jcollapse' : 'vendor/jcollapse/jquery.collapse',
		'jcollapse.cookie_storage' : 'vendor/jcollapse/jquery.collapse_cookie_storage',
		'jquery.collapse_storage' : 'vendor/jcollapse/jquery.collapse_storage',
		'popage' : 'vendor/popage',
		'jScrollPane' : 'vendor/jScrollPane/jScrollPane.min',
		'jquery.mousewheel' : 'vendor/jScrollPane/jquery.mousewheel'
	},
	map : {
		'*' : {
			'css' : 'plugins/requirecss/css',
			'less' : 'plugins/require-less/less'
		}
	},
	shim : {
		underscore : {
			exports : "_"
		},
		backbone : {
			deps : [ "jquery", "underscore", "json2" ],
			exports : "Backbone"
		},
		stickit : {
			deps : [ 'backbone' ]
		},
		"backbone.picky" : [ "backbone" ],
		"backbone.syphon" : [ "backbone" ],
		marionette : {
			deps : [ "backbone" ],
			exports : "Marionette"
		},
		'marionette.progressview' : {
			deps : [ 'marionette' ],
			exports : 'Marionette.ProgressView'
		},
		'marionette.mmv' : {
			deps : [ 'marionette' ],
			exports : 'Marionette.MultiModelView'
		},
		"jquery-ui" : [ "jquery" ],
		'backbone.paginator' : {
			deps : [ 'jquery', 'backbone' ],
			exports : 'Backbone.Paginator'
		},
		'jquery.drapdrop' : {
			deps : [ 'jquery' ],
			exports : '$.fn.dragdrop'
		},
		'drap-drop' : {
			deps : [ 'jquery.drapdrop' ],
			exports : 'DragDrop'
		},
		'dropzone' : {
			deps : [ 'jquery', 'css!vendor/dropzone' ],
			exports : 'Dropzone'
		},
		'canvas-game' : [ 'jquery', 'css!vendor/canvasgame/css/main', 'css!vendor/canvasgame/css/media', 'css!vendor/canvasgame/css/print', 'css!vendor/canvasgame/css/reset', 'css!vendor/canvasgame/css/utilities' ],
		'chosen' : [ 'jquery', 'css!vendor/chosen/chosen' ],
		'waterfall' : [ 'jquery', 'css!vendor/waterfall' ],
		'jquery.easing' : [ 'jquery' ],
		'jquery.mosaicflow' : {
			deps : [ 'jquery', 'css!vendor/mosaicflow' ]
		},
		'jquery.hotkeys' : [ 'jquery' ],
		'jquery.jcarousel' : [ 'jquery' ],
		'jScrollPane' : [ 'jquery', 'jquery.mousewheel', 'css!vendor/jScrollPane/jScrollPane' ],
		'popage' : [ 'css!vendor/popage', 'jquery' ],
		'jcarousel.basic' : [ 'jquery.jcarousel', 'css!vendor/jcarousel/jcarousel.basic' ],
		'jquery.textcomplete' : [ 'jquery', 'css!vendor/jquery.textcomplete' ],
		'jquery.overlay' : [ 'jquery' ],
		'jquery.validate' : [ 'jquery' ],
		'jcollapse.cookie_storage' : [ 'jquery', 'jquery.collapse_storage', 'jcollapse' ],
		'jquery.bootstrap.wizard' : [ 'jquery', 'jquery.validate', 'bootstrap/bootstrap' ],
		'handlebars' : {
			exports : 'Handlebars'
		},
		'shCore' : {
			deps : [ 'emoji', 'css!vendor/shCoreDefault' ]
		},
		'shBrushJScript' : [ 'shCore' ],
		'json2' : {
			exports : 'JSON'
		},
		'select2' : [ 'jquery', 'css!vendor/select2/select2' ],
		'expressionBuilder' : [ 'jquery', 'select2', 'css!vendor/expressionBuilder' ],
		'backbone.marionette.handlebars' : [ 'marionette', 'handlebars' ],
		hbs : [ 'handlebars', 'underscore', 'i18nprecompile', 'json2', 'backbone.marionette.handlebars' ],
		localstorage : [ "backbone" ],
		transitionregion : {
			deps : [ 'marionette' ],
			exports : 'Backbone.Marionette.TransitionRegion'
		},
		'blueimp-gallery' : {
			deps : [ 'blueimp-helper', 'css!vendor/blueimp-gallery/blueimp-gallery' ],
			exports : 'Gallery'
		},
		'blueimp-gallery-video' : {
			deps : [ 'jquery', 'blueimp-gallery', 'css!vendor/blueimp-gallery/blueimp-gallery-video' ],
			exports : 'Gallery'
		},
		'jquery.blueimp-gallery' : {
			deps : [ 'blueimp-gallery' ],
			exports : 'Gallery'
		},
		"spin.jquery" : [ "spin", "jquery" ],
		'bootstrap/bootstrap-slider' : {
			deps : [ 'jquery' ],
			exports : '$.fn.slider'
		},
		'bootstrap/bootstrap-collapse' : {
			deps : [ 'jquery' ],
			exports : '$.fn.collapse'
		},
		'bootstrap/bootstrap-affix' : {
			deps : [ 'jquery' ],
			exports : '$.fn.affix'
		},
		'bootstrap/bootstrap-alert' : {
			deps : [ 'jquery' ],
			exports : '$.fn.alert'
		},
		'bootstrap/bootstrap-button' : {
			deps : [ 'jquery' ],
			exports : '$.fn.button'
		},
		'bootstrap/bootstrap-carousel' : {
			deps : [ 'jquery' ],
			exports : '$.fn.carousel'
		},
		'bootstrap/bootstrap-wysiwyg' : {
			deps : [ 'jquery', 'jquery.hotkeys' ],
			exports : '$.fn.wysiwyg'
		},
		'bootstrap/bootstrap' : {
			deps : [ 'jquery' ],
			exports : '$'
		},
		'bootstrap-tree' : [ 'bootstrap/bootstrap' ],
		'bootstrap/bootstrap-wizard' : {
			deps : [ 'jquery', 'bootstrap/bootstrap', 'css!vendor/bootstrap/bootstrap-wizard' ],
			exports : '$.fn.wizard'
		},
		'bootstrap/bootstrap-collapse' : {
			deps : [ 'jquery' ],
			exports : '$.fn.collapse'
		},
		'bootstrap/bootstrap-dropdown' : {
			deps : [ 'jquery' ],
			exports : '$.fn.dropdown'
		},
		'bootstrap/bootstrap-modal' : {
			deps : [ 'jquery', 'css!vendor/bootstrap/bootstrap-modal', 'css!vendor/bootstrap/bootstrap-modal-bs3patch' ],
			exports : '$.fn.modal'
		},
		'bootstrap/bootstrap-lightbox' : {
			deps : [ 'bootstrap/bootstrap', 'jquery', 'css!vendor/bootstrap/bootstrap-lightbox' ],
			exports : '$.fn.lightbox'
		},
		'bootstrap/bootstrap-select' : {
			deps : [ 'jquery', 'css!vendor/bootstrap/bootstrap-select' ],
			exports : '$.fn.selectpicker'
		},
		'bootstrap/bootstrap-modalmanager' : {
			deps : [ 'jquery' ],
			exports : '$.fn.modal'
		},
		'bootstrap/bootstrap-popover' : {
			deps : [ 'jquery' ],
			exports : '$.fn.popover'
		},
		'bootstrap/bootstrap-scrollspy' : {
			deps : [ 'jquery' ],
			exports : '$.fn.scrollspy'
		},
		'bootstrap/bootstrap-tab' : {
			deps : [ 'jquery' ],
			exports : '$.fn.tab'
		},
		'bootstrap/bootstrap-tooltip' : {
			deps : [ 'jquery' ],
			exports : '$.fn.tooltip'
		},
		'bootstrap/bootstrap-transition' : {
			deps : [ 'jquery' ],
			exports : '$.support.transition'
		},
		'bootstrap/bootstrap-typeahead' : {
			deps : [ 'jquery' ],
			exports : '$.fn.typeahead'
		},
		'bootstrap/bootstrap-contextmenu' : {
			deps : [ 'jquery' ],
			exports : '$.fn.contextmenu'
		},
		'bootstrap/bootstrap-tree/js/bootstrap-tree' : {
			deps : [ 'jquery' ],
			exports : '$.fn.tree'
		},
		'bootstrap/bootstrap-image-gallery' : {
			deps : [ 'jquery', 'blueimp-gallery', 'blueimp-gallery-video', 'jquery.blueimp-gallery', 'css!vendor/bootstrap/bootstrap-image-gallery' ],
			exports : 'Gallery'
		},
		'jquery.autocomplete' : {
			deps : [ 'jquery' ],
			exports : '$.fn.autocomplete'
		},
		'jquery.swipebox' : {
			deps : [ 'jquery', 'css!vendor/swipebox/swipebox' ],
			exports : '$.fn.swipebox'
		},
		'responsive-tabs' : {
			deps : [ 'jquery', 'bootstrap/bootstrap' ],
			exports : 'fakewaffle'
		},
		'jquery.loadImage' : [ 'jquery' ],
		'jquery.layout' : {
			deps : [ "jquery-ui", 'css!vendor/jquery.layout-default' ],
			exports : '$.fn.layout'
		},
		'jquery.swfobject' : {
			deps : [ 'jquery' ],
			exports : '$'
		},
		'jquery.albumPreview' : [ 'jquery' ],
		'jquery.youtube' : {
			deps : [ 'jquery.swfobject', 'jquery', 'css!vendor/youTubeEmbed/youTubeEmbed-jquery-1.0', 'image!assets/js/vendor/youTubeEmbed/img/pause.png', 'image!assets/js/vendor/youTubeEmbed/img/play.png', 'image!assets/js/vendor/youTubeEmbed/img/replay.png' ],
			exports : '$.fn.youTubeEmbed'
		},
		floating : {
			deps : [ 'jquery' ],
			exports : '$.fn.addFloating'
		},
		carouFredSel : {
			deps : [ 'jquery' ],
			exports : '$.fn.carouFredSel'
		},
		backgrid : {
			deps : [ 'jquery', 'backbone', 'underscore', 'css!vendor/backgrid/backgrid' ],
			exports : 'Backgrid'
		},
		"backgrid/select-all" : [ 'backgrid', 'css!vendor/backgrid/extensions/select-all/backgrid-select-all' ],
		qTip : [ 'css!vendor/jquery.qtip.min' ],
		codemirror : {
			deps : [ 'css!vendor/codemirror/codemirror' ],
			exports : 'CodeMirror'
		},
		javascript : [ 'codemirror' ],
		formatting : [ 'codemirror' ],
		'svg.easing' : {
			deps : [ 'svg' ],
			exports : 'SVG.easing'
		},
		'svg.clock' : {
			deps : [ 'svg' ],
			exports : 'SVG.Clock'
		},
		'svg.filter' : {
			deps : [ 'svg' ],
			exports : 'SVG.Filter'
		},
		zepto : {
			deps : [ 'jquery' ],
			exports : '$'
		},
		'interface' : {
			deps : [ 'zepto' ],
			exports : 'Interface'
		},
		'beautify-html' : [ 'beautify', 'beautify-css' ],
		'neural_net' : [ 'mootools' ],
		'sweepers' : [ 'neural_net' ],
		'bubble' : {
			deps : [ 'd3' ],
			exports : 'Bubbles'
		},
		'd3' : {
			exports : 'd3'
		}
	}
};

function flatten(obj) {
	var empty = true;
	if (obj instanceof Array) {
		str = '[';
		empty = true;
		for ( var i = 0; i < obj.length; i++) {
			empty = false;
			str += flatten(obj[i]) + ', ';
		}
		return (empty ? str : str.slice(0, -2)) + ']';
	} else if (obj instanceof Object) {
		str = '{';
		empty = true;
		for (i in obj) {
			empty = false;
			str += i + '->' + flatten(obj[i]) + ', ';
		}
		return (empty ? str : str.slice(0, -2)) + '}';
	} else {
		return obj; // not an obj, don't stringify me
	}
}

function duplicate(obj){
	if(!(obj instanceof Object)) return;
	var temp = {};
	for(i in obj){
		if(temp.hasOwnProperty(i)){
			throw new Error(i);
		}else{
			temp[i] = obj[i];
		}
		if(obj[i] instanceof Object){
			duplicate(obj[i]);
		}
	}
	console.log(temp);
	console.log("\n\n\n");
}
function findDuplicate(obj){
	for(i in obj){
		duplicate(obj[i]);
	}
}

//duplicate(config);

var test = {
	a : 'foo',
	b: 'bar',
	a: 'foobar'
}

duplicate(test);