appConfig.models.Product = {

  fields: {
    ///////////////////
    // without changes
    direct: [
      'uid',
      'series',
      'created_at'
    ],
    format: {
      dateValidFrom: ['date','cdate','YYYY-MM-DD'],
      dateValidTo: ['date','expdate','YYYY-MM-DD']
    },
    expand: {
      nomenclature: 'Nomenclature'
    },
    normalize: {
//      cdate: function(real){
//        return moment(real.cdate).toDate();
//      },
//      expdate: function(real){
//        return moment(real.cdate).toDate();
//      }
    },
    //////////////////
    denormalize: {
      //cdate: ['date','cdate','YYYY-MM-DD'],
//      cdate: function(normal){
//        //console.log(normal);
//        return moment(normal.cdate).format('YYYY-MM-DD');
//      },
//      expdate: function(normal){
//        //console.log(normal);
//        return moment(normal.expdate).format('YYYY-MM-DD');
//      },
      nomenclature_uid:function(normal){
        return normal.nomenclature ? normal.nomenclature.uid: undefined;
      }
    }
  }

};