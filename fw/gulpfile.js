'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

var options = {
  project: '../project',
  src: 'solutions',
  dist: '../dist',
  tmp: '../.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.beep();
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components'
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', function () {
    gulp.start('build');
});
