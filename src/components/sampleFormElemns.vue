<template>
  <div id="sample-form-elemns-div">

  <input type="hidden" v-model="sample.id"/>
  
  
    <div id="sample-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="sample.name" class="form-control"/>


      <div id="sample-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="sample-material-div" class="form-group">
            <label>material</label>
      
  <input type="text" v-model="sample.material" class="form-control"/>


      <div id="sample-material-err" v-if="validationError('material')" class="alert alert-danger">
        {{validationError('material').message}}
      </div>
    </div>

  
    <div id="sample-life_cycle_phase-div" class="form-group">
            <label>life_cycle_phase</label>
      
  <input type="text" v-model="sample.life_cycle_phase" class="form-control"/>


      <div id="sample-life_cycle_phase-err" v-if="validationError('life_cycle_phase')" class="alert alert-danger">
        {{validationError('life_cycle_phase').message}}
      </div>
    </div>

  
    <div id="sample-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="sample.description" class="form-control"/>


      <div id="sample-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
    <div id="sample-harvest_date-div" class="form-group">
            <label>harvest_date</label>
      
  <input v-model="sample.harvest_date" class="datepicker" />


      <div id="sample-harvest_date-err" v-if="validationError('harvest_date')" class="alert alert-danger">
        {{validationError('harvest_date').message}}
      </div>
    </div>

  
    <div id="sample-library-div" class="form-group">
            <label>library</label>
      
  <input type="text" v-model="sample.library" class="form-control"/>


      <div id="sample-library-err" v-if="validationError('library')" class="alert alert-danger">
        {{validationError('library').message}}
      </div>
    </div>

  
    <div id="sample-barcode_number-div" class="form-group">
            <label>barcode_number</label>
      
  <input type="text" v-model="sample.barcode_number" class="form-control"/>


      <div id="sample-barcode_number-err" v-if="validationError('barcode_number')" class="alert alert-danger">
        {{validationError('barcode_number').message}}
      </div>
    </div>

  
    <div id="sample-barcode_sequence-div" class="form-group">
            <label>barcode_sequence</label>
      
  <input type="text" v-model="sample.barcode_sequence" class="form-control"/>


      <div id="sample-barcode_sequence-err" v-if="validationError('barcode_sequence')" class="alert alert-danger">
        {{validationError('barcode_sequence').message}}
      </div>
    </div>

  
      
    <div id="sample-individual-div" class="form-group">
      <label>individual</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/individuals'"
        v-model:foreignKey="sample.individual_id"
        label="name"
                subLabel="harvest_date"
                valueKey="id"
        v-bind:initialInput="individualInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="sample-field_plot-div" class="form-group">
      <label>field_plot</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/field_plots'"
        v-model:foreignKey="sample.field_plot_id"
        label="field_name"
                subLabel="location_code"
                valueKey="id"
        v-bind:initialInput="field_plotInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="sample-pot-div" class="form-group">
      <label>pot</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/pots'"
        v-model:foreignKey="sample.pot_id"
        label="pot"
                subLabel="greenhouse"
                valueKey="id"
        v-bind:initialInput="potInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="sample-parent-div" class="form-group">
      <label>parent</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/parents'"
        v-model:foreignKey="sample.parent_id"
        label="name"
                subLabel="material"
                valueKey="id"
        v-bind:initialInput="parentInitialLabel">
      </foreign-key-form-element>
    </div>

  

  
  
  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)


export default {
  props: [ 'sample', 'errors' ],
  computed: {
          individualInitialLabel: function () {
      var x = this.sample.individual
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              field_plotInitialLabel: function () {
      var x = this.sample.field_plot
      if (x !== null && typeof x === 'object' &&
          x['field_name'] !== null &&
          typeof x['field_name'] !== 'undefined') {
        return x['field_name']
      } else {
        return ''
      }
    }
        ,
              potInitialLabel: function () {
      var x = this.sample.pot
      if (x !== null && typeof x === 'object' &&
          x['pot'] !== null &&
          typeof x['pot'] !== 'undefined') {
        return x['pot']
      } else {
        return ''
      }
    }
        ,
              parentInitialLabel: function () {
      var x = this.sample.parent
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
