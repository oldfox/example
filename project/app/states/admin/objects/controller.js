(function(){
  'use strict';

  angular.module('app')
    .controller('AdminObjectsCtrl',function($scope,Model,Dialog){

      var tc = $scope.tc = 'admin-objects';

      Model('Object').datagrid($scope,'objects');

      var dialog;
      $scope.edit = function(object){
        if (object) {
          $scope.mode = 'edit';
          $scope.EditObject = angular.copy(object);
        } else {
          $scope.mode = 'new';
          $scope.EditObject = {};
        }
        dialog = Dialog.open({
          //size: 'lg',
          header: tc+'.'+$scope.mode+'-object-dialog',
          contentUrl: 'app/states/admin/objects/form.html',
          scope: $scope
        });
      };

      $scope.save = function(object){
        Model('Object').collection($scope.objects,'collection').save(object);
        $scope.EditObject = {};
        dialog.close();
      };

    });

})();