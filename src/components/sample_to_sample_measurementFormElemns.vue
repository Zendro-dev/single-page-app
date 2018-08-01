<template>
  <div id="sample_to_sample_measurement-form-elemns-div">

  <input type="hidden" v-model="sample_to_sample_measurement.id"/>
  
  
      
    <div id="sample_to_sample_measurement-sample-div" class="form-group">
      <label>sample</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/samples'"
        v-model:foreignKey="sample_to_sample_measurement.sample_id"
        label="name"
                subLabel="material"
                valueKey="id"
        v-bind:initialInput="sampleInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="sample_to_sample_measurement-sample_measurement-div" class="form-group">
      <label>sample_measurement</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/sample_measurements'"
        v-model:foreignKey="sample_to_sample_measurement.sample_measurement_id"
        label="variable"
                subLabel="value"
                valueKey="id"
        v-bind:initialInput="sample_measurementInitialLabel">
      </foreign-key-form-element>
    </div>

  

  
  
  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)


export default {
  props: [ 'sample_to_sample_measurement', 'errors' ],
  computed: {
          sampleInitialLabel: function () {
      var x = this.sample_to_sample_measurement.sample
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              sample_measurementInitialLabel: function () {
      var x = this.sample_to_sample_measurement.sample_measurement
      if (x !== null && typeof x === 'object' &&
          x['variable'] !== null &&
          typeof x['variable'] !== 'undefined') {
        return x['variable']
      } else {
        return ''
      }
    }
        },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.find(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	}
}
</script>
