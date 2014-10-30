define([
	'angular',
	'filters',
	'services',
	'directives',
	'controllers',
	'angularRoute',
	'partials/generic',
	'partials/fat',
	'partials/annotation',
	'bootstrap',
	'memory-game-app',
	'carousel',
	'colorGame',
	'treeviewDemo',
	'dndDemo',
	'Sudoku',
	'leaflet-demo'
	], function (angular, filters, services, directives, controllers) {
		'use strict';

		// Declare app level module which depends on filters, and services
		
		return angular.module('myApp', [
			'ngRoute',
			'myApp.controllers',
			'myApp.filters',
			'myApp.services',
			'myApp.directives',
			'google-chart-sample',
			'memoryGameApp',
			'carouselDemo',
			'colorGame',
			'treeviewDemo',
			'dndDemo',
			'Sudoku',
			'leaflet-demo'
		]);
});
