<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>reference_sequence_id:</label>
        <span>{{rowData.reference_sequence_id}}</span>
      </div>
          <div class="inline field">
        <label>otu_id:</label>
        <span>{{rowData.otu_id}}</span>
      </div>
          <div class="inline field">
        <label>sample_id:</label>
        <span>{{rowData.sample_id}}</span>
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
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
