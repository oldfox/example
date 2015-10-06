'use strict';

//////////// to access module //////////////////////

angular.module('app')
.provider('AuthAccess',function AuthAccessProvider($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

    var access = this;

    this.init = function(config){
        angular.extend(access,config);

        access.roles = buildRoles(access.roles);

        setHttpInterceptor();
    };


    this.$get = function(){
        return access;
    };

    function setHttpInterceptor() {
        $httpProvider.interceptors.push(function($q, $location) {
            var loginUrl = access.loginUrl||'/login';
            return {
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                      if ($location.path()!=loginUrl) {
                        $location.path(access.loginUrl||'/login');
                      }
                    }
                    return $q.reject(response);
                }
            };
        });
    }

    function buildRoles(roles){

        var allRoles = angular.extend({
          guest: {homeState:'index'},
          user: {homeState:'index'}
        },roles);

        var userRoles = {};

        angular.forEach(allRoles,function(data,role){
            userRoles[role] = angular.extend({
                key: role
            },data||{});
        });

        return userRoles;
    }

})

.run(function($rootScope,$state,Auth){

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

        var strict = false;
        var access = false;

        if (toState.access) {
          strict = true;

          if (toState.access=='auth' && Auth.isLoggedIn()) {
            access = true;

          } else {

            if (toState.access.roles && Auth.checkRoles(toState.access.roles)) {
              access = true;
            }

            if (toState.access.permissions && Auth.checkPermissions(toState.access.permissions)) {
              access = true;
            }
          }
        }

        if (strict && !access) {
            $rootScope.error = "Seems like you tried accessing a route you don't have access to...";

            event.preventDefault();

            if(Auth.isLoggedIn()) {
                $state.go('error');
            } else {
              Auth.returnState = $state.current;
              $rootScope.error = null;
              $state.go('login');
            }
        }

    });

    $rootScope.accessAuth = function(){
      return Auth.isLoggedIn();
    };

    $rootScope.accessRoles = function(roles){
      return Auth.checkRoles(roles);
    };

    $rootScope.accessPermissions = function(permissions){
      return Auth.checkPermissions(permissions);
    };
})

.service('Auth', function(AuthAccess,$http, webStorage, Server,$location,$state,$rootScope,Model,Inform){

    var v = 3;

    var currentUser = webStorage.get('user');

    if (!currentUser || currentUser.v!=v) {
      setCurrentUser(null);
    } else {
      AuthAccess.token = currentUser.token;
    }
    $rootScope.AuthUser = getUser();




    function setCurrentUser(AuthUser,extend) {
      if (!AuthUser) {
        currentUser = null;
        webStorage.remove('user');
        AuthAccess.token = null;
      } else {
        currentUser = angular.extend(AuthUser,extend);
        currentUser.roles.push('user');
        currentUser.v = v;
        webStorage.add('user',currentUser);
        AuthAccess.token = currentUser.token;
      }
      $rootScope.$broadcast('AuthAccess:change');
    }

    function getUser() {
      var user = currentUser ? currentUser : {
        name: 'Guest',
        roles: [],
        permissions: []
      };

      return user;
    }

    function checkAccess(access) {
      var allow =false;
      if (access=='auth') {
        if (isLoggedIn()) {
          allow = true;
        }
      } else {
        if (access.roles && checkRoles(access.roles)) {
          allow = true;
        }
        if (access.permissions && checkPermissions(access.permissions)) {
          allow = true;
        }
      }
      return allow;
    }

    function isLoggedIn() {
        return !!currentUser;
    }

    function checkRoles(roles) {
      roles = roles.split(',');
      var allow = false;
      angular.forEach(roles,function(role){
        if (!allow && $.inArray(role,getUser().roles)>-1)
          allow = true;
      });
      return allow;
    }

    function checkPermissions(permissions) {
      permissions = permissions.split(',');
      var allow = false;
      angular.forEach(permissions,function(permission){
        if (!allow && $.inArray(permission,getUser().permissions)>-1)
          allow = true;
      });
      return allow;
    }

//    function checkLevel(levels) {
//      levels = levels.split(',');
//      var role = getRole();
//      var allow = false;
//      angular.forEach(levels,function(level){
//        if (!allow) {
//          if (level=='public') {
//            allow = true;
//          }
//          if (!allow && level=='guest') {
//            if (role.key=='guest')
//              allow = true;
//          }
//          if (!allow && level=='auth') {
//            if (isLoggedIn())
//              allow = true;
//          }
//          if (!allow) {
//            if ($.inArray(role.key,AuthAccess.levels[level]||[])>-1)
//              allow = true;
//          }
//        }
//      });
//
//      return allow;
//    }

//    function checkFunction(functions) {
//      functions = functions.split(',');
//      var userFunctions = getFunctions();
//      var allow = false;
//      angular.forEach(functions,function(func){
//        if (!allow) {
//          if ($.inArray(func,userFunctions)>-1)
//            allow = true;
//        }
//      });
//
//      return allow;
//    }

    var pub = {
        returnUrl: null,
        check: checkAccess,
        checkRoles: checkRoles,
        checkPermissions: checkPermissions,
//        checkLevel: checkLevel,
//        checkFunction: checkFunction,
//        getRole: getRole,
        getUser: getUser,
        isLoggedIn: isLoggedIn,
        register: function(user, success, error) {
          Server('backend','post','register',null,{
            data: user
          })
          .then(function(){

          },error);
        },
        login: function(user, success, error) {

          Server('backend','post','auth',{
              data: user
          })
          .then(function(data){

              setCurrentUser(
                Model('AuthUser').normalize(data.data.user),
                {
                  token: data.data.token.id,
                  roles: og.map(data.data.roles,function(role){
                    return role.name;
                  }),
                  permissions: og.map(data.data.permissions,function(permission){
                    return permission.name;
                  })
                }
              );

              var stdRole = AuthAccess.roles[currentUser.roles[0]];
              stdRole = stdRole||{};

              if (pub.returnUrl) {
                $location.path(pub.returnUrl);
                pub.returnUrl = null;
              } else if (stdRole.homeUrl) {
                $location.path(stdRole.homeUrl);
              } else if (stdRole.homeState){
                $state.go(stdRole.homeState);
              } else {
                $location.path('/');
              }
              $location.replace();

              if (success)
                success(user);
          },error||function(){});
        },
        restore: function(data, success, error) {

          Inform('NOT YET ON SERVER',{position:'center',type:'warning',icon:'meh-o'})

//          Server('backend','post','auth',{
//            data: user
//          })
//            .then(function(data){
//
//              var AuthUser = Model('AuthUser').normalize(data.data.user);
//
//              setUser(AuthUser,data.data.token,data.data.functions);
//
//              var role = pub.getRole();
//              if (pub.returnUrl) {
//                $location.path(pub.returnUrl);
//                pub.returnUrl = null;
//              } else if (role.homeUrl) {
//                $location.path(role.homeUrl);
//              } else if (role.homeState){
//                $state.go(role.homeState);
//              } else {
//                $location.path('/');
//              }
//              $location.replace();
//
//              if (success)
//                success(user);
//            },error||function(){});
        },
        logout: function(success, error) {
          Server('backend','get','logout')
          .then(function(){
              setCurrentUser(null);

              $location.path('/');
              $location.replace();

              if (success)
                success();
          },error||function(){});
        }
    };

    return pub;
})


.directive('accessAuth', function(Auth) {
    return {
        restrict: 'A',
        link: function(scope,el,attr) {


            var prevDisp = el.css('display');

            updateCSS();

            scope.$on('AuthAccess:change',updateCSS);

            function checkAuth() {
              return attr.accessAuth=='false'
                ? !Auth.isLoggedIn()
                : Auth.isLoggedIn();
            }

            function updateCSS() {
                if(checkAuth())
                    el.css('display', prevDisp);
                else
                    el.css('display', 'none');
            }
        }
    };
})


.directive('accessRole', function(Auth) {
    return {
        restrict: 'A',
        link: function(scope, el, attr) {

          var prevDisp = el.css('display');

          updateCSS();

          scope.$on('AuthAccess:change',updateCSS);

          function updateCSS() {
              if(!Auth.checkRoles(attr.accessRole))
                  el.css('display', 'none');
              else
                  el.css('display', prevDisp);
          }
        }
    };
})

.directive('accessPermissions', function(Auth) {
    return {
        restrict: 'A',
        link: function(scope, el, attr) {

          var prevDisp = el.css('display');

          updateCSS();

          scope.$on('AuthAccess:change',updateCSS);

          function updateCSS() {
              if(!Auth.checkPermissions(attr.accessPermissions))
                  el.css('display', 'none');
              else
                  el.css('display', prevDisp);
          }
        }
    };
})
;

angular.module('app')
.config(function(AppConfig,AuthAccessProvider){
    AuthAccessProvider.init(AppConfig.access||{});
});
