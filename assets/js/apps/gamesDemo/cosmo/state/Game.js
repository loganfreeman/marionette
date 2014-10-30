
lychee.define('game.state.Game').requires([
	'lychee.ui.Layer',
	'lychee.ui.Button',
	'game.entity.Button'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(game) {

		lychee.game.State.call(this, game);


		this.__stagelevel = 'stage1';


		// Result Layer
		this.__headline  = null;
		this.__destroyed = null;
		this.__missed    = null;
		this.__rating    = null;
		this.__continue  = null;
		this.__restart   = null;

		// UI Layer
		this.__points   = null;
		this.__shield   = null;

		this.reset();

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		reset: function() {

			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var width  = renderer.getEnvironment().width;
				var height = renderer.getEnvironment().height;
				var marginx = width / 4;
				var marginy = height / 4;


				this.removeLayer('result');
				this.removeLayer('ui');


				var resultlayer = new lychee.game.Layer();
				var uilayer     = new lychee.game.Layer();


				entity = new lychee.ui.Layer({
					width:  width,
					height: height,
					position: {
						x: 0,
						y: 0
					}
				});

				resultlayer.setEntity('root', entity);

				entity = new lychee.ui.Layer({
					width:  width,
					height: height,
					position: {
						x: 0,
						y: 0
					}
				});

				uilayer.setEntity('root', entity);



				/*
				 * RESULT INTERFACE
				 */

				var resultroot   = resultlayer.getEntity('root');
				var dialogheight = height * 3/4;


				entity = new lychee.ui.Button({
					label: 'Game Over',
					font:  this.game.fonts.headline,
					position: {
						x: 0,
						y: -1 * marginy
					}
				});

				this.__headline = entity;
				resultroot.addEntity(entity);


				entity = new lychee.ui.Button({
					label: '0',
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: -1 * marginy + dialogheight * 1/3
					}
				});

				this.__destroyed = entity;
				resultroot.addEntity(entity);


				entity = new lychee.ui.Button({
					label: '0',
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: -1 * marginy + dialogheight * 1/3 + 40
					}
				});

				this.__missed = entity;
				resultroot.addEntity(entity);


				entity = new lychee.ui.Button({
					label: 'Completed : 0%',
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: -1 * marginy + dialogheight * 1/3 + 80
					}
				});

				this.__rating = entity;
				resultroot.addEntity(entity);




				entity = new game.entity.Button({
					label: 'Continue',
					font:  this.game.fonts.normal,
					state: 'continue',
					position: {
						x:  1 * marginx,
						y: -1 * marginy + dialogheight - 64
					}
				});

				this.__continue = entity;
				resultroot.addEntity(entity);


				entity = new game.entity.Button({
					label: 'Restart',
					font:  this.game.fonts.normal,
					state: 'continue',
					position: {
						x:  1 * marginx,
						y: -1 * marginy + dialogheight - 64
					}
				});

				this.__restart = entity;
				resultroot.addEntity(entity);


				entity = new game.entity.Button({
					label: 'Menu',
					font:  this.game.fonts.normal,
					state: 'cancel',
					position: {
						x: -1 * marginx,
						y: -1 * marginy + dialogheight - 64
					}
				});

				this.__cancel = entity;
				resultroot.addEntity(entity);



				resultlayer.setVisible(false);



				/*
				 * USER INTERFACE
				 */

				var uiroot = uilayer.getEntity('root');


				entity = new lychee.ui.Button({
					label: 'Points: 0',
					font:  this.game.fonts.normal,
					position: {
						x:  1/2 * width  - marginx,
						y: -1/2 * height + 32
					}
				});

				this.__points = entity;
				uiroot.addEntity(entity);


				entity = new lychee.ui.Button({
					label: 'Shield: 100%',
					font:  this.game.fonts.normal,
					position: {
						x: -1/2 * width  + marginx,
						y: -1/2 * height + 32
					}
				});

				this.__shield = entity;
				uiroot.addEntity(entity);



				this.setLayer('result', resultlayer);
				this.setLayer('ui',     uilayer);

			}

		},

		enter: function(stage) {

			stage = typeof stage === 'string' ? stage : 'stage1';


			var renderer = this.renderer;
			var logic    = this.game.logic;
			if (
				renderer !== null
				&& logic !== null
			) {

				logic.bind('update', function(data) {
					if (this.__points !== null) this.__points.setLabel('Points: ' + data.points);
					if (this.__shield !== null) this.__shield.setLabel('Shield: ' + data.health + '%');
				}, this);

				logic.bind('success', function(data) {

					this.getLayer('ui').setVisible(false);
					this.getLayer('result').setVisible(true);

					this.__headline.setLabel('STAGE CLEAR');
					this.__restart.setVisible(false);
					this.__continue.setVisible(true);

					this.__updateStatistics(data);

				}, this);

				logic.bind('fail', function(data) {

					this.getLayer('ui').setVisible(false);
					this.getLayer('result').setVisible(true);

					this.__headline.setLabel('GAME OVER');
					this.__restart.setVisible(true);
					this.__continue.setVisible(false);

					this.__updateStatistics(data);

				}, this);


				this.__stagelevel = stage;

				var env = renderer.getEnvironment();
				logic.enter(this.__stagelevel, env.width, env.height);


			}


			this.getLayer('ui').setVisible(true);
			this.getLayer('result').setVisible(false);


			if (this.game.settings.music === true) {
				this.game.jukebox.play('music', true);
			}


			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			if (this.game.settings.music === true) {
				this.game.jukebox.stop('music', true);
			}


			var logic = this.game.logic;
			if (logic !== null) {

				logic.leave();
				logic.unbind('fail');
				logic.unbind('update');
				logic.unbind('success');

			}


			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			var logic = this.game.logic;
			if (logic !== null) {
				logic.update(clock, delta);
			}


			lychee.game.State.prototype.update.call(this, clock, delta);

		},

		render: function(clock, delta) {

			var renderer = this.renderer;
			if (renderer !== null) {

				var layer;

				var env = renderer.getEnvironment();
				var offsetX = env.width / 2;
				var offsetY = env.height / 2;


				renderer.clear();


				var logic = this.game.logic;
				if (logic !== null) {
					logic.render(clock, delta);
				}


				layer = this.getLayer('ui');
				if (layer !== null && layer.visible === true) {

					var entities = layer.entities;
					for (var e = 0, el = entities.length; e < el; e++) {

						renderer.renderEntity(
							entities[e],
							offsetX,
							offsetY
						);

					}

				}


				layer = this.getLayer('result');
				if (layer !== null && layer.visible === true) {


					var entities = layer.entities;
					for (var e = 0, el = entities.length; e < el; e++) {

						renderer.renderEntity(
							entities[e],
							offsetX,
							offsetY
						);

					}

				}


				renderer.flush();

			}

		},

		processKey: function(key, name, delta) {

			var layer = this.getLayer('result');
			var logic = this.game.logic;

			if (layer.visible === true) {

				if (key === 'return') {

					if (this.__restart.visible === true) {

						this.leave();
						this.enter(this.__stagelevel);

					} else if (this.__continue.visible === true) {

						var stglvl = parseInt(this.__stagelevel.substr(-1), 10);

						this.leave();
						this.enter('stage' + (stglvl + 1));

					}

				} else if (key === 'escape') {

					this.game.changeState('menu');

				}

			} else if (logic !== null) {

				logic.key(key);

			}

		},

		processSwipe: function(id, type, position, delta, swipe) {

			// Ignore swipe events

		},

		processTouch: function(id, position, delta) {

			var renderer = this.renderer;
			if (renderer !== null) {

				var env = renderer.getEnvironment();

				position.x -= env.width / 2;
				position.y -= env.height / 2;

			}


			var layer = this.getLayer('result');
			var logic = this.game.logic;

			if (layer.visible === true) {

				if (position.x > 64) {

					if (this.__restart.visible === true) {

						this.leave();
						this.enter(this.__stagelevel);

					} else if (this.__continue.visible === true) {

						var stglvl = parseInt(this.__stagelevel.substr(-1), 10);

						this.leave();
						this.enter('stage' + (stglvl + 1));

					}

				} else if (position.x < -64) {

					this.game.changeState('menu');

				}

			} else if (logic !== null) {

				logic.touch(position);

			}

		},



		/*
		 * CUSTOM API
		 */

		__updateStatistics: function(data) {

			var blob = [
				data.destroyed + '',
				data.missed + '',
				((data.destroyed / (data.destroyed + data.missed) * 100) + '').substr(0, 5) + '%'
			];

			var length = 0;
			for (var b = 0; b < blob.length; b++) {
				length = Math.max(blob[b].length, length);
			}


			for (var b = 0; b < blob.length; b++) {
				for (var l = blob[b].length; l <= length; l++) {
					blob[b] = ' ' + blob[b];
				}
			}


			var dest = this.__destroyed;
			var miss = this.__missed;
			var rate = this.__rating;

			dest.setLabel('Destroyed: ' + blob[0]);
			miss.setLabel('Missed:    ' + blob[1]);
			rate.setLabel('Result:    ' + blob[2]);

		}

	};


	return Class;

});
