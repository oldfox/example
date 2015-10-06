angular.module('app')
.controller('PanelsCtrl',function($scope,/*$mdMedia,*/webStorage,$state){
    //$scope.sideBarClosed = !$mdMedia('gt-md');

//    $scope.$watch(function(){
//        return !$mdMedia('gt-md');
//    },function(smallScreen){
//        $scope.sideBarClosed = smallScreen;
//    });

    $scope.getStateMenu = function(){
      return $state.current.menu;
    };
})
;