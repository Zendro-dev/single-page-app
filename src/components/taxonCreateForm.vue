<template>
  <div class="col-xs-5">
    <h4>New taxon</h4>
    <div id="taxon-div">
      <div v-if="taxon" class="content">
        <form id="taxon-form" v-on:submit.prevent="onSubmit">

          <taxon-form-elemns v-bind:errors="errors" v-bind:taxon="taxon"></taxon-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
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
      taxon: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/taxons'
      axios.post(url, t.taxon, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/taxons')
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
