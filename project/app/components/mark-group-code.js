(function(){
  'use strict';

  angular.module('app')
    .directive('markGroupCode',function($timeout){
      return {
        restrict: 'A',
        priority:-1,
        link: function(scope,el){
          $timeout(function(){
            var code = $.trim(el.text());

            if (code && (code.match(/^\d+$/)|| code=='Групповой')) {
              el.addClass('group-code');
            }
          },100);
        }
      }
    });

})();