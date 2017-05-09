/*
* @file loader
* @author lai_lc
* @date   2017-05-03 10:38:45
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-09 10:17:18
*/

'use strict';

var lc = lc || {};

lc.LoaderBase = lc.Class.extend({

	times: 5,

	ctor: function() {
		
	},

	load: function(url, callback, onError) {
		var _this = this;

		var data = lc.Cache.get(url);
		if (data) {
			callback && callback(cached);
			return data;
		}

		_this.tryLoad(url, callback, onError, 0);
	},

	tryLoad: function(url, callback, onError, times) {


	}
});

lc.ImageLoader = lc.LoaderBase.extend({
	ctor: function() {
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
			}
		}, false);

		image.src = url;
	}
});

lc.imageLoaderInstance = new lc.ImageLoader();

lc.ScriptLoader = lc.LoaderBase.extend({
	ctor: function() {
		var _this = this;
		_this._super();
	},

	tryLoad: function(url, callback, onError, times) {
		var _this = this,
			script = document.createElement("script"),
			loadFunc = null,
			errorFunc = null;
			script.async = false;

		loadFunc = function() {
			lc.Cache.add(url, true);
			callback && callback(this);
			script.parentNode && script.parentNode.removeChild(script);

			script.removeEventListener('load', loadFunc, false);
			script.removeEventListener('error', errorFunc, false);
		};

		errorFunc = function() {
			script.parentNode && script.parentNode.removeChild(script);

			script.removeEventListener('load', loadFunc, false);
			script.removeEventListener('error', errorFunc, false);

			if (times < _this.times) {
				_this.tryLoad(url, callback, onError, times++);
			} else {
				onError && onError(event);
			}

		};

		script.addEventListener('load', loadFunc, false);
		script.addEventListener('error', errorFunc, false);

		script.src = url;
		document.body.appendChild(script);
	}

});

lc.scriptLoaderInstance = new lc.ScriptLoader();

lc.audioLoader  = lc.LoaderBase.extend({
	ctor: function() {
		var _this = this;
		_this._super();
	},

	tryLoad: function(url, callback, onError, time) {
		var _this = this;
		var timer = null;
		var audio = Audio? new Audio(""): document.createElement("audio");
		
		var loadFunc = function() {
			timer && window.clearTimeout(timer);
			lc.Cache.add(url, true);
			callback && callback(this);
			removeEvent();
		}

		var errorFunc = function() {
			onError && onError(event);
			removeEvent();
		}

		var removeEvent = function() {
			audio.removeEventListener('loadedmetadata', loadFunc, false);
			audio.removeEventListener('error', errorFunc, false);
		}

		timer = setTimeout(function() {
			console.log("load:" + url + " time out.");
			onError && onError(event);
			removeEvent();
		}, 30000);

		audio.addEventListener("loadedmetadata", loadFunc, false);
		audio.addEventListener("error", errorFunc, false);

		audio.src = url;
	}
});

lc.audioLoaderInstance = new lc.audioLoader();

lc.Loader = {

	//保存支持下载类型的实例
	loaders: {
		'image': lc.imageLoaderInstance,
		'script': lc.scriptLoaderInstance,
		'audio': lc.audioLoaderInstance
	},

	load: function(urls, callback) {
		var _this = this;
		var count = 0;
		var loadFinish = function(obj) {
			count++;
			if (count >= urls.length) {
				callback && callback();
			}
		};
		var errorFunc = function(error) {
			error && console.log(error);
			count++;
			if (count >= urls.length) {
				callback && callback();
			}
		};
		for (var index = 0; index < urls.length; index++) {
			var one = urls[index];
			var loadInstance = _this.loaders[one.type];
			if (loadInstance) {
				loadInstance.load(one.url, loadFinish, errorFunc);
			}
		}
	}
}