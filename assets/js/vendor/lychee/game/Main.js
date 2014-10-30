
lychee.define('lychee.game.Main').requires([
	'lychee.Input',
	'lychee.Renderer',
	'lychee.Viewport',
	'lychee.game.Loop'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var _toString = Object.prototype.toString;
	var _extend_recursive = function(obj) {

		for (var a = 1, al = arguments.length; a < al; a++) {

			var obj2 = arguments[a];
			if (obj2) {

				for (var prop in obj2) {

					if (_toString.call(obj2[prop]) === '[object Object]') {
						obj[prop] = {};
						_extend_recursive(obj[prop], obj2[prop]);
					} else {
						obj[prop] = obj2[prop];
					}

				}

			}

		}


		return obj;

	};


	var Class = function(settings) {

		this.settings = _extend_recursive({}, this.defaults, settings);

		this.input    = null;
		this.loop     = null;
		this.renderer = null;
		this.viewport = null;

		this.__states = {};
		this.__state  = null;


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		defaults: {

			fullscreen: false,
			music:      true,
			sound:      true,

			input: {
				delay:        0,
				fireKey:      false,
				fireModifier: false,
				fireTouch:    true,
				fireSwipe:    false
			},

			loop: {
				render: 60,
				update: 60
			},

			renderer: {
				width:      1024,
				height:     768,
				id:         'game',
				background: '#222222'
			}

		},

		load: function() {

			// Default behaviour:
			// Directly initialize, load no assets
			this.init();

		},

		reshape: function(orientation, rotation, width, height) {

			var renderer = this.renderer;
			if (renderer !== null) {

				var env = renderer.getEnvironment();

				if (
					orientation !== null
					&& rotation !== null
					&& typeof width === 'number'
					&& typeof height === 'number'
				) {
					env.screen.width  = width;
					env.screen.height = height;
				}


				var settings = this.settings;
				var rs       = this.settings.renderer;
				var rd       = this.defaults.renderer;


				if (settings.fullscreen === true) {
					rs.width  = env.screen.width;
					rs.height = env.screen.height;
				} else {
					rs.width  = rd.width;
					rs.height = rd.height;
				}


				renderer.reset(
					rs.width,
					rs.height,
					true
				);

			}

		},

		init: function() {

			lychee.Preloader.prototype._progress(null, null);


			var settings = this.settings;

			if (settings.input !== null) {
				this.input = new lychee.Input(settings.input);
			}

			if (settings.loop !== null) {
				this.loop = new lychee.game.Loop(settings.loop);
				this.loop.bind('render', this.render, this);
				this.loop.bind('update', this.update, this);
			}

			if (settings.renderer !== null) {
				var rs = settings.renderer;
				this.renderer = new lychee.Renderer(rs.id);
				this.renderer.reset(rs.width, rs.height);
				this.renderer.setBackground(rs.background);
			} else {
				// reshape() functionality is not influenced
				settings.renderer = {};
			}

			this.viewport = new lychee.Viewport();
			this.viewport.bind('reshape', this.reshape, this);
			this.viewport.bind('hide',    this.stop,    this);
			this.viewport.bind('show',    this.start,   this);

		},

		start: function() {
			this.loop.start();
		},

		stop: function() {
			this.loop.stop();
		},

		resetState: function(leavedata, enterdata) {

			leavedata = leavedata instanceof Object ? leavedata : null;
			enterdata = enterdata instanceof Object ? enterdata : null;


			var state = this.getState();
			if (state !== null) {

				state.leave && state.leave(leavedata);
				state.reset && state.reset();
				state.enter && state.enter(enterdata);

			}

		},

		setState: function(id, state) {

			id = typeof id === 'string' ? id : null;

			if (id !== null) {

				this.__states[id] = state;

				return true;

			}


			return false;

		},

		getState: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null) {

				return this.__states[id] || null;

			}


			return this.__state || null;

		},

		removeState: function(id) {

			id = typeof id === 'string' ? id : null;

			if (
				   id !== null
				&& this.__states[id] !== undefined
			) {

				delete this.__states[id];

				return true;

			}


			return false;

		},

		changeState: function(id, data) {

			data = data || null;

			var oldState = this.__state;
			var newState = this.__states[id] || null;
			if (newState === null) {
				return false;
			}


			if (oldState !== null) {
				oldState.leave && oldState.leave();
			}

			if (newState !== null) {
				newState.enter && newState.enter(data);
			}

			this.__state = newState;


			return true;

		},

		render: function(t, dt) {

			if (this.__state !== null) {
				this.__state.render && this.__state.render(t, dt);
			}

		},

		update: function(t, dt) {

			if (this.__state !== null) {
				this.__state.update && this.__state.update(t, dt);
			}

		}


	};


	return Class;

});

