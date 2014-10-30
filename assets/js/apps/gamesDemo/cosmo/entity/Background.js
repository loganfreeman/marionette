
lychee.define('game.entity.Background').includes([
	'lychee.game.Background'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = {
		repeat: true,
		states: { 'default': 0 },
		map:    { 'default': [{ x: 0, y: 0, w: 512, h: 512 }] }
	};


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		settings.repeat  = _config.repeat;
		settings.states  = _config.states;
		settings.texture = _texture;
		settings.map     = _config.map;


		lychee.game.Background.call(this, settings);

	};


	Class.prototype = {

	};


	return Class;

});

