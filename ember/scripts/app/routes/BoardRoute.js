define([ 'ember', 'controllers/BoardController', 'models/Board' ], function(Ember, BoardController, Board) {
	"use strict";
	var boardRoute = Ember.Route.extend({
		
		model: function(){
			var board = Board.create();
			board.restart();
			return board;
		},

		renderTemplate : function() {
			this.render('board', {
				into : "application",
				outlet : 'main'
			});
		}
	});
	
	return boardRoute;

});