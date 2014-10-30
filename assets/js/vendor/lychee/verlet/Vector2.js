
lychee.define('lychee.verlet.Vector2').exports(function(lychee, global) {

	var Class = function() {

		this.x = 0;
		this.y = 0;

	};


	Class.prototype = {

		clone: function() {

			var clone = new Class();

			this.copy(clone);

			return clone;

		},

		copy: function(vector) {

			vector.set(this.x, this.y);

		},

		set: function(x, y) {

			this.x = x;
			this.y = y;

		},

		add: function(vector) {

			this.x += vector.x;
			this.y += vector.y;

		},

		subtract: function(vector) {

			this.x -= vector.x;
			this.y -= vector.y;

		},

		multiply: function(vector) {

			this.x *= vector.x;
			this.y *= vector.y;

		},

		divide: function(vector) {

			this.x /= vector.x;
			this.y /= vector.y;

		},

		min: function(vector) {

			this.x = Math.min(this.x, vector.x);
			this.y = Math.min(this.y, vector.y);

		},

		max: function(vector) {

			this.x = Math.max(this.x, vector.x);
			this.y = Math.max(this.y, vector.y);

		},

		scale: function(scale) {

			this.x *= scale;
			this.y *= scale;

		},

		distance: function(vector) {

			var x = vector.x - this.x;
			var y = vector.y - this.y;


			return Math.sqrt(x * x + y * y);

		},

		squaredDistance: function(vector) {

			var x = vector.x - this.x;
			var y = vector.y - this.y;


			return (x * x + y * y);

		},

		length: function() {

			var x = this.x;
			var y = this.y;


			return Math.sqrt(x * x + y * y);

		},

		squaredLength: function() {

			var x = this.x;
			var y = this.y;


			return (x * x + y * y);

		},

		invert: function() {

			this.x *= -1;
			this.y *= -1;

		},

		normalize: function() {

			var x = this.x;
			var y = this.y;


			var length = (x * x + y * y);
			if (length > 0) {

				length = 1 / Math.sqrt(length);

				this.x *= length;
				this.y *= length;

			}

		},

		scalar: function(vector) {

			return (
				  this.x * vector.x
				+ this.y * vector.y
			);

		},

		cross: function(vector) {

			// R^2 -> R^2 will just flip the coordinates
			// to have the assumed orthogonal behaviour
			// of the resulting vector

			this.x =      vector.y;
			this.y = -1 * vectoy.x;

		},

		angle: function(vector) {

			return Math.atan(
				this.x * vector.y - this.y * vector.x,
				this.x * vector.x + this.y * vector.y
			);

		},

		rotate: function(origin, theta) {

			var x = this.x - origin.x;
			var y = this.y - origin.y;


			this.x = origin.x + x * Math.cos(theta) - y * Math.sin(theta);
			this.y = origin.y + x * Math.sin(theta) + y * Math.cos(theta);

		},

		interpolate: function(vector, t) {

			this.x += t * (vector.x - this.x);
			this.y += t * (vector.y - this.y);

		},

		interpolateAdd: function(vector, t) {

			this.x += t * vector.x;
			this.y += t * vector.y;

		},

		interpolateSet: function(vector, t) {

			this.x = t * vector.x;
			this.y = t * vector.y;

		}

	};


	return Class;

});

