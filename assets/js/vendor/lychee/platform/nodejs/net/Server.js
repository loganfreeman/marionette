
lychee.define('lychee.net.Server').tags({
	platform: 'nodejs'
}).requires([
	'lychee.net.Remote'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	var http   = require('http');
	var crypto = require('crypto');



	/*
	 * HELPERS
	 */

	var _get_websocket_headers = function(httpheaders) {

		var wsheaders = {
			host:    httpheaders.host,
			origin:  httpheaders.origin || null,
			version: +httpheaders.version || 0
		};


		for (var prop in httpheaders) {

			if (prop.substr(0, 14) === 'sec-websocket-') {
				wsheaders[prop.substr(14)] = httpheaders[prop];
			}

		}


		if (wsheaders.version) {
			return wsheaders;
		}


		return null;

	};

	var _get_websocket_handshake = function(request) {

		var headers = _get_websocket_headers(request.headers);
		if (headers !== null && headers.origin !== null) {

			var sha1 = crypto.createHash('sha1');
			sha1.update(headers.key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');


			// HEAD
			var handshake = '';
			handshake += 'HTTP/1.1 101 WebSocket Protocol Handshake\r\n';
			handshake += 'Upgrade: WebSocket\r\n';
			handshake += 'Connection: Upgrade\r\n';

			handshake += 'Sec-WebSocket-Version: ' + headers.version       + '\r\n';
			handshake += 'Sec-WebSocket-Origin: '  + headers.origin        + '\r\n';
			handshake += 'Sec-WebSocket-Accept: '  + sha1.digest('base64') + '\r\n';


			// BODY
			handshake += '\r\n';


			return handshake;

		}


		return null;

	};

	var _upgrade_to_websocket = function(request, socket, head) {

		// 1. Validate Upgrade Request
		var reqheaders = request.headers;
		if (
			!(
				request.method === 'GET'
				&& typeof reqheaders.upgrade !== 'undefined'
				&& typeof reqheaders.connection !== 'undefined'
				&& reqheaders.upgrade.toLowerCase() === 'websocket'
				&& reqheaders.connection.toLowerCase().indexOf('upgrade') !== -1
			)
		) {

			return false;

		}


		// 2. Handshake
		var handshake = _get_websocket_handshake(request);
		if (handshake !== null) {

			socket.write(handshake, 'ascii');
			socket.setTimeout(0);
			socket.setNoDelay(true);
			socket.setKeepAlive(true, 0);
			socket.removeAllListeners('timeout');

			this.connect(new lychee.net.Remote(
				this, socket, this.__maxFrameSize,
				this.__encoder, this.__decoder
			));


			return true;

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(encoder, decoder) {

		encoder = encoder instanceof Function ? encoder : function(msg) { return msg; };
		decoder = decoder instanceof Function ? decoder : function(msg) { return msg; };


		this.__encoder = encoder;
		this.__decoder = decoder;

		this.__server       = null;
		this.__maxFrameSize = 32768;
		this.__remotes      = [];


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		listen: function(port, host) {

			port = typeof port === 'number' ? port : 1337;
			host = typeof host === 'string' ? host : null;


			if (lychee.debug === true) {
				console.log('lychee.net.Server: Listening on ' + host + ':' + port);
			}


			var that = this;

			try {

				this.__server = new http.Server();
				this.__server.on('upgrade', function(request, socket, headers) {

					if (_upgrade_to_websocket.call(that, request, socket, headers) === false) {
						socket.end();
						socket.destroy();
					}

				});
				this.__server.listen(port, host);

			} catch(e) {

				if (lychee.debug === true) {
					console.error(e);
				}

				return false;

			}


			return true;

		},



		/*
		 * REMOTE INTEGRATION API
		 */

		connect: function(remote) {

			var found = false;
			for (var r = 0, rl = this.__remotes.length; r < rl; r++) {

				if (this.__remotes[r] === remote) {
					found = true;
					break;
				}

			}


			if (found === false) {

				if (lychee.debug === true) {
					console.log('lychee.net.Server: Connected lychee.Remote (' + remote.id + ')');
				}

				this.__remotes.push(remote);
				this.trigger('connect', [ remote ]);

			}

		},

		disconnect: function(remote) {

			var found = false;
			for (var r = 0, rl = this.__remotes.length; r < rl; r++) {

				if (this.__remotes[r] === remote) {
					found = true;
					this.__remotes.splice(r, 1);
					rl--;
				}

			}


			if (found === true) {

				if (lychee.debug === true) {
					console.log('lychee.net.Server: Disconnected lychee.Remote (' + remote.id + ')');
				}

				this.trigger('disconnect', [ remote ]);

			}

		}

	};


	return Class;

});

