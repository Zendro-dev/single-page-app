<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
    
      
    <div id="sample_to_sample_measurement-sample-div">
      <div class="inline field">
        <label>sample:</label>
        <span>{{sampleInitialLabel}}</span>
      </div>
    </div>

      
    <div id="sample_to_sample_measurement-sample_measurement-div">
      <div class="inline field">
        <label>sample_measurement:</label>
        <span>{{sample_measurementInitialLabel}}</span>
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
              sample_measurementInitialLabel: function () {
      var x = this.rowData.sample_measurement
      if (x !== null && typeof x === 'object' &&
          x['variable'] !== null &&
          typeof x['variable'] !== 'undefined') {
        return x['variable']
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
