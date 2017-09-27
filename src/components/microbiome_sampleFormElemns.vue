<template>
  <div id="microbiome_sample-form-elemns-div">

  <input type="hidden" v-model="microbiome_sample.id"/>
  
  
    <div id="microbiome_sample-name-div" class="form-group">
      <label>name</label>
      <input type="text" v-model="microbiome_sample.name" class="form-control"/>
      <div id="microbiome_sample-name-err" v-if="typeof validationError('name') !== 'undefined'">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="microbiome_sample-material-div" class="form-group">
      <label>material</label>
      <input type="text" v-model="microbiome_sample.material" class="form-control"/>
      <div id="microbiome_sample-material-err" v-if="typeof validationError('material') !== 'undefined'">
        {{validationError('material').message}}
      </div>
    </div>

  
    <div id="microbiome_sample-life_cycle_phas-div" class="form-group">
      <label>life_cycle_phas</label>
      <input type="text" v-model="microbiome_sample.life_cycle_phas" class="form-control"/>
      <div id="microbiome_sample-life_cycle_phas-err" v-if="typeof validationError('life_cycle_phas') !== 'undefined'">
        {{validationError('life_cycle_phas').message}}
      </div>
    </div>

  
    <div id="microbiome_sample-barcode_tag-div" class="form-group">
      <label>barcode_tag</label>
      <input type="text" v-model="microbiome_sample.barcode_tag" class="form-control"/>
      <div id="microbiome_sample-barcode_tag-err" v-if="typeof validationError('barcode_tag') !== 'undefined'">
        {{validationError('barcode_tag').message}}
      </div>
    </div>

  
    <div id="microbiome_sample-description-div" class="form-group">
      <label>description</label>
      <input type="text" v-model="microbiome_sample.description" class="form-control"/>
      <div id="microbiome_sample-description-err" v-if="typeof validationError('description') !== 'undefined'">
        {{validationError('description').message}}
      </div>
    </div>

  
    <div id="microbiome_sample-harvest_date-div" class="form-group">
      <label>harvest_date</label>
      <input type="text" v-model="microbiome_sample.harvest_date" class="form-control"/>
      <div id="microbiome_sample-harvest_date-err" v-if="typeof validationError('harvest_date') !== 'undefined'">
        {{validationError('harvest_date').message}}
      </div>
    </div>

  
      
    <div id="microbiome_sample-individual-div" class="form-group">
      <label>individual</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/individuals"
        v-model:foreignKey="microbiome_sample.individual_id"
        label="name"
                subLabel="sowing_date"
                valueKey="id"
        v-bind:initialInput="individualInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="microbiome_sample-field_plot-div" class="form-group">
      <label>field_plot</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/field_plots"
        v-model:foreignKey="microbiome_sample.field_plot_id"
        label="field_name"
                subLabel="location_code"
                valueKey="id"
        v-bind:initialInput="field_plotInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="microbiome_sample-pot-div" class="form-group">
      <label>pot</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/pots"
        v-model:foreignKey="microbiome_sample.pot_id"
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
  props: ['microbiome_sample', 'errors'],
  computed: {
    individualInitialLabel: function() {
      var x = this.microbiome_sample.individual
      if (x !== null && typeof x === 'object' &&
        x['name'] !== null &&
        typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    },
    field_plotInitialLabel: function() {
      var x = this.microbiome_sample.field_plot
      if (x !== null && typeof x === 'object' &&
        x['field_name'] !== null &&
        typeof x['field_name'] !== 'undefined') {
        return x['field_name']
      } else {
        return ''
      }
    },
    potInitialLabel: function() {
      var x = this.microbiome_sample.pot
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
      return this.errors.find(function(el) {
        return el.path === modelField
      })
    }
  }
}
</script>
