
lychee.define('game.state.Menu').requires([
	'game.entity.Background',
	'game.entity.lycheeJS',
	'lychee.ui.Layer',
	'lychee.ui.Button'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(game) {

		lychee.game.State.call(this, game);


		this.__background = null;
		this.__cache = {
			x: 0, y: 0
		};


		this.reset();

	};


	Class.prototype = {

		reset: function() {

			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var width  = renderer.getEnvironment().width;
				var height = renderer.getEnvironment().height;


				this.__background = new game.entity.Background({
					width:  width,
					height: height
				});


				this.removeLayer('ui');


				var layer = new lychee.game.Layer();


				var root = new lychee.ui.Layer({
					width:  width * 3,
					height: height,
					scrollable: true,
					position: {
						x: 0,
						y: 0
					}
				});

				layer.addEntity(root);



				/*
				 * WELCOME MENU
				 */

				var welcome = new lychee.ui.Layer({
					width:  width,
					height: height,
					scrollable: false,
					position: {
						x: 0,
						y: 0
					}
				});

				root.addEntity(welcome);


				entity = new lychee.ui.Button({
					label: this.game.settings.title,
					font:  this.game.fonts.headline,
					position: {
						x: 0,
						y: -1 * height / 2 + 64
					}
				});

				welcome.addEntity(entity);


				entity = new game.entity.lycheeJS({
					position: {
						x: 0,
						y: height / 2 - 32
					}
				});

				welcome.addEntity(entity);


				entity = new lychee.ui.Button({
					label: 'New Game',
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: -24
					}
				});

				entity.bind('touch', function() {
					this.game.changeState('game');
				}, this);

				welcome.addEntity(entity);


				entity = new lychee.ui.Button({
					label: 'Settings',
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: 24
					}
				});

				entity.bind('touch', function() {

					var position = this.__cache;

					position.x = -1 * width;
					position.y = 0;

					root.setPosition(position);

				}, this);

				welcome.addEntity(entity);



				/*
				 * SETTINGS MENU
				 */

				var settings = new lychee.ui.Layer({
					width:  width,
					height: height,
					scrollable: false,
					position: {
						x: width,
						y: 0
					}
				});

				root.addEntity(settings);


				entity = new lychee.ui.Button({
					label: 'Settings',
					font:  this.game.fonts.headline,
					position: {
						x: 0,
						y: -1 * height / 2 + 64
					}
				});

				entity.bind('touch', function() {

					var position = this.__cache;

					position.x = 0;
					position.y = 0;

					root.setPosition(position);

				}, this);

				settings.addEntity(entity);


				entity = new game.entity.lycheeJS({
					position: {
						x: 0,
						y: height / 2 - 32
					}
				});

				settings.addEntity(entity);


				entity = new lychee.ui.Button({
					label: 'Fullscreen: ' + ((this.game.settings.fullscreen === true) ? ' On': 'Off'),
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: -24
					}
				});

				entity.bind('#touch', function(entity) {

					var s = this.game.settings;
					s.fullscreen = !s.fullscreen;

					entity.setLabel('Fullscreen: ' + ((s.fullscreen === true) ? ' On': 'Off'));

					this.game.reset(true);

				}, this);

				settings.addEntity(entity);


				entity = new lychee.ui.Button({
					label: 'Music:      ' + ((this.game.settings.music === true) ? ' On': 'Off'),
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: 24
					}
				});

				entity.bind('#touch', function(entity) {

					var s = this.game.settings;
					s.music = !s.music;

					entity.setLabel('Music:      ' + ((s.music === true) ? ' On': 'Off'));

				}, this);

				settings.addEntity(entity);


				entity = new lychee.ui.Button({
					label: 'Sound:      ' + ((this.game.settings.sound === true) ? ' On': 'Off'),
					font:  this.game.fonts.normal,
					position: {
						x: 0,
						y: 72
					}
				});

				entity.bind('#touch', function(entity) {

					var s = this.game.settings;
					s.sound = !s.sound;

					entity.setLabel('Sound:      ' + ((s.sound === true) ? ' On': 'Off'));

				}, this);

				settings.addEntity(entity);


				this.setLayer('ui', layer);

			}

		},

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);


			var background = this.__background;
			if (background !== null) {

				var origin = background.origin;

				background.setOrigin({
					y: origin.y + 10 * (delta / 1000)
				});

			}

		},

		render: function(clock, delta) {

			var renderer = this.renderer;
			if (renderer !== null) {

				renderer.clear();

				var background = this.__background;
				if (background !== null) {

					var env = renderer.getEnvironment();

					var offsetX = env.width / 2;
					var offsetY = env.height / 2;

					background.render(
						renderer,
						offsetX,
						offsetY
					);

				}

				lychee.game.State.prototype.render.call(this, clock, delta, true);

				renderer.flush();

			}

		}

	};


	return Class;

});
