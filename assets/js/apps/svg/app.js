define([ 'app', 'tpl!apps/svg/view.tpl', 'svg', 'svg.easing', 'svg.clock', 'css!apps/svg/clock' ], function(App, viewTpl, SVG) {
	App.module('SVGDemo', function(SVGDemo, App, Backbone, Marionette, $, _) {

		SVGDemo.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				SVG('clock-canvas').clock('80%').start();
			}
		});

		SVGDemo.controller = {
			show : function() {
				App.navigate("svgdemo");
				App.mainRegion.show(new SVGDemo.MainView());
			}
		}

		App.on("svgdemo:show", function() {
			SVGDemo.controller.show();
		});

		SVGDemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"svgdemo" : "show"
			}
		});

		SVGDemo.addInitializer(function() {
			new SVGDemo.Router({
				controller : SVGDemo.controller
			});
		});
	});
	return App.SVGDemo.controller;
})