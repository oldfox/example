'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var sequence = require('run-sequence');

module.exports = function(options) {

  gulp.task('partials',['extend-partials'], function () {
    return gulp.src([options.tmp+'/partials/**/*.html'])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'app',
        root: 'app'
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
  });

  gulp.task('clear-tmp-partials',function(done){
      $.del(options.tmp+'/partials/',{force:true},done);
  });

  gulp.task('extend-partials',['clear-tmp-partials'],function(){
    var partials = {};
    return gulp.src([
        options.src + '/app/**/*.html',
        options.project + '/app/**/*.html'
      ])
      .pipe($.ignore.exclude(function(file){
        return file.path.match(/__/);
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'))
      ;
  });

  gulp.task('html', ['inject', 'partials'], function () {

    var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: options.tmp + '/partials',
      addRootSlash: false
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter(['**/*.js','!ng-modules.js','!local.js']);
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)

      .pipe($.ngAnnotate())
      .pipe($.stripDebug())
      .pipe($.uglify({ preserveComments: function(){ return false; } })).on('error', options.errorHandler('Uglify'))

      .pipe(jsFilter.restore())

      //.pipe($.notify({title:'JS',message:'builded'}))

      .pipe(cssFilter)
      .pipe($.stripComments({safe:false}))
      .pipe($.csso()).on('error', options.errorHandler('CSSO'))
      .pipe(cssFilter.restore())

      //.pipe($.notify({title:'CSS',message:'builded',sound: true}))

      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
      }))
      .pipe(htmlFilter.restore())

      //.pipe($.notify({title:'HTML',message:'builded'}))

      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));
  });

  gulp.task('images', function () {
    return gulp.src([
        options.project + '/design/images/**/*.{jpg,jpeg,png,gif,svg}',
      ])
      .pipe($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest(options.dist + '/images/'));
  });

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/fonts/'));
  });

//  gulp.task('assets', function () {
//    return gulp.src([
//        options.project + '/assets/**/*',
//        '!' + options.project + '/assets/**/*.{less,jpg,jpeg,png,gif,svg}'
//      ])
//      .pipe(gulp.dest(options.dist + '/assets/'));
//  });

  gulp.task('root-images', function () {
      return gulp.src([
              options.src + '/favicon.ico',
              options.project + '/favicon.ico',
              options.src + '/apple-touch-icon*.ico',
              options.project + '/apple-touch-icon*.ico',
              options.src + '/*loader.gif',
              options.project + '/*loader.gif'
          ])
          .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task('design-fonts', function () {

    return gulp.src([
        options.project + '/design/**/*.{eot,svg,ttf,woff,woff2}'
      ])
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/fonts/'));
  });

//  gulp.task('design-images', function () {
//
//    return gulp.src([
//        options.project + '/design/**/*.{jpg,jpeg,png,gif,svg}'
//      ])
//      .pipe($.imagemin({
//        optimizationLevel: 3,
//        progressive: true,
//        interlaced: true
//      }))
//      .pipe(gulp.dest(options.dist + '/design/'));
//  });

//  gulp.task('design', function () {
//
//    return gulp.src([
//        options.project + '/design/**/*',
//        '!' + options.project + '/design/**/*.{less,jpg,jpeg,png,gif,svg}'
//      ])
//      .pipe(gulp.dest(options.dist + '/design/'));
//  });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/'],{force:true}, done);
  });

  gulp.task('build',function(done){
    sequence('clean',['html', 'images', 'root-images','fonts', /*'assets',*//*'design',*//*'design-images',*/'design-fonts','i18n-dist'],done);
  });

};
