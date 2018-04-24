<template>
  <div class="col-xs-5">
    <h4>Edit metabolite_measurement</h4>
    <div id="metabolite_measurement-div">
      <div v-if="metabolite_measurement" class="content">
        <form id="metabolite_measurement-form" v-on:submit.prevent="onSubmit">

          <metabolite_measurement-form-elemns v-bind:errors="errors" v-bind:metabolite_measurement="metabolite_measurement"></metabolite_measurement-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
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
      metabolite_measurement: null,
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
        axios.get(this.$baseUrl() + '/metabolite_measurement/' +
          this.$route.params.id, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function (response) {
            t.metabolite_measurement = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/metabolite_measurement'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.metabolite_measurement, {
        headers: {
          'authorization': `Bearer ${t.$getAuthToken()}`,
          'Accept': 'application/json'
        }
      }).then(function (response) {
        t.$router.push('/metabolite_measurements')
      }).catch( function (res) {
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
