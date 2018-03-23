<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>metabolite:</label>
        <span>{{rowData.metabolite}}</span>
      </div>
          <div class="inline field">
        <label>sample_id:</label>
        <span>{{rowData.sample_id}}</span>
      </div>
          <div class="inline field">
        <label>amount:</label>
        <span>{{rowData.amount}}</span>
      </div>
          <div class="inline field">
        <label>unit:</label>
        <span>{{rowData.unit}}</span>
      </div>
          <div class="inline field">
        <label>is_average:</label>
        <span>{{rowData.is_average}}</span>
      </div>
    
  
      
    <div id="metabolite_measurement-samples-div" v-if="rowData.samples">
      <div class="inline field">
        <label>samples:</label>
        <div style="height: 20%; width: auto; overflow: auto">
          <ul>
            <li v-for="x in rowData.samples">
              {{x.name}}
            </li>
          </ul>
        </div>
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
