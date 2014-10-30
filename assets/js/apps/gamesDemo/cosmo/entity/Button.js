
lychee.define('game.entity.Button').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"];


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.label   = null;
		this.font    = null;
		this.visible = true;

		this.__labelwidth  = 0;
		this.__labelheight = 0;


		this.setFont(settings.font);
		this.setLabel(settings.label);
		this.setVisible(settings.visible);

		delete settings.font;
		delete settings.label;
		delete settings.visible;


		settings.texture = _texture;
		settings.map     = _config.map;
		settings.states  = _config.states;

		settings.collision = lychee.game.Entity.COLLISION.none;
		settings.shape     = lychee.game.Entity.SHAPE.rectangle;


		lychee.game.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var texture = this.texture;
			var map   = this.getMap();
			if (
				   texture !== null
				&& map !== null
			) {

				var position = this.position;

				var x1 = position.x + offsetX - map.w / 2;
				var y1 = position.y + offsetY - map.h / 2;


				renderer.drawSprite(
					x1,
					y1,
					texture,
					map
				);


				var label = this.label;
				var font  = this.font;
				if (label !== null && font !== null) {

					var x = position.x + offsetX;
					x += map.w / 2;
					x -= (map.w / 2) - (this.__labelwidth / 2) / 2;

					var y = position.y + offsetY;


					renderer.drawText(
						x,
						y,
						label,
						font,
						true
					);

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				if (this.label !== null) {
					this.setLabel(this.label);
				}


				return true;

			}


			return false;

		},

		setLabel: function(label) {

			label = typeof label === 'string' ? label : null;


			if (label !== null) {

				var font = this.font;
				if (font !== null) {

					var width   = 0;
					var height  = 0;
					var kerning = font.kerning;

					for (var l = 0, ll = label.length; l < ll; l++) {
						var chr = font.get(label[l]);
						width += chr.real + kerning;
						height = Math.max(height, chr.height);
					}

					this.__labelwidth  = width;
					this.__labelheight = height;

				}

				this.label = label;


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

