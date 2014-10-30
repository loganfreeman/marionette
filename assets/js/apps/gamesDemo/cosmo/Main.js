
lychee.define('game.Main').requires([
	'game.Jukebox',
	'game.entity.Font',
	'game.logic.Game',
	'game.state.Game',
	'game.state.Menu',
	'game.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			title: 'Cosmo',

			fullscreen: true,

			music: true,
			sound: true,

			input: {
				fireKey:      true,
				fireModifier: false,
				fireTouch:    true,
				fireSwipe:    false
			},

			renderer: {
				id:     'game',
				width:  640,
				height: 480
			}

		}, data);


		lychee.game.Main.call(this, settings);

		this.init();

	};


	Class.prototype = {

		reset: function(state) {

			game.DeviceSpecificHacks.call(this);

			// This will initially reset the viewport
			// based on the DeviceSpecificHacks
			this.reshape();


			if (state === true) {

				// This will leave the current state and
				// pass in empty data (for level interaction)
				this.resetState(null, null);

			}

		},

		init: function() {

			// Remove Preloader Progress Bar
			lychee.Preloader.prototype._progress(null, null);


			lychee.game.Main.prototype.init.call(this);
			this.reset(false);


			this.fonts = {};
			this.fonts.headline = new game.entity.Font('headline');
			this.fonts.normal   = new game.entity.Font('normal');

			this.jukebox = new game.Jukebox(this);
			this.logic   = new game.logic.Game(this);

			this.setState('game', new game.state.Game(this));
			this.setState('menu', new game.state.Menu(this));
			this.changeState('menu');


			if (lychee.debug === true) {

				if (this.settings.stage !== undefined) {
					this.changeState('game', this.settings.stage);
				}


				if (this.settings.points !== undefined) {

					var data = this.logic.__level.getData();
					data.points = this.settings.points;
					this.logic.__level.trigger('update', [ data ]);

				}

			}


			this.start();

		},

		// TODO: hide/show integration
		start: function() {},
		stop:  function() {}

	};


	return Class;

});
