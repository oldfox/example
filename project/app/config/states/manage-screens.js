// главная страница админки
appConfig.states.manage = {
  url: '/manage',
    parent: 'panels',
    templateUrl: 'app/manage/index.html',
    //accessLevel: 'control',
    scrollTop: 0,
    menu: 'manageMenu'
};
// страница просмотра управления списком модели
appConfig.states.manageList = {
  url: '/manage/:list',
    parent: 'panels',
    templateUrl: 'app/manage/lists.html',
    controller: 'ManageCtrl',
    //accessLevel: 'control',
    scrollTop: 0,
    menu: 'manageMenu'
};