define([ 'app', "tpl!apps/simplecanvasgame/templates/view.tpl", 'apps/simplecanvasgame/game', 'image!assets/js/apps/simplecanvasgame/images/background.png',
         'image!assets/js/apps/simplecanvasgame/images/hero.png',
         'image!assets/js/apps/simplecanvasgame/images/monster.png'], function(App, viewTpl, game) {
	App.module('CanvasGame', function(CanvasGame, App, Backbone, Marionette, $, _) {

		CanvasGame.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				
				game();
			}
		});

		CanvasGame.controller = {
			show : function() {
				App.navigate("canvasgame");
				App.mainRegion.show(new CanvasGame.MainView());
			}
		}

		App.on("canvasgame:show", function() {
			CanvasGame.controller.show();
		});

		CanvasGame.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"canvasgame" : "show"
			}
		});

		CanvasGame.addInitializer(function() {
			new CanvasGame.Router({
				controller : CanvasGame.controller
			});
		});
	});
	return App.CanvasGame.controller;
})