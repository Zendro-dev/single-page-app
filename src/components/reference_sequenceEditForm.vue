<template>
  <div id="reference_sequence-div">
    <div v-if="reference_sequence" class="content">
      <form id="reference_sequence-form" v-on:submit.prevent="onSubmit">

        <reference_sequence-form-elemns v-bind:errors="errors" v-bind:reference_sequence="reference_sequence"></reference_sequence-form-elemns>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import reference_sequenceFormElemns from './reference_sequenceFormElemns.vue'

Vue.component('reference_sequence-form-elemns', reference_sequenceFormElemns)

export default {
  data() {
    return {
      loading: false,
      reference_sequence: null,
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
        axios.get('http://localhost:3000/reference_sequence/' +
          this.$route.params.id).then(function (response) {
            t.reference_sequence = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/reference_sequence'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.reference_sequence).then(function (response) {
        t.$router.push('/reference_sequences')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
