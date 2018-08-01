<template>
  <div id="transcript_count-form-elemns-div">

  <input type="hidden" v-model="transcript_count.id"/>
  
  
    <div id="transcript_count-gene-div" class="form-group">
            <label>gene</label>
      
  <input type="text" v-model="transcript_count.gene" class="form-control"/>


      <div id="transcript_count-gene-err" v-if="validationError('gene')" class="alert alert-danger">
        {{validationError('gene').message}}
      </div>
    </div>

  
    <div id="transcript_count-variable-div" class="form-group">
            <label>variable</label>
      
  <input type="text" v-model="transcript_count.variable" class="form-control"/>


      <div id="transcript_count-variable-err" v-if="validationError('variable')" class="alert alert-danger">
        {{validationError('variable').message}}
      </div>
    </div>

  
    <div id="transcript_count-count-div" class="form-group">
            <label>count</label>
      
  <input type="text" v-model="transcript_count.count" class="form-control"/>


      <div id="transcript_count-count-err" v-if="validationError('count')" class="alert alert-danger">
        {{validationError('count').message}}
      </div>
    </div>

  
    <div id="transcript_count-tissue_or_condition-div" class="form-group">
            <label>tissue_or_condition</label>
      
  <input type="text" v-model="transcript_count.tissue_or_condition" class="form-control"/>


      <div id="transcript_count-tissue_or_condition-err" v-if="validationError('tissue_or_condition')" class="alert alert-danger">
        {{validationError('tissue_or_condition').message}}
      </div>
    </div>

  
  

  
  
  </div>
</template>

<script>



export default {
  props: [ 'transcript_count', 'errors' ],
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
