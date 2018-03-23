<template>
  <div class="col-xs-5 content">
    <h4>Upload sample_to_metabolite_measurements</h4>
      <form id="sample_to_metabolite_measurement-form" enctype="multipart/form-data" novalidate v-on:submit.prevent="onSubmit">

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
        var url = this.$baseUrl() + '/sample_to_metabolite_measurements/upload_xlsx'
        var formElm = "xlsx_file"
      } else {
        var url = this.$baseUrl() + '/sample_to_metabolite_measurements/upload_csv'
        var formElm = "csv_file"
      } 
      var formData = new FormData();
      var tableFile = document.querySelector('#uploadTableFile');
      formData.append(formElm, tableFile.files[0]);
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function(response) {
        t.$router.push('/sample_to_metabolite_measurements')
      }).catch(function(error) {
        if (error.response && error.response.data && error.response.data.errors)
          t.errors = error.response.data.errors
      })
    }
  }
}
</script>
