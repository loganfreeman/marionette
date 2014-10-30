
lychee.define('lychee.ui.Textarea').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font  = null;
		this.value = '';

		this.__buffer  = null;
		this.__drag    = { x: 0, y: 0 };
		this.__lines   = [];
		this.__value   = '';
		this.__isDirty = false;


		this.setFont(settings.font);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width  === 'number' ? settings.width  : 240;
		settings.height = typeof settings.height === 'number' ? settings.height : 144;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function() {}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {

			if (this.value !== this.__value) {
				this.trigger('change', [ this.value ]);
				this.__value = this.value;
			}

			this.setState('default');

		}, this);

		this.bind('key', function(key, name, delta) {

			var line      = this.__lines[this.__lines.length - 1];
			var character = key;

			if (key === 'return') {

				this.__lines.push('');
				this.__isDirty = true;

				return false;

			} else {

				if (key === 'space') {
					character = ' ';
				} else if (key === 'tab') {
					character = '\t';
				}

				var ll = this.__lines.length;

				if (character.length === 1) {

					line += character;
					this.__lines[ll - 1] = line;
					this.__isDirty = true;

				} else if (key === 'backspace') {

					if (line.length > 0) {
						line = line.substr(0, line.length - 1);
						this.__lines[ll - 1] = line;
						this.__isDirty = true;
					} else if (ll > 1) {
						this.__lines.splice(ll - 1, 1);
						this.__isDirty = true;
					}

				}


				this.value = this.__lines.join('\n');

			}

		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Textarea';

			var settings = data['arguments'][0];


			if (this.font !== null) settings.font  = this.font.serialize();
			if (this.value !== '')  settings.value = this.value;

			if (this.width !== 240)  settings.width  = this.width;
			if (this.height !== 144) settings.height = this.height;


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			var buffer = this.__buffer;
			if (buffer === null) {

				buffer = renderer.createBuffer(
					this.width - 48,
					this.height - 48
				);

				this.__buffer = buffer;

			}


			if (this.__isDirty === true) {

				renderer.clearBuffer(buffer);
				renderer.setBuffer(buffer);


				var font = this.font;
				if (font !== null) {

					var l, ll, text;
					var kerning    = font.kerning;
					var linewidth  = 0;
					var lineheight = font.lineheight;
					var textwidth  = 0;
					var textheight = this.__lines.length * lineheight;


					text = this.__lines[this.__lines.length - 1];

					for (var t = 0, tl = text.length; t < tl; t++) {
						var chr = font.get(text[t]);
						linewidth += chr.real + kerning;
					}

					textwidth = linewidth;


					var offsetx = 0;
					var offsety = 0;
					var bwidth  = buffer.width;
					var bheight = buffer.height;

					if (textwidth  > bwidth)  offsetx = bwidth  - textwidth;
					if (textheight > bheight) offsety = bheight - textheight;


					for (l = 0, ll = this.__lines.length; l < ll; l++) {

						text = this.__lines[l];

						renderer.drawText(
							offsetx,
							offsety + lineheight * l,
							text,
							font,
							false
						);

					}

				}


				renderer.setBuffer(null);


				this.__isDirty = false;

			}


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color = this.state === 'active' ? '#ff1b1b' : '#aa1b1b';


			var hwidth  = this.width / 2;
			var hheight = this.height / 2;


			renderer.drawArc(
				x - hwidth + 24,
				y - hheight + 24,
				0.5,
				0.75,
				24,
				color,
				false,
				2
			);

			renderer.drawLine(
				x - hwidth + 24,
				y - hheight,
				x + hwidth - 24,
				y - hheight,
				color,
				2
			);

			renderer.drawArc(
				x + hwidth - 24,
				y - hheight + 24,
				0.75,
				1,
				24,
				color,
				false,
				2
			);

			renderer.drawLine(
				x + hwidth,
				y - hheight + 24,
				x + hwidth,
				y + hheight - 24,
				color,
				2
			);

			renderer.drawArc(
				x + hwidth - 24,
				y + hheight - 24,
				0,
				0.25,
				24,
				color,
				false,
				2
			);

			renderer.drawLine(
				x - hwidth + 24,
				y + hheight,
				x + hwidth - 24,
				y + hheight,
				color,
				2
			);

			renderer.drawArc(
				x - hwidth + 24,
				y + hheight - 24,
				0.25,
				0.5,
				24,
				color,
				false,
				2
			);

			renderer.drawLine(
				x - hwidth,
				y - hheight + 24,
				x - hwidth,
				y + hheight - 24,
				color,
				2
			);


			var x1 = x - hwidth + 24;
			var y1 = y - hheight + 24;

			renderer.drawBuffer(
				x1,
				y1,
				this.__buffer
			);

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null) {

				this.value = value;

				this.__lines   = value.split('\n');
				this.__isDirty = true;

				return true;

			}


			return false;

		}

	};


	return Class;

});

