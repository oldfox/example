'use strict';

var gulp = require('gulp');
var sort = require('sort-stream');


var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*','del']
});

module.exports = function (options) {

  gulp.task('concat-config', function () {
    return gulp.src([
        options.src + '/app/app-config/*.js',
        options.project + '/app/config/**/*.js'
      ])
      .pipe($.concat('config.js'))
      .pipe(gulp.dest(options.tmp + '/serve/app/'));
  });

};