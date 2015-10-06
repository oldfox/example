'use strict';

angular.module('app')
  .directive('languageSelector',function($localization,$rootScope){
    return {
      restrict: 'A',
      template:
        '<md-select ng-model="language" class="language-selector">'+
          '<md-select-label><img ng-src="{{ language.icon }}" /></md-select-label>'+
          '<md-option ng-value="lang" ng-repeat="lang in languages" class="language-selector-item"><img ng-src="{{ lang.icon }}" /> <span translate="{{lang.name}}"></span></md-option>'+
          '</md-select>',
      scope: true,
      link: function(scope,el,attr){
        var knownLanguages = {
          en: {name:'lang.en',code:'en',icon:'data:image/png;base64,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'},
          ru: {name:'lang.ru',code:'ru',icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC60lEQVRoQ+2Za2sTQRSGz+xms7mnaW3TGixWW1uLLRUE/4M3BBX8IIIgIoIi/hBFBBERBPGDiELx9h/ED8VW6mjVQiW2prZNc9+7M0wCqaQ2YZNNBnZg2SXZ8573mTM3EgScN8S5f3AB2l1BtwKdUAGRmJDJRe88NYOYVegQilmWtc6T84pXhFA3BdhLABY5BRiiAKMEAHMKMOYCtLNyZA64FWhnAcCtQFu7nyR3K9AxFTh66x3u7fJBQdHb7amu/AHZA6vpEry/fYwto0duvsXRoAQllZ6PACw6vuqQqn6v8rxdLP2cNqpb/VwrzXbfV7R9XhEyBQ0+3DnOAKZuvMGUStEYQKc3WRKhqOowc/cEA5i8/hqbZoW70+0zf4KAYPbeSQYwfu0V1g2TD+dllx5RgPn7pxjA6NVp/CejbAGoHqvNIrOrWR2/KyLDlwenGcDIlWm8lt0K0CzTrdLpCcuw8LAMsO/yS7yR01qVqyW6sZAEPx6dYRUYvPQC5xUDdIOPiewREQRlEZYen2UAiYvPcUmzQONkIktkAvskAZJPzjGA/gvPsGYgUHU+ViKvRwBJtGDl6XkG8C2xH3tMEyxVrTled9oZaVD14Ku1i/+7Q/9vN95pp0ZeCXRBhOHkdwbwdWAIS8SCpdQGaMkstCGKZC9o5FByYHmRAeD4IJaRQAD4WEqRLINimTD2e4kBfO7bg32iB6xSyUa/OBeKfD4oGTocTP1kAPM9Cez3esEqFp1zYSMT8vvJYU6F8bUkA/jUvRsHCZVVKNiQdS4UBQKQJ6Pl0PovBjAXG8AhQsUTQI6MlomNZQYw29WPI8EgmPm8c91oI5NAvGaI18n0CgP4GI3jaDgMZi5nQ9a5UCEUgnQ2A1ObKQYwE+3DsXDEOQdNyFQNMEwAFpqg6bjE4c3UCK1AnFwT5Op13IG9hKskfI4C0L+XwuW7PUlno+mxIVvPryfO2mowmwvQYIc1/XW3Ak3v0gYFua/AX9giC0iDQzNKAAAAAElFTkSuQmCC'}
        };

        scope.languages = [];
        angular.forEach($localization.availableLanguages,function(lang){
          if (knownLanguages[lang]) {
            scope.languages.push(knownLanguages[lang]);
          }
        });

        if (scope.languages.length>1) {
          scope.language = knownLanguages[$localization.getLanguage()];

          var init = false;
          scope.$watch('language.code',function(lang){
            if (!init) {
              init = true;
            } else if (lang!=undefined) {
              $localization.setLanguage(lang);
              $rootScope.$broadcast('$language:change');
            }
          });
        } else {
          el.remove();
        }
      }

    };
  });