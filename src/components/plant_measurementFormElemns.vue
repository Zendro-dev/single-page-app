<template>
  <div id="plant_measurement-form-elemns-div">

  <input type="hidden" v-model="plant_measurement.id"/>
  
  
    <div id="plant_measurement-variable-div" class="form-group">
            <label>variable</label>
      
  <input type="text" v-model="plant_measurement.variable" class="form-control"/>


      <div id="plant_measurement-variable-err" v-if="validationError('variable')" class="alert alert-danger">
        {{validationError('variable').message}}
      </div>
    </div>

  
    <div id="plant_measurement-value-div" class="form-group">
            <label>value</label>
      
  <input type="text" v-model="plant_measurement.value" class="form-control"/>


      <div id="plant_measurement-value-err" v-if="validationError('value')" class="alert alert-danger">
        {{validationError('value').message}}
      </div>
    </div>

  
    <div id="plant_measurement-unit-div" class="form-group">
            <label>unit</label>
      
  <input type="text" v-model="plant_measurement.unit" class="form-control"/>


      <div id="plant_measurement-unit-err" v-if="validationError('unit')" class="alert alert-danger">
        {{validationError('unit').message}}
      </div>
    </div>

  
      
    <div id="plant_measurement-individual-div" class="form-group">
      <label>individual</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/individuals'"
        v-model:foreignKey="plant_measurement.individual_id"
        label="name"
                subLabel="sowing_date"
                valueKey="id"
        v-bind:initialInput="individualInitialLabel">
      </foreign-key-form-element>
    </div>

  

  
  
  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)


export default {
  props: [ 'plant_measurement', 'errors' ],
  computed: {
          individualInitialLabel: function () {
      var x = this.plant_measurement.individual
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
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
