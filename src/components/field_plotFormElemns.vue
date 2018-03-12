<template>
  <div id="field_plot-form-elemns-div">

  <input type="hidden" v-model="field_plot.id"/>
  
  
    <div id="field_plot-field_name-div" class="form-group">
      <label>field_name</label>
      <input type="text" v-model="field_plot.field_name" class="form-control"/>
      <div id="field_plot-field_name-err" v-if="typeof validationError('field_name') !== 'undefined'">
        {{validationError('field_name').message}}
      </div>
    </div>

  
    <div id="field_plot-latitude-div" class="form-group">
      <label>latitude</label>
      <input type="text" v-model="field_plot.latitude" class="form-control"/>
      <div id="field_plot-latitude-err" v-if="typeof validationError('latitude') !== 'undefined'">
        {{validationError('latitude').message}}
      </div>
    </div>

  
    <div id="field_plot-longitude-div" class="form-group">
      <label>longitude</label>
      <input type="text" v-model="field_plot.longitude" class="form-control"/>
      <div id="field_plot-longitude-err" v-if="typeof validationError('longitude') !== 'undefined'">
        {{validationError('longitude').message}}
      </div>
    </div>

  
    <div id="field_plot-location_code-div" class="form-group">
      <label>location_code</label>
      <input type="text" v-model="field_plot.location_code" class="form-control"/>
      <div id="field_plot-location_code-err" v-if="typeof validationError('location_code') !== 'undefined'">
        {{validationError('location_code').message}}
      </div>
    </div>

  
    <div id="field_plot-soil_treatment-div" class="form-group">
      <label>soil_treatment</label>
      <input type="text" v-model="field_plot.soil_treatment" class="form-control"/>
      <div id="field_plot-soil_treatment-err" v-if="typeof validationError('soil_treatment') !== 'undefined'">
        {{validationError('soil_treatment').message}}
      </div>
    </div>

  
    
  </div>
</template>

<script>

export default {
  props: [ 'field_plot', 'errors' ],
  computed: {
    },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.find(function (el) {
        return el.path === modelField
      })
    }
  }
}
</script>
