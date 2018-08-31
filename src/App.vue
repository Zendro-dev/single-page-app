<template>
  <div id="app">
    <side-nav> </side-nav>
      <div class="main">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
import sideNav from '@/components/SideNav'
export default {
  name: 'app',
  components: {
    sideNav
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
    overflow: scroll;
}


</style>
