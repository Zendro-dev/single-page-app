<template>
  <div id="sample-div">
    <div v-if="sample" class="content">
      <form id="sample-form" v-on:submit.prevent="onSubmit">

        <sample-form-elemns v-bind:errors="errors" v-bind:sample="sample"></sample-form-elemns>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import sampleFormElemns from './sampleFormElemns.vue'

Vue.component('sample-form-elemns', sampleFormElemns)

export default {
  data() {
    return {
      loading: false,
      sample: null,
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
        axios.get('http://localhost:3000/sample/' +
          this.$route.params.id).then(function (response) {
            t.sample = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/sample'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.sample).then(function (response) {
        t.$router.push('/samples')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
