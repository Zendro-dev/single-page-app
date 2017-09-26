<template>
  <div id="microbiome_profile-form-elemns-div">

  <input type="hidden" v-model="microbiome_profile.id"/>
  
  
    <div id="microbiome_profile-count-div" class="form-group">
      <label>count</label>
      <input type="text" v-model="microbiome_profile.count" class="form-control"/>
      <div id="microbiome_profile-count-err" v-if="typeof validationError('count') !== 'undefined'">
        {{validationError('count').message}}
      </div>
    </div>

  
      
    <div id="microbiome_profile-taxon-div" class="form-group">
      <label>taxon</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/taxons"
        v-model:foreignKey="microbiome_profile.taxon_id"
        label="name"
                subLabel="taxonomic_level"
                valueKey="id"
        v-bind:initialInput="taxonInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="microbiome_profile-microbiome_sample-div" class="form-group">
      <label>microbiome_sample</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/microbiome_samples"
        v-model:foreignKey="microbiome_profile.microbiome_sample_id"
        label="name"
                subLabel="description"
                valueKey="id"
        v-bind:initialInput="microbiome_sampleInitialLabel">
      </foreign-key-form-element>
    </div>

    
  </div>
</template>

<script>
import Vue from 'vue'
import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

export default {
  props: [ 'microbiome_profile', 'errors' ],
        computed: {
    taxonInitialLabel: function () {
      var x = this.microbiome_profile.taxon
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
      },
        computed: {
    microbiome_sampleInitialLabel: function () {
      var x = this.microbiome_profile.microbiome_sample
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
  }
}
</script>
