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

