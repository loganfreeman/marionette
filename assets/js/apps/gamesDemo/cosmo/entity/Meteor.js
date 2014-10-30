
lychee.define('game.entity.Meteor').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"];


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		this.health = (100 + Math.random() * 100) | 0;
		this.points = this.health;


		settings.texture = _texture;
		settings.map     = _config.map;
		settings.state   = Math.random() > 0.5 ? 'rotation-right' : 'rotation-left';
		settings.states  = {
			'default': _config.states['default'],
			'rotation-right': {
				animation: true,
				duration:  (2000 + Math.random() * 4000) | 0,
				loop:      true
			},
			'rotation-left': {
				animation: true,
				duration:  (2000 + Math.random() * 4000) | 0,
				loop:      true
			}
		};

		settings.radius    = _config.radius;
		settings.collision = lychee.game.Entity.COLLISION.A;
		settings.shape     = lychee.game.Entity.SHAPE.circle;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		setHealth: function(value) {

			value = typeof value === 'number' ? value : null;

			if (value !== null) {
				this.health = value;
			}

		},

		setPoints: function(value) {

			value = typeof value === 'number' ? value : null;

			if (value !== null) {
				this.points = value;
			}

		}

	};


	return Class;

});

