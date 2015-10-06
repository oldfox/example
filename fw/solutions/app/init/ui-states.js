angular.module('app')
.config(function(AppConfig,$stateProvider,$urlRouterProvider){
    angular.forEach(AppConfig.states||{},function(data,state){
      $stateProvider.state(state,data);
    });
    $urlRouterProvider.otherwise(AppConfig.errorUrl||'/error');
});