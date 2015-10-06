appConfig.states.account = {
  url: '/account',
  parent: 'panels',
  templateUrl: 'app/states/account/index.html',
  controller: 'AccountCtrl',
  access: 'auth'
};

// project screens ---------------------------
appConfig.states.index = {
  url: '/',
  controller: ['$state',function($state){
    $state.go('account');
  }]
//  parent: 'main',
//  templateUrl: 'app/states/pages/index.html'
  //accessLevel: 'user'
};

//appConfig.states.pages = {
//  url: '/{pageName:about|contact}',
//    parent: 'panels',
//    templateUrl: 'app/templates/page.html',
//    controller: 'PageCtrl',
//    //accessLevel: 'member'
//    scrollTop: 0,
//    menu: 'leftMenu'
//};