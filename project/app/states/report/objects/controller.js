(function(){
  'use strict';

  angular.module('app')
  .controller('ReportObjectsCtrl',function($scope,Model,OgDataGrid){

      var tc = $scope.tc = 'report-objects';

      Model('Object').collection($scope,'objects').getAll();

      $scope.ReportData = {};

      $scope.getReport = function(){

        $scope.showResultGrid = true;

        var params = {
          object_uid: $scope.ReportData.object.uid
        };

        if (params) {

          OgDataGrid({
            object: $scope,
            variable: 'reportResult',
            server: 'backend',
            resource: 'reports/balanceInStock',
            envelope: 'report',
            params: params
          });

        }
      };

  });

})();