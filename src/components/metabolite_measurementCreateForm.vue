<template>
  <div class="col-xs-5">
    <h4>New metabolite_measurement</h4>
    <div id="metabolite_measurement-div">
      <div v-if="metabolite_measurement" class="content">
        <form id="metabolite_measurement-form" v-on:submit.prevent="onSubmit">

          <metabolite_measurement-form-elemns v-bind:errors="errors" v-bind:metabolite_measurement="metabolite_measurement"></metabolite_measurement-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import metabolite_measurementFormElemns from './metabolite_measurementFormElemns.vue'

Vue.component('metabolite_measurement-form-elemns', metabolite_measurementFormElemns)

export default {
  data() {
    return {
      loading: false,
      metabolite_measurement: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/metabolite_measurements'
      axios.post(url, t.metabolite_measurement).then(function (response) {
        t.$router.push('/metabolite_measurements')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
