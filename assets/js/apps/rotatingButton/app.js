define([ 'app', 'tpl!apps/rotatingButton/view.tpl', 'css!apps/rotatingButton/style' ], function(App, viewTpl) {
	App.module('AnimatedBar', function(AnimatedBar, App, Backbone, Marionette, $, _) {

		var deg = 0;
		var dif = -3;
		var game = null;
		var over = false;

		function resetState() {
			if (game)
				clearInterval(game);
			deg = 0;
			dif = -3;
			game = null;
			over = false;
		}

		AnimatedBar.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow : function() {

				resetState();

				/* Assigning the buttons to a variable for speed: */
				var arr = $('#stage .btn');

				/* Storing the length of the array in a viriable: */
				var len = arr.length;

				/* Finding the centers of the animation container: */
				var centerX = $('#stage').width() / 2 - 40;
				var centerY = $('#stage').height() / 2 - 60;

				/* Applying relative positioning to the buttons: */
				arr.css('position', 'absolute');

				/* The function inside the interva is run 25 times a second */
				game = setInterval(function() {

					/*
					 * This forms an area with no activity in the middle of the
					 * stage
					 */
					if (over || Math.abs(dif) < 0.5)
						return false;

					/* Increment the degrees: */
					deg += dif;

					/* Loop through all the buttons: */
					$.each(arr, function(i) {

						/* Calculate the sine and cosine */

						var eSin = Math.sin(((360 / len) * i + deg) * Math.PI / 180);
						var eCos = Math.cos(((360 / len) * i + deg) * Math.PI / 180);

						/* Setting the css properties */
						$(this).css({
							top : centerY + 25 * eSin,
							left : centerX + 90 * eCos,
							opacity : 0.8 + eSin * 0.2,
							zIndex : Math.round(80 + eSin * 20)
						});

					})

				}, 40);

				/*
				 * Detecting the movements on the mouse and speeding up or
				 * reversing the rotation accordingly:
				 */

				$("#stage").mousemove(function(e) {

					if (!this.leftOffset) {
						/*
						 * This if section is only run the first time the
						 * function is executed.
						 */
						this.leftOffset = $(this).offset().left;
						this.width = $(this).width();
					}

					/*
					 * If the mouse is over a button, set dif to 0, which stops
					 * the animation
					 */
					dif = -5 + (10 * ((e.pageX - this.leftOffset) / this.width));

					/*
					 * In the other case calculate the speed according to the X
					 * position of the mouse
					 */
				});

				/*
				 * Detecting whether the mouse is positioned above a share
				 * button:
				 */
				$('#stage .btn').hover(function() {
					over = true;
				}, function() {
					over = false;
				});
			}
		});

		AnimatedBar.controller = {
			show : function() {
				App.navigate("animatedbar");
				App.mainRegion.show(new AnimatedBar.MainView());
			}
		}

		App.on("animatedbar:show", function() {
			AnimatedBar.controller.show();
		});

		AnimatedBar.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"animatedbar" : "show"
			}
		});

		AnimatedBar.addInitializer(function() {
			new AnimatedBar.Router({
				controller : AnimatedBar.controller
			});
		});
	});
	return App.AnimatedBar.controller;
})