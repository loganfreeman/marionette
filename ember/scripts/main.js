(function(root) {
	require([ "config" ], function(config) {
		requirejs.config(config);
		require([ "App", "ember", 'ember-animated-outlet' , 'moment'], function(App, Ember) {
			var app_name = config.app_name || "App";
			root[app_name] = App = Ember.Application.create(App);
		});
	});
})(this);

//'use strict';
//
//var config = {
//	app_name : "MyExampleApp",
//	baseUrl : "scripts",
//	map : {
//		'*' : {
//			'css' : 'libs/requirecss/css',
//			'less' : 'libs/require-less/less'
//		}
//	},
//	shim : {
//		'ember' : {
//			deps : [ 'handlebars', 'jquery' ],
//			exports : 'Ember'
//		},
//		'jquery.ui' : [ 'jquery' ]
//	},
//	paths : {
//		'App' : 'app/main',
//		'models' : 'app/models',
//		'views' : 'app/views',
//		'controllers' : 'app/controllers',
//		'templates' : 'app/templates',
//		'routes' : 'app/routes',
//		/* libs */
//		'jquery' : 'libs/jquery/1.9.1/jquery',
//		'handlebars' : 'libs/handlebars/1.0.rc.3/handlebars',
//		'ember' : 'libs/ember/1.0.0-rc.3/ember',
//		'jquery.ui' : 'libs/jquery.ui/1.9.2/jquery-ui-1.9.2.custom.min',
//		'bootstrap' : 'libs/bootstrap/2.2.2/js/boostrap',
//		/* requirejs-plugins */
//		'text' : 'libs/requirejs-plugins/text',
//		'hbs' : 'libs/requirejs-plugins/hbs',
//		'domReady' : 'libs/requirejs-plugins/domReady',
//	},
//	/* hbs plugin options */
//	hbs : {
//		disableI18n : true,
//		templateExtension : "html"
//	}
//};
//requirejs.config(config);
//
//require([ "App", "ember" ], function(App, Ember) {
//	var app_name = config.app_name || "App";
//	window[app_name] = App = Ember.Application.create(App);
//});
