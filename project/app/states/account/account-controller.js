angular.module('app')
.controller('AccountCtrl',function($scope,Auth,Model/*,Dialog*/){
    Model('AuthUserProfile').getByPk(Auth.getUser().uid).then(function(AuthUserProfile){
      $scope.AuthUserProfile = AuthUserProfile;
    });

    $scope.saveAccountData = function(){

      var newData = $scope.AuthUserProfile;

      if (newData.password=='') {
        og.del(newData,'password');
      }

      Model('AuthUserProfile').save(newData).then(function(ruser,nuser){
      });
    };
});