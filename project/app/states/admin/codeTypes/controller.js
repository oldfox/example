(function(){
  'use strict';

  angular.module('app')
    .controller('AdminCodeTypesCtrl',function($scope,Model,Dialog){

      Model('CodeType').datagrid($scope,'codeTypes');

    });

})();