<template>
  <div id="data-model-form-elemns-div">

  <autocomplete
    v-bind:url="searchUrl"
    params="filter"
    v-bind:init-value="initialInput"
    v-bind:anchor="label"
    v-bind:label="subLabel"
    :on-select="setForeignKey">
  </autocomplete>
    
  </div>
</template>

<script>
import Vue from 'vue'
import Autocomplete from 'vue2-autocomplete-js'
import axios from 'axios'

Vue.component('autocomplete', Autocomplete)

export default {
  props: ['searchUrl', 'label', 'subLabel', 'valueKey', 'initialInput', 'foreignKey'],
  components: {
    Autocomplete,
  },
  methods: {
    setForeignKey(data) {
      console.log("t.subLabel=" + this.subLabel + ", this="+this);
      console.log("setForeignKey(): t.valueKey=" + this.valueKey + ", data[t.valueKey]="
          + data[this.valueKey] + ", data.id=" + data.id );
      this.$emit('input', data[this.valueKey])
    }
  }
}
</script>
