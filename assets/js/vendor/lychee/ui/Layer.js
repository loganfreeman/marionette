
lychee.define('lychee.ui.Layer').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.entities = [];
		this.offset   = { x: 0, y: 0, z: 0 };
		this.visible  = true;

		this.__map = {};


		this.setEntities(settings.entities);
		this.setMap(settings.map);
		this.setOffset(settings.offset);
		this.setVisible(settings.visible);

		delete settings.entities;
		delete settings.map;
		delete settings.offset;
		delete settings.visible;


		lychee.ui.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		reset: function() {

			this.entities = [];
			this.visible  = true;

			this.__map = {};

		},

		serialize: function() {

			var settings = {};


			if (this.visible !== true) settings.visible = this.visible;

			if (
				   this.offset.x !== 0
				|| this.offset.y !== 0
				|| this.offset.z !== 0
			) {

				settings.offset = {};

				if (this.offset.x !== 0) settings.offset.x = this.offset.x;
				if (this.offset.y !== 0) settings.offset.y = this.offset.y;
				if (this.offset.z !== 0) settings.offset.z = this.offset.z;

			}


			var mapentities = [];

			if (this.entities.length > 0) {

				settings.entities = [];

				for (var e = 0, el = this.entities.length; e < el; e++) {

					var entity = this.entities[e];
					if (typeof entity.serialize === 'function') {
						settings.entities.push(entity.serialize());
						mapentities.push(entity);
					} else {
						settings.entities.push(null);
					}

				}

			}


			if (Object.keys(this.__map).length > 0) {

				settings.map = {};

				for (var id in this.__map) {

					var index = mapentities.indexOf(this.__map[id]);
					if (index !== -1) {
						settings.map[id] = index;
					}

				}

			}


			return {
				'constructor': 'lychee.game.Layer',
				'arguments':   [ settings ]
			};

		},

		update: function(clock, delta) {

			var entities = this.entities;
			for (var e = 0, el = entities.length; e < el; e++) {
				entities[e].update(clock, delta);
			}

		},

		render: function(renderer, offsetX, offsetY) {

			var position = this.position;

			var ox = position.x + offsetX;
			var oy = position.y + offsetY;


			if (lychee.debug === true) {

				var hwidth  = this.width / 2;
				var hheight = this.height / 2;

				renderer.drawBox(
					ox - hwidth,
					oy - hheight,
					ox + hwidth,
					oy + hheight,
					'#ff00ff',
					false,
					1
				);

			}


			var entities = this.entities;
			for (var e = 0, el = entities.length; e < el; e++) {

				renderer.renderEntity(
					entities[e],
					ox,
					oy
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		addEntity: function(entity) {

			entity = (entity != null && typeof entity.update === 'function') ? entity : null;


			if (entity !== null) {

				var found = false;

				for (var e = 0, el = this.entities.length; e < el; e++) {

					if (this.entities[e] === entity) {
						found = true;
						break;
					}

				}


				if (found === false) {

					this.entities.push(entity);

					return true;

				}

			}


			return false;

		},

		setEntity: function(id, entity, force) {

			id     = typeof id === 'string'                                  ? id     : null;
			entity = (entity != null && typeof entity.update === 'function') ? entity : null;
			force  = force === true;


			if (
				   id !== null
				&& entity !== null
				&& this.__map[id] === undefined
			) {

				this.__map[id] = entity;

				var result = this.addEntity(entity);
				if (result === true) {

					return true;

				} else if (force === true) {

					return true;

				} else {

					delete this.__map[id];

				}

			}


			return false;

		},

		getEntity: function(id) {

			id = typeof id === 'string' ? id : null;


			if (
				   id !== null
				&& this.__map[id] !== undefined
			) {

				return this.__map[id];

			}


			return null;

		},

		removeEntity: function(entity) {

			entity = (entity != null && typeof entity.update === 'function') ? entity : null;


			if (entity !== null) {

				var found = false;

				for (var e = 0, el = this.entities.length; e < el; e++) {

					if (this.entities[e] === entity) {
						this.entities.splice(e, 1);
						found = true;
						el--;
					}

				}


				for (var id in this.__map) {

					if (this.__map[id] === entity) {
						delete this.__map[id];
						found = true;
					}

				}


				return found;

			}


			return false;

		},

		setEntities: function(entities) {

			var all = true;

			if (entities instanceof Array) {

				for (var e = 0, el = entities.length; e < el; e++) {

					var result = this.addEntity(entities[e]);
					if (result === false) {
						all = false;
					}

				}

			}


			return all;

		},

		setMap: function(map) {

			var all = true;

			if (map instanceof Object) {

				this.__map = {};

				for (var id in map) {

					var entity = this.entities[map[id]] || null;
					if (entity !== null) {

						var result = this.setEntity(id, entity, true);
						if (result === false) {
							all = false;
						}

					} else {
						all = false;
					}

				}

			}


			return all;

		},

		setOffset: function(offset) {

			if (offset instanceof Object) {

				this.offset.x = typeof offset.x === 'number' ? offset.x : this.offset.x;
				this.offset.y = typeof offset.y === 'number' ? offset.y : this.offset.y;
				this.offset.z = typeof offset.z === 'number' ? offset.z : this.offset.z;

				return true;

			}


			return false;

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

