(function(){
  'use strict';

  angular.module('app')
  .controller('AdminRightsCtrl',function($scope,Model,Dialog){

      var tc = $scope.tc = 'admin-rights';

      Model('Right').datagrid($scope,'rights');



  });

})();