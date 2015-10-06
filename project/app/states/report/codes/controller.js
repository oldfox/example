(function(){
  'use strict';

  angular.module('app')
  .controller('ReportCodesCtrl',function($scope,$location,Model,Server,OgDataGrid){

      var tc = $scope.tc = 'report-codes';

      $scope.CodesInfo = {};

      $scope.getInfo = function(){

        var CodesInfo = $scope.CodesInfo;
        $location.search({code: CodesInfo.code}).replace();
        $scope.process = 1;
        $scope.iprocess = -1;
        $scope.notFound = false;
        $scope.code = false;

        Server('backend','get','code/'+CodesInfo.code).then(function(data){
          $scope.code = Model('CodeInfo').normalize(data.data.code);
          $scope.childGroup = data.data.childGroup;

          $scope.status = data.data.message;

          $scope.historyLastOutCome = data.data.historyLastOutCome;
          $scope.history = data.data.history;
//          $scope.historyCheckMan = data.data.historyCheckMan;
//          $scope.historyLastView = data.data.historyLastView;

          $scope.process--;



//          OgDataGrid({
//            object: $scope,
//            variable: 'childCodes',
//            server: 'backend',
//            resource: 'code/'+CodesInfo.code+'/codes',
//            envelope: 'codes'
//          });

        },function(error){
          $scope.notFound = true;
          $scope.process--;
        });

        Server('backend','get','code/'+CodesInfo.code+'/codes').then(function(data){
          $scope.childCodes = data.data.codes;
        });



//        Model('CodeInfo').getByPk(CodesInfo.code)
//          .then(function(data){
//            console.log(data);
//            $scope.process = false;
//            console.log(data);
//            $scope.error = false;
//            $scope.code = data;
//          })
//          .catch(function(){
//            $scope.process = false;
//            $scope.error = true;
//            $scope.code = false;
//          });

      };

      $scope.showIndividuals = function(code){

        $scope.iprocess = 1;



//        Server('backend','get','code/'+code+'/individual').then(function(data){
//
//
//
//          $scope.individuals = data.data.individualCodes;
//          $scope.iprocess = 0;
//        },function(error){
//          $scope.iprocess = 0;
//        });
      };

      var search = $location.search();
      if (search.code!=undefined && search.code!==true) {
        $scope.CodesInfo.code = search.code;
        $scope.getInfo();
      }


      $scope.loadSubItem = function(variable,item){
        Server('backend','get','code/'+item.code+'/codes',{params:{'per-page':999999}}).then(function(data){
          $scope[variable] = data.data.codes;
          console.log($scope);
        });
      };

  });

})();