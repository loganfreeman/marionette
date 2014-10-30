define([ 'app', 'tpl!apps/animate/view.tpl', 'css!apps/animate/style' ], function(App, viewTpl) {
	App.module('AnimateApp', function(AnimateApp, App, Backbone, Marionette, $, _) {

		var exits = [ 'fadeOut', 'fadeOutDown', 'fadeOutUpBig', 'bounceOut', 'bounceOutDown', 'hinge', 'bounceOutUp', 'bounceOutLeft', 'rotateOut', 'rotateOutUpLeft', 'lightSpeedOut', 'rollOut' ];

		var entrances = [ 'fadeIn', 'fadeInDown', 'fadeInRight', 'bounceIn', 'bounceInRight', 'rotateIn', 'rotateInDownLeft', 'lightSpeedIn', 'rollIn', 'bounceInDown' ];

		var ignoreClicks = false;
		
		var slideshow;

		AnimateApp.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			
			events:{
				'click .arrow': 'arrowClick',
				'click .arrow.next': 'nextClick',
				'click .arrow.previous': 'previousClick'
			},
			
			ui: {
				photos: '#photos'
			},
			
			arrowClick: function(e, simulated){

				// Once the user clicks on the arrows,
				// stop the automatic slideshow
				if(!simulated) {
					console.log('interval stopped');
					clearInterval(slideshow);
				}
			},
			nextClick: function(e){
				
				var that = this;
				e.preventDefault();

				// The topmost element
				var elem = $('#photos li:last');

				// Apply a random exit animation
				elem.addClass('animated').addClass(exits[Math.floor(exits.length * Math.random())]);

				setTimeout(function() {

					// Reset the classes
					elem.attr('class', '').prependTo(that.ui.photos);

					// The animation is complate!
					// Allow clicks again:
					ignoreClicks = false;

				}, 1000);
			},
			previousClick: function(e){
				
				var that = this;
				e.preventDefault();

				// The bottom-most element
				var elem = $('#photos li:first');

				// Move the photo to the top, and
				// apply a random entrance animation

				elem.appendTo(that.ui.photos).addClass('animated').addClass(entrances[Math.floor(entrances.length * Math.random())]);

				setTimeout(function() {

					// Remove the classess
					elem.attr('class', '');

					// The animation is complate!
					// Allow clicks again:
					ignoreClicks = false;

				}, 1000);
			},
		
		
			
			onShow : function() {
								
				// Start an automatic slideshow
				slideshow = setInterval(function() {
					
					// Simulate a click every 1.5 seconds
					$('.arrow.next').trigger('click', [ true ]);

				}, 1500);
			},
			
			onClose: function(){
				if(slideshow){
					clearInterval(slideshow);
					slideshow = void 0;				
				}
			}
		});

		AnimateApp.controller = {
			show : function() {
				App.navigate("css-animate");
				App.mainRegion.show(new AnimateApp.MainView());
			}
		}

		App.on("css-animate:show", function() {
			AnimateApp.controller.show();
		});

		AnimateApp.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"css-animate" : "show"
			}
		});

		AnimateApp.addInitializer(function() {
			new AnimateApp.Router({
				controller : AnimateApp.controller
			});
		});
	});
	return App.AnimateApp.controller;
})