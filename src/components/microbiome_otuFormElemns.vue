<template>
  <div id="microbiome_otu-form-elemns-div">

  <input type="hidden" v-model="microbiome_otu.id"/>
  
  
    <div id="microbiome_otu-reference_sequence_id-div" class="form-group">
      <label>reference_sequence_id</label>
      <input type="text" v-model="microbiome_otu.reference_sequence_id" class="form-control"/>
      <div id="microbiome_otu-reference_sequence_id-err" v-if="typeof validationError('reference_sequence_id') !== 'undefined'">
        {{validationError('reference_sequence_id').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-otu_id-div" class="form-group">
      <label>otu_id</label>
      <input type="text" v-model="microbiome_otu.otu_id" class="form-control"/>
      <div id="microbiome_otu-otu_id-err" v-if="typeof validationError('otu_id') !== 'undefined'">
        {{validationError('otu_id').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-sample_id-div" class="form-group">
      <label>sample_id</label>
      <input type="text" v-model="microbiome_otu.sample_id" class="form-control"/>
      <div id="microbiome_otu-sample_id-err" v-if="typeof validationError('sample_id') !== 'undefined'">
        {{validationError('sample_id').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-sample_desc-div" class="form-group">
      <label>sample_desc</label>
      <input type="text" v-model="microbiome_otu.sample_desc" class="form-control"/>
      <div id="microbiome_otu-sample_desc-err" v-if="typeof validationError('sample_desc') !== 'undefined'">
        {{validationError('sample_desc').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-count-div" class="form-group">
      <label>count</label>
      <input type="text" v-model="microbiome_otu.count" class="form-control"/>
      <div id="microbiome_otu-count-err" v-if="typeof validationError('count') !== 'undefined'">
        {{validationError('count').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-experiment-div" class="form-group">
      <label>experiment</label>
      <input type="text" v-model="microbiome_otu.experiment" class="form-control"/>
      <div id="microbiome_otu-experiment-err" v-if="typeof validationError('experiment') !== 'undefined'">
        {{validationError('experiment').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-version-div" class="form-group">
      <label>version</label>
      <input type="text" v-model="microbiome_otu.version" class="form-control"/>
      <div id="microbiome_otu-version-err" v-if="typeof validationError('version') !== 'undefined'">
        {{validationError('version').message}}
      </div>
    </div>

  
    <div id="microbiome_otu-kingdom-div" class="form-group">
      <label>kingdom</label>
      <input type="text" v-model="microbiome_otu.kingdom" class="form-control"/>
      <div id="microbiome_otu-kingdom-err" v-if="typeof validationError('kingdom') !== 'undefined'">
        {{validationError('kingdom').message}}
      </div>
    </div>

  
    
  </div>
</template>

<script>

export default {
  props: [ 'microbiome_otu', 'errors' ],
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
