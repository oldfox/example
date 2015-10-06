(function(){
  'use strict';

  angular.module('app')
    .directive('field',formFieldDirective);

  function formFieldDirective($compile,$timeout){
    return {
      restrict:'A',
      priority:5000,
      link: function(scope,el,attr){
        el.addClass('form-group');
        var input = el.find('[ng-model]:not([checkbox])').addClass('form-control');
        var translateCategory = el.closest('[translate-category]').attr('translate-category');

        if (attr.label!=undefined) {
          var label = input.attr('name');
          label = $compile('<label translate="'+translateCategory+'.label-'+label+'"></label>')(scope);
          el.prepend(label);

          $timeout(function(){
            var model = input.controller('ngModel');
            if (model) {
              /// has value
              scope.$watch(function(){
                return model.$modelValue;
              },function(val){
                if (val==undefined || val=='') {
                  el.addClass('input-is-empty').removeClass('input-has-value');
                } else {
                  el.removeClass('input-is-empty').addClass('input-has-value');
                }
              });
            }
          });

          var inputType = input.attr('type');
          if (inputType=='password') {
            el.addClass('has-feedback');
            var showHide = $('<i class="icon fa fa-eye-slash form-control-feedback show-hide-password" ' +
              '></i>');
            el.append(showHide);
            showHide.on('click',function(){
              input.attr('type',input.attr('type')=='password'?'text':'password');
              showHide.toggleClass('fa-eye fa-eye-slash');
            });
          }

          el.find('[open-eye-by-click]').click(function(){
            input.attr('type','text');
            showHide.removeClass('fa-eye-slash');
            showHide.addClass('fa-eye');
          });

        }
      }
    }
  }


  function _copyNgClasses(input,field) {
    field.removeClass(field.attr('class').split(' ').map(function(item){
        return item.match(/^ng-/) ? item : '';
      }).join(' '));
    $timeout(function(){
      field.addClass(input.attr('class').split(' ').map(function(item){
        return item.match(/^ng-/) ? item : '';
      }).join(' '));
    });
  }

})();