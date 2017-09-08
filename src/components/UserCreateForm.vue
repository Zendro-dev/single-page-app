<template>
  <div id="user-div">
    <div v-if="user" class="content">
      <form id="user-form" v-on:submit.prevent="onSubmit">

        <user-form-elemns v-bind:errors="errors" v-bind:user="user"></user-form-elemns>

        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import UserFormElemns from './UserFormElemns.vue'

Vue.component('user-form-elemns', UserFormElemns)

export default {
  data() {
    return {
      loading: false,
      user: null,
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = '/user'
      axios.post(url, t.user).then(function (response) {
        t.$router.push('/users')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
