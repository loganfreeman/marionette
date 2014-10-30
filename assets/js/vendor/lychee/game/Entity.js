
lychee.define('lychee.game.Entity').exports(function(lychee, global) {

	var _default_state  = 'default';
	var _default_states = { 'default': null };


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.width  = typeof settings.width  === 'number' ? settings.width  : 0;
		this.height = typeof settings.height === 'number' ? settings.height : 0;
		this.depth  = typeof settings.depth  === 'number' ? settings.depth  : 0;
		this.radius = typeof settings.radius === 'number' ? settings.radius : 0;

		this.collision = Class.COLLISION.none;
		this.shape     = Class.SHAPE.rectangle;
		this.state     = _default_state;
		this.position  = { x: 0, y: 0, z: 0 };
		this.velocity  = { x: 0, y: 0, z: 0 };
		this.frame     = 0;

		this.__clock   = null;
		this.__states  = _default_states;

		this.__animation = {
			active:   false,
			start:    null,
			frames:   0,
			duration: 0,
			loop:     false
		};
		this.__effect = {
			start:    null,
			active:   false,
			duration: 0,
			from:     { x: 0, y: 0, z: 0 },
			clear:    null,
			callback: null,
			scope:    null,
			loop:     false
		};
		this.__tween = {
			active:   false,
			start:    null,
			duration: 0,
			from:     { x: 0, y: 0, z: 0 },
			to:       { x: 0, y: 0, z: 0 },
			callback: null,
			scope:    null
		};


		if (settings.states instanceof Object) {

			this.__states = { 'default': null };

			for (var id in settings.states) {

				if (settings.states.hasOwnProperty(id)) {
					this.__states[id] = settings.states[id];
				}

			}

		}


		// Reuse this cache for performance relevant methods
		this.__cache = {
			effect:   { x: 0, y: 0, z: 0 },
			tween:    { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 }
		};


		this.setCollision(settings.collision);
		this.setShape(settings.shape);
		this.setState(settings.state);
		this.setPosition(settings.position);
		this.setVelocity(settings.velocity);
		this.setAnimation(settings.animation);

		settings = null;

	};


	Class.COLLISION = {
		none: 0,
		A:    1,
		B:    2,
		C:    3,
		D:    4
	};


	Class.EFFECT = {

		wobble: {

			defaults: {
				x: 0, y: 0, z: 0
			},

			callback: function(effect, t) {

				var set   = effect.settings;
				var cache = this.__cache.effect;

				cache.x = effect.from.x + Math.sin(t * 2 * Math.PI) * set.x;
				cache.y = effect.from.y + Math.sin(t * 2 * Math.PI) * set.y;
				cache.z = effect.from.z + Math.sin(t * 2 * Math.PI) * set.z;

				return cache;

			},

			clear: function(effect) {

				this.setPosition(effect.from);

			}

		}

	};


	// Same ENUM values as lychee.ui.Entity
	Class.SHAPE = {
		circle:    0,
		sphere:    1,
		rectangle: 2,
		cuboid:    3,
		polygon:   4
	};


	Class.TWEEN = {

		linear: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			cache.x = t * dx;
			cache.y = t * dy;
			cache.z = t * dz;

			return cache;

		},

		easeIn: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			var f = 1 * Math.pow(t, 3);

			cache.x = f * dx;
			cache.y = f * dy;
			cache.z = f * dz;

			return cache;

		},

		easeOut: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			var f = Math.pow(t - 1, 3) + 1;

			cache.x = f * dx;
			cache.y = f * dy;
			cache.z = f * dz;

			return cache;

		},

		easeInOut: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			var f;

			if ((t /= 0.5) < 1) {
				f = 0.5 * Math.pow(t, 3);
			} else {
				f = 0.5 * (Math.pow(t - 2, 3) + 2);
			}

			cache.x = f * dx;
			cache.y = f * dy;
			cache.z = f * dz;

			return cache;

		},

		bounceEaseIn: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			var k = 1 - t;
			var f;
			if ((k /= 1) < ( 1 / 2.75 )) {
				f = 1 * ( 7.5625 * Math.pow(k, 2) );
			} else if (k < ( 2 / 2.75 )) {
				f = 7.5625 * ( k -= ( 1.5 / 2.75 )) * k + .75;
			} else if (k < ( 2.5 / 2.75 )) {
				f = 7.5625 * ( k -= ( 2.25 / 2.75 )) * k + .9375;
			} else {
				f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + .984375;
			}

			cache.x = (1 - f) * dx;
			cache.y = (1 - f) * dy;
			cache.z = (1 - f) * dz;

			return cache;

		},

		bounceEaseOut: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			var f;
			if ((t /= 1) < ( 1 / 2.75 )) {
				f = 1 * ( 7.5625 * Math.pow(t, 2) );
			} else if (t < ( 2 / 2.75 )) {
				f = 7.5625 * ( t -= ( 1.5 / 2.75 )) * t + .75;
			} else if (t < ( 2.5 / 2.75 )) {
				f = 7.5625 * ( t -= ( 2.25 / 2.75 )) * t + .9375;
			} else {
				f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + .984375;
			}

			cache.x = f * dx;
			cache.y = f * dy;
			cache.z = f * dz;

			return cache;

		},

		sinEaseIn: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			var f = -1 * Math.cos(t * Math.PI / 2 ) + 1;

			cache.x = f * dx;
			cache.y = f * dy;
			cache.z = f * dz;

			return cache;

		},

		sinEaseOut: function(t, dx, dy, dz) {

			var cache = this.__cache.tween;

			var f = 1 * Math.sin(t * Math.PI / 2);

			cache.x = f * dx;
			cache.y = f * dy;
			cache.z = f * dz;

			return cache;

		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var settings = {};


			if (this.width  !== 0) settings.width  = this.width;
			if (this.height !== 0) settings.height = this.height;
			if (this.radius !== 0) settings.radius = this.radius;

			if (this.collision !== Class.COLLISION.none)  settings.collision = this.collision;
			if (this.shape     !== Class.SHAPE.rectangle) settings.shape     = this.shape;
			if (this.state     !== _default_state)        settings.state     = this.state;
			if (this.__states !== _default_states)        settings.states    = this.__states;


			if (
				   this.position.x !== 0
				|| this.position.y !== 0
				|| this.position.z !== 0
			) {

				settings.position = {};

				if (this.position.x !== 0) settings.position.x = this.position.x;
				if (this.position.y !== 0) settings.position.y = this.position.y;
				if (this.position.z !== 0) settings.position.z = this.position.z;

			}


			if (
				   this.velocity.x !== 0
				|| this.velocity.y !== 0
				|| this.velocity.z !== 0
			) {

				settings.velocity = {};

				if (this.velocity.x !== 0) settings.velocity.x = this.velocity.x;
				if (this.velocity.y !== 0) settings.velocity.y = this.velocity.y;
				if (this.velocity.z !== 0) settings.velocity.z = this.velocity.z;

			}


			if (this.__animation.active === true) {

				settings.animation = {};

				if (this.__animation.duration !== 1000) settings.animation.duration = this.__animation.duration;
				if (this.frame !== 0)                   settings.animation.frame    = this.frame;
				if (this.__animation.frames !== 25)     settings.animation.frames   = this.__animation.frames;
				if (this.__animation.loop !== false)    settings.animation.loop     = true;

			}


			return {
				'constructor': 'lychee.game.Entity',
				'arguments':   [ settings ]
			};

		},

		// Allows sync(null, true) for reset
		sync: function(clock, force) {

			force = force === true;


			if (force === true) {
				this.__clock = clock;
			}


			if (this.__clock === null) {

				if (this.__tween.active === true && this.__tween.start === null) {
					this.__tween.start = clock;
				}

				if (this.__effect.active === true && this.__effect.start === null) {
					this.__effect.start = clock;
				}

				if (this.__animation.active === true && this.__animation.start === null) {
					this.__animation.start = clock;
				}

				this.__clock = clock;

			}

		},

		// HINT: Renderer skips if no render() method exists
		// render: function(renderer, offsetX, offsetY) {},

		update: function(clock, delta) {

			// 1. Sync clocks initially
			// (if Entity was created before loop started)
			if (this.__clock === null) {
				this.sync(clock);
			}


			var t  = 0;
			var dt = delta / 1000;
			var cache;


			var tween = this.__tween;

			// 2. Tweening
			if (
				tween.active === true
				&& tween.start !== null
			) {

				t = (this.__clock - tween.start) / tween.duration;

				if (t <= 1) {

					var from = tween.from;
					var to   = tween.to;


					var dx = to.x - from.x;
					var dy = to.y - from.y;
					var dz = to.z - from.z;


					cache = tween.callback.call(tween.scope, t, dx, dy, dz);

					cache.x = from.x + cache.x;
					cache.y = from.y + cache.y;
					cache.z = from.z + cache.z;


					this.setPosition(cache);

				} else {

					this.setPosition(tween.to);
					tween.active = false;

				}

			}


			var velocity = this.velocity;

			// 3. Velocities
			if (
				   velocity.x !== 0
				|| velocity.y !== 0
				|| velocity.z !== 0
			) {

				cache = this.__cache.velocity;

				cache.x = this.position.x;
				cache.y = this.position.y;
				cache.z = this.position.z;


				if (velocity.x !== 0) {
					cache.x += velocity.x * dt;
				}

				if (velocity.y !== 0) {
					cache.y += velocity.y * dt;
				}

				if (velocity.z !== 0) {
					cache.z += velocity.z * dt;
				}


				this.setPosition(cache);

			}


			var effect = this.__effect;

			// 4. Effects
			if (
				effect.active === true
				&& effect.start !== null
			) {

				t = (this.__clock - effect.start) / effect.duration;

				if (t <= 1) {

					cache = effect.callback.call(effect.scope, effect, t);

					this.setPosition(cache);

				} else {

					if (effect.loop === true) {
						effect.start = this.__clock;
					} else {
						effect.active = false;
					}

				}

			}


			var animation = this.__animation;

			// 5. Animation (Interpolation)
			if (
				animation.active === true
				&& animation.start !== null
			) {

				t = (this.__clock - animation.start) / animation.duration;

				if (t <= 1) {

					this.frame = Math.max(0, Math.ceil(t * animation.frames) - 1);

				} else {

					if (animation.loop === true) {
						animation.start = this.__clock;
					} else {
						this.frame = animation.frames - 1;
						animation.active = false;
					}

				}

			}


			this.__clock = clock;

		},



		/*
		 * CUSTOM API
		 */

		collidesWith: function(entity) {

			if (
				   this.collision !== entity.collision
				|| this.collision === Class.COLLISION.none
				|| entity.collision === Class.COLLISION.none
			) {
				return false;
			}


			var shapeA = this.shape;
			var shapeB = entity.shape;
			var posA   = this.position;
			var posB   = entity.position;


			if (
				   shapeA === Class.SHAPE.circle
				&& shapeB === Class.SHAPE.circle
			) {

				var collisionDistance = this.radius + entity.radius;
				var realDistance = Math.sqrt(
					Math.pow(posB.x - posA.x, 2) + Math.pow(posB.y - posA.y, 2)
				);


				if (realDistance <= collisionDistance) {
					return true;
				}

			} else if (
				   shapeA === Class.SHAPE.circle
				&& shapeB === Class.SHAPE.rectangle
			) {

				var radius  = this.radius;
				var hwidth  = entity.width / 2;
				var hheight = entity.height / 2;

				if (
					   (posA.x + radius > posB.x - hwidth)
					&& (posA.x - radius < posB.x + hwidth)
					&& (posA.y + radius > posB.y - hheight)
					&& (posA.y - radius < posB.y + hheight)
				) {
					return true;
				}

			} else if (
				   shapeA === Class.SHAPE.rectangle
				&& shapeB === Class.SHAPE.circle
			) {

				var radius  = entity.radius;
				var hwidth  = this.width / 2;
				var hheight = this.height / 2;

				if (
					   (posB.x + radius > posA.x - hwidth)
					&& (posB.x - radius < posA.x + hwidth)
					&& (posB.y + radius > posA.y - hheight)
					&& (posB.y - radius < posA.y + hheight)
				) {
					return true;
				}

			} else if (
				   shapeA === Class.SHAPE.rectangle
				&& shapeB === Class.SHAPE.rectangle
			) {

				var allwidth  = this.width  + entity.width;
				var allheight = this.height + entity.height;

				var width  = Math.abs(posA.x - posB.x) * 2;
				var height = Math.abs(posA.y - posB.y) * 2;

				if (
					   width  < allwidth
					&& height < allheight
				) {
					return true;
				}

			}


			return false;

		},

		setCollision: function(collision) {

			if (typeof collision !== 'number') return false;


			var found = false;

			for (var id in Class.COLLISION) {

				if (collision === Class.COLLISION[id]) {
					found = true;
					break;
				}

			}


			if (found === true) {
				this.collision = collision;
			}


			return found;

		},

		setShape: function(shape) {

			if (typeof shape !== 'number') return false;


			var found = false;

			for (var id in Class.SHAPE) {

				if (shape === Class.SHAPE[id]) {
					found = true;
					break;
				}

			}


			if (found === true) {
				this.shape = shape;
			}


			return found;

		},

		getStateMap: function() {
			return this.__states[this.state];
		},

		setState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {

				this.state = id;

				return true;

			}


			return false;

		},

		setPosition: function(position) {

			if (position instanceof Object) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;
				this.position.z = typeof position.z === 'number' ? position.z : this.position.z;

				return true;

			}


			return false;

		},

		setVelocity: function(velocity) {

			if (velocity instanceof Object) {

				this.velocity.x = typeof velocity.x === 'number' ? velocity.x : this.velocity.x;
				this.velocity.y = typeof velocity.y === 'number' ? velocity.y : this.velocity.y;
				this.velocity.z = typeof velocity.z === 'number' ? velocity.z : this.velocity.z;

				return true;

			}


			return false;

		},

		setAnimation: function(settings) {

			if (settings instanceof Object) {

				var duration = typeof settings.duration === 'number' ? settings.duration : 1000;
				var frame    = typeof settings.frame === 'number'    ? settings.frame    : 0;
				var frames   = typeof settings.frames === 'number'   ? settings.frames   : 25;
				var loop     = settings.loop === true;


				var animation = this.__animation;

				animation.start    = this.__clock;
				animation.active   = true;
				animation.duration = duration;
				animation.frames   = frames;
				animation.loop     = loop;

				this.frame = frame;

				return true;

			}


			return false;

		},

		clearAnimation: function() {
			this.__animation.active = false;
			this.frame = 0;
		},

		setEffect: function(duration, enumdata, settings, scope, loop) {

			duration = typeof duration === 'number' ? duration : null;
			settings = settings instanceof Object   ? settings : null;
			scope    = scope !== undefined          ? scope    : this;
			loop     = loop === true;


			if (
				   duration !== null
				&& enumdata instanceof Object
				&& enumdata.callback instanceof Function
			) {

				var position = this.position;
				var effect   = this.__effect;

				effect.start    = this.__clock;
				effect.active   = true;
				effect.duration = duration;
				effect.from.x   = position.x;
				effect.from.y   = position.y;
				effect.from.z   = position.z;
				effect.clear    = enumdata.clear instanceof Function ? enumdata.clear : null;
				effect.callback = enumdata.callback,
				effect.scope    = scope;
				effect.loop     = loop;


				if (settings !== null) {
					effect.settings = settings;
				} else if (enumdata.defaults instanceof Object) {
					effect.settings = lychee.extend({}, enumdata.defaults);
				}

				return true;

			}


			return false;

		},

		clearEffect: function() {

			if (
				   this.__effect.active === true
				&& this.__effect.clear !== null
			) {

				this.__effect.clear.call(this.__effect.scope, this.__effect);

			}

			this.__effect.active = false;

		},

		setTween: function(duration, position, callback, scope) {

			duration = typeof duration === 'number' ? duration : null;
			callback = callback instanceof Function ? callback : Class.TWEEN.linear;
			scope    = scope !== undefined          ? scope    : this;


			if (duration !== null && position instanceof Object) {

				position.x = typeof position.x === 'number' ? position.x : this.position.x;
				position.y = typeof position.y === 'number' ? position.y : this.position.y;
				position.z = typeof position.z === 'number' ? position.z : this.position.z;


				var pos   = this.position;
				var tween = this.__tween;

				tween.start    = this.__clock;
				tween.active   = true;
				tween.duration = duration;
				tween.from.x   = pos.x;
				tween.from.y   = pos.y;
				tween.from.z   = pos.z;
				tween.to.x     = position.x;
				tween.to.y     = position.y;
				tween.to.z     = position.z;
				tween.callback = callback;
				tween.scope    = scope;

				return true;

			}


			return false;

		},

		clearTween: function() {
			this.__tween.active = false;
		}

	};


	return Class;

});

