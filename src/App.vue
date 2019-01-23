<template>
  <div id="app">
  <!--  <app-nav></app-nav>
      <div v-if="!isLoggedIn">
        <login-vuex> </login-vuex>
      </div>
-->
      <div v-if="isLoggedIn">
          <button class="logout" v-on:click="logout">Logout</button>
      </div>


      <div v-if="isLoggedIn">
        <side-nav> </side-nav>

      </div>

      <div  class="main">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
import sideNav from '@/components/SideNav'
//import appNav from '@/components/AppNav'
import loginVuex from '@/components/LoginVuex'

import store from './store'

export default {
  name: 'app',
  components: {
    sideNav,
    //appNav,
    loginVuex
  },
  computed : {
    isLoggedIn : function(){
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
  logout: function() {
    this.$store.dispatch('auth_logout')
    .then(() => {
      this.$router.push('/')
    })
  }
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
