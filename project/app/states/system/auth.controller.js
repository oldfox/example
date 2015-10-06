'use strict';

angular.module('app')
.controller('AuthCtrl',function($scope,Auth,Inform){

    $scope.loginForm = {};
    $scope.restoreForm = {};

    $scope.loginFormSubmit = function(){
      Auth.login($scope.loginForm,function(){
        Inform('authUser.loggedInfo',{
          data: Auth.getUser(),
          type: 'success',
          icon: 'check'
        });
      },function(error){
        Inform(error.data.message,{
          type: 'danger',
          icon: 'exclamation-triangle',
          position: 'center',
          duration: 10000
        });
      });
    };

    $scope.restoreFormSubmit = function(){
      Auth.restore($scope.restoreForm);
    };
});