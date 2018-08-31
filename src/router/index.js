import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Callback from '@/components/callback'

Vue.use(Router)

var routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
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
