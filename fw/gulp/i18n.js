'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
//var es = require('event-stream');
var sequence = require('run-sequence');
var mkdir = require('mkdirp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

function getFolders(dir){
    return fs.readdirSync(dir)
        .filter(function(file){
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function getFiles(dir){
    return fs.readdirSync(dir)
        .filter(function(file){
            return file.match(/\.txt$/);
        });
}

module.exports = function(options) {

    gulp.task('i18n',['angular-locale','moment-locale','translations']);

    gulp.task('angular-locale', function(){
      var dest = options.src + '/i18n/locale/';
      var src = [];

      if (!fs.existsSync(dest)) {
        console.log('copy angular-locale files');
        src = 'bower_components/angular-i18n/angular-locale_*.js';
      }

      return gulp.src(src)
        .pipe(gulp.dest(dest));
    });

    gulp.task('moment-locale', function(){
      var dest = options.src + '/i18n/moment/';
      var src = [];

      if (!fs.existsSync(dest)) {
        console.log('copy moment-locale files');
        src = 'bower_components/moment/locale/*.js';
      }

      return gulp.src(src)
        .pipe(gulp.dest(dest));
    });

    gulp.task('translations',['concatTranslations'],function(done){
        $.del(options.tmp+'/translations/',{force:true},done);
    });

    gulp.task('concatTranslations',['generateTranslations'],function(done){
        var scriptsPath = options.tmp + '/translations/';

        var folders = getFolders(scriptsPath);

        var doneCount = 0;
        folders.map(function(language) {
            gulp.src(options.tmp+'/translations/'+language+'/*.js')
            .pipe($.concat(language + '.js'))
            .pipe(gulp.dest(options.tmp + '/serve/i18n/translations/'))

            .on('end',function(){
              doneCount++;
              if (doneCount==folders.length) done();
            });
        });
    });

    gulp.task('generateTranslations',['prepareTranslationFolders'],function(done){

      mkdir(options.tmp + '/translations');

      var scriptsPath = options.project + '/translations/';

      var folders = getFolders(scriptsPath);

      folders.map(function(language) {
        var folderPath = scriptsPath + language + '/';
        var files = getFiles(folderPath);

        var doneCount = 0;
        if (files.length) {
          files.map(function(file){
              if (file.match(/\.txt$/)) {
                  var category = file.replace('.txt','');
                  category = '[\''+category+'\']';
                  gulp.src(path.join(folderPath,file))
                    .pipe($.insert.transform(function(content){
                        var rows = content.split('\n');
                        var result = '';
                        for (var l=rows.length-1,i=0;i<=l;i++) {
                            var row = rows[i];
                            if (row.trim()!='') {
                                if (!row.match(/^\s{0,}\/\//)) {
                                    row = row.replace("'","\'");
                                    row = row.replace(/([\w\-\.]+)\s{0,}:\s{0,}(.*)/,"'$1':'$2'");
                                    if (i<l)
                                        row += ',\n';
                                    result += row;
                                }
                            }
                        }
                        return result.trim().replace(/(.*),$/,'$1');
                    }))
                    .pipe($.insert.wrap('translations'+category+' = {\n','\n};\n'))
                    .pipe($.rename({extname:'.js'}))
                    .pipe(gulp.dest(options.tmp+'/translations/'+language+'/'))

                    .on('end',function(){
                        doneCount++;
                        if (doneCount==files.length) done();
                      });

              }
          });
        } else {
          done();
        }
      });
    });

    gulp.task('prepareTranslationFolders',function(done){
        $.del(options.project+'/i18n/translations/',{force:true},done);
    });

    gulp.task('i18n-dist',['i18n'],function(){

      gulp.src(options.src + '/i18n/**/*')
        .pipe(gulp.dest(options.dist + '/i18n/'));

      return gulp.src(options.tmp+'/serve/i18n/translations/**/*')
        .pipe(gulp.dest(options.dist+'/i18n/translations/'))
    });
};