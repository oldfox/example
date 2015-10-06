appConfig.models.User = {

  fields: {
    ///////////////////
    // without changes
    direct: ['uid','active','login','email'],
    expand: {
      object: 'Object',
    },
    postexpand: {
      role: 'Role'
    },
    ////////////////
    normalize: {
      name: 'fio',
      role: function(real){
        return real.roles ? real.roles[0] : undefined;
      },
//      roles: function(real){
//        return og.map(real.roles,function(role){
//          return role.name;
//        });
//      },
      roles_list:function(real){
        var list = [];
        if (real.roles && real.roles.length) {
          $.each(real.roles,function(i,role){
            list.push(role.description);
          });
        }
        return list.join(',');
      }
    },
    // postprocess normalized model
    postnormalize: {

//      dearMister: function(normal){ return 'Mr. ' + normal.login.toUpperCase(); },
//      fullname: function(normal){ return normal.name + ' aka '+normal.login; }
    },
    //////////////////
    denormalize: {
      fio: 'name',
      object_uid:function(normal){
        return normal.object ? normal.object.uid: normal.object_uid;
      },
      role_uid:function(normal){
        return normal.role ? normal.role.uid: normal.role_uid;
      },
      password: function(normal){
        return normal.password;
      }
    },
    /////////////
    validate: {}
  },

  relations: {
    objects: {model: 'Object',fk:'objectId'}
  }

};