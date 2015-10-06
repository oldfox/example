appConfig.models.CodeInfo = {
  resource: 'code',
  envelope: null,
  fields: {
    direct: ['uid','code','ucnt','status'],
    expand: {
      type: ['codeType','CodeType'],
      order: ['generation','CodesOrder'],
      product: 'Product'
    },
    normalize: {
//      status: function(real){
//        return real.status;
//      }
    }
  }
};