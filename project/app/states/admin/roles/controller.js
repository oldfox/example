(function(){
  'use strict';

  angular.module('app')
  .controller('AdminRolesCtrl',function($scope,Model,Dialog){

      var tc = $scope.tc = 'admin-roles';

      Model('UserRole').datagrid($scope,'roles');

      var dialog;
      $scope.edit = function(role){
        if (role) {
          $scope.mode = 'edit';
          $scope.EditRole = angular.copy(role);
        } else {
          $scope.mode = 'new';
          $scope.EditRole = {};
        }
        dialog = Dialog.open({
          //size: 'lg',
          header: tc+'.'+$scope.mode+'-role-dialog',
          contentUrl: 'app/states/admin/roles/form.html',
          scope: $scope
        });
      };

      $scope.save = function(role){
        Model('Role').collection($scope.roles,'collection').save(role);
        $scope.EditRole = {};
        dialog.close();
      };

  });

})();