(function(){
  'use strict';

  angular.module('app')
    .controller('AdminCtrl',function($scope,$state,$stateParams){

      var lists = {
        'objects':{},
        'users':{},
        'codeTypes':{},
        'codesOrderStatuses':{},
        'nomenclatures':{},
        'products':{},
        'roles':{},
        'rights':{}
      };

      var listName = $stateParams.list;

      if (lists[listName] && (!lists[listName].access || Auth.check(lists[listName].access))) {
        $scope.listName = $stateParams.list;
      } else {
        $state.go('error',{},{location:'replace'});
      }

    });

})();