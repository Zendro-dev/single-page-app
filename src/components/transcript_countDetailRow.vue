<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>gene:</label>
        <span>{{rowData.gene}}</span>
      </div>
          <div class="inline field">
        <label>variable:</label>
        <span>{{rowData.variable}}</span>
      </div>
          <div class="inline field">
        <label>count:</label>
        <span>{{rowData.count}}</span>
      </div>
          <div class="inline field">
        <label>tissue_or_condition:</label>
        <span>{{rowData.tissue_or_condition}}</span>
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
    },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
