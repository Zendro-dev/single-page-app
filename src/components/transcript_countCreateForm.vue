<template>
  <div class="col-xs-5">
    <h4>New transcript_count</h4>
    <div id="transcript_count-div">
      <div v-if="transcript_count" class="content">
        <form id="transcript_count-form" v-on:submit.prevent="onSubmit">

          <transcript_count-form-elemns v-bind:errors="errors" v-bind:transcript_count="transcript_count"></transcript_count-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import transcript_countFormElemns from './transcript_countFormElemns.vue'

Vue.component('transcript_count-form-elemns', transcript_countFormElemns)

export default {
  data() {
    return {
      loading: false,
      transcript_count: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/transcript_counts'
      axios.post(url, t.transcript_count, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/transcript_counts')
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
