<template>
  <div class="col-xs-5">
    <h4>Edit sample_to_metabolite_measurement</h4>
    <div id="sample_to_metabolite_measurement-div">
      <div v-if="sample_to_metabolite_measurement" class="content">
        <form id="sample_to_metabolite_measurement-form" v-on:submit.prevent="onSubmit">

          <sample_to_metabolite_measurement-form-elemns v-bind:errors="errors" v-bind:sample_to_metabolite_measurement="sample_to_metabolite_measurement"></sample_to_metabolite_measurement-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import sample_to_metabolite_measurementFormElemns from './sample_to_metabolite_measurementFormElemns.vue'

Vue.component('sample_to_metabolite_measurement-form-elemns', sample_to_metabolite_measurementFormElemns)

export default {
  data() {
    return {
      loading: false,
      sample_to_metabolite_measurement: null,
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
        axios.get(this.$baseUrl() + '/sample_to_metabolite_measurement/' +
          this.$route.params.id).then(function (response) {
            t.sample_to_metabolite_measurement = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/sample_to_metabolite_measurement'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.sample_to_metabolite_measurement).then(function (response) {
        t.$router.push('/sample_to_metabolite_measurements')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
