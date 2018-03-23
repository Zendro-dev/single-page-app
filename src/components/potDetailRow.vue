<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>pot:</label>
        <span>{{rowData.pot}}</span>
      </div>
          <div class="inline field">
        <label>greenhouse:</label>
        <span>{{rowData.greenhouse}}</span>
      </div>
          <div class="inline field">
        <label>climate_chamber:</label>
        <span>{{rowData.climate_chamber}}</span>
      </div>
          <div class="inline field">
        <label>conditions:</label>
        <span>{{rowData.conditions}}</span>
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
