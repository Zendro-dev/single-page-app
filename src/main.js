// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import path from 'path'
import fs from 'fs'
import router from './router/index.js'
import ScienceDbGlobals from './sciencedb-globals.js'

Vue.use(ScienceDbGlobals);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
