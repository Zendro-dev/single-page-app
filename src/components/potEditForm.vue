<template>
  <div class="col-xs-5">
    <h4>Edit pot</h4>
    <div id="pot-div">
      <div v-if="pot" class="content">
        <form id="pot-form" v-on:submit.prevent="onSubmit">

          <pot-form-elemns v-bind:errors="errors" v-bind:pot="pot"></pot-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import potFormElemns from './potFormElemns.vue'

Vue.component('pot-form-elemns', potFormElemns)

export default {
  data() {
    return {
      loading: false,
      pot: null,
      error: null,
      errors: null,
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData',
  },
  methods: {
    fetchData() {
      var t = this
      t.error = null
      if (this.$route.params.id) {
        axios.get(this.$baseUrl() + '/pot/' +
          this.$route.params.id).then(function (response) {
            t.pot = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/pot'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.pot).then(function (response) {
        t.$router.push('/pots')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
