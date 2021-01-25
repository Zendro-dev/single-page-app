
export default () => ({
  models: [
    {
      id: 0,
      name: 'no_assoc',
      title: 'No_assoc',
      url: '/main/model/no_assoc',
    },
  ],
  adminModels: [
    {
      id: 1,
      name: 'role',
      title: 'Role',
      url: '/main/admin/role',
    },
    {
      id: 2,
      name: 'role_to_user',
      title: 'Role_to_user',
      url: '/main/admin/role_to_user',
    },
    {
      id: 3,
      name: 'user',
      title: 'User',
      url: '/main/admin/user',
    },
  ],
  zendroStudio: {
    id: 4,
    name: 'zendro-studio',
    title: 'Zendro Studio',
    url: '/main/zendro-studio',
  },
})