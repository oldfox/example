angular.module('app')
.controller('CodesRecallCtrl',function($scope,Model,Server,Dialog,$timeout,$state,$stateParams){

    var tc = $scope.tc = 'codes-recall';

    $scope.CodesRecall = {};

    $scope.tabs = {
      byCodes: true,
      byDates: false
    };

    var getCodesList = function(){
      return $scope.CodesRecall.codesList.replace(/\s+/g,'').split(',');
    };

    var setError = function(errData){
      $scope.CodesRecallForm.$setBackendErrors(errData,{codes:'codesList'});
    };

    var onSuccess = function(key){
      $scope.CodesRecall = {};
      Dialog.alert(tc+'.'+key+'-success');
    };

    var postData = function(data,url){
      Server('backend','post',url,{
        data: data
      }).then(function(data){
        onSuccess(url);
      },function(err){
        setError(err.data)
      });
    };

    $scope.submitRecall = function(url){

      var data;

      if ($scope.tabs.byCodes) {
        data = {
          codes: getCodesList(),
          note: $scope.CodesRecall.note
        };
      } else if ($scope.tabs.byDates) {
        data = {
          bdate: moment($scope.CodesRecall.createdFrom).format('YYYY-MM-DD'),
          edate: moment($scope.CodesRecall.createdTo).format('YYYY-MM-DD'),
          note: $scope.CodesRecall.note
        };

        if ($scope.CodesRecall.series) {
          data.series = $scope.CodesRecall.series;
        }
      }

      if (data) {
        Dialog.confirm(tc+'.'+url+'-confirm',function(){
          postData(data,url);
        });
      }

    };


});