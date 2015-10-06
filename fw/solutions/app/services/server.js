'use strict';

angular.module('app')
  .service('Server',function($http,$q,AppConfig,AuthAccess,Inform){

    function getServerConfig(server) {
      var connectionString = AppConfig.servers[server];
      var config = {};
      var parts = connectionString.split(';');
      config.root = parts.shift();
      config.root = config.root.replace(/\/$/,'')+'/';
      if (parts.length) {
        angular.forEach(parts,function(part){
          var keyvalue = part.split('=');
          config[keyvalue[0]] = keyvalue[1];
        });
      }
      return config;
    }

    return function(server,method,url,options) {

      options = options ||{};

      var config = getServerConfig(server);

      var token = AuthAccess.token;
      if (token) {
        options.params = options.params||{};
        options.params['access-token'] = token;
      }

      options = options||{};

      options.method = method;
      options.url = config.root + url.replace(/^\//,'');

      var defer = $q.defer();

      $http(options).then(function(data){
        defer.resolve(data);
      },function(error){
        if (!error.data) {
          Inform('Server error',{
            icon: 'thumbs-down',
            type: 'danger'
          })
        } else {
          defer.reject(error);
        }
      });

      return defer.promise;
    }
  });