<template>
  <div class="col-xs-5">
    <h4>New sample</h4>
    <div id="sample-div">
      <div v-if="sample" class="content">
        <form id="sample-form" v-on:submit.prevent="onSubmit">

          <sample-form-elemns v-bind:errors="errors" v-bind:sample="sample"></sample-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import sampleFormElemns from './sampleFormElemns.vue'

Vue.component('sample-form-elemns', sampleFormElemns)

export default {
  data() {
    return {
      loading: false,
      sample: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/samples'
      axios.post(url, t.sample, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/samples')
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
