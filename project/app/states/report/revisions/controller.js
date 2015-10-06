(function(){
  'use strict';

  angular.module('app')
  .controller('ReportRevisionsCtrl',function($scope,Model,OgDataGrid){
      var tc = $scope.tc = 'report-revisions';

      Model('User').collection($scope,'allUsers').getAll({expand:'roles'}).then(function(){
        var checkMans = [];
        angular.forEach($scope.allUsers,function(user){
          if (user.role && user.role.name=='checkMan') {
            checkMans.push(user);
          }
        });
        $scope.checkMans = checkMans;
      });


      $scope.ReportData = {};

      $scope.getReport = function(){

        $scope.showResultGrid = true;

        var params = {
          bdate: moment($scope.ReportData.from).format('YYYY-MM-DD'),
          edate: moment($scope.ReportData.to).format('YYYY-MM-DD'),
          user_uid: $scope.ReportData.checkMan.uid
        };

        if (params) {

          OgDataGrid({
            object: $scope,
            variable: 'reportResult',
            server: 'backend',
            resource: 'reports/historyOfCheckMan',
            envelope: 'report',
            params: params
          });

        }

      };

  });

})();