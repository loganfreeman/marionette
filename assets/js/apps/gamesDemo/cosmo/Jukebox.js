
lychee.define('game.Jukebox').includes([
	'lychee.Jukebox'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(game) {

		lychee.Jukebox.call(this, 20);


		var bases = [
			'assets/js/apps/gamesDemo/cosmo/asset/sound/ship-lazer',
			'assets/js/apps/gamesDemo/cosmo/asset/sound/ship-shield',
			'assets/js/apps/gamesDemo/cosmo/asset/sound/ship-transformation',
			'assets/js/apps/gamesDemo/cosmo/asset/sound/explosion',

			'assets/js/apps/gamesDemo/cosmo/asset/music/space'
		];

		var ids = [
			'ship-lazer',
			'ship-shield',
			'ship-transformation',
			'explosion',

			'music'
		];


		for (var i = 0, il = ids.length; i < il; i++) {

			var track = new lychee.Track(ids[i], {
				base:    bases[i],
				formats: [ 'ogg', 'mp3' ]
			});

			this.add(track);

		}

	};


	return Class;

});

