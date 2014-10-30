define([ 'app',
         'tpl!apps/minesweeper/view.tpl',
         'css!apps/minesweeper/style', 'apps/minesweeper/sweeper'], function(App, viewTpl) {
	App.module('MineSweeper', function(MineSweeper, App, Backbone, Marionette, $, _) {

		MineSweeper.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			className: 'sweeper',
			onShow: function(){
				 window.b = new Board();
				  window.b.init();
				  window.b.build();
			}
		});

		MineSweeper.controller = {
			show : function() {
				App.navigate("minesweeper");
				App.mainRegion.show(new MineSweeper.MainView());
			}
		}

		App.on("minesweeper:show", function() {
			MineSweeper.controller.show();
		});

		MineSweeper.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"minesweeper" : "show"
			}
		});

		MineSweeper.addInitializer(function() {
			new MineSweeper.Router({
				controller : MineSweeper.controller
			});
		});
	});
	return App.MineSweeper.controller;
})