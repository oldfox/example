angular.module('app')
.controller('UserButtonsCtrl',function($scope,/*$mdDialog,*/Auth,Dialog,Inform,Model){

  $scope.AuthUser = Auth.getUser();

  $scope.confirmLogout = function(){

    Dialog.confirm('authUser.exitConfirm',function(){
      Auth.logout(function(){
        Inform('authUser.logoutInfo','info');
      });
    });
  };

  $scope.openProfile = function(event){

    $scope.AuthUserProfile;

//    Dialog.loader(event).finally(function(dd){
//      console.log('dd',dd);
//    });

    Model('AuthUserProfile').getByPk($scope.AuthUser.uid).then(function(AuthUserProfile){
      $scope.AuthUserProfile = AuthUserProfile;
      console.log(AuthUserProfile);

      /*Dialog.openTemplate('app/components/auth/user-profile.html',{
        targetEvent:event,
        title: $scope.AuthUser.login,
        scopeExtend: {
          getAuthUserProfile: function(){
            return $scope.AuthUserProfile;
          },
          saveAccountData: function(user){
            console.log(Model('User').denormalize(user));
            Model('AuthUserProfile').save(user);
          }
        }
      });*/
    });





    function _showLoader() {
      $('body').append('<div class="md-dialog-container"><md-dialog>11</md-dialog></div>')
      $('body').prepend('<md-backdrop class="md-dialog-backdrop md-opaque md-default-theme" style="top: 0px;" aria-hidden="true"></md-backdrop>')
    }

    function _hideLoader() {

    }
  }

});