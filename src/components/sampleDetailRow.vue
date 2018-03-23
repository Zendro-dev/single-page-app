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
    
      
    <div id="sample-individual-div">
      <div class="inline field">
        <label>individual:</label>
        <span>{{individualInitialLabel}}</span>
      </div>
    </div>

      
    <div id="sample-field_plot-div">
      <div class="inline field">
        <label>field_plot:</label>
        <span>{{field_plotInitialLabel}}</span>
      </div>
    </div>

      
    <div id="sample-pot-div">
      <div class="inline field">
        <label>pot:</label>
        <span>{{potInitialLabel}}</span>
      </div>
    </div>

      
    <div id="sample-parent-div">
      <div class="inline field">
        <label>parent:</label>
        <span>{{parentInitialLabel}}</span>
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
          individualInitialLabel: function () {
      var x = this.rowData.individual
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
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
        ,
              parentInitialLabel: function () {
      var x = this.rowData.parent
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
