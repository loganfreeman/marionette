define([ 'angular', 'app', 'google-chart' ], function(angular, app) {
	'use strict';

	return app.config([ '$routeProvider', function($routeProvider) {
		$routeProvider.when('/view1', {
			templateUrl : 'app/partials/partial1.html',
			controller : 'MyCtrl1'
		});
		$routeProvider.when('/view2', {
			templateUrl : 'app/partials/partial2.html',
			controller : 'MyCtrl2'
		});
		$routeProvider.when('/gchart', {
			templateUrl : 'app/partials/partial2.html',
			controller : 'MyCtrl2'
		});
		$routeProvider.when('/fat', {
			templateUrl : 'app/partials/fat.html',
			controller : 'FatChartCtrl'
		}).when('/annotation', {
			templateUrl : 'app/partials/annotation.html',
			controller : 'AnnotationChartCtrl'
		}).when('/generic/:chartType', {
			templateUrl : 'app/partials/generic.html',
			controller : 'GenericChartCtrl'
		}).when('/memorygame', {
			templateUrl : 'app/partials/memory-game.html',
			controller : 'GameCtrl'
		}).when('/carousel', {
			templateUrl : 'app/partials/carousel/demo.html',
			controller : 'CarouselDemoCtrl'
		}).when('/colorgame', {
			templateUrl : 'app/partials/colorgame/demo.html',
			controller : 'ColorGameCtrl'
		}).when('/treeview', {
			templateUrl : 'app/partials/treeview/demo.html',
			controller : 'TreeViewCtrl'
		}).when('/dnddemo', {
			templateUrl : 'app/partials/dnddemo/demo.html',
			controller : 'DndDemoCtrl'
		}).when('/sudoku', {
			templateUrl : 'app/partials/sudoku/sudoku.html',
			controller : 'SudokuController'
		}).when('/leaflet/DynamicLayers', {
			templateUrl : 'app/partials/leaflet-demo/dynamiclayer.html',
			controller : 'DynamicLayersController'
		}).when('/leaflet/Default', {
			templateUrl : 'app/partials/leaflet-demo/default.html',
			controller : 'DefaultController'
		}).when('/leaflet/BaseLayers', {
			templateUrl : 'app/partials/leaflet-demo/baselayers.html',
			controller : 'BaseLayersController'
		}).when('/leaflet/CombineTypeLayers', {
			templateUrl : 'app/partials/leaflet-demo/combinetypelayers.html',
			controller : 'CombineTypeLayersController'
		});
	} ]);

});