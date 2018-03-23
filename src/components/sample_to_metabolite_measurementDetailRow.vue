<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
    
      
    <div id="sample_to_metabolite_measurement-sample-div">
      <div class="inline field">
        <label>sample:</label>
        <span>{{sampleInitialLabel}}</span>
      </div>
    </div>

      
    <div id="sample_to_metabolite_measurement-metabolite_measurement-div">
      <div class="inline field">
        <label>metabolite_measurement:</label>
        <span>{{metabolite_measurementInitialLabel}}</span>
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
          sampleInitialLabel: function () {
      var x = this.rowData.sample
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              metabolite_measurementInitialLabel: function () {
      var x = this.rowData.metabolite_measurement
      if (x !== null && typeof x === 'object' &&
          x['metabolite'] !== null &&
          typeof x['metabolite'] !== 'undefined') {
        return x['metabolite']
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
