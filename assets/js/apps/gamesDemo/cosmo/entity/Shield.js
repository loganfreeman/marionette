
lychee.define('game.entity.Shield').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = {
		states: {
			'default': {},
			'flicker': {}
		}
	};


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		this.__flicker = {
			active:   false,
			start:    null,
			timeouts: [ 20, 100, 50, 130 ],
			index:    0
		};


		settings.texture = _texture;
		settings.state   = "default";
		settings.states  = _config.states;

		settings.width   = 175;
		settings.height  = 130;
		settings.shape   = lychee.game.Entity.SHAPE.rectangle;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		setState: function(id) {

			var result = lychee.game.Sprite.prototype.setState.call(this, id);
			if (result === true) {

				var state = this.state;
				if (state === 'flicker') {

					var flicker = this.__flicker;

					flicker.active = true;
					flicker.start  = this.__clock;
					flicker.index  = 0;

				}

			}

		},

		update: function(clock, delta) {

			var flicker = this.__flicker;
			if (flicker.active === true) {

				var timeout = flicker.timeouts[flicker.index];
				var t = (clock - flicker.start) / timeout;
				if (t > 1) {

					flicker.start = clock;
					flicker.index++;

					if (flicker.index >= flicker.timeouts.length) {
						flicker.active = false;
					}

				}

			}

			this.__clock = clock;

		},

		render: function(renderer, offsetX, offsetY) {

			var flicker = this.__flicker;
			if (
				   flicker.active === true
				&& flicker.index !== 0
				&& flicker.index % 2 === 1
			) {

				lychee.game.Sprite.prototype.render.call(this, renderer, offsetX, offsetY);

			}

		}

	};


	return Class;

});

