<template>
  <div id="soil_sample-form-elemns-div">

  <input type="hidden" v-model="soil_sample.id"/>
  
  
    <div id="soil_sample-name-div" class="form-group">
      <label>name</label>
      <input type="text" v-model="soil_sample.name" class="form-control"/>
      <div id="soil_sample-name-err" v-if="typeof validationError('name') !== 'undefined'">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="soil_sample-harvest_date-div" class="form-group">
      <label>harvest_date</label>
      <input type="text" v-model="soil_sample.harvest_date" class="form-control"/>
      <div id="soil_sample-harvest_date-err" v-if="typeof validationError('harvest_date') !== 'undefined'">
        {{validationError('harvest_date').message}}
      </div>
    </div>

  
      
    <div id="soil_sample-field_plot-div" class="form-group">
      <label>field_plot</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/field_plots"
        v-model:foreignKey="soil_sample.field_plot_id"
        label="field_name"
                subLabel="location_code"
                valueKey="id"
        v-bind:initialInput="field_plotInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="soil_sample-pot-div" class="form-group">
      <label>pot</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/pots"
        v-model:foreignKey="soil_sample.pot_id"
        label="pot"
                subLabel="greenhouse"
                valueKey="id"
        v-bind:initialInput="potInitialLabel">
      </foreign-key-form-element>
    </div>

    
  </div>
</template>

<script>
import Vue from 'vue'
import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

export default {
  props: [ 'soil_sample', 'errors' ],
        computed: {
    field_plotInitialLabel: function () {
      var x = this.soil_sample.field_plot
      if (x !== null && typeof x === 'object' &&
          x['field_name'] !== null &&
          typeof x['field_name'] !== 'undefined') {
        return x['field_name']
      } else {
        return ''
      }
    }
        ,
      },
        computed: {
    potInitialLabel: function () {
      var x = this.soil_sample.pot
      if (x !== null && typeof x === 'object' &&
          x['pot'] !== null &&
          typeof x['pot'] !== 'undefined') {
        return x['pot']
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
  }
}
</script>
