<template>
  <div class="col-xs-5">
    <h4>Edit taxon</h4>
    <div id="taxon-div">
      <div v-if="taxon" class="content">
        <form id="taxon-form" v-on:submit.prevent="onSubmit">

          <taxon-form-elemns v-bind:errors="errors" v-bind:taxon="taxon"></taxon-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import taxonFormElemns from './taxonFormElemns.vue'

Vue.component('taxon-form-elemns', taxonFormElemns)

export default {
  data() {
    return {
      loading: false,
      taxon: null,
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
        axios.get(this.$baseUrl() + '/taxon/' +
          this.$route.params.id).then(function (response) {
            t.taxon = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/taxon'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.taxon).then(function (response) {
        t.$router.push('/taxons')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
