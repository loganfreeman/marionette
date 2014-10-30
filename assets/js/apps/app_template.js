define([ 'app',
         'stache!apps/ModuleName/main',
         'css!apps/ModuleName/style'], function(App, viewTpl) {
	App.module('ModuleName', function(ModuleName, App, Backbone, Marionette, $, _) {

		ModuleName.MainView = Marionette.ItemView.extend({
			template : viewTpl,
		});

		ModuleName.controller = {
			show : function() {
				App.navigate("ModuleName");
				App.mainRegion.show(new ModuleName.MainView());
			}
		}

		App.on("ModuleName:show", function() {
			ModuleName.controller.show();
		});

		ModuleName.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"ModuleName" : "show"
			}
		});

		App.addInitializer(function() {
			new ModuleName.Router({
				controller : ModuleName.controller
			});
		});
	});
	return App.ModuleName.controller;
})