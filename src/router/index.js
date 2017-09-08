import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Users from '@/components/users'
import UserCreate from '@/components/UserCreateForm'
import UserEdit from '@/components/UserEditForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
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
})
