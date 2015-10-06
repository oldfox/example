angular.module('app')
.controller('CodesOrderCtrl',function($scope,Model,Dialog,$state,$stateParams){

  Model('CodeType').collection($scope,'codeTypes').getAll();
  Model('Product').collection($scope,'products').getAll({expand:'nomenclatures'});
  resetOrder();

  $scope.submitCodesOrder = function(order){
    Model('CodesOrder').save(order).then(function(order){

      resetOrder();
      $scope.CodesOrderForm.$setPristine();
      $scope.CodesOrderForm.$setUntouched();

      Dialog.alert(translate('codes-order.order-created',{uid:order.uid}),{
        afterAlertCallback: function(){
          $state.go('codesOrders');
        }
      });

    });
  };

  $scope.resetProduct = function(reset){
    if (reset) {
      $scope.CodesOrder.product = undefined;
      return true;
    }
  };

  function resetOrder() {
    $scope.CodesOrder = {};
  }

});