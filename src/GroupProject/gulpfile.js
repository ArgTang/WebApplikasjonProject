/// <binding BeforeBuild='compile' AfterBuild='js:default' Clean='clean' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');

var paths = {
    scripts: [  'frontendsrc/scripts/**/*.js',
                'frontendsrc/scripts/**/*.ts',
                'frontendsrc/scripts/**/*.map'],
    webroot: 'wwwroot/',
    frontroot: 'frontendsrc/'
};

paths.sass = paths.frontroot + '/sass/**/*.scss';

gulp.task('clean', function () {
    return del([paths.webroot + '/js/**/*', 
                paths.webroot + '/css/**/*' ]);
});

gulp.task('js:default', function () {
    gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.webroot + '/js'));
});

gulp.task('sass', function () {
    return gulp.src(paths.sass)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(paths.webroot + '/css'));
});

gulp.task('sass:watch',
    function() {
        gulp.watch(paths.sass, ['sass']);
});

gulp.task('compile', ['js:default', 'sass']);