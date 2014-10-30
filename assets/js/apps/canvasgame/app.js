define([ 'app',
         'stache!apps/canvasgame/main',
         'stache!apps/canvasgame/basic',
         'css!apps/canvasgame/style'], function(App, viewTpl, basicViewTpl) {
	App.module('canvasgame', function(canvasgame, App, Backbone, Marionette, $, _) {

		canvasgame.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				content : '#canvas-game-demo'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		var mainView = new canvasgame.MainView();

		
		canvasgame.basicView = Marionette.ItemView.extend({
			template : basicViewTpl,
			onShow: function(){
			}
		});

		canvasgame.controller = {
			show : function() {
				App.navigate("canvas-game");
				App.mainRegion.show(mainView);
			},
			showBasic: function(){
				window.location.href = 'demo/canvasgame/index.html'
			},
			breakout: function(){
				window.location.href = 'demo/canvasgame/examples/breakout.html'

			},
			cnc: function(){
				window.location.href = 'demo/canvasgame/examples/cnc.html'

			}
			,			
			mario: function(){
				window.location.href = 'demo/canvasgame/examples/mario.html'

			},
			pacman: function(){
				window.location.href = 'demo/canvasgame/examples/pacman.html'

			},
			paint: function(){
				window.location.href = 'demo/canvasgame/examples/paint.html'

			},
			snake: function(){
				window.location.href = 'demo/canvasgame/examples/snake.html'

			}
		}

		App.on("canvas-game:show", function() {
			canvasgame.controller.show();
		});

		canvasgame.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"canvas-game" : "show",
				'canvas-game/basic': 'showBasic',
				'canvas-game/breakout': 'breakout',
				'canvas-game/cnc': 'cnc',
				'canvas-game/mario': 'mario',
				'canvas-game/pacman': 'pacman',
				'canvas-game/paint': 'paint',
				'canvas-game/snake': 'snake',
			}
		});

		App.addInitializer(function() {
			new canvasgame.Router({
				controller : canvasgame.controller
			});
		});
	});
	return App.canvasgame.controller;
})