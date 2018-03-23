<template>
  <div id="app">
    <div class="sidenav">
      <a href="#">HOME</a>
      <a href="#/taxons">Taxons</a>
      <a href="#/cultivars">Cultivars</a>
      <a href="#/individuals">Individuals</a>
      <a href="#/microbiome_otus">Microbiome-OTUs</a>
      <a href="#/reference_sequences">Reference-Sequences</a>
      <a href="#/pots">Pots</a>
      <a href="#/samples">Samples</a>
      <a href="#/field_plots">Field-Plots</a>
      <a href="#/metabolite_measurements">Metabolite-Measurements</a>
      <a href="#/sample_to_metabolite_measurements">Samples-Metabolite-Measurements</a>
    </div>
    <div class="main">
    <router-view></router-view>
    </div>
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
  color: #2c3e50;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.sidenav {
    text-align: left;
    height: 100%;
    width: 280px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #111;
    overflow-x: hidden;
    padding-top: 20px;
}

.sidenav a {
    padding: 6px 6px 6px 32px;
    text-decoration: none;
    color: #818181;
    display: block;
}

.sidenav a:hover {
    color: #f1f1f1;
}

.main {
    margin-left: 280px; /* Same as the width of the sidenav */
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>
