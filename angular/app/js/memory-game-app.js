define([ 'angular', 'memory-game', 'css!../css/memory-game' ], function(angular, Game) {

	var memoryGameApp = angular.module('memoryGameApp', []);

	memoryGameApp.factory('game', function() {
		var tileNames = [ '8-ball', 'kronos', 'baked-potato', 'dinosaur', 'rocket', 'skinny-unicorn', 'that-guy', 'zeppelin' ];

		return new Game(tileNames);
	});

	memoryGameApp.controller('GameCtrl', function GameCtrl($scope, game) {
		$scope.game = game;
	});
	
	return memoryGameApp;

})