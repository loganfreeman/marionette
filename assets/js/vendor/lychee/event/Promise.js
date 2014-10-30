
lychee.define('lychee.event.Promise').exports(function(lychee, global) {

	var Class = function(callback, scope) {

		callback = callback instanceof Function ? callback : null;
		scope    = scope !== undefined          ? scope    : this;


		this.__callback  = callback;
		this.__scope     = scope;

		this.__onresolve = null;
		this.__onreject  = null;
		this.__onscope   = null;

	};


	Class.prototype = {

		then: function(onresolve, onreject, scope) {

			onresolve = onresolve instanceof Function ? onresolve : null;
			onreject  = onreject instanceof Function  ? onreject  : null;
			scope     = scope !== undefined           ? scope     : this;


			this.__onresolve = onresolve;
			this.__onreject  = onreject;
			this.__onscope   = scope;


			return this;

		},

		resolve: function(data) {

			if (this.__onresolve !== null) {
				this.__onresolve.call(this.__onscope, data);
				return true;
			}


			return false;

		},

		reject: function(error) {

			if (this.__onreject !== null) {
				this.__onreject.call(this.__onscope, error);
				return true;
			}


			return false;

		},

		done: function() {

			if (this.__callback !== null) {
				this.__callback.call(this.__scope, this);
			}

		}

	};


	return Class;

});

