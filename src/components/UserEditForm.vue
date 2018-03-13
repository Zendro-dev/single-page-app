<template>
  <div id="user-div">
    <div v-if="user" class="content">
      <form id="user-form" v-on:submit.prevent="onSubmit">

        <user-form-elemns v-bind:errors="errors" v-bind:user="user"></user-form-elemns>

        <button type="submit" class="btn btn-primary">Submit</button>
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
        axios.get('/user/' +
          this.$route.params.id).then(function (response) {
            t.user = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = '/user'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.user).then(function (response) {
        t.$router.push('/users')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
