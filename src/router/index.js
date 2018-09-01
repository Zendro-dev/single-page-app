import Vue from 'vue'
import Router from 'vue-router'

import childPaths from './routes_index'
import Home from '@/components/Home'
import Callback from '@/components/callback'
import Login from '@/components/Login'
import { requireAuth } from '../auth'

Vue.use(Router)

childPaths.push(
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
)

var routes = [
  {
    path: '/login',
    name: 'Login',
    beforeEnter: requireAuth,
    component: Login,
    children : childPaths
  },
  {
    path: '/callback',
    component: Callback
  }
];

export default new Router({
  mode: 'history',
  routes: routes
})
