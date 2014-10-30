
lychee.define('Renderer').tags({
	platform: 'nodejs'
}).supports(function(lychee, global) {

	if (
		typeof process !== 'undefined'
		&& process.stdout
	) {
		return true
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

		this.__state = null;
		this.__width = 0;
		this.__height = 0;

		// required for requestAnimationFrame
		this.context = null;

	};

	Class.prototype = {

		__updateEnvironment: function() {

			var env = this.__environment;


			env.screen.width  = 0;
			env.screen.height = 0;

			env.offset.x = 0;
			env.offset.y = 0;

			env.width  = this.__width;
			env.height = this.__height;

		},



		/*
		 * STATE AND ENVIRONMENT MANAGEMENT
		 */

		reset: function(width, height, resetCache) {

			width = typeof width === 'number' ? width : this.__width;
			height = typeof height === 'number' ? height : this.__height;
			resetCache = resetCache === true ? true : false;

			if (resetCache === true) {
				this.__cache = {};
			}


			this.__width = width;
			this.__height = height;

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

		},

		flush: function() {

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

		},

		setBackground: function(color) {

		},



		/*
		 * DRAWING API
		 */

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

		},

		drawPolygon: function(points, x1, y1) {
		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

		},

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

		},

		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

		},

		drawSprite: function(x1, y1, sprite, map) {

		},

		drawText: function(x1, y1, text, font, center) {

		},



		/*
		 * RENDERING API
		 */

		renderEntity: function(entity, offsetX, offsetY) {

		}

	};


	return Class;

});

