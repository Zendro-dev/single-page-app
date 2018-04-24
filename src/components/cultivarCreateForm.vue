<template>
  <div class="col-xs-5">
    <h4>New cultivar</h4>
    <div id="cultivar-div">
      <div v-if="cultivar" class="content">
        <form id="cultivar-form" v-on:submit.prevent="onSubmit">

          <cultivar-form-elemns v-bind:errors="errors" v-bind:cultivar="cultivar"></cultivar-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import cultivarFormElemns from './cultivarFormElemns.vue'

Vue.component('cultivar-form-elemns', cultivarFormElemns)

export default {
  data() {
    return {
      loading: false,
      cultivar: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/cultivars'
      axios.post(url, t.cultivar, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/cultivars')
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
