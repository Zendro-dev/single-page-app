<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>name:</label>
        <span>{{rowData.name}}</span>
      </div>
          <div class="inline field">
        <label>material:</label>
        <span>{{rowData.material}}</span>
      </div>
          <div class="inline field">
        <label>life_cycle_phase:</label>
        <span>{{rowData.life_cycle_phase}}</span>
      </div>
          <div class="inline field">
        <label>barcode_tag:</label>
        <span>{{rowData.barcode_tag}}</span>
      </div>
          <div class="inline field">
        <label>description:</label>
        <span>{{rowData.description}}</span>
      </div>
          <div class="inline field">
        <label>harvest_date:</label>
        <span>{{rowData.harvest_date}}</span>
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
