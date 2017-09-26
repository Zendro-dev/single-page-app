<template>
  <div id="microbiome_profile-div">
    <div v-if="microbiome_profile" class="content">
      <form id="microbiome_profile-form" v-on:submit.prevent="onSubmit">

        <microbiome_profile-form-elemns v-bind:errors="errors" v-bind:microbiome_profile="microbiome_profile"></microbiome_profile-form-elemns>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import microbiome_profileFormElemns from './microbiome_profileFormElemns.vue'

Vue.component('microbiome_profile-form-elemns', microbiome_profileFormElemns)

export default {
  data() {
    return {
      loading: false,
      microbiome_profile: null,
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
        axios.get('http://localhost:3000/microbiome_profile/' +
          this.$route.params.id).then(function (response) {
            t.microbiome_profile = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/microbiome_profile'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.microbiome_profile).then(function (response) {
        t.$router.push('/microbiome_profiles')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
