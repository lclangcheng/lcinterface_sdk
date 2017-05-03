/*
* @file core
* @author lai_lc
* @date   2017-05-02 17:19:05
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-03 18:31:56
*/

'use strict';

var lc = lc || {};

lc.Core = {
	launch: function(designWidth, designHeight, model) {
		lc.EngineStart(designWidth, designHeight, model, function() {
			var projectData = lc.Project.getProjectData();
			var sceneId = projectData.ResourceText.projectSetting.defaultSceneID;
			var aRes = lc.Project.getResourceBySceneId(sceneId);
			lc.loader.load(aRes, function() {
			});
		});
	}
}