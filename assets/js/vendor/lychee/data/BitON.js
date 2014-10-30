
lychee.define('lychee.data.BitON').exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var CHAR_TABLE = new Array(256);
	for (var c = 0; c < 256; c++) {
		CHAR_TABLE[c] = String.fromCharCode(c);
	}


	var MASK_TABLE = new Array(9);
	var POW_TABLE  = new Array(9);
	var RPOW_TABLE = new Array(9);
	for (var m = 0; m < 9; m++) {
		POW_TABLE[m]  = Math.pow(2, m) - 1;
		MASK_TABLE[m] = ~(POW_TABLE[m] ^ 0xff);
		RPOW_TABLE[m] = Math.pow(10, m);
	}


	var _resolve_constructor = function(identifier, scope) {

		var pointer = scope;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	var _stream = function(buffer, mode) {

		this.__buffer    = typeof buffer === 'string' ? buffer : '';
		this.__mode      = typeof mode === 'number' ? mode : null;

		this.__pointer   = 0;
		this.__value     = 0;
		this.__remaining = 8;
		this.__index     = 0;

		if (this.__mode === _stream.MODE.read) {
			this.__value = this.__buffer.charCodeAt(this.__index);
		}

	};

	_stream.MODE = {
		read:  0,
		write: 1
	};

	_stream.prototype = {

		buffer: function() {
			return this.__buffer;
		},

		pointer: function() {
			return this.__pointer;
		},

		length: function() {
			return this.__buffer.length * 8;
		},

		read: function(bits) {

 			var overflow = bits - this.__remaining;
			var captured = this.__remaining < bits ? this.__remaining : bits;
			var shift    = this.__remaining - captured;


			var buffer = (this.__value & MASK_TABLE[this.__remaining]) >> shift;


			this.__pointer   += captured;
			this.__remaining -= captured;


			if (this.__remaining === 0) {

				this.__value      = this.__buffer.charCodeAt(++this.__index);
				this.__remaining  = 8;

				if (overflow > 0) {
					buffer = buffer << overflow | ((this.__value & MASK_TABLE[this.__remaining]) >> (8 - overflow));
					this.__remaining -= overflow;
				}

			}


			return buffer;

		},

		readRAW: function(bytes) {

			if (this.__remaining !== 8) {

				this.__index++;
				this.__value     = 0;
				this.__remaining = 8;

			}


			var buffer = '';

			if (this.__remaining === 8) {

				buffer        += this.__buffer.substr(this.__index, bytes);
				this.__index  += bytes;
				this.__value   = this.__buffer.charCodeAt(this.__index);

			}


			return buffer;

		},

		write: function(buffer, bits) {

			var overflow = bits - this.__remaining;
			var captured = this.__remaining < bits ? this.__remaining : bits;
			var shift    = this.__remaining - captured;


			if (overflow > 0) {
				this.__value += buffer >> overflow << shift;
			} else {
				this.__value += buffer << shift;
			}


			this.__pointer   += captured;
			this.__remaining -= captured;

			if (this.__remaining === 0) {

				this.__buffer    += CHAR_TABLE[this.__value];
				this.__remaining  = 8;
				this.__value      = 0;

				if (overflow > 0) {
					this.__value     += (buffer & POW_TABLE[overflow]) << (8 - overflow);
					this.__remaining -= overflow;
				}

			}

		},

		writeRAW: function(buffer) {

			if (this.__remaining !== 8) {

				this.__buffer   += CHAR_TABLE[this.__value];
				this.__value     = 0;
				this.__remaining = 8;

			}

			if (this.__remaining === 8) {

				this.__buffer  += buffer;
				this.__pointer += buffer.length * 8;

			}

		},

		close: function() {

			if (this.__mode === _stream.MODE.write) {

				if (this.__value > 0) {
					this.__buffer += CHAR_TABLE[this.__value];
					this.__value   = 0;
				}


				// 0: Boolean or Null or EOS
				this.write(0, 3);
				// 00: EOS
				this.write(0, 2);

			}

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	var _encode = function(stream, data) {

		// 0: Boolean or Null or EOS
		if (typeof data === 'boolean' || data === null) {

			stream.write(0, 3);

			if (data === null) {
				stream.write(1, 2);
			} else if (data === false) {
				stream.write(2, 2);
			} else if (data === true) {
				stream.write(3, 2);
			}


		// 1: Integer, 2: Float
		} else if (typeof data === 'number') {

			var type = data !== (data | 0) ? 2 : 1;

			stream.write(type, 3);


			// Negative value
			var sign = 0;
			if (data < 0) {
				data = -data;
				sign = 1;
			}


			// Float only: Calculate the integer value and remember the shift
			var shift = 0;

			if (type === 2) {

				var step = 10;
				var m    = data;
				var tmp  = 0;


				// Calculate the exponent and shift
				do {

					m     = data * step;
					step *= 10;
					tmp   = m | 0;
					shift++;

				} while (
					m - tmp > 1 / step
					&& shift < 8
				);


				step = tmp / 10;

				// Recorrect shift if we are > 0.5
				// and shift is too high
				if (step === (step | 0)) {
					tmp = step;
					shift--;
				}

				data = tmp;

			}



			if (data < 2) {

				stream.write(data, 4);

			} else if (data < 16) {

				stream.write(1, 3);
				stream.write(data, 4);

			} else if (data < 256) {

				stream.write(2, 3);
				stream.write(data, 8);

			} else if (data < 4096) {

				stream.write(3, 3);
				stream.write(data >>  8 & 0xff, 4);
				stream.write(data >>  0 & 0xff, 8);

			} else if (data < 65536) {

				stream.write(4, 3);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data >>  0 & 0xff, 8);

			} else if (value < 1048576) {

				stream.write(5, 3);
				stream.write(data >> 16 & 0xff, 4);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data >>  0 & 0xff, 8);

			} else if (value < 16777216) {

				stream.write(6, 3);
				stream.write(data >> 16 & 0xff, 8);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data >>  0 & 0xff, 8);

			} else {

				stream.write(7, 3);
				stream.write(data >> 24 & 0xff, 8);
				stream.write(data >> 16 & 0xff, 8);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data >>  0 & 0xff, 8);

			}



			stream.write(sign, 1);


			// Float only: Remember the shift for precision
			if (type === 2) {
				stream.write(shift, 4);
			}


		// 3: String
		} else if (typeof data === 'string') {

			stream.write(3, 3);


			var l = data.length;

			// Write Size Field
			if (l > 65535) {

				stream.write(31, 5);

				stream.write(l >> 24 & 0xff, 8);
				stream.write(l >> 16 & 0xff, 8);
				stream.write(l >>  8 & 0xff, 8);
				stream.write(l >>  0 & 0xff, 8);

			} else if (l > 255) {

				stream.write(30, 5);

				stream.write(l >> 8 & 0xff, 8);
				stream.write(l >> 0 & 0xff, 8);

			} else if (l > 28) {

				stream.write(29, 5);

				stream.write(l, 8);

			} else {

				stream.write(l, 5);

			}


			stream.writeRAW(data);


		// 4: Start of Array
		} else if (data instanceof Array) {

			stream.write(4, 3);


			for (var d = 0, dl = data.length; d < dl; d++) {
				stream.write(0, 3);
				_encode(stream, data[d]);
			}

			// Write EOO marker
			stream.write(7, 3);


		// 5: Start of Object
		} else if (
			data instanceof Object
			&& !data instanceof Function
		) {

			stream.write(5, 3);

			for (var prop in data) {

				if (data.hasOwnProperty(prop)) {
					stream.write(0, 3);
					_encode(stream, prop);
					_encode(stream, data[prop]);
				}

			}

			// Write EOO marker
			stream.write(7, 3);


		// 6: Custom High-Level Implementation
		} else if (typeof data.serialize === 'function') {

			stream.write(6, 3);

			_encode(stream, data.serialize());

			// Write EOO marker
			stream.write(7, 3);

		}

	};


	var _decode = function(stream) {

		var value = undefined;
		var tmp   = 0;

		if (stream.pointer() < stream.length()) {

			var type = stream.read(3);


			// 0: Boolean or Null (or EOS)
			if (type === 0) {

				tmp = stream.read(2);

				if (tmp === 1) {
					value = null;
				} else if (tmp === 2) {
					value = false;
				} else if (tmp === 3) {
					value = true;
				}


			// 1: Integer, 2: Float
			} else if (type === 1 || type === 2) {

				var tmp = stream.read(3);
				if (tmp === 0) {

					value = stream.read(1);

				} else if (tmp === 1) {

					value = stream.read(4);

				} else if (tmp === 2) {

					value = stream.read(8);

				} else if (tmp === 3) {

					value = (stream.read(4) <<  8)
						  + (stream.read(8) <<  0);

				} else if (tmp === 4) {

					value = (stream.read(8) <<  8)
						  + (stream.read(8) <<  0);

				} else if (tmp === 5) {

					value = (stream.read(4) << 16)
						  + (stream.read(8) <<  8)
						  + (stream.read(8) <<  0);

				} else if (tmp === 6) {

					value = (stream.read(8) << 16)
						  + (stream.read(8) <<  8)
						  + (stream.read(8) <<  0);

				} else if (tmp === 7) {

					value = (stream.read(8) << 24)
						  + (stream.read(8) << 16)
						  + (stream.read(8) <<  8)
						  + (stream.read(8) <<  0);

				}


				// Negative value
				var sign = stream.read(1);
				if (sign === 1) {
					value = -1 * value;
				}


				// Float only: Shift it back by the precision
				if (type === 2) {
					var shift = stream.read(4);
					value /= RPOW_TABLE[shift];
				}


			// 3: String
			} else if (type === 3) {

				var size = stream.read(5);

				if (size === 31) {

					size = (stream.read(8) << 24)
					     + (stream.read(8) << 16)
					     + (stream.read(8) <<  8)
					     + (stream.read(8) <<  0);

				} else if (size === 30) {

					size = (stream.read(8) <<  8)
					     + (stream.read(8) <<  0);

				} else if (size === 29) {

					size = stream.read(8);

				}


				value = stream.readRAW(size);


			// 4: Array
			} else if (type === 4) {

				value = [];


				var errors = 0;

				while (errors === 0) {

					var check = stream.read(3);
					if (check === 0) {

						var subvalue = _decode(stream);
						value.push(subvalue);

					} else if (check === 7) {
						break;
					} else {
						errors++;
					}

				}


			// 5: Object
			} else if (type === 5) {

				value = {};

				var errors = 0;

				while (errors === 0) {

					var check = stream.read(3);
					if (check === 0) {

						var prop     = _decode(stream);
						var subvalue = _decode(stream);

						value[prop] = subvalue;

					} else if (check === 7) {
						break;
					} else {
						errors++;
					}

				}

			// 6: Custom High-Level Implementation
			} else if (type === 6) {

				var data = _decode(stream);

				if (
					typeof data.constructor === 'string'
					&& data.arguments instanceof Array
				) {

					var construct = _resolve_constructor(data.constructor, global);
					if (typeof construct === 'function') {

						var bindargs = data.arguments;
						bindargs.reverse();
						bindargs.push(construct);
						bindargs.reverse();

						value = new (
							construct.bind.apply(
								construct,
								bindargs
							)
						)();

					}

				}


				var check = stream.read(3);
				if (check !== 7) {
					value = undefined;
				}

			}

		}


		return value;

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

