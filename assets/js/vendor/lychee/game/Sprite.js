
lychee.define('lychee.game.Sprite').includes([
	'lychee.game.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.texture = null;

		this.__map = {};


		this.setTexture(settings.texture);
		this.setMap(settings.map);

		delete settings.texture;
		delete settings.map;


		lychee.game.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.game.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.game.Sprite';

			var settings = data['arguments'][0];


			if (Object.keys(this.__map).length > 0) {

				settings.map = {};


				for (var stateId in this.__map) {

					settings.map[stateId] = [];


					var frames = this.__map[stateId];
					for (var f = 0, fl = frames.length; f < fl; f++) {

						var frame  = frames[f];
						var sframe = {};

						if (frame.x !== 0) sframe.x = frame.x;
						if (frame.y !== 0) sframe.y = frame.y;
						if (frame.w !== 0) sframe.w = frame.w;
						if (frame.h !== 0) sframe.h = frame.h;


						settings.map.push(sframe);

					}

				}

			}


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			var texture = this.texture;
			if (texture !== null) {

				var position = this.position;

				var map = this.getMap();
				if (map !== null) {

					var x1 = position.x + offsetX - map.w / 2;
					var y1 = position.y + offsetY - map.h / 2;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				} else {

					var hw = (this.width / 2)  || this.radius;
					var hh = (this.height / 2) || this.radius;

					var x1 = position.x + offsetX - hw;
					var y1 = position.y + offsetY - hh;

					renderer.drawSprite(
						x1,
						y1,
						texture
					);

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		setState: function(id) {

			var result = lychee.game.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var map = this.__map[this.state] || null;
				if (map !== null) {

					if (map instanceof Array) {

						var statemap = this.getStateMap();
						if (statemap !== null && statemap instanceof Object) {

							this.clearAnimation();

							if (statemap.animation === true) {

								this.setAnimation({
									duration: statemap.duration || 1000,
									frame:    0,
									frames:   map.length,
									loop:     statemap.loop === true
								});

							}

						}


						map = map[0];

					}


					if (map.width !== undefined && typeof map.width === 'number') {
						this.width = map.width;
					}

					if (map.height !== undefined && typeof map.height === 'number') {
						this.height = map.height;
					}

					if (map.radius !== undefined && typeof map.radius === 'number') {
						this.radius = map.radius;
					}

				}

			}


			return result;

		},

		setTexture: function(texture) {

			if (
				   texture instanceof Texture
				|| texture === null
			) {

				this.texture = texture;

				return true;

			}


			return false;

		},

		getMap: function() {

			var state = this.state;
			var frame = this.frame;

			if (
				   this.__map[state] instanceof Array
				&& this.__map[state][frame] != null
			) {

				return this.__map[state][frame];

			}


			return null;

		},

		setMap: function(map) {

			var valid = false;

			if (map instanceof Object) {

				for (var stateId in map) {

					var frames = map[stateId];
					if (frames instanceof Array) {

						this.__map[stateId] = [];


						for (var f = 0, fl = frames.length; f < fl; f++) {

							var frame = frames[f];
							if (frame instanceof Object) {

								frame.x = typeof frame.x === 'number' ? frame.x : 0;
								frame.y = typeof frame.y === 'number' ? frame.y : 0;
								frame.w = typeof frame.w === 'number' ? frame.w : 0;
								frame.h = typeof frame.h === 'number' ? frame.h : 0;


								this.__map[stateId].push(frame);

							}

						}


						valid = true;

					}

				}

			}


			return valid;

		}

	};


	return Class;

});

