<template>
  <div id="cultivar-div">
    <div v-if="cultivar" class="content">
      <form id="cultivar-form" v-on:submit.prevent="onSubmit">

        <cultivar-form-elemns v-bind:errors="errors" v-bind:cultivar="cultivar"></cultivar-form-elemns>

        <button type="submit" class="btn btn-primary">Create</button>
      </form>
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
      var url = 'http://localhost:3000/cultivar'
      axios.post(url, t.cultivar).then(function (response) {
        t.$router.push('/cultivars')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
