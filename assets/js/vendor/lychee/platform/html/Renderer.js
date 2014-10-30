
lychee.define('Renderer').tags({
	platform: 'html'
}).supports(function(lychee, global) {

	/*
	 * Hint for check against undefined:
	 *
	 * typeof CanvasRenderingContext2D is:
	 * > function in Chrome, Firefox, IE10
	 * > object in Safari, Safari Mobile
	 *
	 */


	if (
		typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
		&& typeof global.CanvasRenderingContext2D !== 'undefined'
	) {

		var canvas = global.document.createElement('canvas');
		if (typeof canvas.getContext === 'function') {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	var Class = function(id) {

		id = typeof id === 'string' ? id : null;

		this.__id     = id;
		this.__canvas = global.document.createElement('canvas');
		this.__ctx    = this.__canvas.getContext('2d');

		this.__environment = {
			width:  null,
			height: null,
			screen: {},
			offset: {}
		};

		this.__cache      = {};
		this.__state      = null;
		this.__alpha      = 1;
		this.__background = null;
		this.__width      = 0;
		this.__height     = 0;


		if (this.__id !== null) {
			this.__canvas.id = this.__id;
		}


		if (!this.__canvas.parentNode) {
			global.document.body.appendChild(this.__canvas);
		}

	};

	Class.prototype = {

		__updateEnvironment: function() {

			var env = this.__environment;


			env.screen.width  = global.innerWidth;
			env.screen.height = global.innerHeight;

			env.offset.x = this.__canvas.offsetLeft;
			env.offset.y = this.__canvas.offsetTop;

			env.width  = this.__width;
			env.height = this.__height;

		},



		/*
		 * STATE AND ENVIRONMENT MANAGEMENT
		 */

		reset: function(width, height, resetCache) {

			width      = typeof width === 'number'  ? width  : this.__width;
			height     = typeof height === 'number' ? height : this.__height;
			resetCache = resetCache === true;

			if (resetCache === true) {
				this.__cache = {};
			}


			var canvas = this.__canvas;


			this.__width  = width;
			this.__height = height;

			canvas.width  = width;
			canvas.height = height;

			canvas.style.width  = width  + 'px';
			canvas.style.height = height + 'px';


			this.__updateEnvironment();

		},

		start: function() {

			if (this.__state !== 'running') {
				this.__state = 'running';
			}

		},

		stop: function() {
			this.__state = 'stopped';
		},

		clear: function() {

			if (this.__state !== 'running') return;

			// Some mobile devices have weird issues on rotations with clearRect()
			// Seems to be if the renderbuffer got bigger after rotation
			// this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);

			// fillRect() renders correctly

			var ctx = this.__ctx;
			var canvas = this.__canvas;

			ctx.fillStyle = this.__background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

		},

		flush: function(command) {

			if (this.__state !== 'running' || typeof command !== 'number') return;

		},



		/*
		 * SETTERS AND GETTERS
		 */

		isRunning: function() {
			return this.__state === 'running';
		},

		getEnvironment: function() {
			this.__updateEnvironment();
			return this.__environment;
		},

		setAlpha: function(alpha) {

			alpha = typeof alpha === 'number' ? alpha : null;

			if (alpha !== null && alpha >= 0 && alpha <= 1) {
				this.__ctx.globalAlpha = alpha;
			}

		},

		setBackground: function(color) {

			color = typeof color === 'string' ? color : '#000000';

			this.__background = color;
			this.__canvas.style.backgroundColor = color;

		},

		createBuffer: function(width, height) {

			width  = typeof width === 'number'  ? width  : 1;
			height = typeof height === 'number' ? height : 1;


			var buffer = document.createElement('canvas');

			buffer.width  = width;
			buffer.height = height;

			return buffer;

		},

		clearBuffer: function(buffer) {

			var ctx = buffer.getContext('2d');

			ctx.clearRect(0, 0, buffer.width, buffer.height);

		},

		setBuffer: function(buffer) {

			if (buffer === null) {
				this.__ctx = this.__canvas.getContext('2d');
			} else {
				this.__ctx = buffer.getContext('2d');
			}

		},



		/*
		 * DRAWING API
		 */

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

			if (this.__state !== 'running') return;

			color      = typeof color === 'string' ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;
			var pi2 = Math.PI * 2;


			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				start * pi2,
				end * pi2
			);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

			if (this.__state !== 'running') return;

			color      = typeof color === 'string' ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
			} else {
				ctx.fillStyle   = color;
				ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
			}

		},

		drawBuffer: function(x1, y1, buffer) {

			this.__ctx.drawImage(
				buffer,
				x1,
				y1
			);

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

			if (this.__state !== 'running') return;

			color      = typeof color === 'string' ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				0,
				Math.PI * 2
			);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

			if (this.__state !== 'running') return;

			color     = typeof color === 'string' ? color : '#000000';
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.beginPath();

			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);

			ctx.lineWidth   = lineWidth;
			ctx.strokeStyle = color;
			ctx.stroke();

			ctx.closePath();

		},

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

			if (this.__state !== 'running') return;

			color = typeof color === 'string' ? color : '#000000';
			background = background === true;
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x1, y1);


			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		// points, x1, y1, [ ... x(a), y(a) ... ], [ color, background, lineWidth ]
		drawPolygon: function(points, x1, y1) {

			if (this.__state !== 'running') return;

			var l = arguments.length;

			if (points > 3) {

				var optargs = l - (points * 2) - 1;

				var color      = '#000000';
				var background = false;
				var lineWidth  = 1;


				if (optargs === 3) {

					color      = arguments[l - 3];
					background = arguments[l - 2];
					lineWidth  = arguments[l - 1];

				} else if (optargs === 2) {

					color      = arguments[l - 2];
					background = arguments[l - 1];

				} else if (optargs === 1) {

					color      = arguments[l - 1];

				}


				var ctx = this.__ctx;


				ctx.beginPath();
				ctx.moveTo(x1, y1);

				for (var p = 1; p < points; p++) {

					ctx.lineTo(
						arguments[1 + p * 2],
						arguments[1 + p * 2 + 1]
					);

				}

				ctx.lineTo(x1, y1);

				if (background === false) {
					ctx.lineWidth   = lineWidth;
					ctx.strokeStyle = color;
					ctx.stroke();
				} else {
					ctx.fillStyle = color;
					ctx.fill();
				}

				ctx.closePath();

			}

		},

		drawSprite: function(x1, y1, texture, map) {

			if (this.__state !== 'running') return;

			texture = texture instanceof Texture ? texture : null;
			map     = map instanceof Object      ? map     : null;


			if (texture !== null) {

				if (map === null) {

					this.__ctx.drawImage(
						texture.buffer,
						x1,
						y1
					);

				} else {

					if (lychee.debug === true) {

						this.drawBox(
							x1,
							y1,
							x1 + map.w,
							y1 + map.h,
							'#ff0000',
							false,
							1
						);

					}


					this.__ctx.drawImage(
						texture.buffer,
						map.x,
						map.y,
						map.w,
						map.h,
						x1,
						y1,
						map.w,
						map.h
					);

				}

			}

		},

		drawText: function(x1, y1, text, font, center) {

			if (this.__state !== 'running') return;

			font   = font instanceof Font ? font : null;
			center = center === true;


			if (font !== null) {

				var baseline = font.baseline;
				var kerning  = font.kerning;

				var chr, t, l;

				if (center === true) {

					var textwidth  = 0;
					var textheight = 0;

					for (t = 0, l = text.length; t < l; t++) {
						chr = font.get(text[t]);
						textwidth += chr.real + kerning;
						textheight = Math.max(textheight, chr.height);
					}

					x1 -= textwidth / 2;
					y1 -= (textheight - baseline) / 2;

				}


				y1 -= baseline / 2;


				var margin = 0;

				for (t = 0, l = text.length; t < l; t++) {

					var chr = font.get(text[t]);

					if (lychee.debug === true) {

						this.drawBox(
							x1 + margin,
							y1,
							x1 + margin + chr.real,
							y1 + chr.height,
							'#00ff00',
							false,
							1
						);

					}

					this.__ctx.drawImage(
						font.texture,
						chr.x,
						chr.y,
						chr.width,
						chr.height,
						x1 + margin - font.spacing,
						y1,
						chr.width,
						chr.height
					);

					margin += chr.real + font.kerning;

				}

			}

		},



		/*
		 * RENDERING API
		 */

		renderEntity: function(entity, offsetX, offsetY) {

			if (typeof entity.render === 'function') {

				entity.render(
					this,
					offsetX || 0,
					offsetY || 0
				);

			}

		}

	};


	return Class;

});

