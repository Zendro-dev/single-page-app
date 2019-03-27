import Vue from 'vue'
import Router from 'vue-router'

import childPaths from './routes_index'
import Home from '@/components/Home'
import LoginVuex from '@/components/LoginVuex'
import store from '../store' //  vuex store

Vue.use(Router)

let routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  }
  // ,
  // {
  //   path: '/',
  //   name: 'Login',
  //   component: LoginVuex
  // }

];

routes.push(...childPaths);

let router = new Router({
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn && !store.getters.isExpired) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router;
