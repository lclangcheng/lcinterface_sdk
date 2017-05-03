
var lc = lc || {};

lc.renderer = null;
lc.camera = [];
lc.effect = null;
lc.controls = [];

lc.EngineStart = function (width, height, mode ,callback) {

	Crafty.init(width, height, "cr-stage", mode);
	Crafty.background("#000");
	if (callback){
		callback();
	}
};


var lc = lc || {};

lc.EngineObject = lc.Class.extend({

    ctor: function(object) {
        var _this = this;
        if (!object) {
            _this.sprite = Crafty.e("2D, DOM");
        }
        _this.init();
    },

    init: function() {
        this.AnchorPoint = {
            x: 0.5,
            y: 0.5
        };

        this.sprite.origin(0.5, 0.5);
    },

    cleanup: function() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    },

    removeChild: function(cleanup) {
        if (cleanup === undefined) {
            cleanup = true;
        }
        if (cleanup) {
            this.cleanup();
        } else {
            this._keeppingChild();
        }
    },

    _keeppingChild: function() {
        this.sprite.undraw();
    },

    addChild: function(obj) {
        var _this = this;
        _this.sprite.attach(obj.sprite);
        obj.parent = _this;
        
        if (obj.parent){  
            obj.updateOffset();
        }
    },

    updateOffset: function() { 
        var _this = this;

        if (_this.parent && _this.textureWidth) {
            _this._bChangedOffset = true;
            _this._spriteOffsetX = - _this.AnchorPoint.x * _this.textureWidth;
            _this._spriteOffsetY = - _this.AnchorPoint.y * _this.textureHeight;
        }
    },

    setPosition: function(x, y) {
        var _this = this;
        var offsetY = 0,
            domX = 0,
            domY = 0;
        if (_this.parent) {
            if (_this.parent.EngineType === "image") {
                offsetY = _this.parent.textureHeight;
                if (_this._bChangedOffset){
                    domX = _this._spriteOffsetX;
                    domY = _this.parent.sprite.y + _this._spriteOffsetY;
                } else {
                    domX = _this.parent.sprite.x;
                    domY = _this.parent.sprite.y;
                }  
            } else if (_this.parent.EngineType === "scene") {
                offsetY = lc.Core.getWinSize().height;
            } else if (_this._bChangedOffset){
                domX = _this._spriteOffsetX;
                domY = _this._spriteOffsetY;
            }
        } 

        _this.sprite.attr({
            x: x + domX,
            y: offsetY - y + domY 
        });
    },

    setSize: function(w, h) {
        this.sprite.w = Number(w) || 100;
        this.sprite.h = Number(h) || 100;
    },

    setTag: function(tag) {
        this.sprite.tag = tag;
    },

    setName: function(name) {
        this.sprite.setName(name);
    },

    setScale: function(x, y, z) {
        this.sprite.attr({
            scaleX: x,
            scaleY: y
        });
    },

    setRotation: function(rotation) {
        this.sprite.attr({
            rotation: rotation
        });
    },

    setAlpha: function(alpha) {
        this.sprite.attr({
            alpha: alpha / 100
        });
    },

    setVisible: function(visible) {
        this.sprite.attr({
            visible: visible
        }); 
    },

    setZOrder: function(zOrder) {
        this.sprite.z = zOrder;
    },

    setFlipX: function(boolX) {
        var _this = this;
        if (boolX){
            if(this.sprite._flipX){
                this.sprite.unflip("X");
            } else {
                this.sprite.flip("X");
            }
        }
    },

    setFlipY: function(boolY) {
        var _this = this;
        if (boolY){
            if(this.sprite._flipY){
                this.sprite.unflip("Y");
            } else {
                this.sprite.flip("Y");
            }
        }
    },

    setSkew: function(x, y) {
        this.sprite.attr({
            skewX: x,
            skewY: y
        });
    }

});

var lc = lc || {};

lc.EngineScene = lc.EngineObject.extend({
	EngineType : "scene",

    run : function (isCreate){
        Crafty.scene("baseScene", function(){
        	
        });
    }

});

var lc = lc || {};

lc.EngineImage = lc.EngineObject.extend({

    EngineType : "image",

    ctor: function(object) {
        var _this = this;
        lc.EngineObject.prototype.ctor.call(_this,object);  

        _this.textureWidth = null;
        _this.textureHeight = null;
        _this._spriteOffsetX = null;
        _this._spriteOffsetY = null;
    },

    setObjectTexture: function(texture) {
        if(!texture)
            return;
        var _this = this;

        _this.textureWidth = texture.width || 0;
        _this.textureHeight = texture.height || 0;
        
        if(_this.sprite.has("sprite"))
            _this.sprite.removeComponent("sprite");
        Crafty.sprite(texture.src, {sprite: [0, 0, texture.width, texture.height]});
        _this.sprite.addComponent("sprite");

        _this.setAnchorPoint();
    },

    setPlistTexture: function(texture,info) {
        if(!texture)
            return;
        var _this = this;
        _this.textureWidth = info.sourceSize.width || 0;
        _this.textureHeight = info.sourceSize.height || 0;

        if(_this.sprite.has("sprite")){
            _this.sprite.removeComponent("sprite");
        }

        Crafty.sprite(texture.src, {sprite: [info.frame.x,info.frame.y,info.frame.width, info.frame.height]});
        _this.sprite.addComponent("sprite");
        _this.setAnchorPoint();
    },
    setAnchorPoint: function(x, y) { 
        var _this = this;
        if ( typeof(x) =="number" && typeof(y) =="number" ){
            _this.AnchorPoint.x = x;
            _this.AnchorPoint.y = y;
        }

        if (_this.parent && _this.parent.textureWidth) {
            _this._bChangedOffset = true;
             var oldOffsetX = _this._spriteOffsetX;
            _this._spriteOffsetX = - 0.5 * _this.textureWidth;
            _this._spriteOffsetY = 0.5 * (_this.parent.textureHeight - _this.textureHeight);
            _this.setPosition(_this.sprite.x - oldOffsetX , _this.parent.textureHeight * 0.5);
        } else {
            _this._spriteOffsetX = - _this.AnchorPoint.x * _this.textureWidth;
            _this._spriteOffsetY = - (1 - _this.AnchorPoint.y) * _this.textureHeight;
            _this.sprite.attr({
                x: _this._spriteOffsetX,
                y: _this._spriteOffsetY
            });
        }

    },

    changeTexture: function(texture) {
        var _this = this;

        _this.textureWidth = texture.width;
        _this.textureHeight = texture.height;

        if(_this.sprite.has("sprite")){
            _this.sprite.removeComponent("sprite");
        }

        Crafty.sprite(texture.src, {sprite: [0, 0, texture.width, texture.height]});
        _this.sprite.addComponent("sprite");
        _this.setAnchorPoint();

    },


    setTextureWithRanderSize: function(texture, info) {
        var _this = this;

        var sprite = Crafty.e("2D, DOM");
        _this.sprite.attach(sprite);

        Crafty.sprite(texture.src, {sprite: [0, 0, texture.width, texture.height]});
        sprite.addComponent("sprite");
        sprite.crop(info.x,info.y,info.width,info.height);

        var _spriteOffsetX = - _this.AnchorPoint.x * info.width;
        var _spriteOffsetY = - (1 - _this.AnchorPoint.y) * info.height;
        sprite.attr({
            x: _spriteOffsetX,
            y: _spriteOffsetY
        });
    }

});

var lc = lc || {};

lc.EngineLabel = lc.EngineObject.extend({
    EngineType : "label",

    ctor: function(object) {
        var _this = this;
        lc.EngineObject.prototype.ctor.call(_this,object);
        _this.sprite.addComponent("Text");
         
        _this.sprite.unselectable();//不能通过拖拽选中改变属性
    },

    setText: function(text) {
        this.sprite.text(text);
    },

    setFont: function(font) {
        this.sprite.textFont({
            family: font
        });
    },

    setFontSize: function(size) {
        this.sprite.textFont({
            size: size + "px"
        });
     },

    setColor: function(color) {
        this.sprite.textColor(color);
    },

    setSize: function(w, h) {
        var _this = this;

        _this.sprite.w = Number(w) || 100;
        _this.sprite.h = Number(h) || 100;

        _this._updatePosition();
    },

    _updatePosition: function() {
        var _this = this;

        _this._spriteOffsetX = - _this.AnchorPoint.x * _this.sprite.w;
        _this._spriteOffsetY = - (1 - _this.AnchorPoint.y) * _this.sprite.h;

        _this.sprite.attr({
            x: _this._spriteOffsetX,
            y: _this._spriteOffsetY
        });
    },

    setHorizontal: function (horizontal) {
        this.horizontal = horizontal;
        if (horizontal == 0) {
            this.sprite._textAlign = "left";
        }else if (horizontal == 1) {
            this.sprite._textAlign = "center";
        }else if (horizontal == 2) {
            this.sprite._textAlign = "right";
        };
    }

});
var lc = lc || {};

lc.EngineInput = lc.EngineObject.extend({

    EngineType : "input",
    eInput : null,
    _defaultText : "",
    _flag : false,

    ctor: function(object) {
        var _this = this;
        lc.EngineObject.prototype.ctor.call(_this, object);

        _this._initInputBox();
    },

     _initInputBox: function() {
        var _this = this;
        var isMobile = lc.System.isMobile();
        _this.sprite.addComponent("HTML");
        _this.eInput = document.createElement('input');
        _this.eInput.style.border= 'none';
        _this.eInput.type = "text";
        _this.eInput.style.backgroundColor = "transparent";
        _this.eInput.style.padding = 0;

        _this.sprite.bind("Draw", function(e) {
        	 _this.sprite._element.appendChild(_this.eInput);
        });
        
        _this.eInput.addEventListener("focus", function(){
            if (!_this._flag && _this.eInput.value === _this._defaultText) {
                _this.eInput.value = "";
            }
            document.addEventListener('click', onclick, false);
        }, false);

        _this.eInput.addEventListener('blur',function(){
            if (_this.eInput.value === "") {
                _this.eInput.value = _this._defaultText;
                _this._flag = false;
            }else{
                _this._flag = true;
            }
        });
        
        if (isMobile) {
            onclick = function(event) {
                if (event.target != _this.eInput) {
                    _this.eInput.blur();
                    document.removeEventListener('click', onclick, false);
                }
            };    
        }

        _this.eInput.addEventListener('click',function(e){
            e.stopPropagation();
        });
    },

    setText: function(text) {
        this.eInput.value = text;
    },

    setDefaultText: function(text) {
        var _this = this;
        _this._defaultText = text;
        _this.setText(_this._defaultText);
    },

    setFont: function(font) {
        this.eInput.style.fontFamily = font;
    },

    setFontSize: function(size) {
        this.eInput.style.fontSize = size + "px";
    },

    setColor: function(color) {
        this.eInput.style.color = color;
    },

    setSize: function(w, h) {
        var _this = this;

        _this.sprite.w = Number(w) || 100;
        _this.sprite.h = Number(h) || 100;     
        _this.eInput.style.width =  _this.sprite.w + 'px';
        _this.eInput.style.height = _this.sprite.h + 'px';
        _this.eInput.style.backgroundSize = w + "px" + " " + h + "px";
        _this._updatePosition();
    },

    setObjectTexture: function(texture) {
        if(!texture)
            return;
        var _this = this;

        _this.eInput.style.background = 'url(' + texture.src + ') no-repeat';
    },

    setPlistTexture: function(texture,info,w,h) {
        if(!texture)
            return;
        var _this = this;

        _this.textureWidth = info.sourceSize.width || 0;
        _this.textureHeight = info.sourceSize.height || 0;

        Crafty.sprite(texture.src, {sprite: [info.frame.x,info.frame.y,info.frame.width, info.frame.height]});
        _this.sprite.addComponent("sprite");
    },

    _updatePosition: function() {
        var _this = this;       

        _this._spriteOffsetX = - _this.AnchorPoint.x * _this.sprite.w;
        _this._spriteOffsetY = - (1 - _this.AnchorPoint.y) * _this.sprite.h;

        _this.sprite.attr({
            x: _this._spriteOffsetX,
            y: _this._spriteOffsetY
        });
    },

    getText: function() {
        var _this = this;
        if (!_this._flag && _this._defaultText == this.eInput.value) {
            return "";
        };
        return this.eInput.value;
    }
});

var lc = lc || {};

lc.EngineAudio = lc.EngineObject.extend({

    playMusic: function(source, volume, loop) {
        this._musicId = source.url;
        Crafty.audio.add(this._musicId, this._musicId);
        loop ? loop = -1 : loop = 1;
        Crafty.audio.play(this._musicId, loop, volume / 100);
    },

    playEffect: function(source, volume, loop) {
        this._audioEffect = source.url;
        var eff = Crafty.audio.add(this._audioEffect, this._audioEffect);
        loop ? loop = -1 : loop = 1;
        Crafty.audio.play(this._audioEffect, loop, volume / 100);
        return eff;
    },
    
    setAudioVolume: function(volume) {
        if (this._musicId) {
            Crafty.audio.setVolume(this._musicId,volume/100);
        }else if (this._audioEffect) {
            Crafty.audio.setVolume(this._audioEffect,volume/100);
        }
    },

    stopMusic: function() {
        Crafty.audio.stop(this._musicId);
    },

    stopEffect: function(url) {
        Crafty.audio.stop(this._audioEffect);
    }

});

var lc = lc || {};

lc.Engine9sprite = lc.EngineImage.extend({

    ctor: function() {
        var _this = this;
        lc.EngineImage.prototype.ctor.call(_this);
        _this.arr = [];
        _this.texture = null;
        _this.textureWidth = null;
        _this.textureHeight = null;
        _this._rect = null;
    },

    setObjectTexture: function(texture) {
        if(!texture)
            return;
        var _this = this;
        
        _this.texture = texture;
        _this._initScale9Sprite();
        _this._updatePosition();
    },

    setPlistTexture: function(texture,info) {
        if(!texture)
            return;
        var _this = this;
        Crafty.sprite(texture.src, {sprite: [info.frame.x,info.frame.y,info.frame.width, info.frame.height]});
        _this.sprite.addComponent("sprite");

        _this.texture = _this.sprite.img;

        _this._initScale9Sprite();
        _this._updatePosition();
    },

    _initScale9Sprite: function() {
        var _this = this;
        for(var i = 0; i < 9; i++){
            _this.arr[i] = Crafty.e("2d, DOM, HTML");
            _this.sprite.attach(_this.arr[i]);
            var img = document.createElement('img');
            _this.arr[i]._element.appendChild(img);
            img.src = _this.texture.src;
            img.ondragstart = function() {
                return false;
            };
        }
    },
 
    setContentSize: function(width, height) {
        var _this = this;
        _this.sprite.w = _this.textureWidth = width;
        _this.sprite.h = _this.textureHeight = height;

        _this._updatePosition();

        if(_this._rect){
            _this.set9SpriteArea(_this._rect.x, _this._rect.y, _this._rect.w, _this._rect.h);
        }

    },

    _updatePosition: function() {
        var _this = this;
        var _spriteOffsetX = - _this.AnchorPoint.x * _this.sprite.w;
        var _spriteOffsetY = - (1 - _this.AnchorPoint.y) * _this.sprite.h;
        _this.sprite.attr({
            x: _spriteOffsetX,
            y: _spriteOffsetY
        });
    },

    set9SpriteArea: function(posX, posY, pictureW, pictureH) {
        var _this = this;

        _this._rect = {
            x: posX,
            y: posY,
            w: pictureW,
            h: pictureH
        };

        var leftOff = posX + "px";
        var rightOff = posX + pictureW + "px";
        var topOff = _this.texture.height - (pictureH + posY) + "px";
        var textureW = _this.texture.width + "px";
        var textureH = _this.texture.height + "px";
        var downOff = _this.texture.height - posY + "px";

        _this.arr[0]._element.style.clip = "rect(0px," + leftOff + "," + topOff + ",0px)";
        _this.arr[1]._element.style.clip = "rect(0px," + rightOff + "," + topOff + "," + leftOff + ")";
        _this.arr[2]._element.style.clip = "rect(0px," + textureW + "," + topOff + "," + rightOff + ")";
        _this.arr[3]._element.style.clip = "rect(" + topOff + ", " + leftOff + ", " + downOff + ", 0px)";
        _this.arr[4]._element.style.clip = "rect(" + topOff + ", " + rightOff + ", " + downOff + ", " + leftOff + ")";
        _this.arr[5]._element.style.clip = "rect(" + topOff + ", " + textureW + ", " + downOff + ", " + rightOff + ")";
        _this.arr[6]._element.style.clip = "rect(" + downOff + ", " + leftOff + ", " + textureH + ", 0px)";
        _this.arr[7]._element.style.clip = "rect(" + downOff + ", " + rightOff + ", " + textureH + ", " + leftOff + ")";
        _this.arr[8]._element.style.clip = "rect(" + downOff + ", " + textureW + ", " + textureH + ", " + rightOff + ")";

        var leftW = posX;
        var centerW = pictureW;
        var rightW = _this.texture.width - (posX + pictureW);
        var downH = posY;
        var centerH = pictureH;
        var topH = _this.texture.height - (pictureH + posY);

        var w = _this.textureWidth - _this.texture.width + pictureW;
        var h = _this.textureHeight - _this.texture.height + pictureH;
        var scaleX = w / pictureW;
        var scaleY = h / pictureH;

        _this.arr[1].scaleX = scaleX;
        _this.arr[3].scaleY = scaleY;
        _this.arr[4].scaleX = scaleX;
        _this.arr[4].scaleY = scaleY;
        _this.arr[5].scaleY = scaleY;
        _this.arr[7].scaleX = scaleX;

        _this.arr[0].x = 0;
        _this.arr[0].y = 0;
        _this.arr[1].x = _this.arr[0].x - (leftW * scaleX - leftW);
        _this.arr[1].y = _this.arr[0].y; 
        _this.arr[2].x = _this.arr[0].x + w - pictureW;//_this.arr[0].x + leftW + w - (leftW + pictureW)
        _this.arr[2].y = _this.arr[0].y;
        _this.arr[3].x = _this.arr[0].x;
        _this.arr[3].y = _this.arr[0].y - (topH * scaleY - topH); 
        _this.arr[4].x = _this.arr[1].x;
        _this.arr[4].y = _this.arr[3].y; 
        _this.arr[5].x = _this.arr[2].x;
        _this.arr[5].y = _this.arr[3].y; 
        _this.arr[6].x = _this.arr[0].x;
        _this.arr[6].y = _this.arr[0].y + h - pictureH; 
        _this.arr[7].x = _this.arr[1].x;
        _this.arr[7].y = _this.arr[6].y;
        _this.arr[8].x = _this.arr[2].x;
        _this.arr[8].y = _this.arr[6].y;
    }
});

var lc = lc || {};
lc.EngineBar = lc.EngineImage.extend({
    ctor: function(object) {
        var _this = this;
        lc.EngineImage.prototype.ctor.call(_this, object);
        _this.textureWidth = null;
        _this.textureHeight = null;
        _this.bar = null;
    },

    setObjectTexture: function(texture) {
        var _this = this;

        _this.textureWidth = texture.width;
        _this.textureHeight = texture.height;
        _this.texture = texture;
        
        _this.bar = document.createElement('img');
        _this.sprite._element.appendChild(_this.bar);
        _this.bar.src = texture.src;
        _this.bar.ondragstart = function() {
            return false;
        };

        _this.setAnchorPoint();
    },

    setBarValue:function(v) {
        var _this = this;
        if (_this.direction == 0) { //左到右
            var right = _this.textureWidth * v / 100 + "px";
            var down = _this.textureHeight + "px";
            _this.sprite._element.style.clip = "rect(0px," + right + "," + down + ",0px)";
        } else if (_this.direction == 1) {//右到左
            var left = _this.textureWidth * (1 - v / 100 ) + "px";
            var down = _this.textureHeight + "px";
            var right = _this.textureWidth + "px";
            _this.sprite._element.style.clip = "rect(0px," + right + "," + down + "," + left + ")";
        } else if (_this.direction == 2) {//上到下
            var down = _this.textureHeight * v / 100 + "px";
            var right = _this.textureWidth + "px";
            _this.sprite._element.style.clip = "rect(0px," + right + "," + down + ",0px)";
        } else if (_this.direction == 3){//下到上
            var top = _this.textureHeight * (1 - v / 100) + "px";
            var right = _this.textureWidth + "px";
            var down = _this.textureHeight + "px";
            _this.sprite._element.style.clip = "rect(" + top + "," + right + "," + down + ",0px)";
        }
    },

    setDirection:function(direction){
        this.direction = direction;
    }
});
var lc = lc || {};

lc.EngineParticle = lc.EngineObject.extend({

	ctor : function(){
        var _this = this;
        lc.EngineObject.prototype.ctor.call(this);

        _this.sprite.addComponent("Particles");
    },

    addParticleData:function(data){

        var options = {
            maxParticles: data.maxParticles,
            size: data.startParticleSize,
            sizeRandom: data.startParticleSizeVariance,
            speed: data.speed,
            speedRandom: data.speedVariance,
            // Lifespan in frames
            lifeSpan: data.particleLifespan,
            lifeSpanRandom: data.particleLifespanVariance,
            // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
            angle: data.angle,
            angleRandom: data.angleVariance,
            startColour: [data.startColorRed*255, data.startColorGreen*255, data.startColorBlue*255, data.startColorAlpha*255],
            startColourRandom: [data.startColorVarianceRed*255, data.startColorVarianceGreen*255, data.startColorVarianceBlue*255, data.startColorVarianceAlpha*255],
            endColour: [data.finishColorRed*255, data.finishColorGreen*255, data.finishColorBlue*255, data.finishColorAlpha*255],
            endColourRandom: [data.finishColorVarianceRed*255, data.finishColorVarianceGreen*255, data.finishColorVarianceBlue*255, data.finishColorVarianceAlpha*255],
            // Only applies when fastMode is off, specifies how sharp the gradients are drawn
            sharpness: 20,
            sharpnessRandom: 10,
            // Random spread from origin
            spread: 10,
            // How many frames should this last
            duration: data.duration,
            // Will draw squares instead of circle gradients
            fastMode: data.textureFileName == "glorious"? false: true,
            gravity: { x: data.gravityx, y: data.gravity },
            // sensible values are 0-3
            jitter: 0,
            // Offset for the origin of the particles
            originOffset: {x: 0, y: lc.Core.getWinSize().height}
        };
    
        this.sprite.particles(options);
    },


    setTextureCache : function (texture){
        //not supported
    },
});

var lc = lc || {};

lc.EngineCall = lc.EngineLabel.extend({
    EngineType : "call",

    ctor: function(object) {
        var _this = this;
        lc.EngineLabel.prototype.ctor.call(_this,object);
    },

    setTelephoneNumber: function(telephoneNum) {
        this.telephoneNum = telephoneNum;
    },
	
	callPhone: function(){
        window.location.href = 'tel:'+ this.telephoneNum;
    }

});
var lc = lc || {};

lc.EngineBMap = lc.EngineObject.extend({
    EngineType : "BMap",
    map : null,
    curType : null, 

    ctor: function(object) {
        var _this = this;
        lc.EngineObject.prototype.ctor.call(_this,object); 

        _this._initBMap();
    },

    _initBMap: function(){
        var _this = this;

        _this.sprite._element.id = "map";
        _this.map = new BMap.Map("map");
        var mapcontrol = new BMap.MapTypeControl();
        _this.map.addControl(mapcontrol);
        _this.map.enableScrollWheelZoom(true);
    },

    setDestination: function (destination, type) {
        var _this = this;
        if (type == _this.curType) return;
        _this.map.clearOverlays();
        if (type == "walking"){
            var geoc = new BMap.Geocoder();    
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){

                    var script = document.createElement("script");
                    script.addEventListener('load', function(){
                        console.log("load");
                    }, false);
                    script.addEventListener('error', function(){
                        console.log('error');
                    }, false);
                    
                    script.src = 'https://api.map.baidu.com/geocoder/v2/?callback=callBack&location='+ r.point.lat + ',' + r.point.lng + '&output=json&pois=1&ak=QtrI9iVFgTgb2B9UHEEaE8u7qk0o0XGG';
                    document.body.appendChild(script);

                    window.callBack = function(data) {
                        if (data == "") return;
                        var start = data.result.pois[0].name;
                        var walking = new BMap.WalkingRoute(_this.map, {renderOptions:{map: _this.map, autoViewport: true}});
                        walking.search(start, destination);
                        document.body.removeChild(script);
                    }
                } else {   
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})  
            _this.curType = type;
        } else {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    var point = new BMap.Point(r.point.lng,r.point.lat);
                    _this.map.centerAndZoom(point,12);

                    var mk = new BMap.Marker(r.point);
                    _this.map.addOverlay(mk);
                    _this.map.panTo(r.point);
                    //三种驾车策略：最少时间，最短距离，避开高速
                    var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
                    var driving = new BMap.DrivingRoute(_this.map, {renderOptions:{map: _this.map, autoViewport: true},policy: routePolicy[0]});
                    driving.search(r.point, destination);
                }
                else {   
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})
            _this.curType = type;
        }
    },

    callBack: function(data) {
        console.log(data);
    },

    setSize: function(w, h) {

        var _this = this;

        _this.sprite.w = Number(w) || 100;
        _this.sprite.h = Number(h) || 100;

        _this._updatePosition();
    },

    _updatePosition: function() {
        var _this = this;

        _this._spriteOffsetX = - _this.AnchorPoint.x * _this.sprite.w;
        _this._spriteOffsetY = - (1 - _this.AnchorPoint.y) * _this.sprite.h;

        _this.sprite.attr({
            x: _this._spriteOffsetX,
            y: _this._spriteOffsetY
        });
    }

});