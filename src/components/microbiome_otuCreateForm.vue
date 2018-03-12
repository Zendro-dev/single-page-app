<template>
  <div id="microbiome_otu-div">
    <div v-if="microbiome_otu" class="content">
      <form id="microbiome_otu-form" v-on:submit.prevent="onSubmit">

        <microbiome_otu-form-elemns v-bind:errors="errors" v-bind:microbiome_otu="microbiome_otu"></microbiome_otu-form-elemns>

        <button type="submit" class="btn btn-primary">Create</button>
      </form>
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
      var url = 'http://localhost:3000/microbiome_otu'
      axios.post(url, t.microbiome_otu).then(function (response) {
        t.$router.push('/microbiome_otus')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
