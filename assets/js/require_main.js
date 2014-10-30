'use strict';

requirejs.config({
  baseUrl: "assets/js",
  packages: [
             {
               name: 'physicsjs',
               location: 'vendor/physicsjs',
               main: 'physicsjs-full-0.6.0'
             }
         ],
  paths: {
    backbone: "vendor/backbone",
    "backbone.picky": "vendor/backbone.picky",
    "backbone.syphon": "vendor/backbone.syphon",
    jquery: "vendor/jquery",
    "jquery-ui": "vendor/jquery-ui",
    json2: "vendor/json2",
    localstorage: "vendor/backbone.localstorage",
    marionette: "vendor/backbone.marionette",
    spin: "vendor/spin",
    "spin.jquery": "vendor/spin.jquery",
    tpl: "vendor/tpl",
    underscore: "vendor/underscore",
    bootstrap: "vendor/bootstrap",
    'jquery.autocomplete': "vendor/jquery.backbone.widgets",
    floating: 'vendor/floating', 
    backgrid: 'vendor/backgrid/backgrid',
    "backgrid/select-all":	'vendor/backgrid/extensions/select-all/backgrid-select-all',
    transitionregion: 'vendor/marionette/marionette.transitionregion',
    font: 'vendor/require/font',
    goog: 'vendor/require/goog',
    image : 'vendor/require/image',
    json: 'vendor/require/json',
    noext: 'vendor/require/noext',
    mdown: 'vendor/require/mdown',
    propertyParser : 'vendor/require/propertyParser',
    carouFredSel: 'vendor/jquery.carouFredSel-6.2.1-packed',
    qTip: "vendor/jquery.qtip.min",
    slade: 'vendor/slade',
    react: 'vendor/react',
    JSXTransformer: 'vendor/JSXTransformer',
    lodash: "vendor/lodash.compat",
    jsx: "vendor/jsx",
    codemirror: 'vendor/codemirror/codemirror',
    javascript: 'vendor/codemirror/javascript',
    formatting: 'vendor/codemirror/formatting',
    svg: 'vendor/svg',
    'svg.easing': 'vendor/svg.easing.min',
    'svg.clock': 'apps/svg/svg.clock.min',
    'svg.filter': 'vendor/svg.filter',
    zepto: 'vendor/zepto',
    knockout: 'vendor/knockout',
    acorn: 'vendor/acorn',
    escope: 'vendor/escope',
    estraverse: 'vendor/estraverse',
    'escodegen.browser': 'vendor/escodegen.browser',
    'jquery.layout': 'vendor/jquery.layout.min',
    'jquery.swfobject' : 'vendor/jquery.swfobject.1-1-1.min',
    'jquery.youtube': 'vendor/youTubeEmbed/youTubeEmbed-jquery-1.0',
    'interface': 'vendor/interface',
    'pqueue': 'algorithm/pqueue',
    'beautify': 'vendor/beautify/beautify',
     'beautify-html' : 'vendor/beautify/beautify-html',
     'beautify-css' : 'vendor/beautify/beautify-css',
     'jquery.albumPreview': 'vendor/albumPreviews',
     'jquery.blueimp-gallery': 'vendor/jquery.blueimp-gallery',
     'blueimp-gallery': 'vendor/blueimp-gallery/blueimp-gallery',
     'blueimp-helper': 'vendor/blueimp-gallery/blueimp-helper',
     'blueimp-gallery-video': 'vendor/blueimp-gallery/blueimp-gallery-video',
     'jquery.swipebox': 'vendor/swipebox/jquery.swipebox',
     'jquery.loadImage': 'vendor/jquery.loadImage',
     'jquery.easing': 'vendor/jquery.easing',
     'waterfall': 'vendor/waterfall',
     'mootools': 'vendor/mootools-core-1.4.5-full-compat',
     'raphael': 'vendor/raphael',
     //'raphael-2.1': 'vendor/raphael.min-2.1',
     'neural_net': 'apps/sweeper/neural_net',
     'sweepers': 'apps/sweeper/sweepers',
     'backbone.marionette.handlebars': 'vendor/backbone.marionette.handlebars',
     'handlebars': 'vendor/handlebars',
     hbs: 'vendor/hbs',
     'i18nprecompile' : 'vendor/i18nprecompile',
     'bubble': 'apps/imdb/converted',
     'd3.v2': 'apps/imdb/d3.v2',
     'd3.v3' : 'vendor/d3.v3.4',
     'marionette.progressview': 'vendor/marionette.progressview',
     'marionette.mmv': 'vendor/marionette.mmv',
     mustache: 'vendor/mustache',
     text: 'vendor/text',
     stache: 'vendor/stache',
     stickit: 'vendor/backbone.stickit',
     'jquery.mosaicflow' : 'vendor/jquery.mosaicflow',
     'jquery.textcomplete': 'vendor/jquery.textcomplete',
     'jquery.overlay': 'vendor/jquery.overlay',
     'shCore': 'vendor/shCore',
     'shBrushJScript' : 'vendor/shBrushJScript',
     'emoji': 'vendor/emoji',
     'gmaps': 'vendor/gmaps',
     'jquery.hotkeys' : 'vendor/jquery.hotkeys',
     'chosen': 'vendor/chosen/chosen.jquery',
     'prettify': 'vendor/prettify',
     'responsive-tabs' : 'vendor/responsive-tabs',
     'expressionBuilder' : 'vendor/expressionBuilder',
     'select2': 'vendor/select2/select2',
     'jquery.bootstrap.wizard': 'vendor/jquery.bootstrap.wizard',
     'jquery.validate': 'vendor/jquery.validate.min',
     'canvas-game': 'vendor/canvasgame/js/combined',  
     'bootstrap-tree': 'vendor/bootstrap-tree',
     'dropzone': 'vendor/dropzone-amd-module',
     'jquery.drapdrop': 'vendor/jquery.dragdrop',
     'drap-drop': 'vendor/drag-drop',
     'jquery.jcarousel': 'vendor/jquery.jcarousel',
     'jcarousel.basic': 'vendor/jcarousel/jcarousel.basic',
     'backbone.paginator': 'vendor/backbone.paginator',
     'jcollapse' :'vendor/jcollapse/jquery.collapse',
     'jcollapse.cookie_storage' :'vendor/jcollapse/jquery.collapse_cookie_storage',
     'jquery.collapse_storage': 'vendor/jcollapse/jquery.collapse_storage',
     'popage' :'vendor/popage',
     'jScrollPane' :'vendor/jScrollPane/jScrollPane.min',
     'jquery.mousewheel': 'vendor/jScrollPane/jquery.mousewheel',
     'jquery.defaultText': 'vendor/jquery.defaultText',
     'bootstrap-checkbox-tree': 'vendor/bootstrap/bootstrap-checkbox-tree',
     'jquery.collapsible': 'vendor/jQuery.collapsible',
     'jquery.jstree': 'vendor/jquery.jstree',
     'SyntaxHighlighter' : 'vendor/syntax/!script',
     'jquery.bubbleSlideshow': 'vendor/jquery.bubbleSlideshow/jquery.bubbleSlideshow',
     'colortip': 'vendor/colortip-1.0/colortip-1.0-jquery',
     'countdown': 'vendor/countdown/jquery.countdown',
     'jquery.facebookwall': 'vendor/jquery.facebookwall',
     'jquery.template': 'vendor/jquery.tmpl.min',
     'jquery.shutter': 'vendor/jquery.shutter/jquery.shutter',
     'typeahead': 'vendor/typeahead.bundle',
     'stellar': 'vendor/stellar',
     'tether': 'vendor/tether',
     'drop': 'vendor/drop',
     'datetimepicker_css': 'vendor/datetimepicker_css/datetimepicker_css',
     ejs:  "vendor/ejs",
     rejs: "vendor/rejs",
     'jquery.peity': 'vendor/jquery.peity',
     'backbone-forms': 'vendor/backbone-forms',
     'bootstrap3-forms': 'vendor/backbone.form.templates/bootstrap3',
     'jquery.tooltip': 'vendor/jquery.tooltip/jquery.tooltipster',
     'jquery.ui.position': 'vendor/jquery.ui.position',
     'jquery.contextmenu': 'vendor/jquery.contextmenu/jquery.contextMenu',
     'jquery.mobile': 'vendor/jquery.mobile-1.4.2',
     'backbone-pageable': 'vendor/backbone-pageable',
     'backbone-relational': 'vendor/backbone-relational',
     'backgrid-text-cell' : 'vendor/backgrid/extensions/backgrid-text-cell',
     'backgrid-paginator': 'vendor/backgrid/extensions/backgrid-paginator',
     'jquery-ui-scrollable': 'vendor/jquery-ui-scrollable',
     'leaflet': 'vendor/leaflet/leaflet',
     'leaflet-sidebar': 'vendor/leaflet/L.Control.Sidebar',
     'backbone.epoxy': 'vendor/backbone.epoxy',
      'backbone.localstorage': 'vendor/backbone.localstorage',
      'MarionetteLoadingViewPlugin' : 'vendor/marionette/MarionetteLoadingViewPlugin',
      'backbone.routefilter': 'vendor/backbone.routefilter',
      'Box2D' : 'vendor/Box2D',
      'stats': 'vendor/stats',
      'jquery.lightbox_me': 'vendor/jquery.lightbox_me',
      'chart': 'vendor/chart/chart', 
      'd3.chart': 'vendor/chart/d3.chart',
      'jquery.jscrollpane': 'vendor/jquery.jscrollpane',
      'jquery.nested': 'vendor/jquery.nested',
      'vein' : 'vendor/vein',
      'chain': 'vendor/chain',
      'skrollr': 'vendor/skrollr',
      'jquery.transit': 'vendor/jquery.transit',
      'parallax': 'vendor/parallax/parallax',
      'jquery.parallax': 'vendor/parallax/jquery.parallax',
      'jquery.superscrollorama': 'vendor/jquery.superscrollorama',
      'TweenMax': 'vendor/greensock/TweenMax.min',
      'TweenLite': 'vendor/greensock/TweenLite.min',
      'move': 'vendor/move',
      'jsMoviceclip': 'vendor/jsmovieclip-1',
      'jquery.jsMovieclip': 'vendor/jquery.jsmovieclip-1',
      'gfx': 'vendor/gfx/gfx',
      'jquery.migrate' : 'vendor/jquery.migrate/migrate',
      'jquery.migrate.core': 'vendor/jquery.migrate/core',
      'shifty': 'vendor/shifty',
      'rekapi': 'vendor/rekapi',
      'jquery.lazylinepainter': 'vendor/jquery.lazylinepainter-1.4.1',
      'eve': 'vendor/eve',
      'morpheus' : 'vendor/morpheus',
      'flippant': 'vendor/flippant',
      'anima': 'vendor/anima',
      'animo': 'vendor/animo',
      'tweenjs': 'vendor/tweenjs-0.5.1.combined',
      'easeljs-NEXT': 'vendor/easeljs-NEXT.min',
      'slidr': 'vendor/slidr',
      'three': 'vendor/three',
      'jquery.magnific-popup': 'vendor/jquery.magnific-popup',
      'shine': 'vendor/shine',
      'fabric': 'vendor/fabric.require',
      'snap.svg': 'vendor/snap.svg',
      'easeljs' : 'vendor/easeljs-0.7.1.min',
      'createjs' : 'vendor/createjs-2013.12.12.min',
      'movieclip': 'vendor/movieclip-0.7.1.min',
      'paper': 'vendor/paper-full',
      'jquery.colorbox': 'vendor/jquery.colorbox',
      'kinetic' : 'vendor/kinetic',
      'jquery.flexslider': 'vendor/jquery.flexslider',
      'swiper' : 'vendor/idangerous.swiper',
      'jquery.fancybox': 'vendor/fancybox/jquery.fancybox',
      'two': 'vendor/two',
      'responsiveslides': 'vendor/responsiveslides',
      'cannon': 'vendor/cannon',
      'MathBox': 'vendor/MathBox-bundle',
      'rickshaw' : 'vendor/rickshaw',
      'slick.grid' : 'vendor/slickgrid/slick.grid',
      'jquery.event.drag-2.2' : 'vendor/jquery.event.drag-2.2',
      'jquery.event.drop-2.2' : 'vendor/jquery.event.drop-2.2',
      'sigma' : 'vendor/sigma/sigma.min',
      'jquery.flot': 'vendor/flot/jquery.flot',
      'morris' : 'vendor/morris',
      'list': 'vendor/list',
      'numeral' : 'vendor/numeral',
      'jquery.handsontable' : 'vendor/jquery.handsontable',
      'dc' : 'vendor/dc',
       'highcharts': "vendor/highcharts",
       'peer': 'vendor/peer',
       'oboe': 'vendor/oboe-browser',
       'store': 'vendor/store',
       'jquery.dataTables' : 'vendor/jquery.dataTables',
       'knwl': 'vendor/knwl',
       'jquery.jsPlumb' : 'vendor/jquery.jsPlumb-1.5.5',
       'cytoscape': 'vendor/cytoscape',
       'accounting': 'vendor/accounting',
       'chance' : 'vendor/chance',
       'arbor' : 'vendor/arbor',
       'springy' : 'vendor/springy',
       'zip' : 'vendor/zip',
       'deflate': 'vendor/deflate',
       'inflate': 'vendor/inflate',
       'datamaps.usa' : 'vendor/datamaps.usa',
       'topojson' : 'vendor/topojson',
       'taffy' : 'vendor/taffy',
       'dimple.v2.0.1' : 'vendor/dimple.v2.0.1',
       'xlsx' : 'vendor/xlsx',
       'jszip' : 'vendor/jszip',
       'xls' : 'vendor/xls',
       'd3.layout.cloud' : 'vendor/d3.layout.cloud',
       'fuse' : 'vendor/fuse',
       'underscore.db' : 'vendor/underscore.db',
       'jquery.indexeddb' : 'vendor/jquery.indexeddb',
       'lokijs' : 'vendor/lokijs',
       'pixi' : 'vendor/pixi.dev',
       'verlet' : 'vendor/verlet-1.0.0',
       'enchant' : 'vendor/enchant',
       'matter' : 'vendor/matter',
       'matter-tools' : 'vendor/matter-tools/matter-tools-dev',
       'async': 'vendor/async',
       'joy' : 'vendor/joy',
       'keydrown' : 'vendor/keydrown',
       'parsley' : 'vendor/parsley',
       'jquery.fineuploader' : 'vendor/jquery.fineuploader-4.4.0',
       'sifter': 'vendor/sifter',
       'microplugin' : 'vendor/microplugin',
       'selectize' : 'vendor/selectize',
       'picker' : 'vendor/picker',
       'picker.date' : 'vendor/picker.date',
       'picker.time' : 'vendor/picker.time',
       'bootstrap-editable' : 'vendor/x-editable/bootstrap3-editable/js/bootstrap-editable',
       'editable-typeahead' : 'vendor/x-editable/inputs-ext/typeaheadjs/typeaheadjs',
       'editable-address' : 'vendor/x-editable/inputs-ext/address/address',
       'mailcheck' : 'vendor/mailcheck',
       'jquery.atwho' : 'vendor/jquery.atwho',
       'jquery.caret' : 'vendor/jquery.caret.min',
       'jquery-ui-sliderAccess' : 'vendor/jquery-ui-sliderAccess',
       'jquery-ui-timepicker-addon' : 'vendor/jquery-ui-timepicker-addon',
       'jquery.form' : 'vendor/jquery.form',
       'jquery.tokeninput' : 'vendor/jquery.tokeninput',
       'garlic' : 'vendor/garlic',
       'pwstrength' : 'vendor/pwstrength',
       'fancyInput' : 'vendor/fancyInput',
       'jquery.mask' : 'vendor/jquery.mask',
       'behave' : 'vendor/behave',
       'jquery.idealforms' : 'vendor/jquery.idealforms',
       'jquery.multi-select' : 'vendor/jquery.multi-select',
       'jquery.sceditor' : 'vendor/sceditor/jquery.sceditor',
       'bbcode' : 'vendor/sceditor/plugins/bbcode',
       'H5F' : 'vendor/H5F',
       'hideShowPassword' : 'vendor/hideShowPassword',
       'progression' : 'vendor/progression',
       'isotope.pkgd' : 'vendor/isotope.pkgd',
       'cellsbyrow':'vendor/isotope/isotope-cells-by-row/cells-by-row',
       'masonry' : 'vendor/masonry.pkgd',
       'waypoints': 'vendor/waypoints',
       'jquery.fullPage' : 'vendor/jquery.fullPage',
       'moment' : 'vendor/moment.min',
       'fuelux': 'vendor/fuelux',
       'jquery.gridster' : 'vendor/jquery.gridster',
       'jquery.velocity' : 'vendor/jquery.velocity',
       'velocity.ui' : 'vendor/velocity.ui',
       'fraphael' : 'vendor/fraphael'
      
  },
  map: {
      '*': {
          'css': 'plugins/requirecss/css',
          'less': 'plugins/require-less/less' 
      }
  },
  shim: {
	    ejs: {
	        exports: 'ejs'
	      },
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    'shifty': {
    	exports: 'Tweenable'
    },
    'vein': {
    	exports: 'vein'
    },
    'skrollr': {
    	exports: 'skrollr'
    },
    'backbone.routefilter': ['backbone', 'underscore'],
    'backbone.localstorage': ['underscore', 'backbone'],
    'backbone.epoxy': ['underscore', 'backbone', 'backbone.localstorage'],
    'backbone-pageable': {
    	deps: ['underscore', 'backbone'],
    	exports: 'PageableCollection'
    },
    'backbone-relational' : {
    	deps: ['underscore', 'backbone'],
    	exports: 'Backbone'
    },
    stickit: {
        deps: ['backbone']
      },
    "backbone.picky": ["backbone"],
    "backbone.syphon": ["backbone"],
    marionette: {
      deps: ["backbone"],
      exports: "Marionette"
    },
    'MarionetteLoadingViewPlugin' : ['marionette', 'backbone'],
    'datetimepicker_css': ['css!vendor/datetimepicker_css/datetimepicker'],
    'marionette.progressview': {
    	deps: ['marionette'],
    	exports: 'Marionette.ProgressView'
    },
    'marionette.mmv': {
    	deps: ['marionette'],
    	exports: 'Marionette.MultiModelView'
    },
    'jquery.lightbox_me' : ['jquery'],
    'jquery.migrate': ['jquery'],
    'jquery.migrate.core': ['jquery', 'jquery.migrate'],
    'gfx': ['jquery', 'jquery.migrate.core'],
    'jquery.jsMovieclip': ['jquery'],
    'jquery.nested' : ['jquery'],
    'jquery.transit': ['jquery'],
    'jquery.lazylinepainter': ['jquery'],
    'jquery.jscrollpane': ['jquery', 'css!vendor/jquery.jscrollpane'],
    "jquery-ui": ["jquery"],
    'jquery-ui-scrollable': ['jquery-ui'],
    'jquery.mobile': ['jquery', 'css!vendor/jquery.mobile-1.4.2'],
    'jquery.ui.position': ['jquery', 'jquery-ui'],
    'backbone.paginator': {deps: ['jquery', 'backbone'], exports: 'Backbone.Paginator'}, 
    'jquery.drapdrop': {deps: ['jquery'], exports : '$.fn.dragdrop'},
    'jquery.peity': ['jquery'],
    'drap-drop': {deps: ['jquery.drapdrop'], exports: 'DragDrop'},
    'dropzone': {deps: ['jquery', 'css!vendor/dropzone'], exports: 'Dropzone'},
    'canvas-game' : ['jquery', 'css!vendor/canvasgame/css/main', 'css!vendor/canvasgame/css/media', 'css!vendor/canvasgame/css/print', 'css!vendor/canvasgame/css/reset', 'css!vendor/canvasgame/css/utilities'],
    'chosen': ['jquery', 'css!vendor/chosen/chosen'],
    'waterfall': ['jquery', 'css!vendor/waterfall'],
    'jquery.easing': ['jquery'],
    'jquery.mosaicflow' : {
    	deps: ['jquery', 'css!vendor/mosaicflow']
    },
    'colortip': ['jquery', 'css!vendor/colortip-1.0/colortip-1.0-jquery'],
    'jquery.hotkeys' : ['jquery'],
    'SyntaxHighlighter': ['jquery', 'jquery.hotkeys', 'css!vendor/syntax/!style'],
    'jquery.bubbleSlideshow': ['jquery', 'css!vendor/jquery.bubbleSlideshow/jquery.bubbleSlideshow', 'vendor/jquery.bubbleSlideshow/bgpos'],
    'jquery.jcarousel': ['jquery'],
    'jScrollPane' : ['jquery', 'jquery.mousewheel', 'css!vendor/jScrollPane/jScrollPane'],
    'popage': ['css!vendor/popage', 'jquery'],
    'jcarousel.basic': ['jquery.jcarousel', 'css!vendor/jcarousel/jcarousel.basic'],
    'jquery.textcomplete' : ['jquery', 'css!vendor/jquery.textcomplete'],
    'jquery.overlay': ['jquery'],
    'jquery.validate': ['jquery'],
    'jquery.jstree': ['jquery'],
    'jcollapse.cookie_storage': ['jquery', 'jquery.collapse_storage', 'jcollapse'],
    'jquery.bootstrap.wizard': ['jquery', 'jquery.validate', 'bootstrap/bootstrap'],
    'jquery.collapsible': ['jquery'],
    'countdown': ['jquery', 'css!vendor/countdown/jquery.countdown'],
    'jquery.facebookwall': ['jquery', 'jquery.template'],
    'jquery.shutter': ['jquery', 'css!vendor/jquery.shutter/jquery.shutter', 'image!assets/js/vendor/jquery.shutter/shutter.png'],
    'jquery.contextmenu': ['jquery', 'jquery-ui', 'css!vendor/jquery.contextmenu/jquery.contextMenu'],
    'jquery.tooltip': ['jquery', 'css!vendor/jquery.tooltip/css/tooltipster'],
    'typeahead': ['jquery', 'css!vendor/typeahead'],
    'stellar': ['jquery'],
    'handlebars': {
    	exports : 'Handlebars'
    },
    'tether': {
    	exports: 'Tether'
    },
    'drop': ['tether'],
    'shCore': {
    	deps: ['emoji', 'css!vendor/shCoreDefault']
    },
    'shBrushJScript': ['shCore'],
    'json2' : {
    	exports: 'JSON'
    },
    'select2' : ['jquery', 'css!vendor/select2/select2'],
    'expressionBuilder' : ['jquery', 'select2', 'css!vendor/expressionBuilder'],
    'backbone.marionette.handlebars' : ['marionette', 'handlebars'],
    hbs : ['handlebars', 'underscore', 'i18nprecompile', 'json2', 'backbone.marionette.handlebars'],
    localstorage: ["backbone"],
    transitionregion: {deps:['marionette'], exports: 'Backbone.Marionette.TransitionRegion'},
    'blueimp-gallery' : {deps : ['blueimp-helper','css!vendor/blueimp-gallery/blueimp-gallery'], exports: 'Gallery'},
    'blueimp-gallery-video' : {deps : ['jquery','blueimp-gallery','css!vendor/blueimp-gallery/blueimp-gallery-video'], exports: 'Gallery'},
    'jquery.blueimp-gallery' : {deps: ['blueimp-gallery'], exports: 'Gallery'},
    "spin.jquery": ["spin", "jquery"],
    'bootstrap/bootstrap-slider': { deps: ['jquery'], exports: '$.fn.slider' }, 
    'bootstrap-checkbox-tree' : {deps: ['jquery', 'less!vendor/bootstrap/bootstrap-checkbox-tree'], exports: '$.fn.checkboxTree'},
    'bootstrap/bootstrap-collapse': { deps: ['jquery'], exports: '$.fn.collapse' }, 
    'bootstrap/bootstrap-affix': { deps: ['jquery'], exports: '$.fn.affix' },
    'bootstrap/bootstrap-alert': { deps: ['jquery'], exports: '$.fn.alert' },
    'bootstrap/bootstrap-button': { deps: ['jquery'], exports: '$.fn.button' },
    'bootstrap/bootstrap-carousel': { deps: ['jquery'], exports: '$.fn.carousel' },
    'bootstrap/bootstrap-wysiwyg': { deps: ['jquery', 'jquery.hotkeys'], exports: '$.fn.wysiwyg' },
    'bootstrap/bootstrap': { deps: ['jquery'], exports: '$' },
    'bootstrap-tree': ['bootstrap/bootstrap'],
    'bootstrap/bootstrap-wizard': { deps: ['jquery','bootstrap/bootstrap' ,'css!vendor/bootstrap/bootstrap-wizard'], exports: '$.fn.wizard' },
    'bootstrap/bootstrap-dropdown': { deps: ['jquery'], exports: '$.fn.dropdown' },
    'bootstrap/bootstrap-modal': { deps: ['jquery', 'css!vendor/bootstrap/bootstrap-modal', 'css!vendor/bootstrap/bootstrap-modal-bs3patch'], exports: '$.fn.modal' },
    'bootstrap/bootstrap-lightbox': {deps: ['bootstrap/bootstrap', 'jquery', 'css!vendor/bootstrap/bootstrap-lightbox'], exports : '$.fn.lightbox'},
    'bootstrap/bootstrap-select': { deps: ['jquery', 'css!vendor/bootstrap/bootstrap-select'], exports: '$.fn.selectpicker' },
    'bootstrap/bootstrap-modalmanager': { deps: ['jquery'], exports: '$.fn.modal' },
    'bootstrap/bootstrap-popover': { deps: ['jquery'], exports: '$.fn.popover' },
    'bootstrap/bootstrap-scrollspy': { deps: ['jquery'], exports: '$.fn.scrollspy'        },
    'bootstrap/bootstrap-tab': { deps: ['jquery'], exports: '$.fn.tab' },
    'bootstrap/bootstrap-tooltip': { deps: ['jquery'], exports: '$.fn.tooltip' },
    'bootstrap/bootstrap-transition': { deps: ['jquery'], exports: '$.support.transition' },
    'bootstrap/bootstrap-typeahead': { deps: ['jquery'], exports: '$.fn.typeahead'  },
    'bootstrap/bootstrap-contextmenu': {deps: ['jquery'], exports: '$.fn.contextmenu'},
    'bootstrap/bootstrap-tree/js/bootstrap-tree': {deps: ['jquery', 'css!bootstrap/bootstrap-tree/css/bootstrap-tree'], exports: '$.fn.tree'},
    'bootstrap/bootstrap-image-gallery': { deps: ['jquery', 'blueimp-gallery', 'blueimp-gallery-video', 'jquery.blueimp-gallery', 'css!vendor/bootstrap/bootstrap-image-gallery'], exports: 'Gallery'  },
    'jquery.autocomplete': {deps: ['jquery'], exports: '$.fn.autocomplete'},
    'jquery.swipebox': {deps: ['jquery', 'css!vendor/swipebox/swipebox'], exports: '$.fn.swipebox'},
    'responsive-tabs': {deps: ['jquery', 'bootstrap/bootstrap'], exports: 'fakewaffle'},
    'backbone-forms': {
    	deps: ['jquery', 'underscore', 'backbone'],
    	exports: 'Backbone.Form'
    },
    'bootstrap3-forms' : ['backbone-forms', 'css!vendor/backbone.form.templates/bootstrap3'],
    'jquery.loadImage': ['jquery'],
    'jquery.layout': {
    	deps: ["jquery-ui", 'css!vendor/jquery.layout-default'],
    	exports: '$.fn.layout'
    },
    'jquery.defaultText': ['jquery'],
    'jquery.swfobject':{
    	deps: ['jquery'],
    	exports : '$'
    },
    'jquery.albumPreview': ['jquery'],
    'jquery.youtube': {
    	deps: ['jquery.swfobject',
    	       'jquery', 'css!vendor/youTubeEmbed/youTubeEmbed-jquery-1.0', 
    	       'image!assets/js/vendor/youTubeEmbed/img/pause.png',
    	       'image!assets/js/vendor/youTubeEmbed/img/play.png',
    	       'image!assets/js/vendor/youTubeEmbed/img/replay.png'
    	       ],
    	exports : '$.fn.youTubeEmbed'
    },
     floating: {deps:['jquery'], exports: '$.fn.addFloating'},
     carouFredSel: {deps:['jquery'], exports: '$.fn.carouFredSel'},
     backgrid: {
        deps: ['jquery', 'backbone', 'underscore', 'css!vendor/backgrid/backgrid'],
        exports: 'Backgrid'
    },
    'backgrid-text-cell': ['backgrid', 'css!vendor/backgrid/extensions/backgrid-text-cell'],
    'backgrid-paginator': ['backgrid', 'css!vendor/backgrid/extensions/backgrid-paginator'],
    "backgrid/select-all": ['backgrid', 'css!vendor/backgrid/extensions/select-all/backgrid-select-all'],
    qTip: ['css!vendor/jquery.qtip.min'],
    codemirror: {deps:['css!vendor/codemirror/codemirror'], exports: 'CodeMirror'},
    javascript: ['codemirror'],
    formatting: ['codemirror'],
    'svg.easing': {
    	deps: ['svg'],
    	exports: 'SVG.easing'
    },
    'svg.clock': {
    	deps: ['svg'],
    	exports: 'SVG.Clock'
    },
    'svg.filter': {
    	deps: ['svg'],
    	exports: 'SVG.Filter'
    },
    zepto: {
    	deps: ['jquery'],
        exports: '$'
      },
      'interface' : {
    	  deps: ['zepto'],
    	  exports: 'Interface'
      },
      'beautify-html' : ['beautify', 'beautify-css'],
      'neural_net': ['mootools'],
      'sweepers': ['neural_net'],
      'bubble':{
    	  deps : ['d3.v2'],
    	  exports: 'Bubbles'
      },
      'd3.v2' : {
    	  exports : 'd3'
      },
      'd3.chart' : {
    	deps: ['d3.v3'],
      },
      'leaflet': ['css!vendor/leaflet/leaflet'],
      'leaflet-sidebar': ['leaflet', 'css!vendor/leaflet/L.Control.Sidebar'],
      'jquery.parallax': ['jquery', 'parallax'],
      'jquery.superscrollorama' : ['jquery', 'TweenLite'],
      'TweenMax': ['TweenLite'],
      'eve': {
    	  exports: 'Eve'
      },
      //'raphael-2.1': ['eve'],
      morpheus: {
    	  exports: 'morpheus'
      },
      'flippant': ['css!vendor/flippant'],
      'anima': {
    	  exports: 'anima'
      },
      animo: {
    	  deps: ['jquery', 'css!vendor/animate+animo'],
    	  exports: '$.animo'
      },
      'easeljs-NEXT': ['tweenjs'],
      'slidr': {
    	  exports: 'slidr'
      },
      'jquery.magnific-popup': ['jquery', 'css!vendor/magnific-popup'],
      'shine': {
    	  exports: 'shinejs'
      },
      'snap.svg': {
    	  exports: 'Snap'
      },
      'createjs': {
    	  exports: 'createjs'
      },
      'easeljs': ['createjs'],
      'movieclip' : ['createjs'],
      'paper': {
    	  exports: 'paper'
      },
      'jquery.colorbox': {
    	  deps: ['jquery']
      },
      'kinetic' : {
    	  exports: 'Kinetic'
      },
      'jquery.flexslider': ['jquery', 'css!vendor/flexslider'],
      'swiper' : {
    	  deps : ['css!vendor/idangerous.swiper'],
    	  exports: 'Swiper'
      },
      'jquery.fancybox': ['jquery', 'css!vendor/fancybox/jquery.fancybox'],
      'responsiveslides': ['jquery', 'css!vendor/responsiveslides'],
      'cannon': ['three'],
      'rickshaw' : {
    	  deps: ['d3.v3', 'css!vendor/rickshaw'],
    	  exports: 'Rickshaw'
      },
      'jquery.flot' : ['jquery'],
      'morris' : ['jquery', 'css!vendor/morris'],
      'numeral' : {
    	  exports: 'numeral'
      },
      'jquery.handsontable' : {
    	  deps: ['jquery', 'numeral', 'jquery.contextmenu', 'css!vendor/jquery.handsontable']
      },
      'dc': {
    	  deps: ['css!vendor/dc', 'd3.v3'],
    	  exports: 'dc'
      },
      'highcharts' : ['jquery'],
      'oboe': {
    	  exports: 'oboe'
      },
      'jquery.dataTables' : ['jquery', 'css!vendor/jquery.dataTables'],
      'jquery.jsPlumb' : ['jquery'],
      'chance' : {
    	  exports: 'Chance'
      },
      'arbor' : {
    	  exports: 'arbor',
    	  deps: ['jquery']
      },
      'zip': ['deflate', 'inflate'],
      'datamaps.usa' : {
    	  deps: ['d3.v3', 'topojson'],
    	  exports: 'Datamap'
      },
      'xlsx' : ['jszip'],
      'xls' : {
    	  exports: 'XLS'
      },
      'd3.v3' : {
    	  exports: 'd3'
      },
      'd3.layout.cloud' : ['d3.v3'],
      'fuse' : {
    	  exports: 'Fuse'
      },
      'underscore.db' : ['underscore'],
      'jquery.indexeddb' : ['jquery'],
      'pixi' : {
    	  exports: 'PIXI'
      },
      'verlet' : {
    	  exports: 'VerletJS'
      },
      'enchant' : {
    	  exports: 'enchant'
      },
      'matter': {
    	  exports: 'Matter'
      },
      'matter-tools' : ['matter', 'css!vendor/matter-tools/matter-tools'],
      'async' : {
    	  exports: 'async'
      },
      'joy': {
    	  exports: 'Joy'
      },
      'keydrown' : {
    	  exports: 'kd'
      },
      'parsley' : ['jquery'],
      'jquery.fineuploader': ['jquery', 'css!vendor/fineuploader-4.4.0'],
      'sifter' : {
    	  exports: 'Sifter'
      },
      'microplugin' : {
    	  exports: 'MicroPlugin'
      },
      'selectize' : {
    	  deps: ['jquery', 'sifter', 'microplugin', 'css!vendor/css/selectize'],
    	  exports: 'Selectize'
      },
      'picker' : ['jquery','css!vendor/css/pickdate/classic'],
      'picker.date' : ['css!vendor/css/pickdate/classic.date'],
      'picker.time' : ['css!vendor/css/pickdate/classic.time'],
      'bootstrap-editable' : ['bootstrap/bootstrap', 'css!vendor/x-editable/bootstrap3-editable/css/bootstrap-editable', 'vendor/moment.min', 
                              'bootstrap/bootstrap-datetimepicker', 'css!bootstrap/datetimepicker'],
       'editable-typeahead' : ['bootstrap-editable', 'vendor/x-editable/inputs-ext/typeaheadjs/lib/typeahead', 'css!vendor/x-editable/inputs-ext/typeaheadjs/lib/typeahead-bootstrap'],
       'editable-address' : ['bootstrap-editable', 'css!vendor/x-editable/inputs-ext/address/address'],
       'mailcheck' : ['jquery'],
       'jquery.caret' : ['jquery'],
       'jquery.atwho' : ['jquery', 'css!vendor/jquery.atwho', 'jquery.caret'],
       'jquery-ui-sliderAccess' : ['jquery-ui'],
       'jquery-ui-timepicker-addon' : ['jquery-ui-sliderAccess', 'css!vendor/jquery-ui-timepicker-addon'],
       'jquery.tokeninput' : ['jquery', 'css!vendor/token-input-facebook'],
       'garlic' : ['jquery'],
       'pwstrength' : ['bootstrap/bootstrap'],
       'fancyInput' : ['jquery', 'css!vendor/fancyInput'],
       'jquery.idealforms' : ['jquery', 'css!vendor/jquery.idealforms'],
       'jquery.multi-select' : ['jquery', 'css!vendor/multi-select', 'image!assets/js/vendor/img/switch.png'],
       'jquery.sceditor' : ['jquery', 'css!vendor/sceditor/jquery.sceditor.default'],
       'bbcode': ['jquery.sceditor'],
       'H5F' : {
    	   exports: 'H5F'
       },
       'progression' : ['jquery', 'css!vendor/progression'],
       'isotope.pkgd' : {
    	   exports: 'Isotope'
       },
       'cellsbyrow' : {
    	   deps: ['isotope.pkgd'],
    	   exports: 'CellsByRow'
       },
       'masonry' : {
    	   exports: 'Masonry'
       },
       'waypoints' : {
    	   exports: '$.fn.waypoint'
       },
       'jquery.fullPage' : ['jquery-ui', 'css!vendor/jquery.fullPage'],
       'jquery.gridster' : ['jquery', 'css!vendor/jquery.gridster'],
       'spin': {
    	   exports: 'Spinner'
       },
       'velocity.ui' : ['jquery.velocity'],
       'jquery.velocity' : ['jquery'],
       'fraphael' : ['raphael']
      
  }
});

require(["app", "apps/header/header_app"], function(ContactManager){
  ContactManager.start();
});
