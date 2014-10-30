
lychee.define('game.entity.Blackhole').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"];


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		this.health = Infinity;
		this.points = 500;


		settings.texture = _texture;
		settings.map     = _config.map;
		settings.state   = "default";
		settings.states  = _config.states;

		settings.radius    = _config.radius;
		settings.collision = lychee.game.Entity.COLLISION.A;
		settings.shape     = lychee.game.Entity.SHAPE.circle;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

	};


	return Class;

});

