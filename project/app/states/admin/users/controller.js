(function(){
  'use strict';

  angular.module('app')
    .controller('AdminUsersCtrl',function($scope,Model,Server,Dialog){

      var tc = $scope.tc = 'admin-users';

      /////////////////////////////////////

      Model('UserRole').getAll().then(function(roles) {
        $scope.roles = roles;
      });

      Model('Object').getAll().then(function(objects) {
        $scope.objects = objects;
      });

      Model('User').datagrid($scope,'users',{expand:'object,roles'});



      //////////////////////////////////////

      var dialog;
      $scope.edit = function(user){
        if (user) {
          $scope.mode = 'edit';

          $scope.EditUser = angular.copy(user);

//          Model('User').relation('Role').getByPk(user.uid).then(function(roles){
//            $scope.EditUser.roles = roles;
//          });



        } else {
          $scope.mode = 'new';
          $scope.EditUser = {
            active: true
          };
        }

        //set roles

        dialog = Dialog.open({
          //size: 'lg',
          header: tc+'.'+$scope.mode+'-user-dialog',
          contentUrl: 'app/states/admin/users/form.html',
          scope: $scope
        });
      };

      $scope.save = function(){
        var user = angular.copy($scope.EditUser);

        if (user.password=='') {
          og.del(user,'password');
        }

        Model('User').collection($scope.users,'collection').save(angular.copy(user)).then(function(savedUser){

          Server('backend','put','users/'+savedUser.uid+'/roles',{
            data: {
              role: user.role.name
            }
          }).then(function(data){
            var listUser = og.findInBy($scope.users.collection,'uid',savedUser.uid);
            angular.extend(listUser,{role: user.role,password:''});
          });

        });


        $scope.EditUser = {};
        dialog.close();
      };

      $scope.delete = function(user){
        Dialog.confirm(tc+'.confirm-delete',function(){

          Model('User').collection($scope.users,'collection').delete(user);

        });
      };

      $scope.generatePassword = function(length){
        $scope.EditUser.password = randomPassword(length);
      };


      $scope.showPermissionsList = function(user){

        var scope = $scope.$new();
        Dialog.open({
          header: tc+'.user-permissions-dialog',
          contentUrl: 'app/states/admin/users/permissions-dialog.html',
          scope: scope
        });

        Server('backend','get','users/'+user.uid+'/permissions').then(function(data){
          scope.permissions = data.data.permissions;
        })
      };

    });

  function randomPassword(length)
  {
    length = length||6;
    if (length<3) length = 3;

    var allChars = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '1234567890'
    ];
    var pass = "";
    angular.forEach(allChars,function(chars){
      pass += chars.charAt(Math.floor(Math.random()*chars.length));
    });
    var charsStr = allChars.join('');
    if (length>3) {
      for(var x=0;x<length-3;x++)
      {
        var i = Math.floor(Math.random() * charsStr.length);
        pass += charsStr.charAt(i);
      }
    }

    return pass.shuffle();
  }

})();