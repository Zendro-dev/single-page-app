<template>
  <div id="metabolite_measurement-form-elemns-div">

  <input type="hidden" v-model="metabolite_measurement.id"/>
  
  
    <div id="metabolite_measurement-metabolite-div" class="form-group">
            <label>metabolite</label>
      
  <input type="text" v-model="metabolite_measurement.metabolite" class="form-control"/>


      <div id="metabolite_measurement-metabolite-err" v-if="validationError('metabolite')" class="alert alert-danger">
        {{validationError('metabolite').message}}
      </div>
    </div>

  
    <div id="metabolite_measurement-amount-div" class="form-group">
            <label>amount</label>
      
  <input type="text" v-model="metabolite_measurement.amount" class="form-control"/>


      <div id="metabolite_measurement-amount-err" v-if="validationError('amount')" class="alert alert-danger">
        {{validationError('amount').message}}
      </div>
    </div>

  
    <div id="metabolite_measurement-unit-div" class="form-group">
            <label>unit</label>
      
  <input type="text" v-model="metabolite_measurement.unit" class="form-control"/>


      <div id="metabolite_measurement-unit-err" v-if="validationError('unit')" class="alert alert-danger">
        {{validationError('unit').message}}
      </div>
    </div>

  
    <div id="metabolite_measurement-is_average-div" class="form-group">
            <label>is_average</label>
      
  <input type="checkbox" v-model="metabolite_measurement.is_average" class="form-control"/>


      <div id="metabolite_measurement-is_average-err" v-if="validationError('is_average')" class="alert alert-danger">
        {{validationError('is_average').message}}
      </div>
    </div>

  
  

      
    <div id="metabolite_measurement-samples-div" class="form-group">
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
  props: [ 'metabolite_measurement', 'errors' ],
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
