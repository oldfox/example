(function(){
  'use strict';

  angular.module('app')
  .controller('ReportNomenclatureCtrl',function($scope,Server,OgDataGrid,$location,$timeout){

      var tc = $scope.tc = 'report-nomenclature';

      $scope.ReportData = {};

      $scope.tabs = {
        byCodes: true,
        byDates: false
      };

      $scope.getReport = function(){
        var params,url;

        $scope.showResultGrid = true;

        if ($scope.tabs.byCodes) {
          params = {
            codes: $scope.ReportData.codesList.replace(/\s/g,'').replace(/\n/g,'')
          };
          url = 'historyByCode';
          $location.search('bdate',null);
          $location.search('edate',null);

        } else if ($scope.tabs.byDates) {

          if ($scope.ReportData.createdFrom && $scope.ReportData.createdTo) {
            params = {
              bdate: moment($scope.ReportData.createdFrom).format('YYYY-MM-DD'),
              edate: moment($scope.ReportData.createdTo).format('YYYY-MM-DD')
            };
          }
          if ($scope.ReportData.series) {
            params = params||{};
            params.series = $scope.ReportData.series;
          }
          $location.search(params).replace();

          url = 'historyByDate';
        }

        if (params) {

          $scope.reportName = url;

          OgDataGrid({
            object: $scope,
            variable: 'reportResult',
            server: 'backend',
            resource: 'reports/'+url,
            envelope: 'report',
            params: params
          });

        }
      };

      var search = $location.search();
      $timeout(function(){

        if (search.bdate && search.edate) {
          $scope.tabs = {
            byCodes: false,
            byDates: true
          };
          $scope.getReport();
        }

        if (search.code) {
          $scope.getReport();
        }

      });

      $scope.ReportData.createdFrom = search.bdate;
      $scope.ReportData.createdTo = search.edate;
      $scope.ReportData.series = search.series;
      $scope.ReportData.codesList = search.code;

  });

})();