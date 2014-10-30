define([ 'app',
         'tpl!apps/waterfall/view.tpl',
         'handlebars', 
         'css!apps/waterfall/style', 'jquery.easing', 'waterfall'], function(App, viewTpl, Handlebars) {
	App.module('waterfall', function(waterfall, App, Backbone, Marionette, $, _) {

		waterfall.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				$('#waterfall-container').waterfall({
				    itemCls: 'waterfall-item',
				    colWidth: 222,  
				    gutterWidth: 15,
				    gutterHeight: 15,
				    checkImagesLoaded: true,
				    dataType: 'json',
				    path: function(page) {
				        return 'assets/js/apps/waterfall/data/data5.json?page=' + page;
				    }
				});
			}
		});
		
		waterfall.animateView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				$('#waterfall-container').waterfall({
				    itemCls: 'waterfall-item',
				    colWidth: 222,
				    gutterWidth: 15,
				    gutterHeight: 15,
				    checkImagesLoaded: true,
				    isAnimated: true,
				    animationOptions: {
				    },
				    path: function(page) {
				        return 'assets/js/apps/waterfall/data/data1.json?page=' + page;
				    }
				});
			}
		});
		
		waterfall.customWidthView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				$('#waterfall-container').waterfall({
				    itemCls: 'waterfall-item',
				    colWidth: 222,  
				    gutterWidth: 15,
				    gutterHeight: 15,
				    fitWidth: false,
				    checkImagesLoaded: true,
				    path: function(page) {
				        return 'assets/js/apps/waterfall/data/data3.json?page=' + page;
				    }
				});
			}
		});
		
		waterfall.fadeinView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				$('#waterfall-container').waterfall({
				    itemCls: 'waterfall-item',
				    colWidth: 222,  
				    gutterWidth: 15,
				    gutterHeight: 15,
				    isFadeIn: true,
				    checkImagesLoaded: true,
				    path: function(page) {
				        return 'assets/js/apps/waterfall/data/data2.json?page=' + page;
				    }
				});
			}
		});

		waterfall.controller = {
			show : function() {
				App.navigate("waterfall");
				App.mainRegion.show(new waterfall.MainView());
			},
			animate: function(){
				App.navigate("waterfall/animate");
				App.mainRegion.show(new waterfall.animateView());
			},
			customWidth: function(){
				App.navigate("waterfall/customwidth");
				App.mainRegion.show(new waterfall.customWidthView());
			},
			fadein: function(){
				App.navigate("waterfall/fadein");
				App.mainRegion.show(new waterfall.fadeinView());
			}
		}

		App.on("waterfall:show", function() {
			waterfall.controller.show();
		});

		waterfall.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"waterfall" : "show",
				'waterfall/animate': 'animate',
				 'waterfall/customwidth' : 'customWidth',
				 'waterfall/fadein' : 'fadein',
				 'waterfall/finitescroll' : 'show',
				 'waterfall/infinitescroll' : 'show'
			}
		});

		App.addInitializer(function() {
			new waterfall.Router({
				controller : waterfall.controller
			});
		});
	});
	return App.waterfall.controller;
})