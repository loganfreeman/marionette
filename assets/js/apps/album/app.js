define([ 'app' , 'tpl!apps/album/view.tpl', 'css!apps/album/style', 'jquery.albumPreview'], function(App, viewTpl) {
	App.module('Album', function(Album, App, Backbone, Marionette, $, _) {

		Album.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				$('#album-wrapper .album').albumPreviews();
			}
		});

		Album.controller = {
			show : function() {
				App.navigate("album");
				App.mainRegion.show(new Album.MainView());
			}
		}

		App.on("album:show", function() {
			Album.controller.show();
		});

		Album.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"album" : "show"
			}
		});

		Album.addInitializer(function() {
			new Album.Router({
				controller : Album.controller
			});
		});
	});
	return App.Album.controller;
})