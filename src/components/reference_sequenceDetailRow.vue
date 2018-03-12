<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>sequence:</label>
        <span>{{rowData.sequence}}</span>
      </div>
          <div class="inline field">
        <label>taxon_id:</label>
        <span>{{rowData.taxon_id}}</span>
      </div>
          <div class="inline field">
        <label>microbiome_otu_id:</label>
        <span>{{rowData.microbiome_otu_id}}</span>
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
