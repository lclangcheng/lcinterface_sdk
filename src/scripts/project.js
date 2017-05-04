/*
* @file project
* @author lai_lc
* @date   2017-05-02 15:04:11
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-04 14:47:52
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
		for (var warperId in instance) {
			var wrapper = instance[warperId];
			if (wrapper.resources) {
				for(var resourceIndex = 0; resourceIndex < wrapper.resources.length; resourceIndex++) {
					var resId = wrapper.resources[resourceIndex].resId? wrapper.resources[resourceIndex].resId: wrapper.resources[resourceIndex];

					var resInfo = res[resId];
					if (!resInfo) continue;

					if (resInfo.resType === "logic") {
						var jsPath = APIRoot + "gf/sdk/GenJs?userid=" + USERID + "&projectid=" + (PROJECTID || '') + "&instanceid=" + resId;
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
