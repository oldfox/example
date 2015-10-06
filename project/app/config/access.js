//=====================================================
// AuthAccess config

appConfig.access = {
  roles: {
    user: {homeState:'account'},
    admin: {homeUrl: 'admin/users'}
  },
  levels: {
    // public
    // guest
    // auth
    operate: ['admin', 'manager', 'operator'],
    manage: ['admin', 'manager'],
    control: ['admin']
  }
};