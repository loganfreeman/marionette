
lychee.define('lychee.event.Emitter').exports(function(lychee, global) {

	var Class = function() {

		this.___emitterId = null;
		this.___events    = {};

	};


	Class.prototype = {

		getEmitterId: function() {
			return this.___emitterId;
		},

		setEmitterId: function(id) {

			id = typeof id === 'number' ? id : null;

			this.___emitterId = id;

		},

		bind: function(type, callback, scope, once) {

			type     = typeof type === 'string'     ? type     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;
			once     = once === true;


			if (type === null || callback === null) {
				return false;
			}


			var passAction = false;
			var passSelf   = false;

			if (type.charAt(0) === '@') {
				type = type.substr(1, type.length - 1);
				passAction = true;
			} else if (type.charAt(0) === '#') {
				type = type.substr(1, type.length - 1);
				passSelf = true;
			}


			if (this.___events[type] === undefined) {
				this.___events[type] = [];
			}


			this.___events[type].push({
				passAction: passAction,
				passSelf:   passSelf,
				callback:   callback,
				scope:      scope,
				once:       once
			});


			return true;

		},

		trigger: function(type, data) {

			type = typeof type === 'string' ? type : null;
			data = data instanceof Array    ? data : null;


			var args = data;

			if (this.___events[type] !== undefined) {

				for (var e = 0, el = this.___events[type].length; e < el; e++) {

					var entry = this.___events[type][e];

					if (entry.passAction === true) {

						if (data !== null) {
							args = [ type, this ];
							args.push.apply(args, data);
						} else {
							args = [ type, this ];
						}

					} else if (entry.passSelf === true) {

						if (data !== null) {
							args = [ this ];
							args.push.apply(args, data);
						} else {
							args = [ this ];
						}

					}


					entry.callback.apply(entry.scope, args);


					if (entry.once === true) {

						var result = this.unbind(type, entry.callback, entry.scope);
						if (result === true) {
							el--;
							e--;
						}

					}

				}


				return true;

			}


			return false;

		},

		unbind: function(type, callback, scope) {

			type     = typeof type === 'string'     ? type     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : null;


			if (this.___events[type] === undefined) {
				return true;
			}


			var found = false;

			for (var e = 0, el = this.___events[type].length; e < el; e++) {

				var entry = this.___events[type][e];

				if (
					(callback === null || entry.callback === callback)
					&& (scope === null || entry.scope === scope)
				) {

					found = true;

					this.___events[type].splice(e, 1);
					el--;

				}

			}


			return found;

		}

	};


	return Class;

});

