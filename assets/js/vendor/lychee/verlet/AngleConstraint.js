
lychee.define('lychee.verlet.AngleConstraint').requires([
	'lychee.verlet.Particle',
	'lychee.verlet.Vector2'
]).exports(function(lychee, global) {

	var _particle = lychee.verlet.Particle;
	var _cache1   = new lychee.verlet.Vector2();
	var _cache2   = new lychee.verlet.Vector2();


	var _get_angle = function(positiona, positionb, positionc) {

		positiona.copy(_cache1);
		_cache1.subtract(positionb);

		positionc.copy(_cache2);
		_cache2.subtract(positionb);


		return _cache1.angle(_cache2);

	};


	var Class = function(a, b, c, rigidity) {

		this.a = a instanceof _particle ? a : null;
		this.b = b instanceof _particle ? b : null;
		this.c = c instanceof _particle ? c : null;

		this.rigidity = typeof rigidity === 'number' ? rigidity : 1;
		this.angle    = 0;


		if (this.a !== null && this.b !== null && this.c !== null) {
			this.angle = _get_angle(this.a.position, this.b.position, this.c.position);
		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		update: function(clock, delta) {

			var a = this.a;
			var b = this.b;
			var c = this.c;

			if (a !== null && b !== null && c !== null) {

				var u = delta / 1000;

				var ap = a.position;
				var bp = b.position;
				var cp = c.position;


				var diff = _get_angle(ap, bp, cp) - this.angle;
				if (diff <= -Math.PI) {
					diff += 2 * Math.PI;
				} else if (diff >= Math.PI) {
					diff -= 2 * Math.PI;
				}


				diff *= u * this.rigidity;


				ap.rotate(bp,  diff);
				cp.rotate(bp, -diff);

				bp.rotate(ap,  diff);
				bp.rotate(cp, -diff);

			}

		},

		render: function(renderer, offsetX, offsetY) {

			var a = this.a;
			var b = this.b;
			var c = this.c;

			if (a !== null && b !== null && c !== null) {

				var ap = a.position;
				var bp = b.position;
				var cp = c.position;

				var ax = offsetX + ap.x;
				var ay = offsetY + ap.y;
				var bx = offsetX + bp.x;
				var by = offsetY + bp.y;
				var cx = offsetX + cp.x;
				var cy = offsetY + cp.y;


				renderer.drawLine(
					ax,
					ay,
					bx,
					by,
					'#ff0000',
					1
				);

				renderer.drawLine(
					bx,
					by,
					cx,
					cy,
					'#ff0000',
					1
				);

			}

		}

	};


	return Class;

});

