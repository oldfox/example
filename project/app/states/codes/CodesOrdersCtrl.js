angular.module('app')
.controller('CodesOrdersCtrl',function($scope,Model,$q,AuthAccess,Dialog,Server,OgDataGrid,Inform,$timeout){

    var tc = $scope.tc = 'codes-orders'


    $scope.codesorders = {};

    $q.all([
      Model('CodeType').collection($scope,'codetypes').getAll(),
      Model('CodesOrderStatus').collection($scope,'orderstatuses').getAll(),
      Model('User').collection($scope,'users').getAll({expand:'object'})
    ]).then(function(){
      Model('CodesOrder')
        .with('codetype',$scope.codetypes)
        .with('status',$scope.orderstatuses)
        .with('user',$scope.users)
        .datagrid($scope,'codesorders',{expand:'product'});

//        $scope.codesorders = [
//          {test:1},
//          {test:1},
//          {test:1},
//          {test:1}
//        ];
    });

    $scope.selectedOrders = {};
    $scope.toggleAll = function(value){
      angular.forEach($scope.selectedOrders,function(order,id){
        $scope.selectedOrders[id] = value;
      });
    };

    $scope.hasSelected= function(){
      var selected = 0;
      angular.forEach($scope.selectedOrders,function(value){
        if (value) {
          selected++;
        }
      });
      return selected;
    };

    $scope.setOrders = function(action,event){
//      Dialog.confirm(translate('codes-orders.Confirm-'+action+'-orders-action',{n: $scope.hasSelected()}),function(){
//
//      },{targetEvent:event});
    };

    $scope.getOrdersPagination = function(){
      return 'ss'
    }

    $scope.resetSelected = function(){
      console.log('reset');
      $scope.selectedOrders = {};
    };

    $scope.tokenRequest = '?access-token='+AuthAccess.token;

    $scope.printCodes = function(orderUid){

      var dialogScope = $scope.$new();

      OgDataGrid({
        object: dialogScope,
        variable: 'codesGridData',
        server: 'backend',
        resource: 'generations/'+orderUid+'/print',
        envelope: 'codes'
      });

//      Server('backend','get','generations/'+orderUid+'/print').then(function(data){
        //dialogScope.codes = data.data.codes;
        dialogScope.cardWidth = 125;
        dialogScope.fontSize = 12;
        //dialogScope.oneOnPage = true;

        dialogScope.sendOnPrinter = function(){
          $('#print-order-codes').print();
        };

        Dialog.open({
          size: 'lg',
          header: tc+'.print-codes-dialog',
          contentUrl: 'app/states/codes/orders-codes-print.html',
          scope: dialogScope
        });
//      });
    };

      var downloadParams = $scope.downloadParams = [
        {field:'created_at', title: tc+'.column-created'},
        {field:'uid', title: tc+'.column-uid'},
        {field: 'cnt', title: tc+'.column-quantity'},
        {field: 'codetype.name', title: tc+'.column-type'},
        {field: 'product.nomenclature.name', title: tc+'.column-product-nname'},
        {field: 'product.series', title: tc+'.column-product-series'},
        {field: 'generationStatus.name', title: tc+'.column-status'}
      ];

      downloadParams[tc+'.column-created'] = 'created_at';
      downloadParams[tc+'.column-uid'] = 'created_at';


});