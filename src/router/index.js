import Vue from 'vue'
import Router from 'vue-router'

import childPaths from './routes_index'
import Home from '@/components/Home'
import LoginVuex from '@/components/LoginVuex'
import store from '../store' //  vuex store

import Restricted from '@/components/Restricted'

Vue.use(Router)

// childPaths.push(
//   {
//     path: '/home',
//     name: 'Home',
//     component: Home
//   }
// )



let routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },

  {
    path: '/',
    name: 'Login',
    component: LoginVuex
  },

  {
    path: '/restricted',
    name: 'Restricted',
    component: Restricted,
    meta:{
      requiresAuth : true
    }
  }

];

routes.push(...childPaths);

let router = new Router({
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router;
