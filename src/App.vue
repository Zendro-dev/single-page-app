<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Reconstruct DB</a>
        </div>
        <ul class="nav navbar-nav">
          <li><a href="#/users">Users</a></li>
          <li><a href="#/taxons">Taxons</a></li>
          <li><a href="#/cultivars">Cultivars</a></li>
          <li><a href="#/individuals">Individuals</a></li>
          <li><a href="#/microbiome_profiles">Microbiome-Profiles</a></li>
          <li><a href="#/microbiome_samples">Microbiome-Samples</a></li>
          <li><a href="#/pots">Pots</a></li>
          <li><a href="#/soil_samples">Soil-Samples</a></li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
