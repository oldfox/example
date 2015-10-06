'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sequence = require('run-sequence');
var del = require('del');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {

  gulp.task('watch',function(done){
    sequence('clean-tmp-serve','inject','set-watchers','i18n',done);
  });

  gulp.task('clean-tmp-serve',function(done){
    del(options.tmp+'/serve',{force:true},done);
  });

  var reloadPath;

  gulp.task('reload-browser',function(done){
    setTimeout(function(){
      browserSync.reload(reloadPath);
      done();
    },300);
  });

  gulp.task('set-watchers', function () {

//    gulp.watch([
//        options.src + '/index.html',
//        'bower.json'
//    ], ['inject'],function(event){
//
//        //browserSync.reload(event.path);
//
//    });

    gulp.watch([
      options.src + '/app/**/*.less'
    ], function(event) {
      reloadPath = event.path;
      if(isOnlyChange(event)) {
        sequence('build-app-styles','reload-browser');
      } else {
        sequence('inject','reload-browser');
      }
    });

    gulp.watch([
      options.project + '/design/**/*',
      '!'+options.project + '/design/**/*.{less}'
    ], function(event) {
      reloadPath = event.path;
      sequence('reload-browser');
    });

    gulp.watch([
      options.project + '/design/**/*.less',
    ], function(event) {
      reloadPath = event.path;
      if(isOnlyChange(event)) {
        sequence('build-design-styles','reload-browser');
      } else {
        sequence('inject','reload-browser');
      }
    });

    gulp.watch([
        options.project + '/app/**/*.js',
        options.src + '/app/**/*.js'
    ], function(event) {
      reloadPath = event.path;
      if(isOnlyChange(event)) {
        sequence(/*'scripts',*/'concat-config','reload-browser');
      } else {
        console.log('!!!!insert/delete');
        sequence('inject','reload-browser');
      }
    });

    gulp.watch([
        options.project + '/app/**/*.html',
        options.src + '/app/**/*.html'
    ], function(event) {
      reloadPath = event.path;
      sequence('partials','reload-browser');
    });

    gulp.watch([
        options.project + '/translations/**/*.txt',
    ], function() {
      sequence('translations','reload-browser');
    });

  });
};
