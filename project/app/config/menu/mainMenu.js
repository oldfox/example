appConfig.menu.mainMenu = [
  {id: 'codes',/*icon:'barcode',*/items:[
    {id:'order',access:{permissions:'generation-create'},url:'/codes/order'},
    {id:'orders',access:{permissions:'generation-view'},url:'/codes/orders'}
  ]},
  {id:'recall',access:{permissions:'codeFunction-removed,codeFunction-defected,codeFunction-claim'},url:'/codes/recall'},
  {id:'reports',items:[
    //{id:'statistic',url:'/report/statistic'},
    {id:'nom-move',access:{permissions:'reports-historyCode'},url:'/report/nomenclature'},
//    {id:'objects-vol',access:{permissions:'reports-balanceInStock'},url:'/report/objects'},
    {id:'user-requests',access:{permissions:'reports-historyCheckCode'},url:'/report/requests'},
    {id:'revisions',access:{permissions:'reports-historyOfCheckMan'},url:'/report/revisions'},
    {id:'codes-data',url:'/report/codes'},
    {id:'downloads',access:{permissions:
      'reports-historyOfCheckMan,reports-historyCode,reports-historyCheckCode'
    },url:'/report/downloads'}
  ]},
  {id:'admin',items:[
    {id:'objects',access:{permissions:'reference-objects'},url:'/admin/objects'},
    //{id:'codeTypes',/*icon:'credit-card-multiple',*/url:'/admin/codeTypes'},
    //{id:'codesOrderStatuses',/*icon:'flag',*/url:'/admin/codesOrderStatuses'},
    {id:'nomenclatures',access:{permissions:'reference-nomenclature'},url:'/admin/nomenclatures'},
    {id:'products',access:{permissions:'reference-product'},url:'/admin/products'},
    {id:'users',access:{permissions:'users-crud'},url:'/admin/users'},
    {id:'roles',access:{permissions:'users-crud'},url:'/admin/roles'}
    //{id:'rights',/*icon:'flag',*/url:'/admin/rights'}
  ]}
//  {id: 'users', icon: 'account-multiple', 'url': '/control/users'},
//  {id: 'operationtypes', icon: 'filter', 'url': '/control/operationtypes'},
//  {id: 'codetypes', icon: 'flag-variant', 'url': '/control/codetypes'}
];