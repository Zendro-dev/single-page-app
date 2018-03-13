import users from '@/components/users'
import UserCreate from '@/components/UserCreateForm'
import UserEdit from '@/components/UserEditForm'

routes = routes.concat(
  [
    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/user/:id',
      name: 'UserEdit',
      component: UserEdit,
    },
    {
      path: '/user',
      name: 'UserCreate',
      component: UserCreate,
    }
  ]
)
