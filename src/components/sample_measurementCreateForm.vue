<template>
  <div class="col-xs-5">
    <h4>New sample_measurement</h4>
    <div id="sample_measurement-div">
      <div v-if="sample_measurement" class="content">
        <form id="sample_measurement-form" v-on:submit.prevent="onSubmit">

          <sample_measurement-form-elemns v-bind:errors="errors" v-bind:sample_measurement="sample_measurement"></sample_measurement-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import sample_measurementFormElemns from './sample_measurementFormElemns.vue'

Vue.component('sample_measurement-form-elemns', sample_measurementFormElemns)

export default {
  data() {
    return {
      loading: false,
      sample_measurement: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/sample_measurements'
      axios.post(url, t.sample_measurement, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/sample_measurements')
      }).catch(function(res) {
        if (res.response && res.response.data && res.response.data.errors) {
          t.errors = res.response.data.errors
        } else {
          var err = (res && res.response && res.response.data && res.response
            .data.message ?
            res.response.data.message : res)
          t.$root.$emit('globalError', err)
          t.$router.push('/')
        }
      })
    }
  }
}
</script>
