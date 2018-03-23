<template>
  <div class="col-xs-5">
    <h4>Edit individual</h4>
    <div id="individual-div">
      <div v-if="individual" class="content">
        <form id="individual-form" v-on:submit.prevent="onSubmit">

          <individual-form-elemns v-bind:errors="errors" v-bind:individual="individual"></individual-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
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
      individual: null,
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
        axios.get(this.$baseUrl() + '/individual/' +
          this.$route.params.id).then(function (response) {
            t.individual = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/individual'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.individual).then(function (response) {
        t.$router.push('/individuals')
      }).catch( function (error) {
        if ( error.response && error.response.data && error.response.data.errors )
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
