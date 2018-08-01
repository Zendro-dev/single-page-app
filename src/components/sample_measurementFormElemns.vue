<template>
  <div id="sample_measurement-form-elemns-div">

  <input type="hidden" v-model="sample_measurement.id"/>
  
  
    <div id="sample_measurement-variable-div" class="form-group">
            <label>variable</label>
      
  <input type="text" v-model="sample_measurement.variable" class="form-control"/>


      <div id="sample_measurement-variable-err" v-if="validationError('variable')" class="alert alert-danger">
        {{validationError('variable').message}}
      </div>
    </div>

  
    <div id="sample_measurement-value-div" class="form-group">
            <label>value</label>
      
  <input type="text" v-model="sample_measurement.value" class="form-control"/>


      <div id="sample_measurement-value-err" v-if="validationError('value')" class="alert alert-danger">
        {{validationError('value').message}}
      </div>
    </div>

  
    <div id="sample_measurement-unit-div" class="form-group">
            <label>unit</label>
      
  <input type="text" v-model="sample_measurement.unit" class="form-control"/>


      <div id="sample_measurement-unit-err" v-if="validationError('unit')" class="alert alert-danger">
        {{validationError('unit').message}}
      </div>
    </div>

  
    <div id="sample_measurement-is_average-div" class="form-group">
            <label>is_average</label>
      
  <input type="checkbox" v-model="sample_measurement.is_average" class="form-control"/>


      <div id="sample_measurement-is_average-err" v-if="validationError('is_average')" class="alert alert-danger">
        {{validationError('is_average').message}}
      </div>
    </div>

  
  

      
    <div id="sample_measurement-samples-div" class="form-group">
      <label>samples</label>
      <has-many-form-element
        :associatedElements.sync="metabolite_measurement.samples"
        :searchUrl="this.$baseUrl() + 'samples'"
        label="name"
        subLabel="material"
        valueKey="id">
      </has-many-form-element>
    </div>

  
  
  </div>
</template>

<script>
import Vue from 'vue'


import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)

export default {
  props: [ 'sample_measurement', 'errors' ],
  computed: {
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
