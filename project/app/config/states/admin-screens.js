// страница просмотра управления списком модели
appConfig.states.admin = {
  url: '/admin/:list',
    parent: 'panels',
    templateUrl: 'app/states/admin/list.html',
    controller: 'AdminCtrl',
    //accessLevel: 'control',
    scrollTop: 0
};