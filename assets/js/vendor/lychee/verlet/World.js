
lychee.define('lychee.verlet.World').requires([
	'lychee.verlet.Vector2'
]).exports(function(lychee, global) {

	var _vector2 = lychee.verlet.Vector2;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__width  = 0;
		this.__height = 0;

		this.__friction       = 0.99;
		this.__gravity        = new _vector2();
		this.__groundfriction = 0.8;
		this.__map            = {};
		this.__objects        = [];
		this.__velocity       = new _vector2();


		this.reset(settings.width, settings.height);

		this.setFriction(settings.friction);
		this.setGravity(settings.gravity);
		this.setGroundFriction(settings.groundfriction);


		settings = null;

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		reset: function(width, height) {

			width  = typeof width === 'number'  ? width  : this.__width;
			height = typeof height === 'number' ? height : this.__height;


			this.__width  = width;
			this.__height = height;

		},

		update: function(clock, delta) {

			var friction       = this.__friction;
			var groundfriction = this.__groundfriction;
			var gravity        = this.__gravity;
			var velocity       = this.__velocity;


			var hheight = this.__height / 2;


			for (var o = 0, ol = this.__objects.length; o < ol; o++) {

				var object = this.__objects[o];

				for (var p = 0, pl = object.particles.length; p < pl; p++) {

					var particle = object.particles[p];

					var position = particle.position;
					var lastposition = particle.lastposition;


					position.copy(velocity);
					velocity.subtract(lastposition);
					velocity.scale(friction);


					if (
						   position.y >= hheight
						&& velocity.squaredLength() > 0.000001
					) {

						var m = velocity.length();

						velocity.x /= m;
						velocity.y /= m;

						velocity.scale(m * groundfriction);

					}


					position.copy(lastposition);
					position.add(gravity);
					position.add(velocity);


					if (position.y > hheight) {
						position.y = hheight;
					}

				}

			}

		},

		render: function(clock, delta) {
		},



		/*
		 * CUSTOM API
		 */

		addObject: function(object) {

			object = (object != null && typeof object.update === 'function') ? object : null;


			if (object !== null) {

				var found = false;
				for (var o = 0, ol = this.__objects.length; o < ol; o++) {

					var cached = this.__objects[o];
					if (cached === object) {
						found = true;
						break;
					}

				}


				if (found === false) {

					this.__objects.push(object);
					return true;

				}

			}


			return false;

		},

		setObject: function(id, object) {

			id     = typeof id === 'string'                                  ? id     : null;
			object = (object != null && typeof object.update === 'function') ? object : null;


			if (
				   id !== null
				&& object !== null
				&& this.__map[id] === undefined
			) {

				this.__map[id] = object;
				this.addObject(object);

				return true;

			}


			return false;

		},

		getObject: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__map[id] !== undefined) {
				return this.__map[id];
			}


			return null;

		},

		getObjects: function() {
			return this.__objects;
		},

		removeObject: function(object) {

			object = (object != null && typeof object.update === 'function') ? object : null;


			if (object !== null) {

				var found = false;

				for (var o = 0, ol = this.__objects.length; o < ol; o++) {

					var cached = this.__objects[o];
					if (cached === object) {
						this.__objects.splice(o, 1);
						found = true;
						ol--;
					}

				}


				for (var id in this.__map) {

					var mapped = this.__map[id];
					if (mapped === object) {
						delete this.__map[id];
						found = true;
					}

				}


				return found;

			}


			return false;

		},

		setFriction: function(friction) {

			if (
				typeof friction === 'number'
				&& friction > 0
				&& friction < 1
			) {

				this.__friction = 1 - friction;

				return true;

			}


			return false;

		},

		setGravity: function(gravity) {

			if (typeof gravity === 'number') {

				this.__gravity.set(0, gravity);
				return true;

			}


			return false;

		},

		setGroundFriction: function(friction) {

			if (
				typeof friction === 'number'
				&& friction > 0
				&& friction < 1
			) {

				this.__groundfriction = 1 - friction;
				return true;

			}


			return false;

		}

	};


	return Class;

});

