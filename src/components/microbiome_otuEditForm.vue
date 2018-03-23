<template>
  <div class="col-xs-5">
    <h4>Edit microbiome_otu</h4>
    <div id="microbiome_otu-div">
      <div v-if="microbiome_otu" class="content">
        <form id="microbiome_otu-form" v-on:submit.prevent="onSubmit">

          <microbiome_otu-form-elemns v-bind:errors="errors" v-bind:microbiome_otu="microbiome_otu"></microbiome_otu-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
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
      microbiome_otu: null,
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
        axios.get(this.$baseUrl() + '/microbiome_otu/' +
          this.$route.params.id).then(function (response) {
            t.microbiome_otu = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/microbiome_otu'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.microbiome_otu).then(function (response) {
        t.$router.push('/microbiome_otus')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
