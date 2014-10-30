
lychee.define('Viewport').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (
		typeof global.addEventListener === 'function'
		&& typeof global.innerWidth === 'number'
		&& typeof global.innerHeight === 'number'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	// I know, there's null and 0.
	// This is wanted. See below.
	var _clock = {
		orientationchange: null,
		resize:            0
	};
	var _active = true;


	var _instances = [];
	var _listeners = {

		orientationchange: function() {

			_clock.orientationchange = Date.now();

			for (var i = 0, l = _instances.length; i < l; i++) {
				_instances[i].__processOrientation(global.orientation);
			}

		},

		resize: function() {

			// This fixes the multiple resize events bug
			// The DOM-concept related Bug by design:
			// 1. resize
			// 2. orientationchange
			// 3. resize (optional, if device was fast enough)
			// 4. orientationchange
			// 5. resize (if reflow was bad)
			// 6. resize

			if (
				_clock.orientationchange === null
				|| (
					_clock.orientationchange !== null
					&& _clock.resize < _clock.orientationchange
				)
			) {

				_clock.resize = Date.now();

				for (var i = 0, l = _instances.length; i < l; i++) {

					(function(instance) {
						setTimeout(function() {
							instance.__processReshape(global.innerWidth, global.innerHeight);
						}, 500);
					})(_instances[i]);

				}

			}

		},

		focus: function() {

			if (_active === false) {

				for (var i = 0, l = _instances.length; i < l; i++) {
					_instances[i].__processShow();
				}

				_active = true;

			}

		},

		blur: function() {

			if (_active === true) {

				for (var i = 0, l = _instances.length; i < l; i++) {
					_instances[i].__processHide();
				}

				_active = false;

			}

		}

	};


	var _enterFullscreen = null;
	var _leaveFullscreen = null;

	(function() {

		var methods = [];

		if (typeof global.onorientationchange !== 'undefined') {
			methods.push('Orientation');
			global.addEventListener('orientationchange', _listeners.orientationchange, true);
		}

		if (typeof global.onfocus !== 'undefined') {
			methods.push('Focus');
			global.addEventListener('focus', _listeners.focus, true);
		}

		if (typeof global.onblur !== 'undefined') {
			methods.push('Blur');
			global.addEventListener('blur', _listeners.blur, true);
		}


		global.addEventListener('resize', _listeners.resize, true);


		if (global.document && global.document.documentElement) {

			var element = global.document.documentElement;

			if (
				typeof element.requestFullscreen === 'function'
				&& typeof element.exitFullscreen === 'function'
			) {

				_enterFullscreen = function() {
					element.requestFullscreen();
				};

				_leaveFullscreen = function() {
					element.exitFullscreen();
				};

			}


			if (_enterFullscreen === null || _leaveFullscreen === null) {

				var prefixes = [ 'moz', 'ms', 'webkit' ];

				for (var p = 0, pl = prefixes.length; p < pl; p++) {

					if (
						typeof element[prefixes[p] + 'RequestFullScreen'] === 'function'
						&& typeof document[prefixes[p] + 'CancelFullScreen'] === 'function'
					) {

						(function(document, element, prefix) {

							_enterFullscreen = function() {
								element[prefix + 'RequestFullScreen']();
							};

							_leaveFullscreen = function() {
								document[prefix + 'LeaveFullScreen']();
							};

						})(global.document, element, prefixes[p]);

						break;

					}

				}

			}

		}


		if (_enterFullscreen !== null && _leaveFullscreen !== null) {
			methods.push('Fullscreen');
		}


		if (lychee.debug === true) {

			console.log('lychee.Viewport: Supported methods are ' + methods.join(', '));

		}

	})();


	var Class = function() {

		this.__orientation = typeof global.orientation === 'number' ? global.orientation : 0;
		this.__width  = global.innerWidth;
		this.__height = global.innerHeight;

		this.__isFullscreen = false;


		lychee.event.Emitter.call(this);

		_instances.push(this);

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		enterFullscreen: function() {

			if (_enterFullscreen !== null) {

				this.__isFullscreen = true;
				_enterFullscreen();

				return true;

			}


			return false;

		},

		leaveFullscreen: function() {

			if (_leaveFullscreen !== null) {

				this.__isFullscreen = false;
				_leaveFullscreen();

				return true;

			}


			return false;

		},

		isFullscreen: function() {
			return this.__isFullscreen === true;
		},



		/*
		 * PRIVATE API
		 */

		__processOrientation: function(orientation) {
			this.__orientation = orientation;
		},

		__processReshape: function(width, height) {

			if (
				width === this.__width
				&& height === this.__height
			) {
				return;
			}


			this.__width  = width;
			this.__height = height;


			//    TOP
			//  _______
			// |       |
			// |       |
			// |       |
			// |       |
			// |       |
			// [X][X][X] <- buttons
			//
			//  BOTTOM

			if (this.__orientation === 0) {

				if (width > height) {
					this.trigger('reshape', [
						'landscape',
						'landscape',
						this.__width,
						this.__height
					]);
				} else {
					this.trigger('reshape', [
						'portrait',
						'portrait',
						this.__width,
						this.__height
					]);
				}


			//    ____________    B
			// T |            [x] O
			// O |            [x] T
			// P |____________[x] T
			//                    O
			//                    M

			} else if (this.__orientation === 90) {

				if (width > height) {
					this.trigger('reshape', [
						'portrait',
						'landscape',
						this.__width,
						this.__height
					]);
				} else {
					this.trigger('reshape', [
						'landscape',
						'portrait',
						this.__width,
						this.__height
					]);
				}


			// B    ____________
			// O [x]            | T
			// T [x]            | O
			// T [x]____________| P
			// O
			// M

			} else if (this.__orientation === -90) {

				if (width > height) {
					this.trigger('reshape', [
						'portrait',
						'landscape',
						this.__width,
						this.__height
					]);
				} else {
					this.trigger('reshape', [
						'landscape',
						'portrait',
						this.__width,
						this.__height
					]);
				}

			}

		},

		__processShow: function() {
			this.trigger('show', []);
		},

		__processHide: function() {
			this.trigger('hide', []);
		}

	};


	return Class;

});

