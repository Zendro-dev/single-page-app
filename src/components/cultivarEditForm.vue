<template>
  <div id="cultivar-div">
    <div v-if="cultivar" class="content">
      <form id="cultivar-form" v-on:submit.prevent="onSubmit">

        <cultivar-form-elemns v-bind:errors="errors" v-bind:cultivar="cultivar"></cultivar-form-elemns>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import cultivarFormElemns from './cultivarFormElemns.vue'

Vue.component('cultivar-form-elemns', cultivarFormElemns)

export default {
  data() {
    return {
      loading: false,
      cultivar: null,
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
        axios.get('http://localhost:3000/cultivar/' +
          this.$route.params.id).then(function (response) {
            t.cultivar = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/cultivar'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.cultivar).then(function (response) {
        t.$router.push('/cultivars')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
