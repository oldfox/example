(function(){
  'use strict';

  angular.module('app')
    .directive('maxHeight',maxHeightDirective);

  function maxHeightDirective() {
    return {
      restrict: 'A',
      link: function(scope,el){
        var style = {
          height: '100%',
          'max-height': '100%'
        };
        el.css(style);
        el.parent().css(style);
      }
    };
  }

})();