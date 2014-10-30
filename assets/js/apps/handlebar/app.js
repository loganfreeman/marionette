define([ 'app',
         'hbs!apps/handlebar/view',
         'css!apps/handlebar/style'], function(App, viewTpl) {
	App.module('HandleBarsDemo', function(HandleBarsDemo, App, Backbone, Marionette, $, _) {

		HandleBarsDemo.MainView = Marionette.ItemView.extend({
			template : {
                type: 'handlebars',
                template: viewTpl
            },
            model: new Backbone.Model({title: 'handlebars', body: 'HandleBars template is awesome!'})
		});

		HandleBarsDemo.controller = {
			show : function() {
				App.navigate("HandleBarsDemo");
				App.mainRegion.show(new HandleBarsDemo.MainView());
			}
		}

		App.on("HandleBarsDemo:show", function() {
			HandleBarsDemo.controller.show();
		});

		HandleBarsDemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"HandleBarsDemo" : "show"
			}
		});

		App.addInitializer(function() {
			new HandleBarsDemo.Router({
				controller : HandleBarsDemo.controller
			});
		});
	});
	return App.HandleBarsDemo.controller;
})