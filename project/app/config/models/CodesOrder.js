appConfig.models.CodesOrder = {
  resource: 'generations',
  fields: {
    direct: [
      'uid',
      'prefix',
      'capacity',
      //'codetype_uid',
      'comment'
    ],
//    format: {
//      created_at:['date','created_at']
//    },
    expand: {
      product: 'Product'
    },
    normalize: {
      created_at: function(real){
        return moment(real.created_at).toDate();
      },
      quantity: 'cnt',
      download: function(real,config,access){
        return real.status_uid==3 ? config.servers.backend+'generations/'+real.uid+'/download?access-token='+access.token : '';
      }
    },
    with: {
      codetype: {model:'CodeType',by: 'codetype_uid'},
      status: {model:'CodesOrderStatus',by: 'status_uid'},
      user: {model:'User',by: 'created_by'}
    },
    denormalize: {
      cnt: 'quantity',
      codetype_uid:function(normal){
        return normal.codetype ? normal.codetype.uid: normal.codetype_uid;
      },
      product_uid:function(normal){
        return normal.product ? normal.product.uid: normal.product_uid;
      }
    }
  }
};