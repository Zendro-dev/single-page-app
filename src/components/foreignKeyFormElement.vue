<template>
  <div id="data-model-form-elemns-div">

  <autocomplete
    v-bind:url="searchUrl"
    param="filter"
    v-bind:init-value="initialInput"
    v-bind:anchor="label"
    v-bind:label="subLabel"
    :classes="{ wrapper: 'form-wrapper', input: 'form-control', list: 'data-list', item: 'data-list-item' }"
    :on-select="setForeignKey"
    :onInput="onUserInput"
    :customHeaders="{ Authorization: `Bearer ${this.$getAuthToken()}` }"
  >
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
      this.$emit('input', data[this.valueKey])
    },

    onUserInput(data) {
      if(data === ''){
        this.$emit('input', null)
      }
    }
  }
}
</script>
<style>
.autocomplete,.autocomplete ul,.autocomplete ul li a,.showAll-transition,.transition{transition:all .3s ease-out;-moz-transition:all .3s ease-out;-webkit-transition:all .3s ease-out;-o-transition:all .3s ease-out}.autocomplete ul{font-family:sans-serif;position:absolute;list-style:none;background:#f8f8f8;padding:10px 0;margin:0;display:inline-block;min-width:15%;margin-top:10px}.autocomplete ul:before{content:"";display:block;position:absolute;height:0;width:0;border:10px solid transparent;border-bottom:10px solid #f8f8f8;left:46%;top:-20px}.autocomplete ul li a{text-decoration:none;display:block;background:#f8f8f8;color:#2b2b2b;padding:5px;padding-left:10px}.autocomplete ul li.focus-list a,.autocomplete ul li a:hover{color:#fff;background:#2f9af7}.autocomplete ul li a .autocomplete-anchor-label,.autocomplete ul li a span{display:block;margin-top:3px;color:grey;font-size:13px}.autocomplete ul li.focus-list a span,.autocomplete ul li a:hover .autocomplete-anchor-label{color:#fff}
</style>  
