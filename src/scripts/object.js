/*
* @file object
* @author lai_lc
* @date   2017-05-02 14:41:19
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-10 18:35:41
*/

'use strict';

var lc = lc || {};

/**
 * 游戏对象，包含所有组件
 * @type {Object}
 */
lc.Object = lc.Class.extend({
	
	/**
	 * 组件列表
	 * @type {Object}
	 */
	oComponents: null,

	/**
	 * 父对象
	 * @type {Object}
	 */
	oParent: null,

	/**
	 * 子对象列表
	 * @type {Array}
	 */
	aChildren: null,

	/**
	 * 标签
	 * @type {String}
	 */
	sTag: null,

	/**
	 * 引擎对象
	 * @type {Object}
	 */
	oEngineObject: null,

	/**
	 * 对象尺寸大小
	 * @type {Object}
	 */
	oSize: null,

	/**
	 * 锚点
	 * @type {Object}
	 */
	oAnchor: null,

	/**
	 *	缩放比例 
	 * @type {Object}
	 */
	oScale: null,

	/**
	 * 坐标点
	 * @type {Object}
	 */
	oPosition: null,

	/**
	 *  旋转
	 * @type {Number}
	 */
	nRotation: null,

	/**
	 * 倾斜
	 * @type {Object}
	 */
	oSkew: null,

	/**
	 * 透明度
	 * @type {Number}
	 */
	nAlpha: null,

	/**
	 * 可见
	 * @type {Boolean}
	 */
	bVisible: true,

	/**
	 * 翻转
	 * @type {Object}
	 */
	oFlip: null,

	/**
	 * 动作数组
	 * @type {Array}
	 */
	aTweens: null,

	/**
	 * 调度器数组
	 * @type {Array}
	 */
	aSchedules: null,

	/**
	 * 构造函数
	 */
	ctor: function() {
		var _this = this;

		_this.oComponents = {};
		_this.oEngineObject = new lc.EngineObject();
		_this.aChildren = [];
		_this.aTweens = [];
		_this.aSchedules = [];

		_this.oSize = {width: 0, height: 0};
		_this.oAnchor = {x: 0, y: 0};
		_this.oScale = {x: 0, y: 0};
		_this.oPosition = {x: 0, y: 0, z: 0};
		_this.nRotation = 0;
		_this.oFlip = {x: false, y: false};
		_this.oSkew = {x: 0, y: 0};
	},

	/**
	 * 设置对象宽高
	 * @param {Number} width  宽
	 * @param {Number} height 高
	 */
	setSize: function(width, height) {
		var _this = this;

		_this.oSize = {
			width: +width || _this.oSize.width,
			height: +height || _this.oSize.height
		}
	},

	/**
	 * 获取对象宽高
	 * @return {Object} 尺寸大小
	 */
	getSize: function() {
		return this.oSize;
	},

	/**
	 * 设置锚点
	 * @param {Number} x x轴
	 * @param {Number} y y轴
	 */
	setAnchor: function(x, y) {
		var _this = this;

		_this.oAnchor = {
			x: +x || _this.oAnchor.x,
			y: +y || _this.oAnchor.y
		}
	},

	/**
	 * 获取锚点
	 * @return {Object} 锚点信息
	 */
	getAnchor: function() {
		return this.oAnchor;
	},


	/**
	 * 设置缩放比例
	 * @param {Number} x 横向
	 * @param {Number} y 纵向
	 */
	setScale: function(x, y) {
		var _this = this;

		_this.oScale = {
			x: +x || _this.oScale.x,
			y: +y || _this.oScale.y
		}
	},

	/**
	 * 获取缩放比例
	 * @return {Object} 缩放信息
	 */
	getScale: function() {
		return this.oScale;
	},

	/**
	 * 设置坐标系
	 * @param {Number} x x轴坐标
	 * @param {Number} y y轴坐标
	 * @param {Number} z z轴坐标
	 */
	setPosition: function(x, y, z) {
		var _this = this;

		_this.oPosition = {
			x: +x || _this.oPosition.x,
			y: +y || _this.oPosition.y,
			z: +z || _this.oPosition.z
		}
	},

	/**
	 * 获取坐标系
	 * @return {Object} 坐标系
	 */
	getPosition: function() {
		return this.oPosition;
	},

	/**
	 * 设置旋转角度
	 * @param {number} value 度数
	 */
	setRotation: function(value) {
		var _this = this;
		
		_this.nRotation = +x || _this.nRotation;
	},

	/**
	 * 获取旋转角度
	 * @return {Number} 度数
	 */
	getRotation: function() {
		return this.nRotation;
	},

	/**
	 * 设置倾斜度
	 * @param {Number} x 横向
	 * @param {Number} y 纵向
	 */
	setSkew: function(x, y) {
		var _this = this;

		_this.oSkew = {
			x: +x || _this.oSkew.x,
			y: +y || _this.oSkew.y
		}
	},

	/**
	 * 获取倾斜度
	 * @return {Object} 倾斜信息
	 */
	getSkew: function() {
		return this.oSkew;
	},

	/**
	 * 设置透明度
	 * @param {Number} value 透明值
	 */
	setAlpha: function(value) {
		var _this = this;

		_this.nAlpha = +value || _this.nAlpha;
	},

	/**
	 * 获取透明度
	 * @return {Number} 透明值
	 */
	getAlpha: function() {
		return this.nAlpha;
	},

	/**
	 * 设置横向翻转
	 * @param {Boolean} bFlipX 是否横向翻转
	 */
	setFlipX: function(bFlipX) {
		var _this = this;
		
		_this.oFlip.x = bFlipX;
	},

	/**
	 * 获取是否横向翻转
	 * @return {Boolean} 真假
	 */
	getFilpX: function() {
		return this.oFlip.x;
	},

	/**
	 * 设置纵向翻转
	 * @param {Boolean} bFlipY 是否纵向翻转
	 */
	setFlipY: function(bFlipY) {
		var _this = this;
		
		_this.oFlip.y = bFlipY;
	},

	/**
	 * 获取是否纵向翻转
	 * @return {Boolean} 真假
	 */
	getFlipY: function() {
		return this.oFlip.y;
	},

	/**
	 * 设置是否显示
	 * @param {Boolean} bVisible 真假
	 */
	setVisible: function(bVisible) {
		var _this = this;

		_this.bVisible = bVisible;
	},

	/**
	 * 获取是否显示
	 * @return {Boolean} 真假
	 */
	getVisible: function() {
		return this.bVisible;
	},

	/**
	 * 设置z坐标
	 * @param {Number} nZOrder z坐标
	 */
	setZOrder: function(nZOrder) {
		var _this = this;

		_this.oPosition.z = nZOrder;
	},

	/**
	 * 获取z坐标
	 * @return {Number} z坐标
	 */
	getZOrder: function() {
		return this.oPosition.z;
	},

	/**
	 * 添加组件
	 * @param {String} key       键
	 * @param {Object} component 组件
	 */
	addComponet: function(key, component) {
		var _this = this;

		if (!_this.oComponents[key]) {
			_this.oComponents[key] = [];
		}

		_this.oComponents[key].push(component);

		component.gameObject = _this;
	},

	/**
	 * 删除组件
	 * @param  {Object} component 组件
	 */
	removeComponent: function(component) {
		var _this = this;

		for (var key in _this.oComponents) {
			if (_this.oComponents[key]) {
				for(var i = 0, len = _this.oComponents[key].length; i < len; i++) {
					if (_this.oComponents[key][i] && _this.oComponents[key][i] === component) {
						_this.oComponents[key].splice(i, 1);
						if (_this.oComponents[key].length === 0) {
							delete _this.oComponents[key];
						}
						component.gameObject = null;
						break;
					}
				}	
			}
		}			
	},

	/**
	 * 清空所有组件
	 */
	removeAllComponents: function() {
		var _this = this;

		for (var key in _this.oComponents) {
			if (_this.oComponents[key]) {
				for (var i = 0; i < _this.oComponents[key].length; i++) {
					if (_this.oComponents[key][i]) {
						_this.oComponents[key][i].clear();
					}
				}
				_this.oComponents[key].length = 0;
			}
 		}

 		_this.components = {};
	},

	/**
	 * 按键来删除组件
	 * @param  {String} key 键
	 */
	removeComponents: function(key) {
		var _this = this;
		if (_this.oComponents[key]) {
			for (var i = 0; i < _this.oComponents[key].length; i++) {
				if (_this.oComponents[key]) {
					_this.oComponents[key].splice(i, 1);
				}
			}
			delete _this.oComponents[key];
		}
	},

	/**
	 * 获取包含键的组件
	 * @param  {String} key 键
	 * @return {Array}      组件数据
	 */
	getComponents: function(key) {
		return this.oComponents[key] ||  [];
	},

	/**
	 * 获取所有组件
	 * @return {Objects} 组件列表
	 */
	getAllComponents: function() {
		return this.oComponents;
	},

	/**
	 * 设置标签
	 * @param {String} sTag 标签标识
	 */
	setTag: function(sTag) {
		var _this = this;

		_this.sTag = sTag;
	},

	/**
	 * 设置名称
	 * @param {String} sName 名称
	 */
	setName: function(sName) {
		var _this = this;

		_this.sName = sName;
	},

	/**
	 * 添加子对象
	 * @param {Object} child 对象
	 */
	addChild: function(child) {
		var _this = this;

		_this.aChildren.push(child);
		child.oParent = _this;
	},

	/**
	 * 删除所有子对象
	 */
	removeChildren: function() {
		var _this = this;

		var len = _this.aChildren.length;
		for (var i = 0; i < len; i++) {
			if (_this.aChildren[i]) {
				_this.aChildren[i].clear();
			}
		}
		_this.aChildren.length = 0;
	},

	/**
	 * 通过tag删除子对象
	 * @param  {String} sTag      标签
	 * @param  {Boolean} bCleanup 是否释放内存空间
	 */
	removeChildByTag: function(sTag, bCleanup) {
		var _this = this;

		bCleanup = bCleanup === undefined? true: false;

		var len = _this.aChildren.length;
		for (var i = 0; i < len; i++) {
			var one = _this.aChildren[i];
			if (one && one.sTag === sTag) {
				if (bCleanup) {
					one.clear();
				} else {
					one.engineObject.removeChild(cleanup);
				}
				_this.aChildren.splice(i, 1);
				break;
			}
		}
	},

	/**
	 * 从父对象删除自身
	 * @param  {Boolean} bCleanup 是否释放内存空间
	 */
	removeFromParent: function(bCleanup) {
		var _this = this;

		bCleanup = bCleanup === undefined? true: false;

		if (_this.oParent) {
			var len = _this.oParent.aChildren.length;
			for (var i = 0; i < len; i++) {
				var one = _this.oParent.aChildren[i];
				if (one && one.sTag === _this.sTag) {
					if (bCleanup) {
						_this.clear();
					} else {
						one.engineObject.removeChild(cleanup);
					}
					_this.oParent.aChildren.splice(i, 1);
					break;
				}
			}
		}
	},

	/**
	 * 添加tween对象
	 * @param {Object} tween 动作对象
	 */
	addTween: function(tween) {
		var _this = this;

		_this.aTweens.push(tween);
	},

	/**
	 * 通过tween对象从数据中删除
	 * @param  {Object} tween 即将删除的对象
	 */
	delTween: function(tween) {
		var _this = this;

		if (tween) {
			var index = _this.aTweens.indexOf(tween);
			if (index !== -1) {
				tween.stop();
				_this.aTweens.splice(index, 1);
			}
		}
	},

	/**
	 * 清空aTweens数组
	 */
	delTweens: function() {
		var _this = this;

		var len = _this.aTweens.length;
		for (var i = 0; i < len; i++) {
			_this.delTween(_this.aTweens[i]);
		}

		_this.aTweens.length = 0;
	},

	/**
	 * 添加调度器
	 * @param {Object} schedule 调度器
	 */
	addSchedule: function(schedule) {
		var _this = this;

		_this.aSchedules.push(schedule);
	}


});