<template>
  <div class="row w-100">

    <div class="col-sm-3">
      <autocomplete
        ref="autocomplete"
        v-bind:url="searchUrl"
        param="filter"
        init-value=""
        v-bind:anchor="label"
        v-bind:label="subLabel"
        :classes="{ wrapper: 'form-wrapper', input: 'form-control', list: 'data-list', item: 'data-list-item' }"
        :on-select="addElement"
        :onInput="onUserInput"
        :customHeaders="{ Authorization: `Bearer ${this.$getAuthToken()}` }"
      >
      </autocomplete>
    </div>

    <div class="col-sm-5">
      <ul v-for="rel in associatedElements" class="list-group">
        <li v-on:click="removeElement(rel)" class="list-group-item">
          <i class="delete icon"></i>
          {{rel[label]}}
          {{subLabel ? rel[subLabel] : ''}}
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import Vue from 'vue'
import Autocomplete from 'vue2-autocomplete-js'
import axios from 'axios'
import _ from 'lodash'

Vue.component('autocomplete', Autocomplete)

export default {
  props: ['associatedElements', 'searchUrl', 'label', 'subLabel', 'valueKey'],
  components: {
    Autocomplete,
  },
  methods: {
    addElement(data) {
      let modList = this.associatedElements ? _.clone(this.associatedElements) : []
      modList.push(data)
      modList = _.uniqBy(modList, 'id')
      this.$emit('update:associatedElements', modList)
      this.$refs.autocomplete.setValue(null)
    },
    removeElement(data) {
      let relId = this.valueKey;
      let modList = _.uniq(_.clone(this.associatedElements)).filter(function(x) {
        return x[relId] !== data[relId]
      })
      this.$emit('update:associatedElements', modList)
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
