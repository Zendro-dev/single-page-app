<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>field_name:</label>
        <span>{{rowData.field_name}}</span>
      </div>
          <div class="inline field">
        <label>latitude:</label>
        <span>{{rowData.latitude}}</span>
      </div>
          <div class="inline field">
        <label>longitude:</label>
        <span>{{rowData.longitude}}</span>
      </div>
          <div class="inline field">
        <label>location_code:</label>
        <span>{{rowData.location_code}}</span>
      </div>
          <div class="inline field">
        <label>soil_treatment:</label>
        <span>{{rowData.soil_treatment}}</span>
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
