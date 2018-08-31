<template>
  <nav class="navbar navbar-default">
      <ul class="nav navbar-nav navbar-right">
         <li>
           <button class="btn btn-danger log" v-show="isLoggedIn()" @click="handleLogout()">Log out </button>
           <button class="btn btn-info log" v-show="!isLoggedIn()" @click="handleLogin()">Log In</button>
         </li>
    </ul>
  </nav>
</template>

<script>
import { isLoggedIn, login, logout } from '../auth'

export default {
  name: 'app-nav',
  methods: {
    handleLogin () {
      login()
    },
    handleLogout () {
      logout()
    },
    isLoggedIn () {
      return isLoggedIn()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-right { margin-right: 0px !important}

.log {
  margin: 5px 10px 0 0;
}
</style>
