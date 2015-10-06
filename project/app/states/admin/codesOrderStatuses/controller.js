(function(){
  'use strict';

  angular.module('app')
    .controller('AdminCodesOrderStatusesCtrl',function($scope,Model){

      Model('CodesOrderStatus').datagrid($scope,'codesOrderStatuses');

    });

})();