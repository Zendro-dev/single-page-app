<template>
  <div id="soil_sample-div">
    <div v-if="soil_sample" class="content">
      <form id="soil_sample-form" v-on:submit.prevent="onSubmit">

        <soil_sample-form-elemns v-bind:errors="errors" v-bind:soil_sample="soil_sample"></soil_sample-form-elemns>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import soil_sampleFormElemns from './soil_sampleFormElemns.vue'

Vue.component('soil_sample-form-elemns', soil_sampleFormElemns)

export default {
  data() {
    return {
      loading: false,
      soil_sample: null,
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
        axios.get('http://localhost:3000/soil_sample/' +
          this.$route.params.id).then(function (response) {
            t.soil_sample = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/soil_sample'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.soil_sample).then(function (response) {
        t.$router.push('/soil_samples')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
