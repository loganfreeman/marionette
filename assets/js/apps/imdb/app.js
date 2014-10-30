define([ 'app',
         'tpl!apps/imdb/view.tpl',
         'bubble',
         'css!apps/imdb/style'], function(App, viewTpl) {
	App.module('IMDB', function(IMDB, App, Backbone, Marionette, $, _) {

		IMDB.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 var display, key, plot, text;
				  plot = Bubbles();
				  display = function(data) {
				    return plotData("#vis", data, plot);
				  };
				  return d3.csv("assets/js/apps/imdb/movies.csv", display);
			}
		});

		IMDB.controller = {
			show : function() {
				App.navigate("IMDB");
				App.mainRegion.show(new IMDB.MainView());
			}
		}

		App.on("IMDB:show", function() {
			IMDB.controller.show();
		});

		IMDB.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"IMDB" : "show"
			}
		});

		App.addInitializer(function() {
			new IMDB.Router({
				controller : IMDB.controller
			});
		});
	});
	return App.IMDB.controller;
})