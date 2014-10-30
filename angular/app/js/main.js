'use strict';

require.config({
	paths: {
		angular: 'vendor/angular/angular',
		angularRoute: 'vendor/angular/angular-route',
		angularMocks: 'vendor/angular/angular-mocks',
		text: 'plugins/requirejs-text/text',
		jquery: 'vendor/jquery',
		'google-chart': 'directive/ng-google-chart',
		'bootstrap-carousel': 'directive/bootstrap-ui/carousel',
		'bootstrap-transition': 'directive/bootstrap-ui/transition',
		'bootstrap-modal': 'directive/bootstrap-ui/modal',
		'partials': '../partials',
		'bootstrap': 'vendor/bootstrap/bootstrap',
		'angular-ui': 'vendor/angular-ui',
		'angular.treeview': 'directive/treeview/angular.treeview',
		'ui-bootstrap': 'directive/bootstrap-ui/ui-bootstrap-tpls-0.4.0.min',
		'jquery-ui': 'vendor/jquery-ui',
		'angular-dragdrop': 'directive/angular-dragdrop',
		'textAngular': 'directive/textAngular',
		'textAngular-sanitize': 'directive/textAngular-sanitize',
		'textAngularSetup': 'directive/textAngularSetup',
		'angular-resource': 'vendor/angular/angular-resource',
		'angular-leaflet': 'directive/angular-leaflet-directive',
		'leaflet': 'vendor/leaflet-dist/leaflet-src'
	},
	  map: {
	      '*': {
	  'css': 'plugins/requirecss/css',
	  'less': 'plugins/require-less/less' 
	      }
	  },
	shim: {
		'angular' : {'exports' : 'angular'},
		'leaflet': ['css!vendor/leaflet-dist/leaflet'],
		'angular-leaflet': ['leaflet'],
		'textAngular-sanitize': ['angular'],
		'textAngularSetup': {exports: 'textAngularSetup'},
		'textAngular': ['angular', 'textAngularSetup', 'textAngular-sanitize'],
		'jquery-ui': ['jquery', 'css!vendor/jquery-ui'],
		'angularRoute': ['angular'],
		'angular-dragpdrop': ['angular', 'jquery', 'jquery-ui'],
		'angular-resource': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		},
		'google-chart': ['angular'],
		'bootstrap': ['jquery'],
		'bootstrap-carousel': ['bootstrap-transition'],
		'bootstrap-modal': ['bootstrap-transition'],
		'angular.treeview': ['angular', 'css!directive/treeview/angular.treeview'],
		'ui-bootstrap': ['angular', 'bootstrap']
	},
	priority: [
		"angular"
	]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes',
	'jquery'
], function(angular, app, routes) {
	'use strict';
	var $html = $('html');

	$(function() {
		angular.resumeBootstrap([app['name']]);
		$(".disabled-link").click(function(event) {
			  event.preventDefault();
			});
	});
});
