
lychee.define('lychee.ui.Entity').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var _default_state  = 'default';
	var _default_states = { 'default': null, 'active': null };


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.width  = typeof settings.width  === 'number' ? settings.width  : 0;
		this.height = typeof settings.height === 'number' ? settings.height : 0;
		this.depth  = 0;
		this.radius = typeof settings.radius === 'number' ? settings.radius : 0;

		this.shape    = Class.SHAPE.rectangle;
		this.state    = _default_state;
		this.position = { x: 0, y: 0 };
		this.visible  = true;

		this.__clock  = null;
		this.__states = _default_states;


		if (settings.states instanceof Object) {

			this.__states = { 'default': null, 'active': null };

			for (var id in settings.states) {

				if (settings.states.hasOwnProperty(id)) {
					this.__states[id] = settings.states[id];
				}

			}

		}


		this.setShape(settings.shape);
		this.setState(settings.state);
		this.setPosition(settings.position);
		this.setVisible(settings.visible);


		lychee.event.Emitter.call(this);

		settings = null;

	};


	// Same ENUM values as lychee.game.Entity
	Class.SHAPE = {
		circle:    0,
		rectangle: 2
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var settings = {};


			if (this.width  !== 0) settings.width  = this.width;
			if (this.height !== 0) settings.height = this.height;
			if (this.radius !== 0) settings.radius = this.radius;

			if (this.shape !== Class.SHAPE.rectangle) settings.shape   = this.shape;
			if (this.state !== _default_state)        settings.state   = this.state;
			if (this.__states !== _default_states)    settings.states  = this.__states;
			if (this.visible !== true)                settings.visible = this.visible;


			if (
				   this.position.x !== 0
				|| this.position.y !== 0
			) {

				settings.position = {};

				if (this.position.x !== 0) settings.position.x = this.position.x;
				if (this.position.y !== 0) settings.position.y = this.position.y;

			}


			return {
				'constructor': 'lychee.ui.Entity',
				'arguments':   [ settings ]
			};

		},

		// Allows sync(null, true) for reset
		sync: function(clock, force) {

			force = force === true;

			if (force === true) {
				this.__clock = clock;
			}


			if (this.__clock === null) {

				this.__clock = clock;

			}

		},

		// HINT: Renderer skips if no render() method exists
		// render: function(renderer, offsetX, offsetY) {},

		update: function(clock, delta) {

			// 1. Sync clocks initially
			// (if Entity was created before loop started)
			if (this.__clock === null) {
				this.sync(clock);
			}

			this.__clock = clock;

		},



		/*
		 * CUSTOM API
		 */

		setPosition: function(position) {

			if (position instanceof Object) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				return true;

			}


			return false;

		},

		getStateMap: function() {
			return this.__states[this.state];
		},

		setState: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && this.__states[id] !== undefined) {
				this.state = id;
				return true;
			}


			return false;

		},

		setShape: function(shape) {

			if (typeof shape !== 'number') return false;


			var found = false;

			for (var id in Class.SHAPE) {

				if (shape === Class.SHAPE[id]) {
					found = true;
					break;
				}

			}


			if (found === true) {
				this.shape = shape;
			}


			return found;

		},

		setVisible: function(visible) {

			if (visible === true || visible === false) {

				this.visible = visible;

				return true;

			}


			return false;

		}

	};


	return Class;

});

