(function(){
  'use strict';

  angular.module('app')
    .config(function(nyaBsConfigProvider){
      nyaBsConfigProvider.setLocalizedText('loc',{
        defaultNoneSelection: ' ',
        noSearchResultTpl: 'icon?',
        numberItemSelected: '%d'
      });
      nyaBsConfigProvider.useLocale('loc');
    })
    .directive('ogSelect',function($compile,$timeout,nyaBsConfig){
      return {
        restrict: 'E',
        terminal: true,
        compile: function(el,attr){

          var checkMark = el.attr('check-mark-icon')||'check';

          var select,solid;
          return {
            pre: function(scope,el,attr){
              var selectedCountText = el.attr('selected-count-text')||'{n}';
              el.removeAttr('selected-count-text');
              nyaBsConfig.numberItemSelected = translate(selectedCountText).replace('{n}','%d');

              var option = el.find('option');
              select = $('<ol class="nya-bs-select"></ol>')
                .append($('<li ng-if="'+option.attr('list')+'==undefined" class="dropdown-header"><i loader></i></li>'))
                .append($('<li ng-if="'+option.attr('list')+'!=undefined && !'+option.attr('list')+'.length" class="dropdown-header"><span translate="'+(el.attr('empty-text')||'Empty list')+'"></span></li>'))
                .append($('<li nya-bs-option="'+option.attr('item')+' in '+option.attr('list')+' '+(option.attr('list-params')||'')+'"></li>').html('<a title="'+option.attr('title')+'"><span>'+option.html()+'</span><span class="fa fa-'+checkMark+' check-mark"></span></a>'));

              if (el.attr('inline')!=undefined) {
                select.addClass('inline');
              }

              if (el.attr('multiple')!=undefined && el.attr('multiple') && el.attr('solid')!=undefined) {
                solid = true;
              }

              angular.forEach(attr.$attr,function(attrName,attrKey){
                select.attr(attrName,attr[attrKey]);
              });

              if (select.attr('selected-text-format')==undefined) {
                select.attr('selected-text-format','count>0');
              }

              $compile(select[0])(scope);

              el.before(select);
              el.remove();

            },
            post: function(scope,el,attr){
              select.find('>button.btn').removeClass('btn btn-default').addClass('form-control');
              if (solid) {
                var toggle = select.find('.dropdown-toggle');
                $timeout(function(){
                  toggle.click();
                  select.addClass('solid');
                  select.removeClass('open');
                  $timeout(function(){
                    toggle.off('click');
                  });
                });
              }
            }
          };


        }
      };
    });

})();