
lychee.define('Renderer').tags({
	platform: 'v8gl'
}).supports(function(lychee, global) {

	if (global.gl && global.glut) {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	var Class = function(id) {

		id = typeof id === 'string' ? id : null;

		this.__id = id;

		this.__environment = {
			width: null,
			height: null,
			screen: {},
			offset: {}
		};

		this.__cache = {};

		this.__colorcache   = { r: 0, g: 0, b: 0 };
		this.__texturecache = {};

		this.__window = null;
		this.__state = null;
		this.__alpha = 1;
		this.__background = { r: 0, g: 0, b: 0 };
		this.__width = 0;
		this.__height = 0;

		this.context = null;

	};

	Class.prototype = {

		__updateEnvironment: function() {

			this.__environment.width = this.__width;
			this.__environment.height = this.__height;

			this.__environment.screen.width = this.__width;
			this.__environment.screen.height = this.__height;

			this.__environment.offset.x = 0;
			this.__environment.offset.y = 0;

		},

		__hexToRGB: function(hex) {

			if (
				typeof hex === 'string'
				&& hex.length === 7
			) {

				this.__colorcache.r = parseInt(hex[1] + hex[2], 16);
				this.__colorcache.g = parseInt(hex[3] + hex[4], 16);
				this.__colorcache.b = parseInt(hex[5] + hex[6], 16);

				return this.__colorcache;

			}


			if (lychee.debug === true) {
				console.warn('lychee.Renderer: Invalid Hex Color "' + hex + '"');
			}


			this.__colorcache.r = 0;
			this.__colorcache.g = 0;
			this.__colorcache.b = 0;


			return this.__colorcache;

		},

		__translateToTexCoord: function(pos, full, inverted) {

			var result = 0;

			if (inverted === true) {
				result = (full - pos) / full;
				result = 1 - (pos / full);
			} else {
				result = pos / full;
			}

			return result;

		},



		/*
		 * STATE AND ENVIRONMENT MANAGEMENT
		 */

		reset: function(width, height, resetCache) {

			if (lychee.debug === true) {
				console.log('lychee.Renderer: reset', width, height, resetCache);
			}


			width = typeof width === 'number' ? width : this.__width;
			height = typeof height === 'number' ? height : this.__height;
			resetCache = resetCache === true ? true : false;

			if (resetCache === true) {
				this.__cache        = {};
				this.__colorcache   = { r: 0, g: 0, b: 0 };
				this.__texturecache = {};
			}


			glut.initDisplayMode(glut.DOUBLE | glut.RGBA | glut.DEPTH);

			if (width !== this.__width || height !== this.__height) {

				glut.destroyWindow(global.window);
				glut.initWindowSize(width, height);
				global.window = glut.createWindow(this.__id);

				// Somehow, this results in a strange skewing effect
				/*
				if (this.__window !== null) {
					glut.reshapeWindow(width, height);
				} else {
					glut.initWindowSize(width, height);
					this.__window = glut.createWindow(this.__id);
				}
				*/


				this.__width = width;
				this.__height = height;

				glut.positionWindow(0, 0);

				// Texture Buffers need to be regenerated
				for (var id in this.__texturecache) {
					if (this.__texturecache[id] === null) continue;
					this.__texturecache[id].generate();
				}

			}


			gl.matrixMode(gl.PROJECTION);
			gl.loadIdentity();
			gl.ortho(0, this.__width, this.__height, 0, 0, 1);

			gl.disable(gl.DEPTH_TEST);


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

			gl.clearColor(this.__background.r, this.__background.g, this.__background.b, 0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		},

		flush: function(command) {

			if (this.__state !== 'running') return;

			// Flush all buffers
			if (command === 0) {

				glut.swapBuffers();

			// Flush buffer to temporary buffer
			} else if (command === 1) {

				// TODO: Save current buffer

			// Flush temporary buffer to buffer
			} else if (command === 2) {

				// TODO: Restore old buffer

			}

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
				this.__alpha = alpha;
			}

		},

		setBackground: function(color) {

			color = typeof color === 'string' ? color : '#000000';

			var background = this.__hexToRGB(color);

			this.__background.r = background.r / 255;
			this.__background.g = background.g / 255;
			this.__background.b = background.b / 255;

		},

		createBuffer: function(width, height) {

			// gl.createBuffer();

		},

		clearBuffer: function(buffer) {

			// reset the passed-through buffer
			// to full transparency

		},

		setBuffer: function(buffer) {

			// set the current drawing buffer to
			// the given one

		},



		/*
		 * DRAWING API
		 */

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

			if (this.__state !== 'running') return;

			color = typeof color === 'string' ? color : '#000000';
			background = background === true ? true : false;
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			// TODO: Implement Triangle Rendering

		},

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


				// TODO: Implement Polygon Rendering
				// ctx.beginPath();
				// ctx.moveTo(x1, y1);

				// for (var p = 1; p < points; p++) {

				// 	ctx.lineTo(
				// 		arguments[1 + p * 2],
				// 		arguments[1 + p * 2 + 1]
				// 	);

				// }

				// ctx.lineTo(x1, y1);

			}

		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

			if (this.__state !== 'running') return;

			color = typeof color === 'string' ? color : '#000000';
			background = background === true ? true : false;
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			gl.matrixMode(gl.MODELVIEW);
			gl.loadIdentity();


			var rgb_color = this.__hexToRGB(color);

			gl.color4f(rgb_color.r / 255, rgb_color.g / 255, rgb_color.b / 255, this.__alpha);


			if (background === false) {

				// TOP BORDER
				gl.begin(gl.QUADS);
				gl.vertex2i(x1, y1);
				gl.vertex2i(x2, y1);
				gl.vertex2i(x2, y1 + lineWidth);
				gl.vertex2i(x1, y1 + lineWidth);
				gl.end();

				// RIGHT BORDER
				gl.begin(gl.QUADS);
				gl.vertex2i(x2 - lineWidth, y1 + lineWidth);
				gl.vertex2i(x2, y1 + lineWidth);
				gl.vertex2i(x2, y2 - lineWidth);
				gl.vertex2i(x2 - lineWidth, y2 - lineWidth);
				gl.end();

				// BOTTOM BORDER
				gl.begin(gl.QUADS);
				gl.vertex2i(x1, y2 - lineWidth);
				gl.vertex2i(x2, y2 - lineWidth);
				gl.vertex2i(x2, y2);
				gl.vertex2i(x1, y2);
				gl.end();

				// LEFT BORDER
				gl.begin(gl.QUADS);
				gl.vertex2i(x1, y1 + lineWidth);
				gl.vertex2i(x1 + lineWidth, y1 + lineWidth);
				gl.vertex2i(x1 + lineWidth, y2 - lineWidth);
				gl.vertex2i(x1, y2 - lineWidth);
				gl.end();

			} else {

				gl.begin(gl.QUADS);
				gl.vertex2i(x1, y1);
				gl.vertex2i(x2, y1);
				gl.vertex2i(x2, y2);
				gl.vertex2i(x1, y2);
				gl.end();

			}

		},

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

			// TODO: Implement Arc Rendering

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

			if (this.__state !== 'running') return;

			color = typeof color === 'string' ? color : '#000000';
			background = background === true ? true : false;
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			gl.matrixMode(gl.MODELVIEW);
			gl.loadIdentity();


			var rgb_color = this.__hexToRGB(color);

			gl.color4f(rgb_color.r / 255, rgb_color.g / 255, rgb_color.b / 255, this.__alpha);


			if (background === false) {

				gl.begin(gl.LINE_STRIP);

				for (var a = 0; a <= 360; a+= 5) {

					var angle = a / 180 * Math.PI;
					gl.vertex2i(
						x + Math.sin(angle) * radius,
						y + Math.cos(angle) * radius
					);

				}

				gl.end();

			} else {

				gl.begin(gl.TRIANGLE_FAN);

				gl.vertex2i(x, y);

				for (var a = 0; a <= 360; a += 5) {

					var angle = a / 180 * Math.PI;

					gl.vertex2i(x + Math.sin(angle) * radius, y + Math.cos(angle) * radius);

				}

				gl.end();

			}

		},

		// TODO: Support lineWidth
		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

			if (this.__state !== 'running') return;

			color = typeof color === 'string' ? color : '#000000';
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;

 			gl.matrixMode(gl.MODELVIEW);
			gl.loadIdentity();


			var rgb_color = this.__hexToRGB(color);

			gl.color4f(rgb_color.r / 255, rgb_color.g / 255, rgb_color.b / 255, this.__alpha);

			gl.begin(gl.LINES);

			gl.vertex2i(x1, y1);
			gl.vertex2i(x2, y2);

			gl.end();

		},

		drawSprite: function(x1, y1, texture, map) {

			if (this.__state !== 'running') return;

			map = map instanceof Object ? map : null;


			if (this.__texturecache[texture.url] === undefined) {

				this.__texturecache[texture.url] = texture;
				this.__texturecache[texture.url].generate();

				if (lychee.debug === true) {
					console.log("lychee.Renderer: cached texture", texture.url, texture.width + "x" + texture.height);
				}

			}


			var sx1, sy1, sx2, sy2;
			var x2, y2;


			if (map === null) {

				x2 = x1 + texture.width;
				y2 = y1 + texture.height;

				// Note: Texture coordinate system is rotating
				// beginning from bottom left to top left.
				sx1 = 0.0; sy1 = 0.0;
				sx2 = 1.0; sy2 = 1.0;


				gl.matrixMode(gl.MODELVIEW);
				gl.loadIdentity();

				gl.color4f(1.0, 1.0, 1.0, this.__alpha);

				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

				gl.enable(gl.TEXTURE_2D);
				gl.bindTexture(gl.TEXTURE_2D, texture.id);

				gl.begin(gl.QUADS);
				gl.texCoord2f(sx1, sy1);
				gl.vertex2f(x1, y1);
				gl.texCoord2f(sx2, sy1);
				gl.vertex2f(x2, y1);
				gl.texCoord2f(sx2, sy2);
				gl.vertex2f(x2, y2);
				gl.texCoord2f(sx1, sy2);
				gl.vertex2f(x1, y2);
				gl.end();

				gl.disable(gl.TEXTURE_2D);

			} else {

				x2 = x1 + map.w;
				y2 = y1 + map.h;


				sx1 = this.__translateToTexCoord(map.x, texture.width);
				sy1 = this.__translateToTexCoord(map.y, texture.height);

				sx2 = this.__translateToTexCoord(map.x + map.w, texture.width);
				sy2 = this.__translateToTexCoord(map.y + map.h, texture.height);


				gl.matrixMode(gl.MODELVIEW);
				gl.loadIdentity();

				gl.color4f(1.0, 1.0, 1.0, this.__alpha);

				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

				gl.enable(gl.TEXTURE_2D);
				gl.bindTexture(gl.TEXTURE_2D, texture.id);

				gl.begin(gl.QUADS);
				gl.texCoord2f(sx1, sy1);
				gl.vertex2f(x1, y1);
				gl.texCoord2f(sx2, sy1);
				gl.vertex2f(x2, y1);
				gl.texCoord2f(sx2, sy2);
				gl.vertex2f(x2, y2);
				gl.texCoord2f(sx1, sy2);
				gl.vertex2f(x1, y2);
				gl.end();

				gl.disable(gl.TEXTURE_2D);


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


				var texture = font.texture;

				if (this.__texturecache[texture.url] === undefined) {

					this.__texturecache[texture.url] = texture;
					this.__texturecache[texture.url].generate();

					if (lychee.debug === true) {
						console.log("lychee.Renderer: cached texture", texture.url, texture.width + "x" + texture.height);
					}

				}


				var margin = 0;
				var xorg = x1;
				var yorg = y1;
				var x2, y2;
				var sx1, sy1, sx2, sy2;

				for (t = 0, l = text.length; t < l; t++) {

					var chr = font.get(text[t]);

					x1 = xorg + margin - spacing;
					y1 = yorg;
					x2 = x1 + chr.width;
					y2 = y1 + chr.height;

					sx1 = this.__translateToTexCoord(chr.x, texture.width);
					sy1 = this.__translateToTexCoord(chr.y, texture.height);

					sx2 = this.__translateToTexCoord(chr.x + chr.width,  texture.width);
					sy2 = this.__translateToTexCoord(chr.y + chr.height, texture.height);


					gl.matrixMode(gl.MODELVIEW);
					gl.loadIdentity();

					gl.color4f(1.0, 1.0, 1.0, this.__alpha);

					gl.enable(gl.BLEND);
					gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

					gl.enable(gl.TEXTURE_2D);
					gl.bindTexture(gl.TEXTURE_2D, texture.id);

					gl.begin(gl.QUADS);
					gl.texCoord2f(sx1, sy1);
					gl.vertex2f(x1, y1);
					gl.texCoord2f(sx2, sy1);
					gl.vertex2f(x2, y1);
					gl.texCoord2f(sx2, sy2);
					gl.vertex2f(x2, y2);
					gl.texCoord2f(sx1, sy2);
					gl.vertex2f(x1, y2);
					gl.end();

					gl.disable(gl.TEXTURE_2D);


					if (lychee.debug === true) {

						this.drawBox(
							xorg + margin,
							yorg,
							xorg + margin + chr.real,
							yorg + chr.height,
							'#00ff00',
							false,
							1
						);

					}

					margin += chr.real + kerning;

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

