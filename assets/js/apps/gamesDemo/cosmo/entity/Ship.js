
lychee.define('game.entity.Ship').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"];


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		this.health  = 0;
		this.speedx  = 0;
		this.speedy  = 0;
		this.weapons = [ 0, 0, 0, 1, 0, 0, 0 ];

		this.__speed = 0;


		settings.texture = _texture;
		settings.map     = _config.map;
		settings.states  = _config.states;

		settings.width     = _config.width;
		settings.height    = _config.height;
		settings.collision = lychee.game.Entity.COLLISION.A;
		settings.shape     = lychee.game.Entity.SHAPE.rectangle;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		setHealth: function(health) {

			health = typeof health === 'number' ? health : null;

			if (health !== null) {
				this.health = health;
			}

		},

		setSpeedX: function(speed) {

			speed = typeof speed === 'number' ? speed : 0;

			this.speedx = speed;

		},

		setSpeedY: function(speed) {

			speed = typeof speed === 'number' ? speed : null;

			if (speed !== null) {
				this.speedy = speed;
			} else {
				this.speedy = this.__speed;
			}

		},

		setState: function(id) {

			var result = lychee.game.Sprite.prototype.setState.call(this, id);
			if (result === true) {

				if (id.substr(0, 7) === 'upgrade') {
					this.health = 100;
				}


				var statemap = this.getStateMap();

				var weapons = statemap.weapons;
				if (weapons instanceof Array) {
					this.weapons = weapons;
				}

				var width = statemap.width;
				if (typeof width === 'number') {
					this.width = width;
				}

				var height = statemap.height;
				if (typeof height === 'number') {
					this.height = height;
				}

				var speed = statemap.speed;
				if (typeof speed === 'number') {
					this.__speed = speed;
					this.speedy  = speed;
				}

			}

		}

	};


	return Class;

});

