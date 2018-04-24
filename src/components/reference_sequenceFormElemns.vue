<template>
  <div id="reference_sequence-form-elemns-div">

  <input type="hidden" v-model="reference_sequence.id"/>
  
  
    <div id="reference_sequence-sequence-div" class="form-group">
            <label>sequence</label>
      
  <input type="text" v-model="reference_sequence.sequence" class="form-control"/>


      <div id="reference_sequence-sequence-err" v-if="validationError('sequence')" class="alert alert-danger">
        {{validationError('sequence').message}}
      </div>
    </div>

  
    <div id="reference_sequence-taxon_id-div" class="form-group">
            <label>taxon_id</label>
      
  <input type="text" v-model="reference_sequence.taxon_id" class="form-control"/>


      <div id="reference_sequence-taxon_id-err" v-if="validationError('taxon_id')" class="alert alert-danger">
        {{validationError('taxon_id').message}}
      </div>
    </div>

  
    <div id="reference_sequence-microbiome_otu_id-div" class="form-group">
            <label>microbiome_otu_id</label>
      
  <input type="text" v-model="reference_sequence.microbiome_otu_id" class="form-control"/>


      <div id="reference_sequence-microbiome_otu_id-err" v-if="validationError('microbiome_otu_id')" class="alert alert-danger">
        {{validationError('microbiome_otu_id').message}}
      </div>
    </div>

  
  

  
  
  </div>
</template>

<script>



export default {
  props: [ 'reference_sequence', 'errors' ],
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
