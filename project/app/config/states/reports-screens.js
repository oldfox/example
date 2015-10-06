appConfig.states.reportStatistic = {
  url: '/report/statistic',
  parent: 'panels',
  templateUrl: 'app/states/report/statistic/index.html',
  controller: 'ReportStatisticCtrl',
  access: 'auth'
};

appConfig.states.reportNomenclature = {
  url: '/report/nomenclature',
  parent: 'panels',
  templateUrl: 'app/states/report/nomenclature/index.html',
  controller: 'ReportNomenclatureCtrl',
  access: 'auth'
};

appConfig.states.reportObjects = {
  url: '/report/objects',
  parent: 'panels',
  templateUrl: 'app/states/report/objects/index.html',
  controller: 'ReportObjectsCtrl',
  access: 'auth'
};

appConfig.states.reportRequests = {
  url: '/report/requests',
  parent: 'panels',
  templateUrl: 'app/states/report/requests/index.html',
  controller: 'ReportRequestsCtrl',
  access: 'auth'
};

appConfig.states.reportRevisions = {
  url: '/report/revisions',
  parent: 'panels',
  templateUrl: 'app/states/report/revisions/index.html',
  controller: 'ReportRevisionsCtrl',
  access: 'auth'
};

appConfig.states.reportCodes = {
  url: '/report/codes?code',
  parent: 'panels',
  templateUrl: 'app/states/report/codes/index.html',
  controller: 'ReportCodesCtrl',
  access: 'auth'
};

appConfig.states.reportDownloads = {
  url: '/report/downloads',
  parent: 'panels',
  templateUrl: 'app/states/report/downloads/index.html',
  controller: 'ReportDownloadsCtrl',
  access: 'auth'
};