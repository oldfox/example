(function(){
  'use strict';

  angular.module('app')
    .directive('ogDatepicker',function($compile,$timeout,amDateFormatFilter,$parse){

      return {
        restrict: 'A',
        terminal: true,
        priority: 3000,
        compile: function(el,attr){

          var id = Math.ceil(Math.random()*10e10);
          var options = $parse(el.attr('og-datepicker'))()||{};
          options.format = options.format||'ll';

          el.removeAttr('og-datepicker');

          el.attr('datepicker-popup','');

          var dpOptions;
          angular.forEach(['minMode','maxMode'],function(key){
            if (options[key]) {
              dpOptions = dpOptions||{};
              dpOptions[key] = options[key];
            }
          });
          if (dpOptions) {
            el.attr('datepicker-options',angular.toJson(dpOptions));
          }

          angular.forEach({
            mode: 'datepicker-mode'
          },function(attr,key){
            if (options[key]) {
              el.attr(attr,'\''+options[key]+'\'');
            }
          });

          el.attr('is-open','$root.dp'+id);

          el.attr('show-weeks',el.attr('show-weeks')||false);
          el.attr('show-button-bar',el.attr('show-button-bar')||false);
          el.attr('type','text');


          el.parent().addClass('has-feedback og-datepicker-input');
          el.after('<i class="fa fa-calendar form-control-feedback"></i>');
          el.attr('ng-click','$root.dp'+id+'=!$root.dp'+id);

          var display = $('<div ng-class="{open:$root.dp'+id+'}"><div class="form-control display"></div></div>').css('position','relative');

//          var display = $('<div ng-class="{open:dp'+id+'}"><div class="form-control display"></div></div>').css('position','relative');
          el.before(display);

          display.append(el);


          return {
            pre: function(scope,el,attr){
              $timeout(function(){
                $compile(el[0])(scope);
              });
            },
            post: function(scope,el,attr){

              $timeout(function(){

                var input = el.find('[datepicker-popup]');
                var display = el.find('.display');

                input.focus(function(e){
                  e.preventDefault();
                  input.blur();
                });

                var unwatch = scope.$watch(function(){
                  return input.val();
                },function(val){
                  var date = '';
                  if (val) {
                    date = amDateFormatFilter(new Date(val),options.format);
                  }
                  $timeout(function(){
                    display.text(date);
                  });
                });

                scope.$on('$destroy',function(){
                  unwatch();
                });

              },200);



            }
          };


        }
      };
    });
})();