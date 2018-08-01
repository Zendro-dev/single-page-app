<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>variable:</label>
        <span>{{rowData.variable}}</span>
      </div>
          <div class="inline field">
        <label>value:</label>
        <span>{{rowData.value}}</span>
      </div>
          <div class="inline field">
        <label>unit:</label>
        <span>{{rowData.unit}}</span>
      </div>
    
      
    <div id="plant_measurement-individual-div">
      <div class="inline field">
        <label>individual:</label>
        <span>{{individualInitialLabel}}</span>
      </div>
    </div>

  
  
  </div>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  computed: {
          individualInitialLabel: function () {
      var x = this.rowData.individual
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
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
