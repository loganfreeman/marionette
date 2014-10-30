
lychee.define('lychee.net.Remote').tags({
	platform: 'nodejs'
}).requires([
	'lychee.net.Protocol'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	var _protocol = lychee.net.Protocol;



	/*
	 * HELPERS
	 */

	var _receive_handler = function(blob, isBinary) {

		var data = null;
		try {
			data = this.__decoder(blob);
		} catch(e) {
			// Unsupported data encoding
			return false;
		}


		if (
			data instanceof Object
			&& typeof data._serviceId === 'string'
		) {

			var service = _get_service_by_id.call(this, data._serviceId);
			var method  = data._serviceMethod || null;

			if (
				service !== null
				&& method !== null
				&& method.charAt(0) !== '@'
			) {

				if (
					   typeof service.trigger === 'function'
					|| typeof service[method] === 'function'
				) {

					// Remove data frame service header
					delete data._serviceId;
					delete data._serviceMethod;


					if (typeof service.trigger === 'function') {
						service.trigger(method, [ data ]);
					}

					if (typeof service[method] === 'function') {
						service[method](data);
					}

				}

			} else if (method.charAt(0) === '@') {

				if (method === '@plug') {
					_plug_service.call(this, data._serviceId, service);
				} else if (method === '@unplug') {
					_unplug_service.call(this, data._serviceId, service);
				}

			}

		} else {

			this.trigger('receive', [ data ]);

		}


		return true;

	};

	var _get_service_by_id = function(id) {

		for (var s = 0, sl = this.__services.length; s < sl; s++) {

			var service = this.__services[s];
			if (service.getId() === id) {
				return service;
			}

		}


		return null;

	};

	var _plug_service = function(id, service) {

		id = typeof id === 'string' ? id : null;


		if (
			   id === null
			|| service !== null
		) {
			return;
		}


		var construct = lychee.net.remote[id];
		if (typeof construct === 'function') {

			service = new construct();
			this.__services.push(service);


			if (lychee.debug === true) {
				console.log('lychee.net.Remote: Plugged in Service (' + id + ')');
			}

			if (typeof service.plug === 'function') {
				service.plug(this);
			}


			// Okay, Client, plugged Service! PONG
			this.send({}, {
				id: service.getId(),
				method: '@plug'
			});

		} else {

			if (lychee.debug === true) {
				console.log('lychee.net.Remote: Unplugged Service (' + id + ')');
			}

			if (typeof service.unplug === 'function') {
				service.unplug();
			}


			// Nope, Client, unplug invalid Service! PONG
			this.send({}, {
				id: id,
				method: '@unplug'
			});

		}

	};

	var _unplug_service = function(id, service) {

		id = typeof id === 'string' ? id : null;


		if (
			   id === null
			|| service === null
		) {
			return;
		}


		var found = false;

		for (var s = 0, sl = this.__services.length; s < sl; s++) {

			if (this.__services[s].getId() === id) {
				this.__services.splice(s, 1);
				found = true;
				sl--;
			}

		}


		if (lychee.debug === true) {
			console.log('lychee.net.Remote: Unplugged Service (' + id + ')');
		}


		if (found === true) {

			if (typeof service.unplug === 'function') {
				service.unplug();
			}

			this.send({}, {
				id: id,
				method: '@unplug'
			});

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(server, socket, maxFrameSize, encoder, decoder) {

		encoder = encoder instanceof Function ? encoder : function(blob) { return blob; };
		decoder = decoder instanceof Function ? decoder : function(blob) { return blob; };


		this.id       = socket.remoteAddress + ':' + socket.remotePort;
		this.version  = _protocol.VERSION;
		this.waiting  = true;

		this.__server    = server;
		this.__encoder   = encoder;
		this.__decoder   = decoder;
		this.__socket    = socket;
		this.__services  = [];


		lychee.event.Emitter.call(this);

		settings = null;


		var that = this;

		this.__protocol = new _protocol(socket, maxFrameSize, function(closedByRemote) {

			that.__socket.end();
			that.__socket.destroy();
			that.__server.disconnect(that);


			for (var s = 0, sl = that.__services.length; s < sl; s++) {

				var service = that.__services[s];

				if (typeof service.unplug === 'function') {
					service.unplug();
				}

				that.__services.splice(s, 1);
				sl--;

			}

		});

		this.__socket.on('data', function(data) {
			that.__protocol.read(data, _receive_handler, that);
		});

		this.__socket.on('error', function(err) {
			that.__protocol.close();
		});

		this.__socket.on('end', function() {
			that.__protocol.close(true);
		});

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		accept: function() {

			if (this.waiting === true) {

				this.waiting = false;

				return true;

			}


			return false;

		},

		reject: function(reason) {

			if (this.waiting === true) {

				this.__protocol.close(false, reason);
				this.waiting = false;

				return true;

			}


			return false;

		},

		send: function(data, service) {

			if (data instanceof Object) {

				if (service instanceof Object) {
					data._serviceId     = service.id || null;
					data._serviceMethod = service.method || null;
				}

			}


			var blob = this.__encoder(data);
			this.__protocol.write(blob);

		},

		disconnect: function(reason) {

			if (this.__protocol.isConnected() === true) {
				return this.__protocol.close(false, reason);
			}


			return false;

		}

	};


	return Class;

});

