/*
* @file cache
* @author lai_lc
* @date   2017-05-03 12:16:11
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-03 12:33:39
*/

'use strict';

var kc = kc || {};

kc.Cache = {
	/**
	 * 启动/关闭缓存
	 * @type {Boolean}
	 */
	enable: true,

	/**
	 * 存放缓存数据的对象
	 * @type {Object}
	 */
	files: {},

	/**
	 * 添加缓存在files上
	 * @param {[string]} key 键
	 * @param {[*]} data 数据
	 */
	add: function(key, data) {
		var _this = this;

		var result = false;
		if (_this.enable !== false) {
			_this.files[key] = data;
			result = true;
		}
		return result;
	},

	/**
	 * 通过键返回缓存上的数据
	 * @param  {[type]} key 获取files的key
	 * @return {[*]} 对应的缓存数据
	 */
	get: function(key) {
		return _this.files[key];
	}

};