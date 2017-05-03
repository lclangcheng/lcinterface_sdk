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
'use strict';
var lc = lc || {};
/* Simple JavaScript Inheritance
 * By John Resig https://johnresig.com/
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  lc.Class = function(){};
   
  // Create a new Class that inherits from this class
  lc.Class.extend = function(prop) {
    var _super = this.prototype;
     
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
     
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
             
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
             
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
             
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
     
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
     
    // Populate our constructed prototype object
    Class.prototype = prototype;
     
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = lc.Class.extend;
     
    return Class;
  };
})();
/*
* @file core
* @author lai_lc
* @date   2017-05-02 17:19:05
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-03 17:32:04
*/

'use strict';

var lc = lc || {};

lc.Core = {
	launch: function(designWidth, designHeight, model) {
		lc.EngineStart(designWidth, designHeight, model, function() {
			var projectData = lc.Project.getProjectData();
			var sceneId = projectData.ResourceText.projectSetting.defaultSceneID;
			var aRes = lc.Project.getResourceBySceneId(sceneId);
			console.log(aRes);
		});
	}
}
/*
* @file loader
* @author lai_lc
* @date   2017-05-03 10:38:45
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-03 16:36:50
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


lc.Loader = {
	load: function(url, callback) {
		
	}
}
/*
* @file object
* @author lai_lc
* @date   2017-05-02 14:41:19
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-02 15:45:44
*/

'use strict';

var lc = lc || {};


lc.Object = {

};
/*
* @file project
* @author lai_lc
* @date   2017-05-02 15:04:11
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-03 17:48:00
*/

'use strict';

var lc = lc ||  {};

lc.Project = {

	_projectData: null,
	_resource: null,

	prepare: function(callback) {
		var _this = this;
		var xmlHttpRequest = lc.Util.getXMLHttpRequest();
		var data = null;
		var url = "http://10.57.220.76:12000/op//gf/webapi/ReadProject_Preview";
		data = "pid=fe1bf410-2965-11e7-ab3f-cba729ac7ef0";
		xmlHttpRequest.open('POST', url);
		xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencodeed;charset=UTF-8");
		var tempData = '{"state":"ok","projectinfo":{"name":"userInterface","owner":"24289509306817014","ProjectText":{"version":0.91,"editorVersion":2,"owner":"24289509306817014","users":[],"project":"","name":"userInterface","ptype":0,"structure":{"sences":{},"objects":{}},"packages":{"base":["Base"],"extra":[]}},"ResourceText":{"version":0.91,"curranimationId":200000,"currresId":300001,"currprototypeId":400000,"currlogicId":500002,"currsceneId":600000,"currScene":600000,"currmapId":700000,"currparticleId":800000,"currvariableId":1000000,"currloadingId":2000000,"wraperId":0,"owner":"24289509306817014","project":"","name":"userInterface","resolution":{"adapterMode":"2","width":"640","height":"1136"},"logicPlugin":[],"structure":{"currentTabs":[{"id":"page1","path":"/素材","title":"素材","state":true},{"id":"page2","path":"/动画","title":"动画","state":true},{"id":"page3","path":"/逻辑","title":"逻辑","state":true},{"id":"page4","path":"/原型","title":"原型","state":true},{"id":"page5","path":"/场景","title":"场景","state":true},{"id":"page6","path":"/地图","title":"地图","state":true},{"id":"page7","path":"/数据","title":"数据","state":true}],"resources":{"/":{"d":["素材","动画","逻辑","原型","场景","地图","数据"],"f":[]},"/素材":{"d":["图片","影音","数据"],"f":[]},"/素材/图片":{"d":[],"f":[300001]},"/素材/影音":{"d":[],"f":[]},"/素材/数据":{"d":[],"f":[]},"/动画":{"d":[],"f":[]},"/逻辑":{"d":[],"f":[500001,500002]},"/原型":{"d":[],"f":[]},"/场景":{"d":[],"f":["600000"]},"/地图":{"d":[],"f":[]},"/数据":{"d":[],"f":[]}}},"origin":{"resources":{"300001":{"resType":"image","resURL":"/images/e86307d2be74cffb5e565f2867be4502.png","size":11264,"width":357,"height":103},"500001":{"resType":"logic","data":{"data":[[{"argu":["2","200000","360",false],"block":[[]],"pos":{"left":78,"top":158},"type":"ac-runRotates","resources":[]},{"argu":["1",100000,"2",false],"block":[[{"argu":["1","200000","1",false],"block":[[]],"pos":{},"type":"ac-runScales","resources":[]}]],"pos":{"left":78,"top":158},"type":"ac-runScales","resources":[]}]],"local":[]},"md5":"7ae23c1ebdbd58530791b95a9ae06def"},"500002":{"resType":"logic","data":{"data":[[{"argu":["2","320","850",null],"block":[[]],"pos":{"left":46,"top":240},"type":"ac-runEaseInOutMoving","resources":[]}]],"local":[]},"md5":"5def5d700efbaf590ef0a929cf02f61d"},"600000":{"resType":"scene","data":{"gameSetting":[{"id":"b00f220b-89e7-4254-be90-2bc639956574","child":[]}],"instance":{"b00f220b-89e7-4254-be90-2bc639956574":{"components":{"Transform":[{"propertys":{"objectName":"Logo","transform":{"Position":{"x":"320.00","y":"568.00","z":"0.00"},"Scale":{"x":"1.00","y":"1.00"},"Rotation":{"x":"0.00","y":0}},"alpha":100,"group":"默认"},"id":1,"enabled":true}],"Texture":[{"propertys":{"file":{"id":"300001","name":"logo.png"},"blendFunc":0},"id":2,"enabled":true}]},"wraperName":"Logo","lockState":0,"resources":[{"number":1,"resId":"300001"},{"number":1,"resId":"500001"}]}},"arInstance":{}}}}},"projectSetting":{"gameEngine":"crafty","defaultSceneID":"600000","resolution":{"adapterMode":"2","width":"640","height":"1136"},"id":"75067a90-2fe3-11e7-821f-d36a32f88b9c","owner":"24289509306817014"}},"FrameworkVersion":"2.1","Type":"1","version":{"oldVersion":0.91,"version":0.91}}}';
		xmlHttpRequest.onreadystatechange = function() {
			if (xmlHttpRequest.readyState == 4 && (xmlHttpRequest.status == 200 || xmlHttpRequest.status ==0)) {
				var resText = xmlHttpRequest.responseText || tempData;
				var dataObj = JSON.parse(resText);

				if (dataObj.state == "ok") {
					_this._projectData = dataObj.projectinfo;
					_this._resources = dataObj.projectinfo.ResourceText.origin.resources;
				}

				callback && callback();
			}
		}

		xmlHttpRequest.send(data);
	},

	getProjectData: function() {
		return this._projectData;
	},

	getResourceForKey: function(key) {
		return this._resource[key];
	},

	getResourceInstance: function(res, instance) {
		var aRes = [];
		for (var wrapperId in instance) {
			var wrapper = instance[wrapperId];
			if (wrapper.resources) {
				for(var resourceIndex in wrapper.resources) {
					var resId = wrapper.resources[resourceIndex].resId? wrapper.resources[resourceIndex].resId: wrapper.resources[resourceIndex];

					var resInfo = res[resId];
					if (!resInfo) continue;

					if (resInfo.resType === "logic") {
						var jsPath = APIRoot + "gf/sdk/GenJs?userid=" + USERID + "&projectid=" + (PROJECTID || '') + "&instance=" + resId;
						aRes.push({
							type: "script",
							url: jsPath
						});
					} else if (resInfo.resType === "image") {
						aRes.push({
							type: "image",
							url: ResRoot + resInfo.resURL.substr(1)
						});
					} else if (resInfo.resType === "audio") {
						aRes.push({
							type: "audio",
							url: ResRoot + resInfo.resURL.substr(1)
						});
					} else if (resInfo.resType === "fnt") {
						aRes.push({
							type: "fnt",
							url: ResRoot + resInfo.resURL.substr(1)
						});
					} else if (resInfo.resType === "applciation") {
						aRes.push({
							type: "application",
							url: ResRoot + resInfo.resURL.substr(1)
						});
					} else if (resInfo.resTYpe === "map") {
						var list = resInfo.data.mapBlock;
					 	for(var index in list) {
					 		var one = list[index];
					 		aRes.push({
					 			type: "image",
					 			url: ResRoot + one.src.substr(1)
					 		});
					 	}
					}

				}
			}
		}

		return aRes;
	},

	getResourceBySceneId: function(sceneId) {
		var _this = this;
		var aRes = [];

		var res = _this._resources;
		var sceneData = res[sceneId];
 		
 		if (sceneData) {
 			var instance = sceneData.data.instance;
 			aRes = _this.getResourceInstance(res, instance);
 		}

 		return aRes;
	}
}

/*
* @file util
* @author lai_lc
* @date   2017-05-02 15:16:03
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-02 15:26:35
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
	}
};