<template>
  <div class="col-xs-5">
    <h4>New plant_measurement</h4>
    <div id="plant_measurement-div">
      <div v-if="plant_measurement" class="content">
        <form id="plant_measurement-form" v-on:submit.prevent="onSubmit">

          <plant_measurement-form-elemns v-bind:errors="errors" v-bind:plant_measurement="plant_measurement"></plant_measurement-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import plant_measurementFormElemns from './plant_measurementFormElemns.vue'

Vue.component('plant_measurement-form-elemns', plant_measurementFormElemns)

export default {
  data() {
    return {
      loading: false,
      plant_measurement: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/plant_measurements'
      axios.post(url, t.plant_measurement, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/plant_measurements')
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
