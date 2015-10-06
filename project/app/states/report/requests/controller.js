(function(){
  'use strict';

  angular.module('app')
  .controller('ReportRequestsCtrl',function($scope,OgDataGrid,$location,Dialog){

      var tc = $scope.tc = 'report-requests';

      $scope.ReportData = {};

      $scope.getReport = function(){

        $scope.showResultGrid = true;

        var params = {
          bdate: moment($scope.ReportData.from).format('YYYY-MM-DD'),
          edate: moment($scope.ReportData.to).format('YYYY-MM-DD')
        };

        if (params) {

          OgDataGrid({
            object: $scope,
            variable: 'reportResult',
            server: 'backend',
            resource: 'reports/historyCheckCode',
            envelope: 'report',
            params: params
          });

          $location.search(params).replace();

        }

      };

      var search = $location.search();

      if (search.bdate && search.bdate) {
        $scope.ReportData.from = search.bdate;
        $scope.ReportData.to = search.edate;
        $scope.getReport();
      }

      $scope.showAbuse = function(report){
        $scope.requestAbuse = report;
        Dialog.open({
          header: tc+'.dialog-header',
          headerBg: 'danger',
          contentUrl:'app/states/report/requests/abuse-dialog.html',
          scope: $scope
        });
      };

  });

})();