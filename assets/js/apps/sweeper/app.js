define([ 'app',
         'tpl!apps/sweeper/view.tpl',
         'css!apps/sweeper/style', 'mootools', 'raphael', 'neural_net', 'sweepers'], function(App, viewTpl) {

	App.module('Sweeper', function(Sweeper, App, Backbone, Marionette, $, _) {
		
		Sweeper.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 Sweepers.init({
			            canvas_height: 390,
			            canvas_width: 850,
			        });
			}
		});

		Sweeper.controller = {
			show : function() {
				App.navigate("sweeper");
				App.mainRegion.show(new Sweeper.MainView());
			}
		}

		App.on("sweeper:show", function() {
			Sweeper.controller.show();
		});

		Sweeper.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"sweeper" : "show"
			}
		});

		Sweeper.addInitializer(function() {
			new Sweeper.Router({
				controller : Sweeper.controller
			});
		});


	});
	return App.Sweeper.controller;
})