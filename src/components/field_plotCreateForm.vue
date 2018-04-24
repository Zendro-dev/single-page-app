<template>
  <div class="col-xs-5">
    <h4>New field_plot</h4>
    <div id="field_plot-div">
      <div v-if="field_plot" class="content">
        <form id="field_plot-form" v-on:submit.prevent="onSubmit">

          <field_plot-form-elemns v-bind:errors="errors" v-bind:field_plot="field_plot"></field_plot-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import field_plotFormElemns from './field_plotFormElemns.vue'

Vue.component('field_plot-form-elemns', field_plotFormElemns)

export default {
  data() {
    return {
      loading: false,
      field_plot: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/field_plots'
      axios.post(url, t.field_plot, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/field_plots')
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
