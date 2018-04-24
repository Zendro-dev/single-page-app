<template>
  <div id="microbiome_otu-form-elemns-div">

  <input type="hidden" v-model="microbiome_otu.id"/>
  
  
    <div id="microbiome_otu-sample_desc-div" class="form-group">
            <label>sample_desc</label>
      
  <input type="text" v-model="microbiome_otu.sample_desc" class="form-control"/>


      <div id="microbiome_otu-sample_desc-err" v-if="validationError('sample_desc')" class="alert alert-danger">
        {{validationError('sample_desc').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-count-div" class="form-group">
            <label>count</label>
      
  <input type="text" v-model="microbiome_otu.count" class="form-control"/>


      <div id="microbiome_otu-count-err" v-if="validationError('count')" class="alert alert-danger">
        {{validationError('count').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-experiment-div" class="form-group">
            <label>experiment</label>
      
  <input type="text" v-model="microbiome_otu.experiment" class="form-control"/>


      <div id="microbiome_otu-experiment-err" v-if="validationError('experiment')" class="alert alert-danger">
        {{validationError('experiment').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-version-div" class="form-group">
            <label>version</label>
      
  <input type="text" v-model="microbiome_otu.version" class="form-control"/>


      <div id="microbiome_otu-version-err" v-if="validationError('version')" class="alert alert-danger">
        {{validationError('version').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-kingdom-div" class="form-group">
            <label>kingdom</label>
      
  <input type="text" v-model="microbiome_otu.kingdom" class="form-control"/>


      <div id="microbiome_otu-kingdom-err" v-if="validationError('kingdom')" class="alert alert-danger">
        {{validationError('kingdom').message}}
      </div>
    </div>

  
      
    <div id="microbiome_otu-reference_sequence-div" class="form-group">
      <label>reference_sequence</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/reference_sequences'"
        v-model:foreignKey="microbiome_otu.reference_sequence_id"
        label="id"
                subLabel="id"
                valueKey="id"
        v-bind:initialInput="reference_sequenceInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="microbiome_otu-parent-div" class="form-group">
      <label>parent</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/parents'"
        v-model:foreignKey="microbiome_otu.otu_id"
        label="sample_desc"
                subLabel="experiment"
                valueKey="id"
        v-bind:initialInput="parentInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="microbiome_otu-sample-div" class="form-group">
      <label>sample</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/samples'"
        v-model:foreignKey="microbiome_otu.sample_id"
        label="name"
                subLabel="material"
                valueKey="id"
        v-bind:initialInput="sampleInitialLabel">
      </foreign-key-form-element>
    </div>

  

  
  
  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)


export default {
  props: [ 'microbiome_otu', 'errors' ],
  computed: {
          reference_sequenceInitialLabel: function () {
      var x = this.microbiome_otu.reference_sequence
      if (x !== null && typeof x === 'object' &&
          x['id'] !== null &&
          typeof x['id'] !== 'undefined') {
        return x['id']
      } else {
        return ''
      }
    }
        ,
              parentInitialLabel: function () {
      var x = this.microbiome_otu.parent
      if (x !== null && typeof x === 'object' &&
          x['sample_desc'] !== null &&
          typeof x['sample_desc'] !== 'undefined') {
        return x['sample_desc']
      } else {
        return ''
      }
    }
        ,
              sampleInitialLabel: function () {
      var x = this.microbiome_otu.sample
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
