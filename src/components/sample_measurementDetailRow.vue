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
          <div class="inline field">
        <label>is_average:</label>
        <span>{{rowData.is_average}}</span>
      </div>
    
  
      
    <div id="sample_measurement-samples-div" v-if="rowData.samples" class="row w-100">
      <div class="col">
        <label>samples:</label>
        <ul class="list-group">
          <li v-for="x in rowData.samples" class="list-group-item">
            {{x.name}}
                            {{x.material}}
                      </li>
        </ul>
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
    },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
