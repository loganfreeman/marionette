
(function(lychee, global) {

	lychee.Preloader.prototype._load = function(url, type, _cache) {

		var that = this;


		// 1. JavaScript
		if (type === 'js') {

			this.__pending[url] = true;

			var script = new Script(url);
			script.onload = function() {
				that.__pending[url] = false;
				_cache[url] = this.data;
			};

			script.load();
			script.execute();


		// 2. JSON
		} else if (type === 'json') {

			this.__pending[url] = true;

			var text = new Text(url);
			text.onload = function() {

				var raw = this.data;
				var data = null;
				try {
					data = JSON.parse(raw);
				} catch(e) {
					console.warn('JSON file at ' + url + ' is invalid.');
				}

				that.__pending[url] = false;
				_cache[url] = data;

			};

			text.load();


		// 3. Images
		} else if (type.match(/bmp|gif|jpg|jpeg|png/)) {

			this.__pending[url] = true;

			var texture = new Texture(url);
			texture.onload = function() {
				that.__pending[url] = false;
				_cache[url] = this;
			};

			texture.load();


		// 4. CSS (not required in V8GL)
		} else if (type === 'css') {

			this.__pending[url] = false;
			_cache[url] = '';


		// 5. Unknown File Types (will be loaded as text)
		} else {

			this.__pending[url] = true;

			var text = new Text(url);
			text.onload = function() {
				that.__pending[url] = false;
				_cache[url] = this.data;
			};

			text.load();

		}

	};

})(this.lychee, this);

