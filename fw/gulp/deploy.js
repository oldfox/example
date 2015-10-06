'use strict';

var gulp = require('gulp');
var fs = require('fs');
var filter = require('gulp-filter');

var ssh = require('scp2');

var deployConfig = require('../../project/deploy.json');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = function(options) {

  gulp.task('deploy',function(){

    if (deployConfig.privateKey) {
      deployConfig.privateKey = fs.readFileSync(getUserHome()+'/.ssh/id_rsa');
    }
    var path = deployConfig.path;
    delete(deployConfig.path);

    var ssh = require('gulp-ssh')({
      sshConfig: deployConfig,
      filePath: path
    });
console.log('mkdir -p '+path+'| cd '+path+'| ls | grep -v \'local.js\' | xargs rm');
//    ssh.exec(['mkdir -p '+path+'| cd '+path+'| ls | grep -v \'local.js\' | xargs rm'], {filePath: 'deploy.log'})
//      .pipe(gulp.dest('../logs'));

//    var files = [];
//    return gulp.src(options.dist+'/app/**/*')
//      .pipe(filter(function(file){
//        ssh.sftp('write',)
//      }))
//      //.pipe(gulp.dest('logs'))
//      ;
//    return gulp.src(files)
//      .pipe(ssh.sftp('write',))
  });

};