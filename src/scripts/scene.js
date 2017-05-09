/*
* @file scene
* @author lai_lc
* @date   2017-05-09 09:58:32
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-09 17:55:29
*/

'use strict';

var lc = lc || {};

/**
 * 游戏场景类，包含所有对象
 * @class
 * @name lc.Scene
 * @extends lc.Class
 */
lc.Scene = lc.Class.extend({

	/**
	 * obj type
	 * @type {String}
	 */
	objType: "scene",

	/**
	 * 场景中的所有对象
	 * @type {Array}
	 */
	children: null,

	/**
	 * 引擎场景
	 * @type {Object}
	 */
	engineScene: null,

	/**
	 * construct funciton
	 */
	ctor: function() {
		var _this = this;

		_this.children = [];

		_this.engineScene = new lc.EngineScene();
	},

	/**
	 * 添加子对象
	 * @param {Object} child 
	 */
	addChild: function(child) {
		var _this = this;

		if(child.parent !== null) {
			throw new Error('child already have a parent!');
			return;
		}

		child.parent = _this;
		
		_this.children.push(child);

		_this.engineScene.addChild(child.engineObject);
	},

	_traverseObject: function(object, tag) {
		var _this = this;
		if (object.tag = tag) {
			return object;
		} else if(object.children && object.children[0]) {
			for (var i = 0; i < object.length; i++) {
				var findObject = _this._traverseObject(object.children[i], key);
				if (findObject) {
					return findObject;
				}	
			}
		}
	},

	/**
	 * 通过tag找对象
	 * @param  {[String]} tag 标志
	 * @return {[Object]}     对象
	 */
	getChildByTag: function(tag) {
		var _this = this;
		var obj = _this._traverseObject(_this, tag);
		obj = obj? obj: null;
		return obj;
	},

	/**
	 * 回收内存数据
	 * @param  {Boolean} parentClear 回收engineScene数据
	 */
	clear: function(parentClear) {
		var _this = this;
		var len = _this.children.length;
		for (var i = len - 1; i >= 0; i--) {
			if (_this.children[i]) {
				_this.children[i].clear(true);
			}
		}
		_this.children.length = 0;

		if (parentClear) {
			_this.engineScene.cleanup();
		}

		parentClear = null;
	},

	/**
	 * 加载引擎场景
	 */
	run: function() {
		if (_this.engineScene) {
			_this.engineScene.run && _this.engineScene.run();
			console.log("scene run");
		}
	},

	/**
	 * 刷新每个对象
	 */
	update: function() {
		var _this = this;

		var children = _this.children,
			len 	 = children.length,
			child    = null;

		for (var i = len - 1; i >= 0; i--) {
			child = children[i];
			if (child) {
				child.update();
			}
		}
	},

	/**
	 * 传递事件
	 * @param  {Object} event 
	 */
	onEvent: function(event) {
		var _this = this;

		var children = _this.children,
			len 	 = children.length,
			child    = null;
		for (var i = len - 1; i >= 0; i--) {
			child = children[i];
			if (child && child.onEvent(event)) {
				break;
			}
		}
	}

});