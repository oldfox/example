(function(){
  'use strict';

  angular.module('app')
    .directive('ogValidate',function($timeout,$compile){
      var map = {
        //'required=required':'required',
        'type=number':'number',
        'type=email':'email',
        'ng-minlength':'minlength',
        'ng-maxlength':'maxlength',
        'pattern': 'pattern',
        'ng-pattern': 'pattern',
        'og-backend': 'backend'
      };
      return {
        restrict: 'A',
        require:'?^form',
        priority: -1,
        compile: function(el,attr){
          var name = el.attr('name');
          var translateCategory = el.closest('[translate-category]').attr('translate-category');

          var formModel = attr.ngModel.replace(/\./,'Form.');

          var messages = $('<div ng-messages="'+formModel+'.$error" class="text-danger" role="alert"></div>');
          var backendMessage;

          angular.forEach(map,function(validationKey,validationAttr){
            validationAttr = validationAttr.split('=');
            if (
              (validationAttr[1]!==undefined && el.attr(validationAttr[0])==validationAttr[1])
                ||
              (validationAttr[1]===undefined && el.attr(validationAttr[0])!==undefined)
            ) {
              if (validationKey=='backend') {
                backendMessage = true;
              } else {
                messages.append('<div ng-message="'+validationKey+'"><span translate="'+translateCategory+'.invalid-'+validationKey+'-'+name+'"></span></div>');
              }
              var message = validationKey=='backend'?'<span>{{'+formModel+'.$error.backend}}</span>':'';
            }
          });

          if (backendMessage) {

            messages.append($('<div ng-show="!'+formModel+'.$invalid && '+formModel+'.$backendError"><span>{{'+formModel+'.$backendError}}</<span>&nbsp;&nbsp;&nbsp;<b class="og-backend-validate-dismiss" ng-click="'+formModel+'.$backendError=null">&times;</b></div>'));
          }

          el.closest('[field]').append(messages);

          return {
            pre: function(scope){
              $compile(messages)(scope);
            },
            post: function(scope,el,attr,form){
              if (form) {
                form.$setBackendErrors = form.$setBackendErrors||function(data,fieldsMap,messageParse){
                  var th = this;
                  messageParse = messageParse||function(text){
                    return text.replace(/Error: (.*)/,'$1');
                  };
                  fieldsMap = fieldsMap||{};
                  angular.forEach(data,function(error){
                    if (error.field && error.message) {
                      var field = fieldsMap[error.field] ? fieldsMap[error.field] : error.field;
                      if (th[field]!==undefined) {
                        th[field].$backendError = messageParse(error.message);
                      }
                    }
                  });
                };
              }
              $timeout(function(){
                var label = el.closest('[field]').find('>label');
                if (label.length) {
                  var model = el.controller('ngModel');
                  if (model) {
                    /// required
                    scope.$watch(function(){
                      return model.$error.required;
                    },function(error){
                      if (error) {
                        label.append('<b class="text-danger"> *</b>');
                      } else {
                        label.find('b').remove();
                      }
                    });

                  }
                }

              },250);

            }
          };
        }
      };
    });
})();