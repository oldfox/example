(function(){
  'use strict';

  angular.module('app')
    .controller('AdminProductsCtrl',function($scope,Model,Dialog){

      var tc = $scope.tc = 'admin-products';

      Model('Product').datagrid($scope,'products',{expand:'nomenclature'});



      $scope.setValidTo = function(){

        if (
//          !$scope.EditProduct.dateValidTo
//            &&
          $scope.EditProduct.dateValidFrom
            &&
          $scope.EditProduct.nomenclature && $scope.EditProduct.nomenclature.expmonth
        ) {
          $scope.EditProduct.dateValidTo = moment($scope.EditProduct.dateValidFrom)
            .add($scope.EditProduct.nomenclature.expmonth,'month')
            .toDate();
        }
      };

      var dialog;
      $scope.edit = function(editItem){
        var item = angular.copy(editItem);
        if (item) {
          $scope.mode = 'edit';
          $scope.EditProduct = item;
        } else {
          $scope.mode = 'new';
          $scope.EditProduct = {};
        }
        dialog = Dialog.open({
          //size: 'lg',
          header: tc+'.'+$scope.mode+'-product-dialog',
          contentUrl: 'app/states/admin/products/form.html',
          scope: $scope
        });
      };

      $scope.save = function(item){
        Model('Product').collection($scope.products,'collection').save(item);
        $scope.EditProduct = {};
        dialog.close();
      };

      $scope.delete = function(item){
        Dialog.confirm(tc+'.confirm-delete',function(){

          Model('Product').collection($scope.products,'collection').delete(item);

        });
      };

      Model('Nomenclature').getAll().then(function(nomenclatures) {
        $scope.nomenclatures = nomenclatures;
      });

    });

})();