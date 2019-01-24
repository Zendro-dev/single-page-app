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
  console.log("FROM beforeEach",to)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log("FROM beforeEach matched",to)
    console.log("STATUS",store.getters.authStatus)
    if (store.getters.isLoggedIn) {
      console.log("FROM loggedIn",to)
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router;
