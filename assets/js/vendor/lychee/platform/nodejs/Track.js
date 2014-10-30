
lychee.define('Track').tags({
	platform: 'nodejs'
}).supports(function(lychee, global) {

	if (
		typeof process !== 'undefined'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	if (lychee.debug === true) {
		console.log("lychee.Track: Supported media formats are NONE");
	}



	var Class = function(id, data, isReady) {

		//isReady = isReady === true;
		isReady = true; // Correct API Simulation


		this.id     = id;
		this.muted  = false;
		this.volume = 0.0;

		this.__isIdle    = true;
		this.__isLooping = false;
		this.__isReady   = true;


		this.__settings = lychee.extend({}, data);

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		play: function(loop) {

			loop = loop === true ? true : false;


			if (this.__isReady === true) {
				this.__isIdle = true; // Nothing to do, so it's idling
				this.__isLooping = loop;
			}

		},

		stop: function() {
			this.__isIdle = true;
			this.__isLooping = false;
		},

		pause: function() {},

		resume: function() {},

		clone: function() {

			var id = this.id;

			return new lychee.Track(id, this.__settings, true);

		},

		isPlaying: function() {
			return this.__isIdle === false;
		},

		isReady: function() {
			return this.__isReady && this.isPlaying() === false;
		},

		setMuted: function(muted) {

			muted = muted === true;


			this.muted = muted;

			return true;

		},

		setVolume: function(volume) {

			this.volume = 0.0;

			return false;

		}

	};


	return Class;

});

