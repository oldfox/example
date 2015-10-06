(function(){
  'use strict';

  angular.module('app')
  .controller('ReportDownloadsCtrl',function(AuthAccess,AppConfig,$scope,Model,Server,OgDataGrid){

      var tc = $scope.tc = 'report-downloads';

      $scope.backend = AppConfig.servers.backend;
      $scope.accessToken = AuthAccess.token;

      OgDataGrid({
        object: $scope,
        variable: 'downloads',
        server: 'backend',
        resource: 'reports',
        envelope: 'report'
      });

  });

})();