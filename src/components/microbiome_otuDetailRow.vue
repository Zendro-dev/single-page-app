<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>sample_desc:</label>
        <span>{{rowData.sample_desc}}</span>
      </div>
          <div class="inline field">
        <label>count:</label>
        <span>{{rowData.count}}</span>
      </div>
          <div class="inline field">
        <label>experiment:</label>
        <span>{{rowData.experiment}}</span>
      </div>
          <div class="inline field">
        <label>version:</label>
        <span>{{rowData.version}}</span>
      </div>
          <div class="inline field">
        <label>kingdom:</label>
        <span>{{rowData.kingdom}}</span>
      </div>
    
      
    <div id="microbiome_otu-reference_sequence-div">
      <div class="inline field">
        <label>reference_sequence:</label>
        <span>{{reference_sequenceInitialLabel}}</span>
      </div>
    </div>

      
    <div id="microbiome_otu-parent-div">
      <div class="inline field">
        <label>parent:</label>
        <span>{{parentInitialLabel}}</span>
      </div>
    </div>

      
    <div id="microbiome_otu-sample-div">
      <div class="inline field">
        <label>sample:</label>
        <span>{{sampleInitialLabel}}</span>
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
          reference_sequenceInitialLabel: function () {
      var x = this.rowData.reference_sequence
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
      var x = this.rowData.parent
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
      var x = this.rowData.sample
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
