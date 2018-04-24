<template>
  <div class="col-xs-5">
    <h4>New reference_sequence</h4>
    <div id="reference_sequence-div">
      <div v-if="reference_sequence" class="content">
        <form id="reference_sequence-form" v-on:submit.prevent="onSubmit">

          <reference_sequence-form-elemns v-bind:errors="errors" v-bind:reference_sequence="reference_sequence"></reference_sequence-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
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
      reference_sequence: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/reference_sequences'
      axios.post(url, t.reference_sequence, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/reference_sequences')
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
