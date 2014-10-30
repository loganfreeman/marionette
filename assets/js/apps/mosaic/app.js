define([ 'app',
         'tpl!apps/mosaic/view.tpl',
         'css!apps/mosaic/style',
         'jquery.mosaicflow'], function(App, viewTpl) {
	App.module('mosaic', function(mosaic, App, Backbone, Marionette, $, _) {

		mosaic.MainView = Marionette.ItemView.extend({
			template : viewTpl
		});

		mosaic.controller = {
			show : function() {
				App.navigate("mosaic");
				App.mainRegion.show(new mosaic.MainView());
			}
		}

		App.on("mosaic:show", function() {
			mosaic.controller.show();
		});

		mosaic.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"mosaic" : "show"
			}
		});

		App.addInitializer(function() {
			new mosaic.Router({
				controller : mosaic.controller
			});
		});
	});
	return App.mosaic.controller;
})