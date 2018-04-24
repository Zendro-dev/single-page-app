<template>
  <div class="col-xs-5">
    <h4>New microbiome_otu</h4>
    <div id="microbiome_otu-div">
      <div v-if="microbiome_otu" class="content">
        <form id="microbiome_otu-form" v-on:submit.prevent="onSubmit">

          <microbiome_otu-form-elemns v-bind:errors="errors" v-bind:microbiome_otu="microbiome_otu"></microbiome_otu-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import microbiome_otuFormElemns from './microbiome_otuFormElemns.vue'

Vue.component('microbiome_otu-form-elemns', microbiome_otuFormElemns)

export default {
  data() {
    return {
      loading: false,
      microbiome_otu: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/microbiome_otus'
      axios.post(url, t.microbiome_otu, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/microbiome_otus')
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
