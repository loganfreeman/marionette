define([ 'vendor/melonJS-1.1.0' ], function() {
	/* Game namespace */
	var game = {
		// Run on page load.
		"onload" : function() {
			// Initialize the video.
			if (!me.video.init("screen", 1024, 768, true, 'auto')) {
				alert("Your browser does not support HTML5 canvas.");
				return;
			}

			// add "#debug" to the URL to enable the debug Panel
			if (document.location.hash === "#debug") {
				window.onReady(function() {
					me.plugin.register.defer(this, debugPanel, "debug");
				});
			}

			// Initialize the audio.
			me.audio.init("mp3,ogg");

			// switch to the Play Screen.
			me.state.set(me.state.PLAY, new game.PlayScreen());
			me.state.change(me.state.PLAY);
		}
	};

	game.square = me.DraggableEntity.extend({
		/**
		 * constructor
		 */
		init : function(x, y, settings) {
			// call the super constructor
			this._super(me.DraggableEntity, 'init', [ x, y, settings ]);
			// set the color to white
			this.color = "white";
			// set the font we want to use
			this.font = new me.Font('Verdana', 15, 'black');
			this.font.bold();
			// set the text
			this.text = 'Drag me';
		},
		/**
		 * update function
		 */
		update : function() {
			return true;
		},
		/**
		 * draw the square
		 */
		draw : function(context) {
			context.fillStyle = this.color;
			context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
			this.font.draw(context, this.text, this.pos.x, this.pos.y);
		},
		/**
		 * dragStart overwrite function
		 */
		dragStart : function(e) {
			// call the super function
			this._super(me.DraggableEntity, 'dragStart', [ e ]);
			// set the color to blue
			this.color = 'blue';
		},
		dragEnd : function(e) {
			// call the super function
			this._super(me.DraggableEntity, 'dragEnd', [ e ]);
			// set the color to white
			this.color = 'white';
		}
	});

	game.droptarget = me.DroptargetEntity.extend({
		/**
		 * constructor
		 */
		init : function(x, y, settings) {
			// call the parent constructor
			this._super(me.DroptargetEntity, 'init', [ x, y, settings ]);
			// set the color to white
			this.color = "red";
			// set the font we want to use
			this.font = new me.Font('Verdana', 15, 'black');
			this.font.bold();
			// set the text
			this.text = 'Drop on me\n\nAnd I\'ll turn green\n\ncheckmethod: overlap';
		},
		/**
		 * update function
		 */
		update : function() {
			return true;
		},
		/**
		 * draw the square
		 */
		draw : function(context) {
			context.fillStyle = this.color;
			context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
			this.font.draw(context, this.text, this.pos.x, this.pos.y);
		},
		/**
		 * drop overwrite function
		 */
		drop : function(e) {
			// save a reference to this to use in the timeout
			var self = this;
			// call the super function
			this._super(me.DroptargetEntity, 'draw', [ e ]);
			// indicate a succesful drop
			this.color = 'green';
			// set the color back to red after a second
			window.setTimeout(function() {
				self.color = 'red';
			}, 1000);
		}
	});

	game.droptarget2 = game.droptarget.extend({
		/**
		 * constructor
		 */
		init : function(x, y, settings) {
			// call the super constructor
			this._super(game.droptarget, 'init', [ x, y, settings ]);
			// set the color to white
			this.color = "red";
			// set the font we want to use
			this.font = new me.Font('Verdana', 15, 'black');
			this.font.bold();
			// set the text
			this.text = 'Drop on me\n\nAnd I\'ll turn green\n\ncheckmethod: contains';
			// set the check method to 'contains' (default is 'overlap')
			this.setCheckMethod(this.CHECKMETHOD_CONTAINS);
		}
	});

	game.PlayScreen = me.ScreenObject.extend({
		/**
		 * action to perform on state change
		 */
		onResetEvent : function() {
			// clear the background
			me.game.world.addChild(new me.ColorLayer("background", "#000000", 0), 0);
			// add a few squares
			me.game.world.addChild(new game.square(200, 230, {
				width : 100,
				height : 100
			}), 1);

			// add a droptarget entity
			me.game.world.addChild(new game.droptarget(400, 200, {
				width : 200,
				height : 150
			}), 1);

			// add another droptarget entity
			me.game.world.addChild(new game.droptarget2(400, 400, {
				width : 200,
				height : 150
			}), 1);
		}
	});
	var run = function() {
		game.onload();

		// Mobile browser hacks
		if (me.device.isMobile && !navigator.isCocoonJS) {
			// Prevent the webview from moving on a swipe
			window.document.addEventListener("touchmove", function (e) {
				e.preventDefault();
				window.scroll(0, 0);
				return false;
			}, false);

			// Scroll away mobile GUI
			(function () {
				window.scrollTo(0, 1);
				me.video.onresize(null);
			}).defer();

			me.event.subscribe(me.event.WINDOW_ONRESIZE, function (e) {
				window.scrollTo(0, 1);
			});
		}
	};
	return run;
})