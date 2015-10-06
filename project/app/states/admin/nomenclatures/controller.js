(function(){
  'use strict';

  angular.module('app')
    .controller('AdminNomenclaturesCtrl',function($scope,Model,Dialog){

      var tc = $scope.tc = 'admin-nomenclatures';

      Model('Nomenclature').datagrid($scope,'nomenclatures');

      var dialog;
      $scope.edit = function(item){
        if (item) {
          $scope.mode = 'edit';
          $scope.EditNomenclature = item;
        } else {
          $scope.mode = 'new';
          $scope.EditNomenclature = {};
        }
        //console.log('open');
        dialog = Dialog.open({
          //size: 'lg',
          header: tc+'.'+$scope.mode+'-nomenclature-dialog',
          contentUrl: 'app/states/admin/nomenclatures/form.html',
          scope: $scope
        });
      };

      $scope.save = function(item){
        Model('Nomenclature').collection($scope.nomenclatures,'collection').save(item);
        $scope.EditNomenclature = {};
        dialog.close();
      };

      $scope.delete = function(item){
        Dialog.confirm(tc+'.confirm-delete',function(){

          Model('Nomenclature').collection($scope.nomenclatures,'collection').delete(item);

        });
      };

    });

})();