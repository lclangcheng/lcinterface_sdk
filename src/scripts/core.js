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