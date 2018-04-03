<template>
  <div id="pot-form-elemns-div">

  <input type="hidden" v-model="pot.id"/>
  
  
    <div id="pot-pot-div" class="form-group">
            <label>pot</label>
      
  <input type="text" v-model="pot.pot" class="form-control"/>


      <div id="pot-pot-err" v-if="typeof validationError('pot') !== 'undefined'">
        {{validationError('pot').message}}
      </div>
    </div>

  
    <div id="pot-greenhouse-div" class="form-group">
            <label>greenhouse</label>
      
  <input type="text" v-model="pot.greenhouse" class="form-control"/>


      <div id="pot-greenhouse-err" v-if="typeof validationError('greenhouse') !== 'undefined'">
        {{validationError('greenhouse').message}}
      </div>
    </div>

  
    <div id="pot-climate_chamber-div" class="form-group">
            <label>climate_chamber</label>
      
  <input type="text" v-model="pot.climate_chamber" class="form-control"/>


      <div id="pot-climate_chamber-err" v-if="typeof validationError('climate_chamber') !== 'undefined'">
        {{validationError('climate_chamber').message}}
      </div>
    </div>

  
    <div id="pot-conditions-div" class="form-group">
            <label>conditions</label>
      
  <input type="text" v-model="pot.conditions" class="form-control"/>


      <div id="pot-conditions-err" v-if="typeof validationError('conditions') !== 'undefined'">
        {{validationError('conditions').message}}
      </div>
    </div>

  
  

  
  
  </div>
</template>

<script>



export default {
  props: [ 'pot', 'errors' ],
  computed: {
    },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.find(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	}
}
</script>
