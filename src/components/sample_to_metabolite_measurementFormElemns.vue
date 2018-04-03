<template>
  <div id="sample_to_metabolite_measurement-form-elemns-div">

  <input type="hidden" v-model="sample_to_metabolite_measurement.id"/>
  
  
      
    <div id="sample_to_metabolite_measurement-sample-div" class="form-group">
      <label>sample</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/samples'"
        v-model:foreignKey="sample_to_metabolite_measurement.sample_id"
        label="name"
                subLabel="material"
                valueKey="id"
        v-bind:initialInput="sampleInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="sample_to_metabolite_measurement-metabolite_measurement-div" class="form-group">
      <label>metabolite_measurement</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/metabolite_measurements'"
        v-model:foreignKey="sample_to_metabolite_measurement.metabolite_measurement_id"
        label="metabolite"
                subLabel="amount"
                valueKey="id"
        v-bind:initialInput="metabolite_measurementInitialLabel">
      </foreign-key-form-element>
    </div>

  

  
  
  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)


export default {
  props: [ 'sample_to_metabolite_measurement', 'errors' ],
  computed: {
          sampleInitialLabel: function () {
      var x = this.sample_to_metabolite_measurement.sample
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              metabolite_measurementInitialLabel: function () {
      var x = this.sample_to_metabolite_measurement.metabolite_measurement
      if (x !== null && typeof x === 'object' &&
          x['metabolite'] !== null &&
          typeof x['metabolite'] !== 'undefined') {
        return x['metabolite']
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
