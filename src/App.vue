<template>
  <div id="app">
      <div v-if="isLoggedIn">
          <button class="logout" v-on:click="logout">Logout</button>
      </div>

      <login-vuex v-if="!isLoggedIn"> </login-vuex>

      <general-message v-if="flag_global_error" :type="'danger'" :errors="errors" v-on:click.native = "closeErrors">

      </general-message>

      <div v-if="isLoggedIn">
        <side-nav> </side-nav>

        <div class="main">
          <router-view></router-view>
        </div>
      </div>
  </div>
</template>

<script>
import sideNav from '@/components/SideNav'
//import appNav from '@/components/AppNav'
import loginVuex from '@/components/LoginVuex'
import generalMessage from '@/components/generalMessage'
import axios from 'axios'

import store from './store'

export default {
  name: 'app',
  data(){
    return {
      flag_global_error : false,
      errors : []
    }
  },
  components: {
    sideNav,
    //appNav,
    loginVuex,
    generalMessage
  },
  computed : {
    isLoggedIn : function(){
      return this.$store.getters.isLoggedIn && !this.$store.getters.isExpired;
    }
  },
  methods: {
  logout: function() {
    this.$store.dispatch('auth_logout')
    .then(() => {
      this.$router.push('/')
    })
  },

  setErrors: function(errors){
    console.log(typeof errors, errors)
    this.flag_global_error = true;
    this.errors = errors;
  },

  closeErrors: function(){
    this.flag_global_error = false;
    this.errors = [];
  }
},

created: function () {
    axios.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.response && err.response.data && err.response.data.status === 401  && err.response.data.name === 'UnauthorizedError') {
        // if you ever get an unauthorized, logout the user
            store.dispatch('auth_logout')
          .then(()=>{
            this.$router.push('/')
          })
        }
        throw err;
      });
    });

    this.$root.$on('globalError', this.setErrors)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}


.main {
    margin-left: 280px; /* Same as the width of the sidenav */
    overflow: auto;
}

.logout{
  position: absolute;
  top: 20px;
  right : 20px;
}

</style>
