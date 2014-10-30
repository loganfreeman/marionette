
lychee.define('lychee.ui.Connector').exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _bind_connector = function() {

		var emitter = this.emitter;
		var event   = this.event;
		var entity  = this.entity;
		var method  = this.method;


		if (
			   emitter !== null
			&& event !== null
			&& entity !== null
			&& method !== null
		) {

			emitter.bind(event, entity[method], entity);

		}

	};

	var _unbind_connector = function() {

		var emitter = this.emitter;
		var event   = this.event;
		var entity  = this.entity;
		var method  = this.method;


		if (
			   emitter !== null
			&& event !== null
			&& entity !== null
			&& method !== null
		) {

			emitter.unbind(event, entity[method], entity);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.emitter = null;
		this.event   = null;
		this.entity  = null;
		this.method  = null;


		this.setEmitter(settings.emitter);
		this.setEvent(settings.event);
		this.setEntity(settings.entity);
		this.setMethod(settings.method);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var settings = {};

			if (this.event !== null)   settings.event   = this.event;
			if (this.emitter !== null) settings.emitter = this.emitter.serialize();
			if (this.entity !== null)  settings.entity  = this.entity.serialize();
			if (this.method !== null)  settings.method  = this.method;


			return {
				'constructor': 'lychee.ui.Connector',
				'arguments':   [ settings ]
			};

		},



		/*
		 * CUSTOM API
		 */

		setEmitter: function(emitter) {

			if (
				emitter instanceof Object
				&& typeof emitter.bind === 'function'
				&& typeof emitter.unbind === 'function'
				&& typeof emitter.serialize === 'function'
			) {

				_unbind_connector.call(this);

				this.emitter = emitter;

				_bind_connector.call(this);

				return true;

			}


			return false;

		},

		setEvent: function(event) {

			event = typeof event === 'string' ? event : null;


			if (event !== null) {

				_unbind_connector.call(this);

				this.event = event;

				_bind_connector.call(this);

				return true;

			}


			return false;

		},

		setEntity: function(entity) {

			if (
				entity instanceof Object
				&& typeof entity.serialize === 'function'
			) {

				_unbind_connector.call(this);

				this.entity = entity;

				_bind_connector.call(this);

				return true;

			}


			return false;

		},

		setMethod: function(method) {

			method = typeof method === 'string' ? method : null;


			var entity = this.entity;
			if (
				   entity !== null
				&& method !== null
				&& typeof entity[method] === 'function'
			) {

				_unbind_connector.call(this);

				this.method = method;

				_bind_connector.call(this);

				return true;

			}


			return false;

		}

	};


	return Class;

});

