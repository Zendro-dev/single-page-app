// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import path from 'path'
import fs from 'fs'
import ScienceDbGlobals from './sciencedb-globals.js'
import  store from './store'

Vue.use(ScienceDbGlobals);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
