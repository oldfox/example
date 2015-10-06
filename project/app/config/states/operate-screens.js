// главная страница админки
appConfig.states.operate = {
  url: '/operate',
    parent: 'panels',
    templateUrl: 'app/operate/index.html',
    //accessLevel: 'control',
    scrollTop: 0,
    menu: 'operateMenu'
};
// страница просмотра управления списком модели
appConfig.states.operateList = {
  url: '/operate/:list',
    parent: 'panels',
    templateUrl: 'app/operate/lists.html',
    controller: 'OperateCtrl',
    //accessLevel: 'control',
    scrollTop: 0,
    menu: 'operateMenu'
};