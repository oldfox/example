'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del']
});
var series = require('stream-series');

var sequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var mainBowerFiles = require('main-bower-files');

module.exports = function(options) {
  gulp.task('inject',function(done){
    sequence('inject-ng-modules','inject-js-and-css','inject-config',done);
  });

  gulp.task('inject-config',function(){
      return gulp.src(options.tmp+'/serve/index.html')
        .pipe($.replace(/src=\"local\.js\"/, 'src="local.js?'+new Date().getTime()+'"'))
        .pipe(gulp.dest(options.tmp+'/serve/'));
  });

  gulp.task('inject-js-and-css', [/*'scripts', */'concat-config','styles'], function () {

    var injectOptions = {
      ignorePath: [
        options.project,
        options.src,
        options.tmp + '/serve'
      ],
      addRootSlash: false
    };

    return gulp.src(options.src + '/index.html')
      // вставка bower зависимостей
      .pipe(wiredep(options.wiredep))

      // вставка скомпилированных стилей
      .pipe($.inject(gulp.src(
        [
          options.tmp + '/serve/app/**/*.css',
          options.project + '/design/style.css'
        ],
        { read: false }
      ),injectOptions))

      // вставка скриптов
      .pipe($.inject(series(
        // конфиг и определение нг модулей
        gulp.src([
          options.tmp + '/serve/app/config.js',
          options.project + '/local.js',
          options.tmp + '/serve/ng-modules-parsed.js'
        ]),
        // решения
        gulp.src([
          options.src + '/app/**/*.js',
          '!' + options.src + '/app/**/*.{test,mock,spec}.js'
        ]),
        // файлы проекта
        gulp.src([
          options.project + '/app/**/*.js',
          '!' + options.project + '/app/**/*.{test,mock,spec}.js',
        ])
      ), injectOptions))

      //
      .pipe(gulp.dest(options.tmp + '/serve'));

  });

  var ngModules = [];
  function parseNgModule(code) {
    var find = code.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,'')
      .match(/angular\.module\(([a-zA-Z0-9\-\.'"]+),\s+\[(|[\sa-zA-Z0-9\-\.'",]+)\]/g);
    if (find) {
      //console.log(find);
      var modules = {};
      for (var i=0,l=find.length;i<l;i++) {
        var module = find[i].replace('angular.module(','').replace(/\s+/g,'').replace(']','').split(',[');
        var moduleName = module[0].replace(/('|")/g,'');
        var moduleDeps = module[1].replace(/('|")/g,'');
        modules[moduleName] = moduleDeps;
      }
      var submodules = [];
      var deps = [];
      for (var submoduleName in modules) {
        deps.push(modules[submoduleName]);
        submodules.push(submoduleName);
      }
      deps = deps.join(',').split(',');
      for (var ii=0,ll=submodules.length;ii<ll;ii++) {
        if (deps.indexOf(submodules[ii])<0) {
          ngModules.push(submodules[ii]);
        }
      }
    }
    return code;
  }

  gulp.task('parse-bower-ng-modules',function(){
    return gulp.src(mainBowerFiles())
      .pipe($.insert.transform(parseNgModule));
  });

  gulp.task('parse-src-ng-modules',function(){
    return gulp.src(options.src+'/app/**/*.module.js')
      .pipe($.insert.transform(parseNgModule));
  });

  gulp.task('inject-ng-modules',['parse-bower-ng-modules','parse-src-ng-modules'],function(){

    return gulp.src(options.src+'/ng-modules.js')
      //.pipe($.replace('/*injectBowerModules*/','\n\t\''+ngModules.join('\',\n\t\'')+'\'\n'))
      .pipe(
//        $.replace(
//          new RegExp(/angular\.module\('(.*?)',\[[^]+?\]\)/),
//          //'angular.module(\'$1\',[\n\'ui.bootstrap\',\n\''+ngModules.join('\',\n\'')+'\'\n])'
//          'angular.module(\'$1\',[\n\n\''+ngModules.join('\',\n\'')+'\'\n\n])'
//        )
        $.replace('// inject:ngModules','\''+ngModules.join('\',\n\'')+'\'')

      )
      //.pipe(gulp.dest(options.tmp+'/serve/app'))
      .pipe($.rename('ng-modules-parsed.js'))
      .pipe(gulp.dest(options.tmp+'/serve'))
      ;
  });
};