
lychee.define('lychee.game.Background').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.origin = { x: 0, y: 0 };

		this.__buffer  = null;
		this.__isDirty = true;


		this.setOrigin(settings.origin);


		delete settings.origin;


		lychee.game.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.game.Sprite.prototype.serialize.call(this);
			data['constructor'] = 'lyche.game.Background';

			var settings = data['arguments'][0];


			if (
				   this.origin.x !== 0
				|| this.origin.y !== 0
			) {

				settings.origin = {};

				if (this.origin.x !== 0) settings.origin.x = this.origin.x;
				if (this.origin.y !== 0) settings.origin.y = this.origin.y;

			}


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			var texture = this.texture;
			var map     = this.getMap();
			if (texture  === null || map === null) {
				return;
			}


			if (this.__buffer === null) {

				this.__buffer = renderer.createBuffer(
					this.width,
					this.height
				);

			}


			var buffer = this.__buffer;

			if (this.__isDirty === true) {

				renderer.setBuffer(buffer);


				if (
					   map.w !== 0
					&& map.h !== 0
					&& (
						map.w < this.width
						|| map.h < this.height
					)
				) {

					var px = this.origin.x - map.w;
					var py = this.origin.y - map.h;


					while (px < this.width) {

						py = this.origin.y - map.h;

						while (py < this.height) {

							renderer.drawSprite(
								px,
								py,
								texture,
								map
							);

							py += map.h;

						}

						px += map.w;

					}

				} else {

					renderer.drawSprite(
						0,
						0,
						texture,
						map
					);

				}


				renderer.setBuffer(null);

				this.__buffer = buffer;

			}


			var position = this.position;

			var x1 = position.x + offsetX - this.width / 2;
			var y1 = position.y + offsetY - this.height / 2;


			renderer.drawBuffer(
				x1,
				y1,
				buffer
			);


			if (lychee.debug === true) {

				renderer.drawBox(
					x1,
					y1,
					x1 + this.width,
					y1 + this.height,
					'#ffff00',
					false,
					1
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		setOrigin: function(origin) {

			if (origin instanceof Object) {

				this.origin.x = typeof origin.x === 'number' ? origin.x : this.origin.x;
				this.origin.y = typeof origin.y === 'number' ? origin.y : this.origin.y;

				var map = this.getMap();
				if (map !== null) {
					this.origin.x %= map.w;
					this.origin.y %= map.h;
				}

				this.__isDirty = true;


				return true;

			}


			return false;

		}

	};


	return Class;

});

