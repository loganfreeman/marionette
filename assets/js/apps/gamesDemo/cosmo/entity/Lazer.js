
lychee.define('game.entity.Lazer').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"];


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		this.owner = null;


		settings.texture = _texture;
		settings.states  = _config.states;
		settings.map     = _config.map;

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

		setOwner: function(owner) {
			this.owner = owner;
		}

	};


	return Class;

});

