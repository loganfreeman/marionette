define([ 'app', 'tpl!apps/rocket/view.tpl', 'css!apps/rocket/style' ], function(App, viewTpl) {
	App.module('Rocket', function(Rocket, App, Backbone, Marionette, $, _) {
		
		function animSteam(){
			
			// Create a new span with the steam1, or steam2 class:
			
			$('<span>',{
				class:'steam'+Math.floor(Math.random()*2 + 1),
				css:{
					// Apply a random offset from 10px to the left to 10px to the right
					marginLeft	: -10 + Math.floor(Math.random()*20)
				}
			}).appendTo('#rocket-wrapper').animate({
				left:'-=58',
				bottom:'-=100'
			}, 120,function(){
				
				// When the animation completes, remove the span and
				// set the function to be run again in 10 milliseconds
				
				$(this).remove();
				setTimeout(animSteam,10);
			});
		}
		
		function moveRocket(){
			$('#rocket-wrapper').animate({'left':'+=200'},5000).delay(1000)
						.animate({'left':'-=200'},5000,function(){
							setTimeout(moveRocket,1000);
			});
		}

		Rocket.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				moveRocket();
				animSteam();
			},
			onClose: function(){
			}
		});

		Rocket.controller = {
			show : function() {
				App.navigate("rocket");
				App.mainRegion.show(new Rocket.MainView());
			}
		}

		App.on("rocket:show", function() {
			Rocket.controller.show();
		});

		Rocket.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"rocket" : "show"
			}
		});

		Rocket.addInitializer(function() {
			new Rocket.Router({
				controller : Rocket.controller
			});
		});
	});
	return App.Rocket.controller;
})