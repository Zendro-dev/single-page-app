import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Users from '@/components/users'
import UserCreate from '@/components/UserCreateForm'
import UserEdit from '@/components/UserEditForm'
import glob from 'glob-fs'
import fs from 'fs-extra'

Vue.use(Router)

var routes = [
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
  ];


// Include model specific routes:
glob.sync(__dirname + '/*Routes.js').forEach(function(file) {
    console.log('Requiring model specific routes from \'%s\'', file);
    eval(fs.readFileSync(path.resolve(file)))
});

console.log("Routes are:")
console.log(routes)

export default new Router({
  routes: routes
})
