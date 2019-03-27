// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import path from 'path'
import fs from 'fs'
import ScienceDbGlobals from './sciencedb-globals.js'
import  store from './store'
import axios from 'axios'

//when refreshing the page re-set tokin in axios
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] =  'Bearer '+token;
}

Vue.use(ScienceDbGlobals);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
