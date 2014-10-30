
lychee.define('lychee.net.Client').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (
		typeof WebSocket !== 'undefined'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

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

	var _is_service_waiting = function(service) {

		for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

			if (this.__services.waiting[w] === service) {
				return true;
			}

		}


		return false;

	};

	var _is_service_active = function(service) {

		for (var a = 0, al = this.__services.active.length; a < al; a++) {

			if (this.__services.active[a] === service) {
				return true;
			}

		}


		return false;

	};

	var _get_service_by_id = function(id) {

		var service;

		for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

			service = this.__services.waiting[w];
			if (service.getId() === id) {
				return service;
			}

		}

		for (var a = 0, al = this.__services.active.length; a < al; a++) {

			service = this.__services.active[a];
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
			|| service === null
		) {
			return;
		}


		var found = false;

		for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

			if (this.__services.waiting[w] === service) {
				this.__services.waiting.splice(w, 1);
				found = true;
				wl--;
			}

		}


		if (found === true) {

			if (lychee.debug === true) {
				console.log('lychee.net.Client: Remote plugged in Service (' + id + ')');
			}

			this.__services.active.push(service);
			service.init && service.init();

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


		for (var a = 0, al = this.__services.active.length; a < al; a++) {

			if (this.__services.active[a] === service) {
				this.__services.active.splice(a, 1);
				al--;
			}

		}


		if (lychee.debug === true) {
			console.log('lychee.net.Client: Remote unplugged Service (' + id + ')');
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(encoder, decoder) {

		encoder = encoder instanceof Function ? encoder : function(blob) { return blob; };
		decoder = decoder instanceof Function ? decoder : function(blob) { return blob; };


		this.__encoder = encoder;
		this.__decoder = decoder;
		this.__socket  = null;
		this.__services  = {
			waiting: [], // Waiting Services need to be verified from Remote
			active:  []  // Active Services for allowed interaction
		};

		this.__isBinary  = false;
		this.__isRunning = false;


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		listen: function(port, host) {

			port = typeof port === 'number' ? port : 1337;
			host = typeof host === 'string' ? host : 'localhost';


			if (this.__isRunning === true) {
				return false;
			}


			if (lychee.debug === true) {
				console.log('lychee.net.Client: Listening on ' + host + ':' + port);
			}


			var url = 'ws://' + host + ':' + port;

			this.__socket = new WebSocket(url);

			if (
				typeof ArrayBuffer !== 'undefined'
				&& typeof this.__socket.binaryType !== 'undefined'
			) {
				this.__socket.binaryType = 'arraybuffer';
				this.__isBinary = true;
			}


			var that = this;

			this.__socket.onopen = function() {

				that.__isRunning = true;
				that.trigger('connect');

			};


			this.__socket.onmessage = function(event) {

				var blob = null;
				if (
					that.__isBinary === true
					&& event.data instanceof ArrayBuffer
				) {

					var bytes = new Uint8Array(event.data);
					blob = String.fromCharCode.apply(null, bytes);

					_receive_handler.call(that, blob, true);

				} else {

					blob = event.data;

					_receive_handler.call(that, blob, false);

				}

			};


			// WebSocket Close frame is standardized,
			// no deserialization required.

			this.__socket.onclose = function(event) {

				that.__isRunning = false;
				that.trigger('disconnect', [ event.code, event.reason ]);

			};


			return true;

		},

		send: function(data, service) {

			data    = data instanceof Object    ? data    : null;
			service = service instanceof Object ? service : null;


			if (
				data === null
				|| this.__isRunning === false
			) {
				return false;
			}


			if (service !== null) {

				data._serviceId     = service.id     || null;
				data._serviceMethod = service.method || null;

			}


			var blob = this.__encoder(data);
			if (this.__isBinary === true) {

				var bl    = blob.length;
				var bytes = new Uint8Array(bl);

				for (var b = 0; b < bl; b++) {
					bytes[b] = blob.charCodeAt(b);
				}

				blob = bytes.buffer;

			}


			this.__socket.send(blob);


			return true;

		},

		disconnect: function() {

			if (this.__isRunning === true) {

				this.__socket.close();

				return true;

			}


			return false;

		},

		plug: function(service) {

			if (
				   _is_service_waiting.call(this, service) === false
				&& _is_service_active.call(this, service) === false
			) {

				this.__services.waiting.push(service);

				// Please, Remote, plug Service! PING
				this.send({}, {
					id: service.getId(),
					method: '@plug'
				});

				return true;

			}


			return false;

		},

		unplug: function(service) {

			if (
				   _is_service_waiting.call(this, service) === true
				|| _is_service_active.call(this, service) === true
			) {

				// Please, Remote, unplug Service! PING
				this.send({}, {
					id: service.getId(),
					method: '@unplug'
				});

				return true;

			}


			return false;

		}

	};


	return Class;

});

