define([ 'app', 
         "tpl!apps/gogame/view.tpl",
         'apps/gogame/legal', 
         'apps/gogame/board',
         'css!apps/gogame/board', 'image!assets/img/board.png'], function(App, viewTpl) {
	App.module('GoGame', function(GoGame, App, Backbone, Marionette, $, _) {

		GoGame.MainView = Marionette.ItemView.extend({
			template : viewTpl,
		});

		GoGame.controller = {
			show : function() {
				App.navigate("gogame");
				App.mainRegion.show(new GoGame.MainView());
				Board.initilized = false;
			    //var io = require('socket.io');
			    //var socket = io.connect();
				// for testing, to be removed in final version 
				Board.Make(600,19,0);
				//alert(Game.ko);
				//alert(Game.checkLegal(0,0));
				//alert('poop');
				//alert(Game.groupArray);

				$("#boardOverlay").mouseup(function (e) {
			        e.preventDefault();
			        var move = {};

					var currentMoveLocation = Board.getEventPosInBoardOverlay(e);
					move.Y = Math.floor(currentMoveLocation[1] / Board.piece_length);
					move.X = Math.floor(currentMoveLocation[0] / Board.piece_length);
					//alert('x and y ' + move.X + ',' + move.Y);
					if(Board.Game.checkLegal(move.X,move.Y)){
						Board.place_piece(move);
						Board.Game.place_piece(move.X,move.Y);
					} else if (!Board.Game.checkLegal(move.X,move.Y)) {
						alert('move not legal');
					} else {
						alert('WTF');
					}
					
				    
			    });
			}
		}

		App.on("gogame:show", function() {
			GoGame.controller.show();
		});

		GoGame.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"gogame" : "show"
			}
		});

		GoGame.addInitializer(function() {
			new GoGame.Router({
				controller : GoGame.controller
			});
		});
	});
	return App.GoGame.controller;
})