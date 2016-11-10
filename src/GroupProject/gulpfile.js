/// <binding BeforeBuild='compile' Clean='clean' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var paths = {
    scripts: [  'frontendsrc/scripts/**/*.js',
                'frontendsrc/scripts/**/*.ts',
                'frontendsrc/scripts/**/*.map',
                'frontendsrc/bankid/js/**/*.js',
                'frontendsrc/bankid/js/**/*.ts',
                'frontendsrc/bankid/js/**/*.map'],
    webroot: 'wwwroot/',
    frontroot: 'frontendsrc/'
};

paths.sass = paths.frontroot + '/sass/**/*.scss';

gulp.task('clean', function () {
    return del([paths.webroot + '/js/**/*', 
                paths.webroot + '/css/**/*' ]);
});

gulp.task('clean:prod', function () {
    return del([paths.webroot + '/js/**/*.ts',
                paths.webroot + '/js/**/*.map']);
});

gulp.task('js:default', function () {
    gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.webroot + '/js'));
});

gulp.task('sass', function () {
    var postPlugins = [
        autoprefixer({ browsers: ['> 5%'], cascade: false })
    ]

    return gulp.src(paths.sass)
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(postPlugins))
      .pipe(gulp.dest(paths.webroot + '/css'));
});

gulp.task('sass:watch',
    function() {
        gulp.watch(paths.sass, ['sass']);
});


gulp.task('compile', ['js:default', 'sass']);