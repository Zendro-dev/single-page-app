<template>
  <div class="col-xs-5 content">
    <ul v-for="record in errors" v-if="errors" class="list-group">
      <li class="list-group-item">
        <div class="alert alert-danger">
          <h4>Errors for cultivar {{record.record}}</h4> 
          <ul>
            <li>{{record.errors.message}}</li>
          </ul>
        </div>
      </li>
    </ul>
    <h4>Upload cultivars</h4>
      <form id="cultivar-form" enctype="multipart/form-data" novalidate v-on:submit.prevent="onSubmit">

        <div class="form-group">
          <input type="file" id="uploadTableFile" ref="uploadTable" class="form-control">
        </div>

        <button type="submit" class="btn btn-primary">Upload</button>
      </form>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      if (t.$refs.uploadTable.value.indexOf('.xlsx') > 0) {
        var url = this.$baseUrl() + '/cultivars/upload_xlsx'
        var formElm = "xlsx_file"
      } else {
        var url = this.$baseUrl() + '/cultivars/upload_csv'
        var formElm = "csv_file"
      } 
      var formData = new FormData();
      var tableFile = document.querySelector('#uploadTableFile');
      formData.append(formElm, tableFile.files[0]);
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': `Bearer ${t.$getAuthToken()}`,
          'Accept': 'application/json'
        }
      }).then(function(response) {
        t.$router.push('/cultivars')
      }).catch(function(res) {
        if (res.response && res.response.data && res.response.data && Array
          .isArray(res.response.data)) {
          t.errors = res.response.data
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
