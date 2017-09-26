<template>
  <div id="individual-div">
    <div v-if="individual" class="content">
      <form id="individual-form" v-on:submit.prevent="onSubmit">

        <individual-form-elemns v-bind:errors="errors" v-bind:individual="individual"></individual-form-elemns>

        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import individualFormElemns from './individualFormElemns.vue'

Vue.component('individual-form-elemns', individualFormElemns)

export default {
  data() {
    return {
      loading: false,
      individual: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = 'http://localhost:3000/individuals'
      axios.post(url, t.individual).then(function (response) {
        t.$router.push('/individuals')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
