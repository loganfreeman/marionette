
lychee.define('lychee.ui.Button').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.label = null;
		this.font  = null;


		this.setFont(settings.font);
		this.setLabel(settings.label);

		delete settings.font;
		delete settings.label;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = this.width;
		settings.height = this.height;


		lychee.ui.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Button';

			var settings = data['arguments'][0];


			if (this.label !== null) settings.label = this.label;
			if (this.font !== null)  settings.font  = this.font.serialize();


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;


			var label = this.label;
			var font  = this.font;

			if (label !== null && font !== null) {

				renderer.drawText(
					x,
					y,
					label,
					font,
					true
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				// refresh the layout
				if (this.label !== null) {
					this.setLabel(this.label);
				}

				return true;

			}


			return false;

		},

		setLabel: function(label) {

			label = typeof label === 'string' ? label : null;


			if (label !== null) {

				var font = this.font;
				if (font !== null) {

					var width   = 0;
					var height  = 0;
					var kerning = font.kerning;

					for (var l = 0, ll = label.length; l < ll; l++) {
						var chr = font.get(label[l]);
						width += chr.real + kerning;
						height = Math.max(height, chr.height);
					}

					this.width  = width;
					this.height = height;

				}

				this.label = label;

				return true;

			}


			return false;

		}

	};


	return Class;

});

