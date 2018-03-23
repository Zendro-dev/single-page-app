<template>
  <div id="metabolite_measurement-form-elemns-div">

  <input type="hidden" v-model="metabolite_measurement.id"/>
  
  
    <div id="metabolite_measurement-metabolite-div" class="form-group">
      <label>metabolite</label>
      <input type="text" v-model="metabolite_measurement.metabolite" class="form-control"/>
      <div id="metabolite_measurement-metabolite-err" v-if="typeof validationError('metabolite') !== 'undefined'">
        {{validationError('metabolite').message}}
      </div>
    </div>

  
    <div id="metabolite_measurement-sample_id-div" class="form-group">
      <label>sample_id</label>
      <input type="text" v-model="metabolite_measurement.sample_id" class="form-control"/>
      <div id="metabolite_measurement-sample_id-err" v-if="typeof validationError('sample_id') !== 'undefined'">
        {{validationError('sample_id').message}}
      </div>
    </div>

  
    <div id="metabolite_measurement-amount-div" class="form-group">
      <label>amount</label>
      <input type="text" v-model="metabolite_measurement.amount" class="form-control"/>
      <div id="metabolite_measurement-amount-err" v-if="typeof validationError('amount') !== 'undefined'">
        {{validationError('amount').message}}
      </div>
    </div>

  
    <div id="metabolite_measurement-unit-div" class="form-group">
      <label>unit</label>
      <input type="text" v-model="metabolite_measurement.unit" class="form-control"/>
      <div id="metabolite_measurement-unit-err" v-if="typeof validationError('unit') !== 'undefined'">
        {{validationError('unit').message}}
      </div>
    </div>

  
    <div id="metabolite_measurement-is_average-div" class="form-group">
      <label>is_average</label>
      <input type="text" v-model="metabolite_measurement.is_average" class="form-control"/>
      <div id="metabolite_measurement-is_average-err" v-if="typeof validationError('is_average') !== 'undefined'">
        {{validationError('is_average').message}}
      </div>
    </div>

  
    
  </div>
</template>

<script>

export default {
  props: [ 'metabolite_measurement', 'errors' ],
  computed: {
    },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.find(function (el) {
        return el.path === modelField
      })
    }
  }
}
</script>
