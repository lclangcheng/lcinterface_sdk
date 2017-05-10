/*
* @file util
* @author lai_lc
* @date   2017-05-02 15:16:03
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-09 18:30:34
*/

'use strict';

var lc = lc || {};

lc.Util = {
	/**
	 * [getXMLHttpRequest description] 返回在后台与服务器交换数据的对象,IE7以上都内建XMLHttpRequest对象。
	 * @return {[type]} [description] XMLHttpRequest
	 */
	getXMLHttpRequest: function () {
		return window.XMLHttpRequest? new window.XMLHttpRequest(): new ActiveXObject("MSXML2.XMLHTTP");
	},

	getObjectType: function(obj) {
		return Object.prototype.toString.call(obj).slice(8,-1);
	}
};