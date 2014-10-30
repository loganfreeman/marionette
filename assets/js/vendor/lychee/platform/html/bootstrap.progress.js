
(function(lychee, global) {

	var _bar      = null;
	var _progress = null;
	var _message  = null;

	if (
		typeof global.document !== 'undefined'
		&& typeof global.document.addEventListener === 'function'
	) {

		var _bar = global.document.createElement('div');
		_bar.id = 'bootstrap-progress-bar';

		var _progress = global.document.createElement('div');
		_progress.id = 'bootstrap-progress-progress';

		var _message = global.document.createElement('div');
		_message.id = 'bootstrap-progress-message';

		_bar.appendChild(_progress);
		_bar.appendChild(_message);


		global.document.addEventListener("DOMContentLoaded", function() {
			global.document.body.appendChild(_bar);
		}, false);

	}

	var _count = function(obj) {

		var count = 0;
		for (var o in obj) {
			if (obj[o] === true) count++;
		}

		return count;

	};


	lychee.Preloader.prototype._progress = function(url, _cache) {

		// called inside lychee.build()
		if (url === null && _cache === null) {

			if (_bar.parentNode !== null) {
				_bar.parentNode.removeChild(_bar);
			}

			return;

		}


		var ready      = Object.keys(_cache).length;
		var loading    = _count(this.__pending);
		var percentage = (ready / (ready + loading) * 100) | 0;

		if (_progress !== null) {
			_progress.style.width = percentage + '%';
		}

		if (_message !== null) {
			_message.innerHTML = url + ' (' + loading + ' left)';
		}

	};

})(lychee, this);

