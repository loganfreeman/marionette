
lychee.define('lychee.event.Bus').requires([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var _emitterId = 0;

	var _trigger_channel = function(type, root) {

		var id   = root.getEmitterId();
		var args = [].splice.call(arguments, 1);


		if (
			   this.__channels[type] !== undefined
			&& this.__channels[type][id] !== undefined
		) {

			for (var c = 1, cl = this.__channels[type][id].length; c < cl; c++) {

				var emitter = this.__channels[type][id][c];

				emitter.trigger(type, args);

			}

		}

	};



	var Class = function() {

		this.__channels = {};

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		addChannel: function(type, emitters) {

			type     = typeof type === 'string'                                      ? type     : null;
			emitters = Object.prototype.toString.call(emitters) === '[object Array]' ? emitters : null;

			if (type !== null && type.charAt(0) === '@') {
				return false;
			}


			if (type !== null && emitters !== null) {

				if (this.__channels[type] === undefined) {
					this.__channels[type] = {};
				}


				var channel = [];

				for (var e = 0, el = emitters.length; e < el; e++) {

					var emitter = emitters[e];

					if (
						   typeof emitter.bind === 'function'
						&& typeof emitter.unbind === 'function'
						&& typeof emitter.trigger === 'function'
					) {
						channel.push(emitter);
					}

				}


				if (channel.length > 0) {

					var root = channel[0];
					if (root.getEmitterId() === null) {
						root.setEmitterId(_emitterId++);
					}


					if (this.__channels[type][root.getEmitterId()] === undefined) {

						root.unbind('@' + type, _trigger_channel, this);
						root.bind('@' + type,   _trigger_channel, this);

						this.__channels[type][root.getEmitterId()] = channel;

						return true;

					}

				}

			}


			return false;

		},

		removeChannel: function(type, root) {

			type = typeof type === 'string'                ? type : null;
			root = typeof root.getEmitterId === 'function' ? root : null;

			if (
				   type !== null
				&& root !== null
				&& this.__channels[type] !== undefined
			) {

				var rootId = root.getEmitterId();
				if (this.__channels[type][rootId] !== undefined) {

					rootId.unbind('@' + type, _trigger_channel, this);
					delete this.__channels[type][rootId];

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

