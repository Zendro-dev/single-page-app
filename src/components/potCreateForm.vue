<template>
  <div class="col-xs-5">
    <h4>New pot</h4>
    <div id="pot-div">
      <div v-if="pot" class="content">
        <form id="pot-form" v-on:submit.prevent="onSubmit">

          <pot-form-elemns v-bind:errors="errors" v-bind:pot="pot"></pot-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import potFormElemns from './potFormElemns.vue'

Vue.component('pot-form-elemns', potFormElemns)

export default {
  data() {
    return {
      loading: false,
      pot: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/pots'
      axios.post(url, t.pot, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function(response) {
        t.$router.push('/pots')
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
