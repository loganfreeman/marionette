
lychee.define('Jukebox').requires([
	'lychee.Track'
]).exports(function(lychee, global) {

	var _track = lychee.Track;


	var Class = function(maxPoolSize) {

		this.__maxPoolSize = typeof maxPoolSize === 'number' ? maxPoolSize : 8;

		this.__tracks = {};
		this.__pool = {};
		this.__poolSize = 0;

	};


	Class.prototype = {

		add: function(track) {

			if (track instanceof _track) {
				this.__tracks[track.id] = track;
			}

		},

		isPlaying: function(id) {

			id = typeof id === 'string' ? id : null;


			var found = false;

			for (var pId in this.__pool) {

				var track = this.__pool[pId];
				if (
					(track.id === id || id === null)
					&& track.isPlaying() === true
				) {

					found = true;
					break;

				}

			}


			return found;

		},

		play: function(id, loop) {

			id   = typeof id === 'string' ? id   : null;
			loop = loop === true          ? true : false;


			if (id === null || this.__tracks[id] === undefined) {
				throw "Unknown Track ID, add the Track before playing it.";
			}


			var pId;
			var track;

			// Try to find an identical idling track
			for (pId in this.__pool) {

				track = this.__pool[pId];

				if (
					   track.id === id
					&& track.isReady() === true
				) {
					track.play(loop);
					return true;
				}

			}


			// Try to use free pool space for playback
			if (this.__poolSize < this.__maxPoolSize) {

				pId = ++this.__poolSize;
				this.__pool[pId] = this.__tracks[id].clone();
				this.__pool[pId].play(loop);

				return true;

			}


			// No free poolspace? Overwrite an idling track with requested one
			for (pId in this.__pool) {

				track = this.__pool[pId];

				if (
					this.__poolSize === this.__maxPoolSize
					&& track.isReady() === true
				) {

					this.__pool[pId] = this.__tracks[id].clone();
					this.__pool[pId].play(loop);

					return true;

				}

			}


			return false;

		},

		toggle: function(id, loop) {

			id   = typeof id === 'string' ? id   : null;
			loop = loop === true          ? true : false;


			if (id !== null) {

				if (this.isPlaying(id) === true) {

					return this.stop(id);

				} else {

					return this.play(id, loop);

				}

			}


			return false;

	   	},

		stop: function(id) {

			id = typeof id === 'string' ? id : null;


			var found = false;

			for (var pId in this.__pool) {

				var track = this.__pool[pId];
				if (track.id === id || id === null) {

					found = true;
					track.stop();

				}

			}


			return found;

		},

		isMuted: function(id) {

			id = typeof id === 'string' ? id : null;


			var found = false;

			for (var pId in this.__pool) {

				var track = this.__pool[pId];
				if (
					(track.id === id || id === null)
					&& track.muted === true
				) {

					found = true;
					break;

				}

			}


			return found;

		},

		setMuted: function(id, muted) {

			id    = typeof id === 'string' ? id : null;
			muted = muted === true;


			var found = false;

			for (var pId in this.__pool) {

				var track = this.__pool[pId];
				if (track.id === id || id === null) {

					found = true;
					track.setMuted(muted);

				}

			}


			return found;

		},

		getVolume: function(id) {

			id = typeof id === 'string' ? id : null;


			var volume = 0;

			if (id !== null) {

				for (var pId in this.__pool) {

					var track = this.__pool[pId];
					if (track.id === id) {
						volume = Math.max(volume, track.volume);
					}

				}

			}


			return volume;

		},

		setVolume: function(id, volume) {

			id     = typeof id === 'string'     ? id     : null;
			volume = typeof volume === 'number' ? volume : null;


			if (volume > 1 || volume < 0) {
				return false;
			}


			var found = false;

			for (var pId in this.__pool) {

				var track = this.__pool[pId];
				if (track.id === id || id === null) {

					track.setVolume(volume);
					found = true;

				}

			}


			return found;

		}

	};


	return Class;

});

