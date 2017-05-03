var gulp = require('gulp'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify');


var scriptsPath = 'src/scripts/*.js'
gulp.task('default', function() {
	gulp.src(scriptsPath)
		.pipe(concat('sdk.js'))
		.pipe(gulp.dest('dist/scripts'))


	gulp.src(scriptsPath)
		.pipe(concat('sdk.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'))
});