define([ 'app', 'stache!apps/ASTTree/view' , 'css!apps/ASTTree/main'], function(App, tpl) {
	App.module('ASTTRee', function(ASTTRee, App, Backbone, Marionette, $, _) {

		ASTTRee.MainView = Marionette.ItemView.extend({
			template : tpl,
			onShow: function(){
				require(['apps/ASTTree/main']);
			}
		});

		ASTTRee.controller = {
			show : function() {
				App.navigate("asttree");
				App.mainRegion.show(new ASTTRee.MainView());
			}
		}

		App.on("asttree:show", function() {
			ASTTRee.controller.show();
		});

		ASTTRee.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"asttree" : "show"
			}
		});

		ASTTRee.addInitializer(function() {
			new ASTTRee.Router({
				controller : ASTTRee.controller
			});
		});
	});
	return App.ASTTRee.controller;
})