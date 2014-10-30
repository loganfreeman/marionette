
lychee.define('lychee.ui.Select').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font    = null;
		this.options = [];
		this.value   = '';


		this.setFont(settings.font);
		this.setOptions(settings.options);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.options;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width === 'number' ? settings.width : 240;
		settings.height = 48;


		lychee.ui.Entity.call(this, settings);


		if (
			this.options.length > 0
			&& this.value === ''
		) {
			this.setValue(this.options[0]);
		}



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {

			// 1. Show dropdown menu
			if (this.state !== 'active') {

				this.setState('active');

			// 2. Select option from dropdown menu
			} else {

				var hheight = this.options.length * 48 / 2;
				var index   = ((position.y + hheight) / 48) | 0;

				var value   = this.options[index] || null;
				if (value !== null && this.value !== value) {

					var result = this.setValue(this.options[index] || null);
					if (result === true) {
						this.trigger('change', [ this.value ]);
					}

				}


				this.setState('default');

			}

		}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {
			// TODO: Serialization
		},

		render: function(renderer, offsetX, offsetY) {

			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color = this.state === 'active' ? '#ff1b1b' : '#aa1b1b';


			var hwidth  = this.width / 2;
			var hheight = this.height / 2;


			// TODO: Evaluate better method for preventing
			// entities in the background of being visible

			renderer.drawBox(
				x - hwidth,
				y - hheight,
				x + hwidth,
				y + hheight,
				'#000000',
				true
			);


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


			var state = this.state;
			if (state === 'active') {

				var font = this.font;
				if (font !== null) {

					var offsety  = 48;
					var currenty = y - hheight + offsety / 2;

					for (var o = 0, ol = this.options.length; o < ol; o++) {

						var text = this.options[o];

						renderer.drawText(
							x,
							currenty,
							text,
							font,
							true
						);

						if (o > 0) {

							renderer.drawLine(
								x - hwidth,
								currenty - 24,
								x + hwidth,
								currenty - 24,
								color,
								2
							);

						}


						currenty += offsety;

					}

				}

			} else {

				var font = this.font;
				if (font !== null) {

					var text = this.value;

					renderer.drawText(
						x - hwidth + 24,
						y - hheight,
						text,
						font,
						false
					);

				}

			}

		},



		/*
		 * CUSTOM ENTITY API
		 */

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				if (id === 'default') {

					this.height = 48;

				} else if (id === 'active') {

					var o = this.options.length;

					this.height = Math.max(48, o * 48);

				}

			}


			return result;

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

		setOptions: function(options) {

			if (options instanceof Array) {

				var filtered = [];

				for (var o = 0, ol = options.length; o < ol; o++) {
					filtered.push(options[o] + '');
				}

				this.options = filtered;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (
				value !== null
				&& this.options.indexOf(value) !== -1
			) {

				this.value = value;

				return true;

			}


			return false;

		}

	};


	return Class;

});

