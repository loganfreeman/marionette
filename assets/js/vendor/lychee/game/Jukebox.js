
lychee.define('lychee.game.Jukebox').requires([
	'lychee.game.Loop'
]).includes([
	'lychee.Jukebox'
]).exports(function(lychee, global) {

	var Class = function(maxPoolSize, loop) {

		this.__clock    = 0;
		this.__effects  = {};
		this.__effectId = 0;


		lychee.Jukebox.call(this, maxPoolSize);


		if (loop instanceof lychee.game.Loop) {
			loop.bind('update', this.update, this);
		}

	};


	Class.prototype = {

		update: function(clock, delta) {

			for (var e in this.__effects) {

				var effect = this.__effects[e];
				if (effect === null) continue;

				if (effect.end <= this.__clock) {

					if (effect.type === 'fade-out') {
						this.stop(effect.id);
					}

					this.__effects[e] = null;
					continue;

				}


				var pos = (this.__clock - effect.start) / (effect.end - effect.start);
				if (effect.type === 'fade-in') {
					this.setVolume(effect.id, pos * effect.diff);
				} else if (effect.type === 'fade-out') {
					this.setVolume(effect.id, (1 - pos) * effect.diff);
				}

			}

			this.__clock = clock;

		},

		fadeIn: function(id, duration, loop, volume) {

			id       = typeof id === 'string'       ? id       : null;
			duration = typeof duration === 'number' ? duration : 1000;
			loop     = loop === true                ? true     : false;
			volume   = typeof volume === 'number'   ? volume   : 1;


			if (id !== null) {

				this.play(id, loop);
				this.setVolume(id, 0);

				var effect = {
					id:    id,
					type:  'fade-in',
					start: this.__clock,
					end:   this.__clock + duration,
					diff:  volume
				};

				this.__effects[++this.__effectId] = effect;

			}

		},

		fadeOut: function(id, duration) {

			id       = typeof id === 'string'       ? id       : null;
			duration = typeof duration === 'number' ? duration : 1000;


			if (id !== null) {

				var current = this.getVolume(id);

				var effect = {
					id:    id,
					type:  'fade-out',
					start: this.__clock,
					end:   this.__clock + duration,
					diff:  current
				};

				this.__effects[++this.__effectId] = effect;

			}

		},

		removeEffects: function(id, type) {

			id   = typeof id === 'string'   ? id   : null;
			type = typeof type === 'string' ? type : null;


			var found = false;

			for (var e in this.__effects) {

				if (this.__effects[e] === null) continue;

				if (
					   (id === null   || this.__effects[e].id === id)
					&& (type === null || this.__effects[e].type === type)
				) {
					this.__effects[e] = null;
					found = true;
				}

			}


			return found;

		}

	};


	return Class;

});

