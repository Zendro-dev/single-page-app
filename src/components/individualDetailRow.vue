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
        <label>sowing_date:</label>
        <span>{{rowData.sowing_date}}</span>
      </div>
          <div class="inline field">
        <label>harvest_date:</label>
        <span>{{rowData.harvest_date}}</span>
      </div>
    
      
    <div id="individual-cultivar-div">
      <div class="inline field">
        <label>cultivar:</label>
        <span>{{cultivarInitialLabel}}</span>
      </div>
    </div>

      
    <div id="individual-field_plot-div">
      <div class="inline field">
        <label>field_plot:</label>
        <span>{{field_plotInitialLabel}}</span>
      </div>
    </div>

      
    <div id="individual-pot-div">
      <div class="inline field">
        <label>pot:</label>
        <span>{{potInitialLabel}}</span>
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
          cultivarInitialLabel: function () {
      var x = this.rowData.cultivar
      if (x !== null && typeof x === 'object' &&
          x['genotype'] !== null &&
          typeof x['genotype'] !== 'undefined') {
        return x['genotype']
      } else {
        return ''
      }
    }
        ,
              field_plotInitialLabel: function () {
      var x = this.rowData.field_plot
      if (x !== null && typeof x === 'object' &&
          x['field_name'] !== null &&
          typeof x['field_name'] !== 'undefined') {
        return x['field_name']
      } else {
        return ''
      }
    }
        ,
              potInitialLabel: function () {
      var x = this.rowData.pot
      if (x !== null && typeof x === 'object' &&
          x['pot'] !== null &&
          typeof x['pot'] !== 'undefined') {
        return x['pot']
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
