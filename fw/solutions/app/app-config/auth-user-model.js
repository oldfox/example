appConfig.models.AuthUser = {
  fields: {
    direct: ['uid','login'],
    normalize: {
      name: 'fio'
    }
  }
};


appConfig.models.AuthUserProfile = {
  resource: 'users',

  fields: {
    // fields
    direct: ['uid','login','email','password'],
    normalize: {
      name: 'fio'
    },
    denormalize: {
      fio: 'name'
    }
  }

};