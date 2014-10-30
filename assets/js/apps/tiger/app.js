define([ 'app',
         'tpl!apps/tiger/view.tpl',
         'css!apps/tiger/style', 'apps/tiger/tiger', 'raphael'], function(App, viewTpl) {
	App.module('Tiger', function(Tiger, App, Backbone, Marionette, $, _) {
		var r;
		Tiger.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
                if(!r) {r = Raphael(tiger).translate(200, 200);}
			},
			onClose: function(){
				
			}
		});

		Tiger.controller = {
			show : function() {
				App.navigate("Tiger");
				App.mainRegion.show(new Tiger.MainView());
			}
		}

		App.on("Tiger:show", function() {
			Tiger.controller.show();
		});

		Tiger.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"Tiger" : "show"
			}
		});

		App.addInitializer(function() {
			new Tiger.Router({
				controller : Tiger.controller
			});
		});
	});
	return App.Tiger.controller;
})