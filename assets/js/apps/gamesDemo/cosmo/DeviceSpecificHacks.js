
lychee.define('game.DeviceSpecificHacks').exports(function(lychee, game, global, attachments) {

	var Callback = function() {

		var settings = this.settings;

		if (typeof global.navigator !== 'undefined') {


			if (global.navigator.appName === 'V8GL') {

				settings.fullscreen = true;
				settings.music = false;
				settings.sound = false;

			} else if (global.navigator.userAgent.match(/iPad/)) {

				settings.fullscreen = true;
				settings.music = false;
				settings.sound = true;

			} else if (global.navigator.userAgent.match(/Android/)) {

				settings.fullscreen = true;

			}

		}

	};

	return Callback;

});
