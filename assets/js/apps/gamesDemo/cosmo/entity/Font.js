
lychee.define('game.entity.Font').exports(function(lychee, game, global, attachments) {

	var _fonts = {};

	for (var file in attachments) {

		var tmp = file.split('.');
		var id  = tmp[0];
		var ext = tmp[1];

		if (ext === 'fnt') {
			_fonts[id] = attachments[file];
		}

	}


	var Callback = function(id) {

		if (_fonts[id] !== undefined) {
			return _fonts[id];
		}


		return null;

	};


	return Callback;

});

