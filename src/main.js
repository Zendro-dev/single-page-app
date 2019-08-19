// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import path from 'path'
import fs from 'fs'
import ScienceDbGlobals from './sciencedb-globals.js'
import store from './store'
import axios from 'axios'

// See 
// https://fontawesome.com/how-to-use/on-the-web/using-with/vuejs
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import vuetify from './plugins/vuetify';

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)

//when refreshing the page re-set tokin in axios
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

Vue.use(ScienceDbGlobals);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
