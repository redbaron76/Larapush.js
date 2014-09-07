var gulp 		= require('gulp');
var gutil 		= require('gulp-util');
var concat 		= require('gulp-concat');
var uglify 		= require('gulp-uglify');

var jsDir 			= 'scripts/';
var jsBuild 		= 'build/';
var jsTarget 		= '../js';

gulp.task('concat_ugly', function() {
	return gulp.src([
		jsDir + 'larapush.js',
		jsDir + 'connection.js',
		jsDir + 'pubsub.js',
	])
		.pipe(concat('larapush.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(jsTarget))
		.pipe(gulp.dest(jsBuild));
});

gulp.task('concat_build', function() {
	return gulp.src([
		jsDir + 'larapush.js',
		jsDir + 'connection.js',
		jsDir + 'pubsub.js',
	])
		.pipe(concat('larapush.js'))
		.pipe(gulp.dest(jsBuild));
});

gulp.task('concat', function() {
	return gulp.src([
		jsDir + 'larapush.js',
		jsDir + 'connection.js',
		jsDir + 'pubsub.js',
	])
		.pipe(concat('larapush.dev.js'))
		.pipe(gulp.dest(jsTarget));
});

gulp.task('default', ['concat', 'watch']);
gulp.task('build', ['concat_ugly', 'concat_build']);

gulp.task('watch', function () {
    gulp.watch(jsDir + '/**/*.js', ['concat']);
});