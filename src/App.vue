<template>
  <div id="app">
    <app-nav></app-nav>
      <div v-if="isLoggedIn()">
        <side-nav> </side-nav>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
import sideNav from '@/components/SideNav'
import appNav from '@/components/AppNav'

import { isLoggedIn } from './auth'

export default {
  name: 'app',
  components: {
    sideNav,
    appNav
  },
  methods: {
    isLoggedIn () {
      return isLoggedIn()
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


</style>
