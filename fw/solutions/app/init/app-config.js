(function(global){
  'use strict';

  angular.module('app')
  .constant('AppConfig',getAppConfig())
  .run(initAppConfig);

  function getAppConfig() {
    return angular.copy(angular.extend({},global.appConfig||{},global.localConfig||{}))
  }

  function initAppConfig($timeout){
    $timeout(function(){
      og.del(global,'appConfig');
    });
  }

})(this);
