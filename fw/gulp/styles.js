'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var argv = require('yargs').argv;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {

  gulp.task('styles', ['build-app-styles','build-design-styles'],function(done){
    done();
  });

  //
  // inject less files to style.less & compile to tmp/serve/app/style.css
  //
  gulp.task('build-app-styles', function () {

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/', '');
        //console.log(filePath);
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    // import less files to style.less
    return gulp.src([
      options.src + '/app.less',
    ])

    .pipe($.inject(gulp.src(
      [
        options.src + '/app/**/*.less'
      ],
      { read: false }
    ), injectOptions))

    .pipe($.less()).on('error', options.errorHandler('Less'))
    .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
    .pipe(gulp.dest(options.tmp + '/serve/app/'))
    ;
  });


  //
  // project/design/less/* >>> project/design/style.css
  //
  gulp.task('build-design-styles',function () {
    return gulp.src([
        options.project + '/design/style/build.less'
      ])
      //.pipe($.sourcemaps.init())
      .pipe($.less()).on('error', options.errorHandler('Less'))
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      //.pipe($.sourcemaps.write())
      .pipe($.rename('design.css'))
      //.pipe($.cssRebaseUrls())
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      ;
  });
};
