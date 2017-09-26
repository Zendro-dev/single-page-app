<template>
  <div id="cultivar-form-elemns-div">

  <input type="hidden" v-model="cultivar.id"/>
  
  
    <div id="cultivar-description-div" class="form-group">
      <label>description</label>
      <input type="text" v-model="cultivar.description" class="form-control"/>
      <div id="cultivar-description-err" v-if="typeof validationError('description') !== 'undefined'">
        {{validationError('description').message}}
      </div>
    </div>

  
    <div id="cultivar-genotype-div" class="form-group">
      <label>genotype</label>
      <input type="text" v-model="cultivar.genotype" class="form-control"/>
      <div id="cultivar-genotype-err" v-if="typeof validationError('genotype') !== 'undefined'">
        {{validationError('genotype').message}}
      </div>
    </div>

  
      
    <div id="cultivar-taxon-div" class="form-group">
      <label>taxon</label>
      <foreign-key-form-element
        searchUrl="http://localhost:3000/taxons"
        v-model:foreignKey="cultivar.taxon_id"
        label="name"
                subLabel="taxonomic_level"
                valueKey="id"
        v-bind:initialInput="taxonInitialLabel">
      </foreign-key-form-element>
    </div>

    
  </div>
</template>

<script>
import Vue from 'vue'
import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

export default {
  props: [ 'cultivar', 'errors' ],
        computed: {
    taxonInitialLabel: function () {
      var x = this.cultivar.taxon
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
