'use strict';

angular.module('app')
.directive('translationsInclude',function($rootScope,angularLoad,$localization,$translate,tmhDynamicLocale,AppConfig){

    var hideTranslations;

    return {
      restrict: 'A',
      link: function(scope,el){

        hideTranslations = angular.element('<style type="text/css"></style>');
        el.prepend(hideTranslations);

        setTranslations();

        $rootScope.$on('$language:change',setTranslations);

      }
    };

    function setTranslations(){
      var lang = $localization.getLanguage();

      hideTranslations.text('[translate] { opacity:0; }');

      tmhDynamicLocale.set(lang);

      angularLoad.loadScript('/i18n/translations/'+lang+'.js?'+AppConfig.scriptsCacheKey||new Date().getTime())
        .then(function(){
          setTranslationsData(lang,window.translations);
        })
        .catch(function(){
          setTranslationsData(lang);
        })
      ;

      angularLoad.loadScript('/i18n/moment/'+lang+'.js?'+AppConfig.scriptsCacheKey||new Date().getTime());
    }

    function setTranslationsData(lang,data) {
      $localization.setLocale(lang,data||{});
      $translate.use(lang);
      hideTranslations.text('');
      $('[src^="/i18n/translations/"]').remove();
    }
  });