
lychee.define('game.logic.Level').requires([
	'game.entity.Blackhole',
	'game.entity.Enemy',
	'game.entity.Lazer',
	'game.entity.Meteor',
	'game.entity.Ship'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, game, global, attachments) {

	var _config    = attachments['json'];

	var _blackhole = game.entity.Blackhole;
	var _enemy     = game.entity.Enemy;
	var _lazer     = game.entity.Lazer;
	var _meteor    = game.entity.Meteor;
	var _ship      = game.entity.Ship;


	(function(stages) {

		if (lychee.debug === true) {

			for (var id in stages) {
				console.log('game.Level: Stage "' + id + '": ' + stages[id].length);
			}

		}

	})(_config);


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.entities = [];
		this.width    = 0;

		this.__cache    = { x: 0, y: 0 };
		this.__data     = {
			health:    0,
			points:    0,
			destroyed: 0,
			missed:    0
		};
		this.__enemies  = [];
		this.__stage    = null;
		this.__boundY   = 0;

		this.__ship = new _ship();


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		reset: function(stagedata, width, height) {

			this.entities = [];

			this.__boundY = ((height      / 80) | 0);


			var data = this.__data;

			data.health    = 100;
			data.points    = 0;
			data.destroyed = 0;
			data.missed    = 0;


			if (typeof stagedata.points === 'number') {
				data.points = stagedata.points;
			}

			if (stagedata.ship instanceof _ship) {

				this.__ship = stagedata.ship;
				this.__ship.setHealth(data.health);

				this.entities.push(this.__ship);

			} else {

				this.__ship.setState('default');
				this.__ship.setPosition(this.__translateToPosition(0, 1));
				this.__ship.setHealth(data.health);

				this.entities.push(this.__ship);

			}


			this.spawnStage(stagedata.stage);

		},



		/*
		 * LOGIC INTEGRATION API
		 */

		__translateToPosition: function(x, y) {

			var position = this.__cache;

			position.x  = 0;
			position.y  = 1/2 * this.__boundY * 80;

			position.x += 80 * x;
			position.y -= 80 * y;

			return position;

		},

		destroy: function(entity, points) {

			points = points === true;


			for (var e = 0, el = this.entities.length; e < el; e++) {

				if (this.entities[e] === entity) {
					this.entities.splice(e, 1);
					el--;
				}

			}


			if (entity instanceof _enemy) {

				for (var e = 0, el = this.__enemies.length; e < el; e++) {

					if (this.__enemies[e] === entity) {
						this.__enemies.splice(e, 1);
						el--;
					}

				}

			}



			if (
				   entity instanceof _enemy
				|| entity instanceof _meteor
			) {

				if (points === true) {

					this.__data.points += entity.points;
					this.__data.destroyed++;

					this.trigger('update', [ this.__data ]);

				} else {

					this.__data.missed++;

				}

			}


			if (entity instanceof _ship) {

				this.__data.missed += this.entities.length;
				this.trigger('fail', [ this.__data ]);

			} else if (
				   this.entities.length === 1
				&& this.entities[0] instanceof _ship
			) {

				this.trigger('success', [ this.__data ]);

			}

		},

		collide: function(active, passive) {

			var health = 0;
			var diff   = 0;


			if (
				   active instanceof _lazer
				&& passive instanceof _lazer
			) {

				this.destroy(active,  false);
				this.destroy(passive, false);
				diff -= 2;

			} else if (
				active instanceof _lazer
				&& (
					   passive instanceof _enemy
					|| passive instanceof _meteor
				)
			) {

				health  = passive.health;
				health -= 50;
				passive.setHealth(health);


				if (health < 0) {
					this.destroy(active,  false);
					this.destroy(passive, true);
					diff -= 2;
				} else {
					this.destroy(active,  false);
					diff -= 1;
				}

			} else if (
				(
					   active instanceof _enemy
					|| active instanceof _lazer
					|| active instanceof _meteor
				)
				&& passive instanceof _ship
			) {

				health  = passive.health;
				health -= 10;
				passive.setHealth(health);


				if (health < 0) {
					this.destroy(active,  false);
					this.destroy(passive, false);
					diff -= 2;
				} else {
					this.destroy(active,  false);
					diff -= 1;
				}


				this.__data.health = health;
				this.trigger('update', [ this.__data ]);

			}


			return diff;

		},

		spawnStage: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null) {

				var stage = _config[id] || null;
				if (stage === null) return;


				var offsetX = (-1 * stage[0].length / 2) | 0;
				var offsetY = this.__boundY;

				for (var y = 0, yl = stage.length; y < yl; y++) {

					for (var x = 0, xl = stage[y].length; x < xl; x++) {

						var pos = this.__translateToPosition(offsetX + x, offsetY + y);

						var raw = stage[y][x];
						if (raw === 1) {
							this.spawn(_meteor, pos.x, pos.y);
						} else if (raw === 2) {
							this.spawn(_blackhole, pos.x, pos.y);
						} else if (raw === 3) {
							this.spawn(_enemy, pos.x, pos.y);
						}

					}

				}

				this.width = stage[0].length * 80;

			}

		},

		spawn: function(construct, posx, posy, velx, vely, owner) {

			construct = construct instanceof Function ? construct : null;
			posx      = posx || 0;
			posy      = posy || 0;
			velx      = velx || 0;
			vely      = vely || 0;
			owner     = owner !== undefined ? owner : null;

			if (construct !== null) {

				var entity = new construct();

				entity.setPosition({
					x: posx,
					y: posy
				})

				entity.setVelocity({
					x: velx,
					y: vely
				});

				if (owner !== null) {
					entity.setOwner(owner);
				}


				this.entities.push(entity);

				if (entity instanceof _enemy) {
					this.__enemies.push(entity);
				}

			}

		},

		getData: function() {
			return this.__data;
		},

		getEnemies: function() {
			return this.__enemies;
		},

		getShip: function() {
			return this.__ship;
		},

	};


	return Class;

});

