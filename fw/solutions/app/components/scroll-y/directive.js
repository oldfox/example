(function(){
  'use strict';

  angular.module('app')
    .directive('scrollY',function(){
      return {
        restrict:'A',
        link: function(scope,el){

          _setHeight(el);

          $(window).resize(function(){
            _setHeight(el);
          });
        }
      };
    });

  function _setHeight(el) {
    var container = el.closest('[scroll-y-container]');
    var height = container.innerHeight();
    var fixed = el.parent().find('[scroll-y-fixed]');
    if (fixed.length) {
      height -= fixed.outerHeight();
    }
    el.outerHeight(height);
  }

})();