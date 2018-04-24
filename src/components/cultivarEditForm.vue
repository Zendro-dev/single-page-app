<template>
  <div class="col-xs-5">
    <h4>Edit cultivar</h4>
    <div id="cultivar-div">
      <div v-if="cultivar" class="content">
        <form id="cultivar-form" v-on:submit.prevent="onSubmit">

          <cultivar-form-elemns v-bind:errors="errors" v-bind:cultivar="cultivar"></cultivar-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
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
      cultivar: null,
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
        axios.get(this.$baseUrl() + '/cultivar/' +
          this.$route.params.id, {
          headers: {
            'authorization': `Bearer ${t.$getAuthToken()}`,
            'Accept': 'application/json'
          }
        }).then(function (response) {
            t.cultivar = response.data
          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl() + '/cultivar'
      if (t.$route.params.id) { 
        url += '/' + t.$route.params.id
      }
      axios.put(url, t.cultivar, {
        headers: {
          'authorization': `Bearer ${t.$getAuthToken()}`,
          'Accept': 'application/json'
        }
      }).then(function (response) {
        t.$router.push('/cultivars')
      }).catch( function (res) {
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
