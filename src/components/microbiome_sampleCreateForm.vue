<template>
  <div id="microbiome_sample-div">
    <div v-if="microbiome_sample" class="content">
      <form id="microbiome_sample-form" v-on:submit.prevent="onSubmit">

        <microbiome_sample-form-elemns v-bind:errors="errors" v-bind:microbiome_sample="microbiome_sample"></microbiome_sample-form-elemns>

        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import microbiome_sampleFormElemns from './microbiome_sampleFormElemns.vue'

Vue.component('microbiome_sample-form-elemns', microbiome_sampleFormElemns)

export default {
  data() {
    return {
      loading: false,
      microbiome_sample: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/microbiome_samples'
      axios.post(url, t.microbiome_sample).then(function (response) {
        t.$router.push('/microbiome_samples')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
