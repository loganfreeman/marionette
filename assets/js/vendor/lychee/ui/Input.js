
lychee.define('lychee.ui.Input').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font  = null;
		this.max   = Infinity;
		this.min   = 0;
		this.type  = Class.TYPE.text;
		this.value = null;

		this.__buffer  = null;
		this.__drag    = null;
		this.__value   = '';
		this.__isDirty = false;


		this.setFont(settings.font);
		this.setMax(settings.max);
		this.setMin(settings.min);
		this.setType(settings.type);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.max;
		delete settings.min;
		delete settings.type;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width === 'number' ? settings.width : 240;
		settings.height = 48;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function() {}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {

			var oldvalue = this.value;
			var raw = this.__value;


			var type = this.type;
			if (type === Class.TYPE.text) {

				if (oldvalue !== value) {

					var result = this.setValue(raw);
					if (result === false) {
						this.setValue(raw.substr(0, this.max));
					}

				}

			} else if (type === Class.TYPE.number) {

				var value = parseInt(raw, 10);
				if (!isNaN(value) && oldvalue !== value) {


					var result = this.setValue(value);
					if (result === false) {

						if (value > this.max) {
							this.value     = this.max;
							this.__value   = this.max + '';
							this.__isDirty = true;
						} else if (value < this.min) {
							this.value     = this.min;
 							this.__value   = this.min + '';
							this.__isDirty = true;
						}

					}

				}

			}


			if (oldvalue !== this.value) {
				this.trigger('change', [ this.value ]);
			}


			this.setState('default');

		}, this);

		this.bind('key', function(key, name, delta) {

			var type = this.type;


			var character = null;
			if (key.length === 1) {

				character = key;

			} else {

				if (key === 'backspace') {

					var raw = this.__value;
					raw = raw.substr(0, raw.length - 1);

					if (type === Class.TYPE.text) {

						this.__value = raw;

					} else if (type === Class.TYPE.number) {

						var value = parseInt(raw, 10);
						if (!isNaN(value)) {
							this.__value = value + '';
						} else {
							this.__value = '';
						}

					}

					this.__isDirty = true;

					return;

				} else if (key === 'return') {

					this.trigger('blur', []);

				} else if (key === 'space') {

					character = ' ';

				}

			}



			if (character !== null) {

				var raw = this.__value;

				if (
					type === Class.TYPE.text
					&& character.match(/([A-Za-z0-9\s-_]+)/)
				) {

					this.__value = raw + character;

				} else if (
					type === Class.TYPE.number
					&& character.match(/[0-9-+]/)
				) {

					var value = parseInt('' + raw + character, 10);
					if (!isNaN(value)) {
						this.__value = value + '';
					} else {
						this.__value = '';
					}

				}

				this.__isDirty = true;

			}

		}, this);


		settings = null;

	};


	Class.TYPE = {
		text:   0,
		number: 1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Input';

			var settings = data['arguments'][0];

			if (this.width !== 240) settings.width = this.width;

			if (this.font !== null)            settings.font  = this.font.serialize();
			if (this.max !== Infinity)         settings.max   = this.max;
			if (this.min !== 0)                settings.min   = this.min;
			if (this.type !== Class.TYPE.text) settings.type  = this.type;
			if (this.value !== null)           settings.value = this.value;


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			var buffer = this.__buffer;
			if (buffer === null) {

				buffer = renderer.createBuffer(
					this.width - 48,
					this.height
				);

				this.__buffer = buffer;

			}


			if (this.__isDirty === true) {

				renderer.clearBuffer(buffer);
				renderer.setBuffer(buffer);


				var font = this.font;
				if (font !== null) {

					var kerning   = font.kerning;
					var textwidth = 0;

					var text = this.__value;
					for (var t = 0, tl = text.length; t < tl; t++) {
						var chr = font.get(text[t]);
						textwidth += chr.real + kerning;
					}


					var bwidth = buffer.width;

					if (textwidth > bwidth) {

						renderer.drawText(
							bwidth - textwidth,
							0,
							text,
							font,
							false
						);

					} else {

						renderer.drawText(
							0,
							0,
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


			renderer.drawLine(
				x - hwidth + 24,
				y - hheight,
				x + hwidth - 24,
				y - hheight,
				color,
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
				y,
				0.25,
				0.75,
				24,
				color,
				false,
				2
			);

			renderer.drawArc(
				x + hwidth - 24,
				y,
				-0.25,
				0.25,
				24,
				color,
				false,
				2
			);


			var x1 = x - hwidth + 24;
			var y1 = y - hheight;

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

		setMax: function(max) {

			max = typeof max === 'number' ? max : null;


			if (max !== null) {

				this.max = max;

				return true;

			}


			return false;

		},

		setMin: function(min) {

			min = typeof min === 'number' ? min : null;


			if (min !== null) {

				this.min = min;

				return true;

			}


			return false;

		},

		setType: function(type) {

			if (typeof type !== 'number') return false;


			var found = false;

			for (var id in Class.TYPE) {

				if (type === Class.TYPE[id]) {
					found = true;
					break;
				}

			}


			if (found === true) {
				this.type = type;
			}


			return found;

		},

		setValue: function(value) {

			var type = this.type;


			// 0: Text
			if (
				type === Class.TYPE.text
				&& typeof value === 'string'
			) {

				if (
					   this.value !== value
					&& value.length >= this.min
					&& value.length <= this.max
				) {

					this.value = value;

					this.__value   = value + '';
					this.__isDirty = true;

					return true;

				}

			// 1. Number
			} else if (
				type === Class.TYPE.number
				&& typeof value === 'number'
				&& !isNaN(value)
			) {

				if (
					   this.value !== value
					&& value >= this.min
					&& value <= this.max
				) {

					this.value = value;

					this.__value   = value + '';
					this.__isDirty = true;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

