<template>
  <div id="pot-div">
    <div v-if="pot" class="content">
      <form id="pot-form" v-on:submit.prevent="onSubmit">

        <pot-form-elemns v-bind:errors="errors" v-bind:pot="pot"></pot-form-elemns>

        <button type="submit" class="btn btn-primary">Create</button>
      </form>
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
      var url = 'http://localhost:3000/pots'
      axios.post(url, t.pot).then(function (response) {
        t.$router.push('/pots')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
