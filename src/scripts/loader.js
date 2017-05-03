/*
* @file loader
* @author lai_lc
* @date   2017-05-03 10:38:45
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-03 18:20:03
*/

'use strict';

var lc = lc || {};

lc.LoaderBase = lc.Class.extend({

	times: 5,

	init: function() {
		
	},

	load: function(url, callback, onError) {
		var _this = this;

		var data = lc.Cache.get(url);
		if (data) {
			callback && callback(cached);
			return data;
		}

		_this.tryLoad(url, callback, onError, times);
	},

	tryLoad: function(url, callback, onError, times) {


	}
});

lc.ImageLoader = lc.LoaderBase.extend({
	init: function() {
		var _this = this;
		_this._super();
	},

	tryLoad: function(url, callback, onError, times) {
		var _this = this;
		var image = new Image();

		image.addEventListener('load', function() {
			lc.Cache.add(url, this);
			callback && callback(this);
		}, false);

		image.addEventListener('error', function() {
			if (times < _this.times) {
				_this.tryLoad(url, callback, onError, times++)
			} else {
				onError && onError(event);
				callback && callback();
			}
		}, false);

		image.src = url;
	}
});

lc.ScriptLoader = lc.LoaderBase.extend({
	init: function() {
		var _this = this;
		_this._super();
	},

	tryLoad: function(url, callback, onError, times) {
		var _this = this,
			script = document.createElement("script"),
			loadFunc = null,
			errorFunc = null;

		loadFunc = function(event) {
			lc.Cache.add(url, true);
			callback && callback(this);
			script.parentNode && script.parentNode.removeChild(script);

			script.removeEventListener('load', loadFunc, false);
			script.removeEventListener('error', errorFunc, false);
		};

		errorFunc = function(event) {
			script.parentNode && script.parentNode.removeChild(script);

			script.removeEventListener('load', loadFunc, false);
			script.removeEventListener('error', errorFunc, false);

			if (times < _this.times) {
				_this.tryLoad(url, callback, onError, times++);
			} else {
				onError && onError(event);
				callback && callback();
			}


		};

		script.addEventListener('load', loadFunc, false);
		script.addEventListener('error', errorFunc, false);

		script.src = url;
		document.body.appendChild(script);
	}

});

lc.imageLoaderInstance = new lc.ImageLoader();
lc.scriptLoaderInstance = new lc.ScriptLoader();

lc.Loader = {

	loaders: {
		'image': lc.imageLoaderInstance,
		'script': lc.scriptLoaderInstance
	}

	load: function(urls, callback) {

	}
}