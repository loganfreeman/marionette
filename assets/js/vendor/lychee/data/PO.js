
lychee.define('lychee.data.PO').exports(function(lychee, global) {


	var _stream = function(buffer, mode) {

		this.__buffer  = [];
		this.__pointer = 0;
		this.__mode    = typeof mode === 'number' ? mode : null;

		if (typeof buffer === 'string') {
			this.__buffer = buffer.split('\n');
		}

	};

	_stream.MODE = {
		read:  0,
		write: 1
	};

	_stream.prototype = {

		buffer: function() {
			return this.__buffer.join('\n');
		},

		pointer: function() {
			return this.__pointer;
		},

		length: function() {
			return this.__buffer.length;
		},

		read: function() {

			var data = null;

			var l = this.__buffer.length;
			if (l > this.__pointer) {
				data = this.__buffer[this.__pointer];
			}

			this.__pointer++;

			return data;

		},

		write: function(buffer) {

			this.__buffer.push(buffer);
			this.__pointer++;

		},

		close: function() {
		}

	};



	/*
	 * ENCODER and DECODER
	 */

	var _token = function(id) {

		this.id          = id || null;
		this.id_plural   = null;
		this.translation = [];
		this.flags       = [];
		this.references  = [];

	};


	var _encode = function(stream, data) {
	};


	var _decode = function(stream) {

		var cache = [];

		var token      = new _token();
		var references = [];
		var flags      = [];


		var msgstrid = null;
		var mode     = null;

		/*
		 * Modes:
		 *
		 * 0 - nothing
		 * 1 - msgid
		 * 2 - msgid_plural
		 * 3 - msgstr
		 */

		while (stream.pointer() < stream.length()) {

			var tmp, tmp2;

			var line = stream.read();


			// 1. References
			if (line.substr(0, 2) === '#:') {

				mode = 0;


				tmp = line.substr(3);
				references.push(tmp);


			// 2. Flags
			} else if (line.substr(0, 2) === '#,') {

				mode = 0;


				tmp = line.substr(3).split(' ');
				for (var t = 0, tl = tmp.length; t < tl; t++) {
					flags.push(tmp[t]);
				}


			// 3. msgid or msgid_plural
			} else if (line.substr(0, 5) === 'msgid') {

				// Create token, msgid is before msgid_plural
				if (line.substr(0, 12) !== 'msgid_plural') {

					tmp = line.substr(6);
					if (
						tmp.charAt(0) === '"'
						&& tmp.charAt(tmp.length - 1) === '"'
					) {

						cache.push(token);

						token = new _token();

						token.id = tmp.substr(1, tmp.length - 2);
						token.references = references;
						token.flags = flags;

						references = [];
						flags = [];

						mode = 1;

					}

				} else {

					tmp = line.substr(13);
					if (
						tmp.charAt(0) === '"'
						&& tmp.charAt(tmp.length - 1) === '"'
					) {
						token.id_plural = tmp.substr(1, tmp.length - 2);
						mode = 2;
					}

				}


			// 4. msgstr[id]
			} else if (line.substr(0, 7) === 'msgstr[') {

				mode = 3;


				tmp = line.substr(6);
				if (tmp.match(/\[([0-9]+)\]/)) {

					tmp = line.split(/\[([0-9]+)\]/);
					tmp2 = parseInt(tmp[1], 10);
					if (!isNaN(tmp2)) {
						msgstrid = tmp2;
						token.translation[msgstrid] = tmp[2].substr(2, tmp[2].length - 3);
					}

				}


			} else if (line.substr(0, 6) === 'msgstr') {

				mode = 3;
				msgstrid = 0;


				tmp = line.substr(7);
				if (
					tmp.charAt(0) === '"'
					&& tmp.charAt(tmp.length - 1) === '"'
				) {
					token.translation[msgstrid] = tmp.substr(1, tmp.length - 2);
				}


			// Combine the strings together
			} else if (line.substr(0, 1) === '"') {

				tmp = line.substr(1, line.length - 2);


				// Append string to token.id
				if (mode === 1) {

					token.id += tmp;

				// Append string to token.plural_id
				} else if (mode === 2) {

					token.id_plural += tmp;

				// Append to last msgstrid
				} else if (mode === 3) {

					token.translation[msgstrid] += tmp;

				}

			}

		}


		// Add last token, remove first (dummy) token
		cache.push(token);
		cache.splice(0, 1);


		return cache;

	};



	/*
	 * PUBLIC API
	 */

	var Module = {};


	Module.encode = function(data) {

		var stream = new _stream('', _stream.MODE.write);

		_encode(stream, data);

		stream.close();

		return stream.buffer();

	};


	Module.decode = function(data) {

		var stream = new _stream(data, _stream.MODE.read);

		var value = _decode(stream);
		if (value === undefined) {
			return null;
		} else {
			return value;
		}

	};


	return Module;

});

