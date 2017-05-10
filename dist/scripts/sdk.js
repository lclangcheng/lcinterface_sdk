/*
* @file cache
* @author lai_lc
* @date   2017-05-03 12:16:11
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-04 14:35:21
*/

'use strict';

var lc = lc || {};

lc.Cache = {
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
		return this.files[key];
	}

};
/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var lc = lc || {};

/**
 * @namespace
 * @name ClassManager
 */
var ClassManager = {
    id : (0|(Math.random()*998)),

    instanceId : (0|(Math.random()*998)),

    getNewID : function(){
        return this.id++;
    },

    getNewInstanceId : function(){
        return this.instanceId++;
    }
};

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
(function () {
    var fnTest = /\b_super\b/;

    /**
     * The base Class implementation (does nothing)
     * @class
     */
    lc.Class = function () {
    };

    /**
     * Create a new Class that inherits from this Class
     * @static
     * @param {object} props
     * @return {function}
     */
    lc.Class.extend = function (props) {
        var _super = this.prototype;

        // Instantiate a base Class (but only create the instance,
        // don't run the init constructor)
        var prototype = Object.create(_super);

        var classId = ClassManager.getNewID();
        ClassManager[classId] = _super;
        // Copy the properties over onto the new prototype. We make function
        // properties non-eumerable as this makes typeof === 'function' check
        // unneccessary in the for...in loop used 1) for generating Class()
        // 2) for lc.clone and perhaps more. It is also required to make
        // these function properties cacheable in Carakan.
        var desc = { writable: true, enumerable: false, configurable: true };

      prototype.__instanceId = null;

      // The dummy Class constructor
      function Class() {
        this.__instanceId = ClassManager.getNewInstanceId();
        // All construction is actually done in the init method
        if (this.ctor)
          this.ctor.apply(this, arguments);
      }

      Class.id = classId;
      // desc = { writable: true, enumerable: false, configurable: true,
      //          value: XXX }; Again, we make this non-enumerable.
      desc.value = classId;
      Object.defineProperty(prototype, '__pid', desc);

      // Populate our constructed prototype object
      Class.prototype = prototype;

      // Enforce the constructor to be what we expect
      desc.value = Class;
      Object.defineProperty(Class.prototype, 'constructor', desc);

      // Copy getter/setter
      this.__getters__ && (Class.__getters__ = lc.clone(this.__getters__));
      this.__setters__ && (Class.__setters__ = lc.clone(this.__setters__));

        for(var idx = 0, li = arguments.length; idx < li; ++idx) {
            var prop = arguments[idx];
            for (var name in prop) {
                var isFunc = (typeof prop[name] === "function");
                var override = (typeof _super[name] === "function");
                var hasSuperCall = fnTest.test(prop[name]);

                if (isFunc && override && hasSuperCall) {
                    desc.value = (function (name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-Class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]);
                    Object.defineProperty(prototype, name, desc);
                } else if (isFunc) {
                    desc.value = prop[name];
                    Object.defineProperty(prototype, name, desc);
                } else {
                    prototype[name] = prop[name];
                }

                if (isFunc) {
                    // Override registered getter/setter
                    var getter, setter, propertyName;
                    if (this.__getters__ && this.__getters__[name]) {
                        propertyName = this.__getters__[name];
                        for (var i in this.__setters__) {
                            if (this.__setters__[i] === propertyName) {
                                setter = i;
                                break;
                            }
                        }
                        lc.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
                    }
                    if (this.__setters__ && this.__setters__[name]) {
                        propertyName = this.__setters__[name];
                        for (var i in this.__getters__) {
                            if (this.__getters__[i] === propertyName) {
                                getter = i;
                                break;
                            }
                        }
                        lc.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
                    }
                }
            }
        }

        // And make this Class extendable
        Class.extend = lc.Class.extend;

        //add implementation method
        Class.implement = function (prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };
})();

/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config<br/>
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 * @param {String}   getterName Name of getter function for the property
 * @param {String}   setterName Name of setter function for the property
 */
lc.defineGetterSetter = function (proto, prop, getter, setter, getterName, setterName){
    if (proto.__defineGetter__) {
        getter && proto.__defineGetter__(prop, getter);
        setter && proto.__defineSetter__(prop, setter);
    } else if (Object.defineProperty) {
        var desc = { enumerable: false, configurable: true };
        getter && (desc.get = getter);
        setter && (desc.set = setter);
        Object.defineProperty(proto, prop, desc);
    } else {
        throw new Error("browser does not support getters");
    }

    if(!getterName && !setterName) {
        // Lookup getter/setter function
        var hasGetter = (getter != null), hasSetter = (setter != undefined), props = Object.getOwnPropertyNames(proto);
        for (var i = 0; i < props.length; i++) {
            var name = props[i];

            if( (proto.__lookupGetter__ ? proto.__lookupGetter__(name)
                                        : Object.getOwnPropertyDescriptor(proto, name))
                || typeof proto[name] !== "function" )
                continue;

            var func = proto[name];
            if (hasGetter && func === getter) {
                getterName = name;
                if(!hasSetter || setterName) break;
            }
            if (hasSetter && func === setter) {
                setterName = name;
                if(!hasGetter || getterName) break;
            }
        }
    }

    // Found getter/setter
    var ctor = proto.constructor;
    if (getterName) {
        if (!ctor.__getters__) {
            ctor.__getters__ = {};
        }
        ctor.__getters__[getterName] = prop;
    }
    if (setterName) {
        if (!ctor.__setters__) {
            ctor.__setters__ = {};
        }
        ctor.__setters__[setterName] = prop;
    }
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @function
 * @param {object|Array} obj The source object
 * @return {Array|object} The created object
 */
lc.clone = function (obj) {

    var newObj = (obj.constructor) ? new obj.constructor : {};

    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if (((typeof copy) === "object") && copy && !(copy instanceof HTMLElement)) {
            newObj[key] = lc.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

lc.inject = function(srcPrototype, destPrototype){
    for(var key in srcPrototype)
        destPrototype[key] = srcPrototype[key];
};


/*
* @file core
* @author lai_lc
* @date   2017-05-02 17:19:05
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-08 17:56:26
*/

'use strict';

var lc = lc || {};

lc.Core = {
	launch: function(designWidth, designHeight, model) {
		lc.EngineStart(designWidth, designHeight, model, function() {
			var projectData = lc.Project.getProjectData();
			var sceneId = projectData.ResourceText.projectSetting.defaultSceneID;
			var aRes = lc.Project.getResourceBySceneId(sceneId);
			lc.Loader.load(aRes, function() {
				console.log("load finished");
				var res = [{
					type: "script",
					url:APIRoot + "gf/sdk/GenJs?userid=" + USERID + "&projectid=" + PROJECTID + "&isglobal=1"
				}];
				lc.Loader.load(res, function() {
					var res = [{
						type: "script",
						url:APIRoot + 'gf/sdk/GenTpl/'+projectData.FrameworkVersion+'/' + '2d' + '/RenderScene?userid=' + USERID + '&projectid=' + PROJECTID + '&sceneid=' + sceneId
					}];
					lc.Loader.load(res, function() {
						console.log("load render scene finished.");
					})
				})
			});
		});
	}
}
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
/*
* @file project
* @author lai_lc
* @date   2017-05-02 15:04:11
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-08 12:23:30
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
		var tempData = '{"state":"ok","projectinfo":{"name":"userInterface","owner":"24289509306817014","ProjectText":{"version":0.91,"editorVersion":2,"owner":"24289509306817014","users":[],"project":"","name":"userInterface","ptype":0,"structure":{"sences":{},"objects":{}},"packages":{"base":["Base"],"extra":[]}},"ResourceText":{"version":0.91,"curranimationId":200000,"currresId":300002,"currprototypeId":400000,"currlogicId":500002,"currsceneId":600000,"currScene":600000,"currmapId":700000,"currparticleId":800000,"currvariableId":1000000,"currloadingId":2000000,"wraperId":0,"owner":"24289509306817014","project":"","name":"userInterface","resolution":{"adapterMode":"2","width":"640","height":"1136"},"logicPlugin":[],"structure":{"currentTabs":[{"id":"page1","path":"/素材","title":"素材","state":true},{"id":"page2","path":"/动画","title":"动画","state":true},{"id":"page3","path":"/逻辑","title":"逻辑","state":true},{"id":"page4","path":"/原型","title":"原型","state":true},{"id":"page5","path":"/场景","title":"场景","state":true},{"id":"page6","path":"/地图","title":"地图","state":true},{"id":"page7","path":"/数据","title":"数据","state":true}],"resources":{"/":{"d":["素材","动画","逻辑","原型","场景","地图","数据"],"f":[]},"/素材":{"d":["图片","影音","数据"],"f":[]},"/素材/图片":{"d":[],"f":[300001]},"/素材/影音":{"d":[],"f":[300002]},"/素材/数据":{"d":[],"f":[]},"/动画":{"d":[],"f":[]},"/逻辑":{"d":[],"f":[500001,500002]},"/原型":{"d":[],"f":[]},"/场景":{"d":[],"f":["600000"]},"/地图":{"d":[],"f":[]},"/数据":{"d":[],"f":[]}}},"origin":{"resources":{"300001":{"resType":"image","resURL":"/images/e86307d2be74cffb5e565f2867be4502.png","size":11264,"width":357,"height":103},"300002":{"resType":"audio","resURL":"/material/sounds/4/a38508d01e41ac879180c2e44e64013d.mp3","size":322560,"width":0,"height":0},"500001":{"resType":"logic","data":{"data":[[{"argu":["2","200000","360",false],"block":[[]],"pos":{"left":78,"top":158},"type":"ac-runRotates","resources":[]},{"argu":["1",100000,"2",false],"block":[[{"argu":["1","200000","1",false],"block":[[]],"pos":{},"type":"ac-runScales","resources":[]}]],"pos":{"left":78,"top":158},"type":"ac-runScales","resources":[]}]],"local":[]},"md5":"7ae23c1ebdbd58530791b95a9ae06def"},"500002":{"resType":"logic","data":{"data":[[{"argu":["2","320","850",null],"block":[[]],"pos":{"left":46,"top":240},"type":"ac-runEaseInOutMoving","resources":[]}]],"local":[]},"md5":"5def5d700efbaf590ef0a929cf02f61d"},"600000":{"resType":"scene","data":{"gameSetting":[{"id":"b00f220b-89e7-4254-be90-2bc639956574","child":[]},{"id":"133b2e5f-d990-446d-a75d-60cf55114d37","child":[]}],"instance":{"b00f220b-89e7-4254-be90-2bc639956574":{"components":{"Transform":[{"propertys":{"objectName":"Logo","transform":{"Position":{"x":"320.00","y":"568.00","z":"0.00"},"Scale":{"x":"1.00","y":"1.00"},"Rotation":{"x":"0.00","y":0}},"alpha":100,"group":"默认"},"id":1,"enabled":true}],"Texture":[{"propertys":{"file":{"id":"300001","name":"logo.png"},"blendFunc":0},"id":2,"enabled":true}],"Event":[{"propertys":{"EventType":0,"file":{"name":"逻辑2","id":"500002"}},"id":3,"enabled":true}]},"wraperName":"Logo","lockState":0,"resources":[{"number":1,"resId":"300001"},{"number":1,"resId":"500001"},{"number":1,"resId":"500002"}]},"133b2e5f-d990-446d-a75d-60cf55114d37":{"components":{"Transform":[{"propertys":{"objectName":"音频","transform":{"Position":{"x":"245.84","y":"210.01","z":"0.00"},"Scale":{"x":"1.00","y":"1.00"},"Rotation":{"x":"0.00","y":0}},"alpha":100,"group":"默认"},"id":1,"enabled":true}],"Audio":[{"propertys":{"src":{"id":"300002","name":"格式工厂游戏中背景音乐.mp3"},"playType":0,"Volume":100,"autoPlay":true,"isLoop":false},"id":2,"enabled":true}]},"wraperName":"音频","lockState":null,"resources":[{"number":1,"resId":"300002"}]}},"arInstance":{}}}}},"projectSetting":{"gameEngine":"crafty","defaultSceneID":"600000","resolution":{"adapterMode":"2","width":"640","height":"1136"},"id":"75067a90-2fe3-11e7-821f-d36a32f88b9c","owner":"24289509306817014"}},"FrameworkVersion":"2.1","Type":"1","version":{"oldVersion":0.91,"version":0.91}}}';
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
		for (var warperId in instance) {
			var wrapper = instance[warperId];
			if (wrapper.resources) {
				for(var resourceIndex = 0; resourceIndex < wrapper.resources.length; resourceIndex++) {
					var resId = wrapper.resources[resourceIndex].resId? wrapper.resources[resourceIndex].resId: wrapper.resources[resourceIndex];

					var resInfo = res[resId];
					if (!resInfo) continue;

					if (resInfo.resType === "logic") {
						// var jsPath = APIRoot + "gf/sdk/GenJs?userid=" + USERID + "&projectid=" + (PROJECTID || '') + "&instanceid=" + resId;
						// aRes.push({
						// 	type: "script",
						// 	url: jsPath
						// });
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
					 	for(var listIndex = 0; listIndex < list.length; listIndex++) {
					 		var one = list[listIndex];
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