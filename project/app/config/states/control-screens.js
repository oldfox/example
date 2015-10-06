// страница просмотра управления списком модели
appConfig.states.controlList = {
  url: '/control/:list',
    parent: 'panels',
    templateUrl: 'app/states/control/lists.html',
    controller: 'ControlCtrl',
    //accessLevel: 'control',
    scrollTop: 0
};