<template>
  <div id="taxon-form-elemns-div">

  <input type="hidden" v-model="taxon.id"/>
  
  
    <div id="taxon-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="taxon.name" class="form-control"/>


      <div id="taxon-name-err" v-if="typeof validationError('name') !== 'undefined'">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="taxon-taxonomic_level-div" class="form-group">
            <label>taxonomic_level</label>
      
  <input type="text" v-model="taxon.taxonomic_level" class="form-control"/>


      <div id="taxon-taxonomic_level-err" v-if="typeof validationError('taxonomic_level') !== 'undefined'">
        {{validationError('taxonomic_level').message}}
      </div>
    </div>

  
      
    <div id="taxon-taxon-div" class="form-group">
      <label>parent</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl() + '/taxons'"
        v-model:foreignKey="taxon.parent_id"
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
  props: [ 'taxon', 'errors' ],
  computed: {
          taxonInitialLabel: function () {
      var x = this.taxon.parent
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
