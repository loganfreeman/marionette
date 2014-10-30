
(function(lychee, global) {

	var _font_id    = 0;
	var _texture_id = 0;


	var _parse_font_data = function(font, data) {

		if (data !== null) {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}


			for (var property in data) {

				if (property === 'texture') {

					var texture = new Texture(data[property]);
					texture.load();

					font.texture = texture;

				} else if (
					property !== 'map'
					&& font[property] !== undefined
				) {

					font[property] = data[property];

				}

			}


			if (data.map instanceof Array) {
				_parse_font_map(font, data.map);
			}

		} else {

			console.warn('FNT file at ' + font.url + ' is invalid.');

			if (font.__onload) {
				font.__onload();
			}

		}

	};

	var _parse_font_map = function(font, map) {

		if (map instanceof Array) {

			var offset = font.spacing;

			for (var c = 0, cl = font.charset.length; c < cl; c++) {

				var chr = {
					id:     font.charset[c],
					width:  map[c] + font.spacing * 2,
					height: font.lineheight,
					real:   map[c],
					x:      offset - font.spacing,
					y:      0
				};

				offset += chr.width;

				font.__buffer[chr.id] = chr;

			}

		}


		if (font.__onload) {
			font.__onload();
		}

	};


	var Font = function(url) {

		// Hint: default charset from 32 to 126

		this.url      = url;
		this.__id     = _font_id++;
		this.__buffer = {};

		this.baseline   = 0;
		this.charset    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		this.spacing    = 0;
		this.kerning    = 0;
		this.lineheight = 0;

	};

	Object.defineProperty(Font.prototype, 'texture', {

		get: function() {

			if (this.__texture != null) {
				return this.__texture.buffer || null;
			}


			return null;

		},

		set: function(texture) {

			if (texture instanceof Texture) {
				this.__texture = texture;
			}

		}

	});

	Object.defineProperty(Font.prototype, 'get', {

		value: function(chr) {
			return this.__buffer[chr] || null;
		},

		enumerable: true,
		writable: false,
		configurable: false

	});

	Object.defineProperty(Font.prototype, 'onload', {

		get: function() {
			return this.__onload || null;
		},

		set: function(callback) {
			this.__onload = callback;
		}

	});

	Object.defineProperty(Font.prototype, 'load', {

		value: function() {

			var that = this;

			var url = this.url;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');
			xhr.onreadystatechange = function() {

				if (xhr.readyState === 4) {

					var data = null;
					try {
						data = JSON.parse(xhr.responseText);
					} catch(e) {
					}

					_parse_font_data(that, data);

				}

			};

			xhr.send(null);

		},

		writable: false,
		enumerable: false,
		configurable: false

	});


	var Texture = function(url) {

		this.id     = _texture_id++;
		this.buffer = null;
		this.url    = url;
		this.width  = 0;
		this.height = 0;

	};

	Object.defineProperty(Texture.prototype, 'onload', {

		get: function() {
			return this.__onload || null;
		},

		set: function(callback) {
			this.__onload = callback;
		}

	});

	Object.defineProperty(Texture.prototype, 'load', {

		value: function() {

			var that = this;
			var img = new Image();
			img.onload = function() {
				that.width  = this.width;
				that.height = this.height;
				that.buffer = this;
				that.__onload && that.__onload();
			};
			img.src = this.url;

		},

		writable: false,
		enumerable: false,
		configurable: false

	});


	global.Font    = Font;
	global.Texture = Texture;


	lychee.Preloader.prototype._load = function(url, type, _cache) {

		var that = this;

		// 1. JavaScript
		if (type === 'js') {

			this.__pending[url] = true;

			var script = document.createElement('script');
			script.async = true;
			script.onload = function() {
				that.__pending[url] = false;
				_cache[url] = '';
				that._progress(url, _cache);
			};
			script.src = url;

			document.body.appendChild(script);


		// 2. JSON
		} else if (type === 'json') {

			this.__pending[url] = true;

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');
			xhr.onreadystatechange = function() {

				if (xhr.readyState === 4) {

					var data = null;
					try {
						data = JSON.parse(xhr.responseText);
					} catch(e) {
						console.warn('JSON file at ' + url + ' is invalid.');
					}


					that.__pending[url] = false;
					_cache[url] = data;
					that._progress(url, _cache);

				}

			};

			xhr.send(null);


		// 3. Textures
		} else if (type.match(/png/)) {

			this.__pending[url] = true;

			var texture = new Texture(url);
			texture.onload = function() {
				that.__pending[url] = false;
				_cache[url] = this;
				that._progress(url, _cache);
			};

			texture.load();


		// 4. Fonts
		} else if (type.match(/fnt/)) {

			this.__pending[url] = true;

			var font = new Font(url);
			font.onload = function() {
				that.__pending[url] = false;
				_cache[url] = this;
				that._progress(url, _cache);
			};

			font.load();


		// 5. CSS (won't affect JavaScript anyhow)
		} else if (type === 'css') {

			this.__pending[url] = false;
			_cache[url] = '';

			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = url;

			document.head.appendChild(link);


		// 6. Unknown File Types (will be loaded as text)
		} else {

			this.__pending[url] = true;

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onreadystatechange = function() {

				if (xhr.readyState === 4) {

					if (xhr.status === 200 || xhr.status === 304) {

						var data = xhr.responseText || xhr.responseXML || null;

						that.__pending[url] = false;
						_cache[url] = data;
						that._progress(url, _cache);

					} else {

						that.__pending[url] = false;
						_cache[url] = null;

					}

				}

			};

			xhr.send(null);

		}

	};

})(this.lychee, this);

