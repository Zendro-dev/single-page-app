<template>
  <div id="field_plot-div">
    <div v-if="field_plot" class="content">
      <form id="field_plot-form" v-on:submit.prevent="onSubmit">

        <field_plot-form-elemns v-bind:errors="errors" v-bind:field_plot="field_plot"></field_plot-form-elemns>

        <button type="submit" class="btn btn-primary">Create</button>
      </form>
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
      field_plot: null,
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/field_plot'
      axios.post(url, t.field_plot).then(function (response) {
        t.$router.push('/field_plots')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
