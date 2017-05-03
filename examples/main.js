/*
* @file main
* @author lai_lc
* @date   2017-05-02 14:48:31
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-03 16:04:55
*/

'use strict';

var lc = lc || {};

lc.main = function() {
	console.log("获取项目档数据");
	lc.Project.prepare(function() {

		var projectData = lc.Project.getProjectData();
		var resolution = projectData.ResourceText.resolution;
		lc.Core.launch(resolution.width, resolution.height, resolution.adapterMode || 0);
		
	})
}